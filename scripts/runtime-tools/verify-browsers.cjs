"use strict";

const path = require("node:path");
const { createRequire } = require("node:module");

const [modulesRoot, chromePath, edgePath] = process.argv.slice(2);
if (!modulesRoot) {
  console.error(
    "Usage: node verify-browsers.cjs <node-modules-directory> [chrome-path] [edge-path]",
  );
  process.exit(2);
}

const localRequire = createRequire(
  path.join(path.resolve(modulesRoot), "package.json"),
);
const { chromium } = localRequire("playwright");
const targets = [
  { name: "Chromium headless shell", options: { headless: true } },
  { name: "Chromium", options: { channel: "chromium", headless: true } },
  { name: "Chrome", options: { executablePath: chromePath, headless: true } },
  { name: "Edge", options: { executablePath: edgePath, headless: true } },
];
const results = [];

async function verify(target) {
  if (target.options.executablePath === "") {
    results.push({
      name: target.name,
      status: "Failed",
      details: "Executable was not found.",
    });
    return;
  }

  let browser;
  try {
    browser = await chromium.launch(target.options);
    const page = await browser.newPage({
      viewport: { width: 800, height: 600 },
    });
    await page.setContent(
      "<!doctype html><html><head><style>h1{color:rgb(12, 34, 56)}</style></head>" +
        "<body><main><h1>DSP Guide</h1></main></body></html>",
    );
    const observation = await page.locator("h1").evaluate((element) => ({
      text: element.textContent,
      color: getComputedStyle(element).color,
    }));
    const screenshot = await page.screenshot();
    if (
      observation.text !== "DSP Guide" ||
      observation.color !== "rgb(12, 34, 56)"
    ) {
      throw new Error(
        `Unexpected rendered content: ${JSON.stringify(observation)}`,
      );
    }
    if (screenshot.length < 1000)
      throw new Error("Rendered screenshot was unexpectedly small.");
    results.push({
      name: target.name,
      status: "Ready",
      details: "Launch, DOM, CSS, and screenshot checks passed.",
    });
  } catch (error) {
    results.push({
      name: target.name,
      status: "Failed",
      details: error && error.stack ? error.stack : String(error),
    });
  } finally {
    if (browser) await browser.close();
  }
}

(async () => {
  for (const target of targets) await verify(target);
  process.stdout.write(JSON.stringify(results));
  if (results.some((result) => result.status !== "Ready")) process.exitCode = 1;
})();
