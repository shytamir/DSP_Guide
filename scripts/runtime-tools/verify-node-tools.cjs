"use strict";

const path = require("node:path");
const { createRequire } = require("node:module");

const modulesRoot = process.argv[2];
if (!modulesRoot) {
  console.error("Usage: node verify-node-tools.cjs <node-modules-directory>");
  process.exit(2);
}

const localRequire = createRequire(
  path.join(path.resolve(modulesRoot), "package.json"),
);
const results = [];

async function check(name, packageName, operation) {
  try {
    await operation();
    results.push({
      name,
      package: packageName,
      status: "Ready",
      details: "Functional smoke test passed.",
    });
  } catch (error) {
    results.push({
      name,
      package: packageName,
      status: "Failed",
      details: error && error.stack ? error.stack : String(error),
    });
  }
}

(async () => {
  await check("Prettier engine", "prettier", async () => {
    const prettier = localRequire("prettier");
    const formatted = await prettier.format("const answer={value:42}", {
      parser: "babel",
    });
    if (formatted !== "const answer = { value: 42 };\n")
      throw new Error(`Unexpected formatter output: ${formatted}`);
  });

  process.stdout.write(JSON.stringify(results));
  if (results.some((result) => result.status !== "Ready")) process.exitCode = 1;
})();
