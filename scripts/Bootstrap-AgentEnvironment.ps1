[CmdletBinding()]
param(
    [string]$ToolsRoot,
    [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$repoRootForGit = $repoRoot.Replace("\", "/")
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
$nodeInstallStamp = Join-Path $nodeWorkspace ".dependency-fingerprint"
$runtimePackageFile = Join-Path $nodeWorkspace "package.json"
$expectedPackages = [ordered]@{
    prettier = "3.9.6"
    playwright = "1.62.0"
}
$dependencyFingerprint = ($expectedPackages.GetEnumerator() | ForEach-Object { "$($_.Key)@$($_.Value)" }) -join "`n"
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

function Resolve-NodePath {
    $path = Resolve-ApplicationPath "node.exe"
    if (-not [string]::IsNullOrWhiteSpace($path)) { return $path }
    if ([string]::IsNullOrWhiteSpace($env:USERPROFILE)) { return $null }

    $candidate = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
    return $null
}

function Resolve-PnpmPath {
    $path = Resolve-ApplicationPath "pnpm.cmd"
    if (-not [string]::IsNullOrWhiteSpace($path)) { return $path }
    if ([string]::IsNullOrWhiteSpace($env:USERPROFILE)) { return $null }

    $candidate = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
    return $null
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

function Get-PackageVersion {
    param([string]$PackageName)

    $packageFile = Join-Path (Join-Path $nodeModules $PackageName) "package.json"
    if (-not (Test-Path -LiteralPath $packageFile -PathType Leaf)) { return "" }
    return (Get-Content -LiteralPath $packageFile -Raw | ConvertFrom-Json).version
}

function Test-NodePackageFiles {
    foreach ($packageName in $expectedPackages.Keys) {
        if ((Get-PackageVersion $packageName) -ne $expectedPackages[$packageName]) { return $false }
    }

    return (Test-Path -LiteralPath (Join-Path $nodeModules "prettier\bin\prettier.cjs") -PathType Leaf) -and
        (Test-Path -LiteralPath (Join-Path $nodeModules "playwright\cli.js") -PathType Leaf)
}

function Test-NodeInstallation {
    if (-not (Test-Path -LiteralPath $nodeInstallStamp -PathType Leaf)) { return $false }
    if ((Get-Content -LiteralPath $nodeInstallStamp -Raw).Trim() -ne $dependencyFingerprint.Trim()) { return $false }
    return Test-NodePackageFiles
}

function Get-ActivationScriptContent {
    param(
        [string]$GitPath,
        [string]$NodePath,
        [string]$PnpmPath
    )

    $escapedRepo = $repoRoot.Replace("'", "''")
    $escapedRepoForGit = $repoRootForGit.Replace("'", "''")
    $escapedGit = $GitPath.Replace("'", "''")
    $escapedNode = $NodePath.Replace("'", "''")
    $escapedPnpm = $PnpmPath.Replace("'", "''")
    $escapedModules = $nodeModules.Replace("'", "''")
    $escapedBrowsers = $browserRoot.Replace("'", "''")

    return @"
`$script:DspGuideRoot = '$escapedRepo'
`$script:DspGuideRootForGit = '$escapedRepoForGit'
`$script:DspGuideGit = '$escapedGit'
`$script:DspGuideNode = '$escapedNode'
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
}

function Write-FileIfChanged {
    param(
        [string]$Path,
        [string]$Content
    )

    if ((Test-Path -LiteralPath $Path -PathType Leaf) -and (Get-Content -LiteralPath $Path -Raw) -eq $Content) {
        return
    }
    Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8 -NoNewline
}

function Get-ChromiumExecutablePath {
    param([string]$NodePath)

    $script = 'const path=require("node:path");const root=path.resolve(process.argv[1]);process.stdout.write(require(path.join(root,"playwright")).chromium.executablePath());'
    return Invoke-External $NodePath @("-e", $script, $nodeModules)
}

Write-Host "DSP Guide agent environment bootstrap"
Write-Host "Repository: $repoRoot"
Write-Host "Tool root:  $ToolsRoot"
Write-Host "Mode:       $(if ($ValidateOnly) { 'validate only' } else { 'install and validate' })"

$gitPath = Resolve-ApplicationPath "git.exe"
$rgPath = Resolve-ApplicationPath "rg.exe"
$nodePath = Resolve-NodePath
$pnpmPath = Resolve-PnpmPath
$activationContent = $null

if (-not [string]::IsNullOrWhiteSpace($gitPath) -and
    -not [string]::IsNullOrWhiteSpace($nodePath) -and
    -not [string]::IsNullOrWhiteSpace($pnpmPath)) {
    $activationContent = Get-ActivationScriptContent $gitPath $nodePath $pnpmPath
}

if (-not $ValidateOnly) {
    New-Item -ItemType Directory -Path $ToolsRoot, $nodeWorkspace, $browserRoot -Force | Out-Null

    if ($null -eq $activationContent) {
        $installationFailures.Add("Activation helper generation requires Git, Node.js, and pnpm from the supplied runtime.")
    } else {
        try {
            Write-FileIfChanged $activationScript $activationContent
        } catch {
            $installationFailures.Add("Activation helper generation failed: $($_.Exception.Message)")
        }
    }

    if (Test-NodeInstallation) {
        Write-Host "Node authoring packages are current; installation skipped."
    } elseif ([string]::IsNullOrWhiteSpace($pnpmPath)) {
        $installationFailures.Add("Node package installation requires pnpm.cmd from the supplied runtime.")
    } else {
        $previousCi = $env:CI
        try {
            $manifest = [ordered]@{
                private = $true
                dependencies = $expectedPackages
            } | ConvertTo-Json -Depth 3
            Write-FileIfChanged $runtimePackageFile $manifest

            $env:CI = "true"
            Write-Host "Installing exact Node authoring packages. pnpm output follows."
            & $pnpmPath --dir $nodeWorkspace install --ignore-scripts --store-dir $pnpmStore
            if ($LASTEXITCODE -ne 0) {
                throw "pnpm exited with code $LASTEXITCODE. Do not retry under restricted network access."
            }
            if (-not (Test-NodePackageFiles)) {
                throw "Installed package entry points or versions do not match the bootstrap specification."
            }
            Set-Content -LiteralPath $nodeInstallStamp -Value $dependencyFingerprint -Encoding UTF8 -NoNewline
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
        $installationFailures.Add("Chromium installation requires Node.js and the installed Playwright package.")
    } else {
        $previousBrowserPath = $env:PLAYWRIGHT_BROWSERS_PATH
        $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
        try {
            $requiredBrowserPath = Get-ChromiumExecutablePath $nodePath
            if (Test-Path -LiteralPath $requiredBrowserPath -PathType Leaf) {
                Write-Host "Playwright Chromium is current; browser installation skipped."
            } else {
                Write-Host "Installing Playwright Chromium. Installer output follows."
                & $nodePath $playwrightCli install chromium
                if ($LASTEXITCODE -ne 0) {
                    throw "Playwright exited with code $LASTEXITCODE. Do not retry under restricted network access."
                }
            }
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
}

if ([string]::IsNullOrWhiteSpace($gitPath)) {
    Add-InventoryResult "Core" "Git with scoped safe-directory access" "Failed" "" "" "git.exe was not found."
} else {
    try {
        $gitVersion = Invoke-External $gitPath @("--version")
        $resolvedRoot = Invoke-External $gitPath @("-c", "safe.directory=$repoRootForGit", "-C", $repoRoot, "rev-parse", "--show-toplevel")
        if ($resolvedRoot.Replace("\", "/") -ne $repoRootForGit) { throw "Git resolved an unexpected root: $resolvedRoot" }
        Add-InventoryResult "Core" "Git with scoped safe-directory access" "Ready" ($gitVersion -replace "^git version ", "") $gitPath
    } catch {
        Add-InventoryResult "Core" "Git with scoped safe-directory access" "Failed" "" $gitPath $_.Exception.Message
    }
}

foreach ($tool in @(
    @{ Name = "ripgrep"; Path = $rgPath; Arguments = @("--version") },
    @{ Name = "Node.js"; Path = $nodePath; Arguments = @("--version") },
    @{ Name = "pnpm"; Path = $pnpmPath; Arguments = @("--version") }
)) {
    if ([string]::IsNullOrWhiteSpace($tool.Path)) {
        Add-InventoryResult "Core" $tool.Name "Failed" "" "" "$($tool.Name) was not found in the supplied runtime."
    } else {
        try {
            $version = ((Invoke-External $tool.Path $tool.Arguments) -split "`r?`n")[0]
            Add-InventoryResult "Core" $tool.Name "Ready" ($version -replace "^ripgrep\s+", "" -replace "^v", "") $tool.Path
        } catch {
            Add-InventoryResult "Core" $tool.Name "Failed" "" $tool.Path $_.Exception.Message
        }
    }
}

foreach ($packageName in $expectedPackages.Keys) {
    $expectedVersion = $expectedPackages[$packageName]
    $actualVersion = Get-PackageVersion $packageName
    if ($actualVersion -eq $expectedVersion) {
        Add-InventoryResult "Authoring" $packageName "Ready" $actualVersion (Join-Path $nodeModules $packageName) "Exact version is installed."
    } else {
        Add-InventoryResult "Authoring" $packageName "Failed" $actualVersion (Join-Path $nodeModules $packageName) "Expected exact version $expectedVersion."
    }
}

if (-not [string]::IsNullOrWhiteSpace($nodePath)) {
    $prettierCli = Join-Path $nodeModules "prettier\bin\prettier.cjs"
    try {
        $prettierVersion = Invoke-External $nodePath @($prettierCli, "--version")
        if ($prettierVersion -ne $expectedPackages.prettier) { throw "Expected $($expectedPackages.prettier), received $prettierVersion." }
        $prettierSmoke = @'
const path = require("node:path");
const root = path.resolve(process.argv[1]);
const prettier = require(path.join(root, "prettier"));
(async () => {
    const formatted = await prettier.format("const answer={value:42}", { parser: "babel" });
    if (formatted !== "const answer = { value: 42 };\n") throw new Error("Unexpected formatter output");
    process.stdout.write("ready");
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
'@
        $smokeResult = Invoke-External $nodePath @("-e", $prettierSmoke, $nodeModules)
        if ($smokeResult -ne "ready") { throw "Unexpected formatter smoke result: $smokeResult" }
        Add-InventoryResult "Authoring" "Prettier" "Ready" $prettierVersion $prettierCli "CLI and formatting smoke tests passed."
    } catch {
        Add-InventoryResult "Authoring" "Prettier" "Failed" "" $prettierCli $_.Exception.Message
    }

    $previousBrowserPath = $env:PLAYWRIGHT_BROWSERS_PATH
    $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
    try {
        $chromiumPath = Get-ChromiumExecutablePath $nodePath
        if (-not (Test-Path -LiteralPath $chromiumPath -PathType Leaf)) { throw "Chromium executable is missing: $chromiumPath" }
        $browserSmoke = @'
const path = require("node:path");
const root = path.resolve(process.argv[1]);
const { chromium } = require(path.join(root, "playwright"));
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 320, height: 200 } });
    await page.setContent("<h1>DSP Guide</h1>");
    const screenshot = await page.screenshot();
    await browser.close();
    if (screenshot.length < 1000) throw new Error("Screenshot was unexpectedly small");
    process.stdout.write("ready");
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
'@
        $smokeResult = Invoke-External $nodePath @("-e", $browserSmoke, $nodeModules)
        if ($smokeResult -ne "ready") { throw "Unexpected browser smoke result: $smokeResult" }
        Add-InventoryResult "Rendering" "Playwright Chromium" "Ready" $expectedPackages.playwright $chromiumPath "Headless rendering smoke test passed."
    } catch {
        Add-InventoryResult "Rendering" "Playwright Chromium" "Failed" "" $browserRoot $_.Exception.Message
    } finally {
        if ($null -eq $previousBrowserPath) {
            Remove-Item Env:PLAYWRIGHT_BROWSERS_PATH -ErrorAction SilentlyContinue
        } else {
            $env:PLAYWRIGHT_BROWSERS_PATH = $previousBrowserPath
        }
    }
}

if ($null -eq $activationContent) {
    Add-InventoryResult "Integration" "Activation helper" "Failed" "" $activationScript "Git, Node.js, or pnpm is unavailable."
} elseif (-not (Test-Path -LiteralPath $activationScript -PathType Leaf)) {
    Add-InventoryResult "Integration" "Activation helper" "Failed" "" $activationScript "Helper is missing. Run without -ValidateOnly."
} elseif ((Get-Content -LiteralPath $activationScript -Raw) -ne $activationContent) {
    Add-InventoryResult "Integration" "Activation helper" "Failed" "" $activationScript "Helper is stale. Run without -ValidateOnly."
} else {
    Add-InventoryResult "Integration" "Activation helper" "Ready" "" $activationScript "Dot-source this file in each new shell."
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
