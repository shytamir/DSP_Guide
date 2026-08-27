[CmdletBinding()]
param(
    [string]$ToolsRoot,
    [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$repoRootForGit = $repoRoot.Replace("\", "/")
$manifestRoot = Join-Path $PSScriptRoot "runtime-tools"
if ([string]::IsNullOrWhiteSpace($ToolsRoot)) {
    $ToolsRoot = Join-Path $repoRoot "artifacts\.runtime-tools"
} elseif (-not [System.IO.Path]::IsPathRooted($ToolsRoot)) {
    $ToolsRoot = Join-Path $repoRoot $ToolsRoot
}
$ToolsRoot = [System.IO.Path]::GetFullPath($ToolsRoot)
$nodeWorkspace = Join-Path $ToolsRoot "node"
$nodeModules = Join-Path $nodeWorkspace "node_modules"
$pnpmStore = Join-Path $ToolsRoot "pnpm-store"
$browserRoot = Join-Path $ToolsRoot "browsers"
$activationScript = Join-Path $ToolsRoot "Activate-DspGuideTools.ps1"
$results = New-Object System.Collections.Generic.List[object]
$installationFailures = New-Object System.Collections.Generic.List[string]

function Add-InventoryResult {
    param(
        [string]$Category,
        [string]$Name,
        [string]$Status,
        [string]$Version = "",
        [string]$Path = "",
        [string]$Details = ""
    )
    $results.Add([pscustomobject]@{
        Category = $Category
        Name = $Name
        Status = $Status
        Version = $Version
        Path = $Path
        Details = $Details
    })
}

function Resolve-ApplicationPath {
    param([string]$Name)
    $command = Get-Command $Name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($null -eq $command) { return $null }
    return $command.Source
}

function Invoke-External {
    param(
        [string]$Executable,
        [string[]]$Arguments
    )
    $output = & $Executable @Arguments 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "Exit code $LASTEXITCODE from $Executable $($Arguments -join ' ')`n$output"
    }
    return $output.Trim()
}

function Find-BundledRuntimeExecutable {
    param(
        [string]$PnpmPath,
        [string]$RelativePath,
        [string]$UserCacheRelativePath
    )
    if (-not [string]::IsNullOrWhiteSpace($PnpmPath)) {
        $fromPnpm = [System.IO.Path]::GetFullPath((Join-Path (Split-Path $PnpmPath -Parent) "..\..\$RelativePath"))
        if (Test-Path -LiteralPath $fromPnpm -PathType Leaf) { return $fromPnpm }
    }
    if (-not [string]::IsNullOrWhiteSpace($env:USERPROFILE)) {
        $fromCache = Join-Path $env:USERPROFILE $UserCacheRelativePath
        if (Test-Path -LiteralPath $fromCache -PathType Leaf) { return $fromCache }
    }
    return $null
}

function Find-BrowserExecutable {
    param([string[]]$Candidates)
    foreach ($candidate in $Candidates) {
        if (-not [string]::IsNullOrWhiteSpace($candidate) -and (Test-Path -LiteralPath $candidate -PathType Leaf)) {
            return $candidate
        }
    }
    return ""
}

function Get-FileProductVersion {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path -LiteralPath $Path -PathType Leaf)) { return "" }
    return (Get-Item -LiteralPath $Path).VersionInfo.ProductVersion
}

function Get-PackageVersion {
    param([string]$PackageName)
    $packageFile = Join-Path (Join-Path $nodeModules $PackageName) "package.json"
    if (-not (Test-Path -LiteralPath $packageFile -PathType Leaf)) { return "" }
    return (Get-Content -LiteralPath $packageFile -Raw | ConvertFrom-Json).version
}

function Write-ActivationScript {
    param(
        [string]$GitPath,
        [string]$NodePath,
        [string]$PythonPath,
        [string]$PnpmPath
    )
    $escapedRepo = $repoRoot.Replace("'", "''")
    $escapedRepoForGit = $repoRootForGit.Replace("'", "''")
    $escapedNode = $NodePath.Replace("'", "''")
    $escapedPython = $PythonPath.Replace("'", "''")
    $escapedGit = $GitPath.Replace("'", "''")
    $escapedPnpm = $PnpmPath.Replace("'", "''")
    $escapedModules = $nodeModules.Replace("'", "''")
    $escapedBrowsers = $browserRoot.Replace("'", "''")
    $content = @"
`$script:DspGuideRoot = '$escapedRepo'
`$script:DspGuideRootForGit = '$escapedRepoForGit'
`$script:DspGuideGit = '$escapedGit'
`$script:DspGuideNode = '$escapedNode'
`$script:DspGuidePython = '$escapedPython'
`$script:DspGuidePnpm = '$escapedPnpm'
`$script:DspGuideNodeModules = '$escapedModules'
`$env:NODE_PATH = `$script:DspGuideNodeModules
`$env:PLAYWRIGHT_BROWSERS_PATH = '$escapedBrowsers'

function git-safe {
    & `$script:DspGuideGit -c "safe.directory=`$script:DspGuideRootForGit" @args
}

function node {
    & `$script:DspGuideNode @args
}

function python {
    & `$script:DspGuidePython @args
}

function pnpm {
    & `$script:DspGuidePnpm @args
}

function prettier {
    & `$script:DspGuideNode (Join-Path `$script:DspGuideNodeModules 'prettier\bin\prettier.cjs') @args
}

function playwright {
    & `$script:DspGuideNode (Join-Path `$script:DspGuideNodeModules 'playwright\cli.js') @args
}

Write-Output "DSP Guide tools ready for `$script:DspGuideRoot"
"@
    Set-Content -LiteralPath $activationScript -Value $content -Encoding UTF8
}

Write-Host "DSP Guide agent environment bootstrap"
Write-Host "Repository: $repoRoot"
Write-Host "Tool root:  $ToolsRoot"
Write-Host "Mode:       $(if ($ValidateOnly) { 'validate only' } else { 'install and validate' })"

$gitPath = Resolve-ApplicationPath "git.exe"
$rgPath = Resolve-ApplicationPath "rg.exe"
$pnpmPath = Resolve-ApplicationPath "pnpm.cmd"
$nodePath = Resolve-ApplicationPath "node.exe"
$pythonPath = Resolve-ApplicationPath "python.exe"

if ([string]::IsNullOrWhiteSpace($nodePath)) {
    $nodePath = Find-BundledRuntimeExecutable $pnpmPath "node\bin\node.exe" ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
}
if ([string]::IsNullOrWhiteSpace($pythonPath)) {
    $pythonPath = Find-BundledRuntimeExecutable $pnpmPath "python\python.exe" ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
}

if (-not $ValidateOnly) {
    New-Item -ItemType Directory -Path $nodeWorkspace, $browserRoot -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $manifestRoot "package.json") -Destination (Join-Path $nodeWorkspace "package.json") -Force
    Copy-Item -LiteralPath (Join-Path $manifestRoot "pnpm-lock.yaml") -Destination (Join-Path $nodeWorkspace "pnpm-lock.yaml") -Force

    if ([string]::IsNullOrWhiteSpace($pnpmPath)) {
        $installationFailures.Add("Node package installation was blocked because pnpm.cmd was not found.")
    } else {
        try {
            $previousCi = $env:CI
            $env:CI = "true"
            $installOutput = Invoke-External $pnpmPath @("--dir", $nodeWorkspace, "install", "--frozen-lockfile", "--ignore-scripts", "--store-dir", $pnpmStore)
            Write-Host $installOutput
        } catch {
            $installationFailures.Add("Node package installation failed: $($_.Exception.Message)")
        } finally {
            if ($null -eq $previousCi) {
                Remove-Item Env:CI -ErrorAction SilentlyContinue
            } else {
                $env:CI = $previousCi
            }
        }
    }

    $playwrightCli = Join-Path $nodeModules "playwright\cli.js"
    if ([string]::IsNullOrWhiteSpace($nodePath) -or -not (Test-Path -LiteralPath $playwrightCli -PathType Leaf)) {
        $installationFailures.Add("Playwright browser installation was blocked because Node.js or the Playwright CLI was unavailable.")
    } else {
        try {
            $previousBrowserPath = $env:PLAYWRIGHT_BROWSERS_PATH
            $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
            $browserOutput = Invoke-External $nodePath @($playwrightCli, "install", "chromium")
            Write-Host $browserOutput
        } catch {
            $installationFailures.Add("Playwright browser installation failed: $($_.Exception.Message)")
        } finally {
            if ($null -eq $previousBrowserPath) {
                Remove-Item Env:PLAYWRIGHT_BROWSERS_PATH -ErrorAction SilentlyContinue
            } else {
                $env:PLAYWRIGHT_BROWSERS_PATH = $previousBrowserPath
            }
        }
    }

    if ([string]::IsNullOrWhiteSpace($gitPath) -or [string]::IsNullOrWhiteSpace($nodePath) -or
        [string]::IsNullOrWhiteSpace($pythonPath) -or [string]::IsNullOrWhiteSpace($pnpmPath)) {
        $installationFailures.Add("Activation-script generation was blocked because Git, Node.js, Python, or pnpm was unavailable.")
    } else {
        try {
            Write-ActivationScript $gitPath $nodePath $pythonPath $pnpmPath
        } catch {
            $installationFailures.Add("Activation-script generation failed: $($_.Exception.Message)")
        }
    }
}

if ([string]::IsNullOrWhiteSpace($gitPath)) {
    Add-InventoryResult "Core" "Git with scoped safe-directory access" "Failed" "" "" "git.exe was not found on PATH."
} else {
    try {
        $gitVersion = Invoke-External $gitPath @("--version")
        $resolvedRoot = Invoke-External $gitPath @("-c", "safe.directory=$repoRootForGit", "-C", $repoRoot, "rev-parse", "--show-toplevel")
        if ($resolvedRoot.Replace("\", "/") -ne $repoRootForGit) { throw "Git resolved an unexpected root: $resolvedRoot" }
        Add-InventoryResult "Core" "Git with scoped safe-directory access" "Ready" ($gitVersion -replace "^git version ", "") $gitPath "Repository access passed without global Git configuration."
    } catch {
        Add-InventoryResult "Core" "Git with scoped safe-directory access" "Failed" "" $gitPath $_.Exception.Message
    }
}

foreach ($tool in @(
    @{ Name = "ripgrep"; Path = $rgPath; Arguments = @("--version") },
    @{ Name = "Node.js"; Path = $nodePath; Arguments = @("--version") },
    @{ Name = "Python"; Path = $pythonPath; Arguments = @("--version") },
    @{ Name = "pnpm"; Path = $pnpmPath; Arguments = @("--version") }
)) {
    if ([string]::IsNullOrWhiteSpace($tool.Path)) {
        Add-InventoryResult "Core" $tool.Name "Failed" "" "" "$($tool.Name) was not found in the supplied agent runtime."
    } else {
        try {
            $version = Invoke-External $tool.Path $tool.Arguments
            $version = ($version -split "`r?`n")[0]
            Add-InventoryResult "Core" $tool.Name "Ready" ($version -replace "^(ripgrep|Python)\s+", "" -replace "^v", "") $tool.Path "Version command passed."
        } catch {
            Add-InventoryResult "Core" $tool.Name "Failed" "" $tool.Path $_.Exception.Message
        }
    }
}

$expectedPackages = (Get-Content -LiteralPath (Join-Path $manifestRoot "package.json") -Raw | ConvertFrom-Json).dependencies
foreach ($packageName in @("prettier", "jsdom", "cheerio", "playwright")) {
    $expectedVersion = $expectedPackages.$packageName
    $actualVersion = Get-PackageVersion $packageName
    if ([string]::IsNullOrWhiteSpace($actualVersion)) {
        Add-InventoryResult "Authoring" $packageName "Failed" "" (Join-Path $nodeModules $packageName) "Package is not installed. Expected $expectedVersion."
    } elseif ($actualVersion -ne $expectedVersion) {
        Add-InventoryResult "Authoring" $packageName "Failed" $actualVersion (Join-Path $nodeModules $packageName) "Expected exact version $expectedVersion."
    } else {
        Add-InventoryResult "Authoring" $packageName "Ready" $actualVersion (Join-Path $nodeModules $packageName) "Exact locked version is installed."
    }
}

if (-not [string]::IsNullOrWhiteSpace($nodePath)) {
    foreach ($cli in @(
        @{ Name = "Prettier CLI"; Script = "prettier\bin\prettier.cjs"; Arguments = @("--version") }
    )) {
        $cliPath = Join-Path $nodeModules $cli.Script
        if (-not (Test-Path -LiteralPath $cliPath -PathType Leaf)) {
            Add-InventoryResult "Authoring" $cli.Name "Failed" "" $cliPath "CLI entry point is missing."
        } else {
            try {
                $version = Invoke-External $nodePath (@($cliPath) + $cli.Arguments)
                Add-InventoryResult "Authoring" $cli.Name "Ready" ($version -replace "^v", "") $cliPath "CLI execution passed."
            } catch {
                Add-InventoryResult "Authoring" $cli.Name "Failed" "" $cliPath $_.Exception.Message
            }
        }
    }

    $nodeSmoke = Join-Path $manifestRoot "verify-node-tools.cjs"
    try {
        $smokeJson = & $nodePath $nodeSmoke $nodeModules 2>&1 | Out-String
        $smokeExit = $LASTEXITCODE
        $smokeResults = $smokeJson.Trim() | ConvertFrom-Json
        foreach ($smoke in $smokeResults) {
            $version = Get-PackageVersion $smoke.package
            Add-InventoryResult "Authoring" "$($smoke.name) functional check" $smoke.status $version (Join-Path $nodeModules $smoke.package) $smoke.details
        }
        if ($smokeExit -ne 0 -and $smokeResults.Count -eq 0) { throw "Node authoring smoke test exited $smokeExit without results." }
    } catch {
        Add-InventoryResult "Authoring" "DOM tooling smoke tests" "Failed" "" $nodeSmoke $_.Exception.Message
    }
}

$programFilesX86 = [Environment]::GetFolderPath([Environment+SpecialFolder]::ProgramFilesX86)
$chromePath = Find-BrowserExecutable @(
    (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
    (Join-Path $programFilesX86 "Google\Chrome\Application\chrome.exe"),
    (Join-Path $env:LOCALAPPDATA "Google\Chrome\Application\chrome.exe")
)
$edgePath = Find-BrowserExecutable @(
    (Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path $programFilesX86 "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path $env:LOCALAPPDATA "Microsoft\Edge\Application\msedge.exe")
)

$chromiumDirectory = Get-ChildItem -LiteralPath $browserRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^chromium-\d+$' } | Select-Object -First 1
$headlessDirectory = Get-ChildItem -LiteralPath $browserRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^chromium_headless_shell-\d+$' } | Select-Object -First 1
$ffmpegPath = Get-ChildItem -LiteralPath $browserRoot -Recurse -File -Filter "ffmpeg*.exe" -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName

foreach ($managed in @(
    @{ Name = "Chromium files"; Item = $chromiumDirectory },
    @{ Name = "Chromium headless shell files"; Item = $headlessDirectory }
)) {
    if ($null -eq $managed.Item) {
        Add-InventoryResult "Rendering" $managed.Name "Failed" "" $browserRoot "Playwright-managed browser directory is missing."
    } else {
        Add-InventoryResult "Rendering" $managed.Name "Ready" ($managed.Item.Name -replace '^.*-', '') $managed.Item.FullName "Playwright-managed browser directory is installed."
    }
}
if ([string]::IsNullOrWhiteSpace($ffmpegPath)) {
    Add-InventoryResult "Rendering" "ffmpeg" "Failed" "" $browserRoot "Playwright-managed ffmpeg.exe is missing."
} else {
    try {
        $ffmpegVersionOutput = Invoke-External $ffmpegPath @("-version")
        Add-InventoryResult "Rendering" "ffmpeg" "Ready" (($ffmpegVersionOutput -split "`r?`n")[0] -replace '^ffmpeg version\s+', '') $ffmpegPath "Version command passed."
    } catch {
        Add-InventoryResult "Rendering" "ffmpeg" "Failed" "" $ffmpegPath $_.Exception.Message
    }
}

if (-not [string]::IsNullOrWhiteSpace($nodePath) -and (Test-Path -LiteralPath (Join-Path $nodeModules "playwright\package.json"))) {
    $previousBrowserPath = $env:PLAYWRIGHT_BROWSERS_PATH
    $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
    try {
        $browserSmoke = Join-Path $manifestRoot "verify-browsers.cjs"
        $browserJson = & $nodePath $browserSmoke $nodeModules $chromePath $edgePath 2>&1 | Out-String
        $browserExit = $LASTEXITCODE
        $browserResults = $browserJson.Trim() | ConvertFrom-Json
        foreach ($browser in $browserResults) {
            $path = switch ($browser.name) {
                "Chrome" { $chromePath }
                "Edge" { $edgePath }
                default { $browserRoot }
            }
            $version = switch ($browser.name) {
                "Chrome" { Get-FileProductVersion $chromePath }
                "Edge" { Get-FileProductVersion $edgePath }
                default { Get-PackageVersion "playwright" }
            }
            Add-InventoryResult "Rendering" "$($browser.name) rendering" $browser.status $version $path $browser.details
        }
        if ($browserExit -ne 0 -and $browserResults.Count -eq 0) { throw "Browser smoke test exited $browserExit without results." }
    } catch {
        Add-InventoryResult "Rendering" "Browser rendering smoke tests" "Failed" "" (Join-Path $manifestRoot "verify-browsers.cjs") $_.Exception.Message
    } finally {
        if ($null -eq $previousBrowserPath) {
            Remove-Item Env:PLAYWRIGHT_BROWSERS_PATH -ErrorAction SilentlyContinue
        } else {
            $env:PLAYWRIGHT_BROWSERS_PATH = $previousBrowserPath
        }
    }
}

if (Test-Path -LiteralPath $activationScript -PathType Leaf) {
    Add-InventoryResult "Integration" "Activation helper" "Ready" "" $activationScript "Dot-source this file in each new shell."
} else {
    Add-InventoryResult "Integration" "Activation helper" "Failed" "" $activationScript "Activation helper is missing. Run without -ValidateOnly."
}

foreach ($failure in $installationFailures) {
    Add-InventoryResult "Installation" "Bootstrap operation" "Failed" "" $ToolsRoot $failure
}

Write-Host ""
Write-Host "Validated inventory"
$results | Select-Object Category, Name, Status, Version, Path | Format-Table -AutoSize -Wrap | Out-Host

$failed = @($results | Where-Object { $_.Status -ne "Ready" })
if ($failed.Count -gt 0) {
    [Console]::Error.WriteLine("Environment bootstrap failed with $($failed.Count) inventory failure(s):")
    foreach ($failure in $failed) {
        [Console]::Error.WriteLine("")
        [Console]::Error.WriteLine("[$($failure.Category)] $($failure.Name)")
        [Console]::Error.WriteLine("  Path: $($failure.Path)")
        [Console]::Error.WriteLine("  Detail: $($failure.Details)")
    }
    throw "DSP Guide agent environment is incomplete. Review the detailed failure report above."
}

Write-Host ""
Write-Host "DSP Guide agent environment is ready."
Write-Host "Activation: . '$activationScript'"
