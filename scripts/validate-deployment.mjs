import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";

const [siteArgument, sourceArgument = "."] = process.argv.slice(2);
if (!siteArgument) {
  console.error("Usage: node scripts/validate-deployment.mjs <site-directory> [source-directory]");
  process.exit(2);
}

const siteRoot = path.resolve(siteArgument);
const sourceRoot = path.resolve(sourceArgument);
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const toRelative = value => path.relative(value.root, value.file).replaceAll(path.sep, "/");

function listFiles(root) {
  const files = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        failures.push(`Symbolic links are not permitted: ${path.relative(root, absolute)}`);
      } else if (entry.isDirectory()) {
        visit(absolute);
      } else if (entry.isFile()) {
        files.push(absolute);
      }
    }
  };
  visit(root);
  return files;
}

const sourceFiles = [
  path.join(sourceRoot, "index.html"),
  ...listFiles(path.join(sourceRoot, "assets"))
];
const expected = sourceFiles.map(file => toRelative({ root: sourceRoot, file })).sort();
const deployedFiles = listFiles(siteRoot);
const actual = deployedFiles.map(file => toRelative({ root: siteRoot, file })).sort();
check(JSON.stringify(actual) === JSON.stringify(expected), "Package contents differ from index.html plus assets/.");

for (const relative of expected) {
  const source = path.join(sourceRoot, relative);
  const deployed = path.join(siteRoot, relative);
  check(fs.existsSync(deployed), `Missing deployment file: ${relative}`);
  if (fs.existsSync(deployed)) {
    check(fs.readFileSync(deployed).equals(fs.readFileSync(source)), `Deployment file changed: ${relative}`);
  }
}

const htmlPath = path.join(siteRoot, "index.html");
check(fs.existsSync(htmlPath), "index.html is missing.");
const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
check(!/<style\b/.test(html), "Inline CSS found in index.html.");
check(!/<script(?![^>]*\bsrc=)/.test(html), "Inline JavaScript or JSON found in index.html.");

const ids = [...html.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
check(ids.length === new Set(ids).size, "Duplicate HTML id found.");
check(anchors.every(anchor => ids.includes(anchor)), "Broken internal anchor found.");

const localAssets = [
  ...html.matchAll(/(?:href|src)="(assets\/[^"]+)"/g)
].map(match => match[1]);
check(localAssets.length === 4, `Expected four directly referenced static assets; found ${localAssets.length}.`);
check(localAssets.every(asset => fs.existsSync(path.join(siteRoot, asset))), "A referenced static asset is missing.");

for (const relative of actual.filter(file => file.endsWith(".js"))) {
  try {
    new vm.Script(fs.readFileSync(path.join(siteRoot, relative), "utf8"), { filename: relative });
  } catch (error) {
    failures.push(`${relative} does not parse: ${error.message}`);
  }
}

const technologyDataPath = path.join(siteRoot, "assets", "data", "tech-reference.json");
try {
  const technologyData = JSON.parse(fs.readFileSync(technologyDataPath, "utf8"));
  check(Object.keys(technologyData).length === 314, "Technology reference data does not contain 314 records.");
  check([...html.matchAll(/data-tech-id="(\d+)"/g)].every(match => technologyData[match[1]]), "Unresolved technology reference found.");
} catch (error) {
  failures.push(`Technology reference data is invalid: ${error.message}`);
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};
const server = http.createServer((request, response) => {
  const relative = request.url === "/" ? "index.html" : decodeURIComponent(request.url.slice(1));
  const resolved = path.resolve(siteRoot, relative);
  if (!resolved.startsWith(`${siteRoot}${path.sep}`) && resolved !== path.join(siteRoot, "index.html")) {
    response.writeHead(403).end();
    return;
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "Content-Type": contentTypes[path.extname(resolved)] || "application/octet-stream" });
  fs.createReadStream(resolved).pipe(response);
});

async function request(relative, port) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/${relative}`, response => {
      response.resume();
      response.on("end", () => resolve(response.statusCode));
    }).on("error", reject);
  });
}

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
try {
  for (const relative of ["index.html", ...localAssets, "assets/data/tech-reference.json"]) {
    check(await request(relative, port) === 200, `${relative} was not served successfully.`);
  }
} finally {
  await new Promise(resolve => server.close(resolve));
}

if (failures.length) {
  console.error(JSON.stringify({ status: "FAIL", failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  deployment_files: actual.length,
  direct_asset_references: localAssets.length,
  internal_anchors: anchors.length,
  technology_references: [...html.matchAll(/data-tech-id="(\d+)"/g)].length
}, null, 2));
