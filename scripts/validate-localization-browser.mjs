import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { completeFixtures } from "./lib/localization-fixtures.mjs";
import { generateSite, writeSite } from "./lib/site-builder.mjs";
import { readJson } from "./lib/terminology.mjs";
import {
  localeUi,
  localeData,
  validateEditions,
} from "./lib/locale-delivery.mjs";

const output = path.resolve(
  process.argv[2] || "artifacts/localization/browser",
);
const candidate = process.argv.includes("--candidate");
const profile = process.argv.slice(3).find((arg) => arg !== "--candidate");
fs.mkdirSync(output, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(
  path.resolve("artifacts/.runtime-tools/node/node_modules/playwright"),
);
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(
  "artifacts/.runtime-tools/browsers",
);
const sites = new Map();
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const prefix = pathname.startsWith("/guide/") ? "guide/" : "";
  let file = decodeURIComponent(pathname.slice(prefix.length + 1));
  if (!file || file.endsWith("/")) file += "index.html";
  const bytes = sites.get(prefix)?.get(file);
  if (!bytes) return response.writeHead(404).end();
  response.setHeader(
    "Content-Type",
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "application/json",
      ".png": "image/png",
    }[path.extname(file)] || "application/octet-stream",
  );
  response.end(bytes);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}/`;
const fixtures = candidate
  ? { manifest: readJson("localization/manifest.json") }
  : completeFixtures();
const locales = fixtures.manifest.locales.filter((locale) => locale.enabled);
assert.equal(locales.length, 4, "Combined checks require all four editions");
const report = { synthetic: !candidate, cases: [] };
try {
  for (const prefix of ["", "guide/"]) {
    const files = generateSite({ ...fixtures, baseUrl: `${origin}${prefix}` });
    validateEditions(files, fixtures.manifest, `${origin}${prefix}`);
    // Local test URLs and synthetic fixtures must never enter a release package.
    files.set(
      "PREVIEW-ONLY.txt",
      Buffer.from(
        "Browser validation output with local URLs; never publish.\n",
      ),
    );
    sites.set(prefix, files);
    writeSite(path.join(output, prefix ? "site-prefix" : "site-root"), files);
  }
  for (const [name, engine, viewport, mobile] of [
    ["android", chromium, { width: 412, height: 915 }, true],
    ["iphone", webkit, { width: 393, height: 852 }, true],
    ["desktop", chromium, { width: 1280, height: 800 }, false],
  ]) {
    if (profile && profile !== name) continue;
    const browser = await engine.launch();
    try {
      const context = await browser.newContext({
        viewport,
        isMobile: mobile,
        hasTouch: mobile,
        deviceScaleFactor: mobile ? 3 : 1,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      let requests = [];
      page.on("pageerror", (error) => errors.push(String(error)));
      page.on("request", (request) => requests.push(request.url()));
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()} ${response.url()}`);
      });
      for (const prefix of ["", "guide/"]) {
        for (const from of locales)
          for (const to of locales) {
            await page.goto(`${origin}${prefix}${from.path}#yellow`);
            await page.waitForFunction(
              () => !document.querySelector("input").disabled,
            );
            await page.evaluate(() =>
              localStorage.setItem("unrelated", "retained"),
            );
            await page.locator("input").first().check();
            await page
              .locator(`#language-selector a[hreflang="${to.id}"]`)
              .click();
            await page.waitForFunction(
              (lang) =>
                document.documentElement.lang === lang &&
                !document.querySelector("input").disabled,
              to.id,
            );
            assert.equal(new URL(page.url()).pathname, `/${prefix}${to.path}`);
            assert.equal(new URL(page.url()).hash, "#yellow");
            assert.equal(await page.locator("input").first().isChecked(), true);
            assert.equal(
              await page.locator("#checklist-save-status").innerText(),
              localeUi(to.id).strings.saved,
            );
            await page.locator("#reset-checklist-progress").click();
            assert.equal(await page.locator("input:checked").count(), 0);
            assert.equal(
              await page.locator("#checklist-save-status").innerText(),
              localeUi(to.id).strings.reset,
            );
            assert.equal(
              await page.evaluate(() => localStorage.getItem("unrelated")),
              "retained",
            );
          }
        await page.goto(`${origin}${prefix}#yellow`);
        for (const locale of locales) {
          requests = [];
          await page
            .locator(`#language-selector a[hreflang="${locale.id}"]`)
            .click();
          await page.waitForFunction(
            (lang) =>
              document.documentElement.lang === lang &&
              !document.querySelector("input").disabled,
            locale.id,
          );
          assert.equal(new URL(page.url()).hash, "#yellow");
          const ui = localeUi(locale.id).strings;
          if (mobile) {
            await page.locator("#phone-route-trigger").click();
            if (prefix)
              await page.screenshot({
                path: path.join(output, `${name}-${locale.id}-route.png`),
              });
            await page.locator('#route-sheet a[href="#yellow"]').click();
          }
          const card = page.locator("#yellow details.build-card").first();
          await card.locator("summary").first().click();
          assert.equal(await card.evaluate((node) => node.open), true);
          if (prefix)
            await page.screenshot({
              path: path.join(output, `${name}-${locale.id}-card.png`),
            });
          await card.locator("summary").first().click();
          const tables = await page
            .locator(".table-scroll")
            .evaluateAll((nodes) =>
              nodes.map((node) => {
                const overflows = node.scrollWidth > node.clientWidth;
                node.scrollLeft = 100;
                return !overflows || node.scrollLeft > 0;
              }),
            );
          assert.ok(
            tables.every(Boolean),
            "Wide tables must scroll after switching",
          );
          if (locale.id !== "en") {
            assert.ok(
              !requests.some((url) =>
                /\/data\/(tech-reference|tech-tooltip-details)\.json|\/locales\/en\/ui\.json/.test(
                  url,
                ),
              ),
              "Localized edition fetched English fallback data",
            );
            await page
              .locator('.tech-ref[data-tech-id="2203"]')
              .first()
              .click();
            await page.waitForFunction(
              () =>
                !document
                  .getElementById("tech-tooltip")
                  .classList.contains("is-hidden"),
            );
            const data = localeData(locale.id);
            assert.equal(
              await page.locator(".tech-tooltip-name").innerText(),
              data["tech-reference.json"][2203].displayName,
            );
            assert.ok(
              (await page.locator("#tech-tooltip").textContent()).includes(
                ui.required,
              ),
            );
            if (prefix)
              await page.screenshot({
                path: path.join(output, `${name}-${locale.id}-details.png`),
              });
            await page.keyboard.press("Escape");
            await page
              .locator('.tech-ref[data-tech-id="1001"]')
              .first()
              .click();
            await page.waitForFunction(
              () =>
                !document
                  .getElementById("tech-tooltip")
                  .classList.contains("is-hidden"),
            );
            for (const unlock of data["tech-tooltip-details.json"][1001]
              .unlocks)
              assert.ok(
                (await page.locator("#tech-tooltip").innerText()).includes(
                  unlock.label,
                ),
              );
            await page.keyboard.press("Escape");
          }
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          if (prefix)
            await page.screenshot({
              path: path.join(output, `${name}-${locale.id}-selector.png`),
            });
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
          );
        }
        const noJs = await browser.newContext({
          viewport,
          isMobile: mobile,
          hasTouch: mobile,
          javaScriptEnabled: false,
        });
        try {
          const staticPage = await noJs.newPage();
          for (const locale of locales) {
            await staticPage.goto(`${origin}${prefix}${locale.path}#yellow`);
            assert.equal(
              await staticPage.locator("input:disabled").count(),
              66,
            );
            assert.equal(
              await staticPage.locator("#language-selector a").count(),
              4,
            );
            await staticPage
              .locator('#language-selector a[hreflang="ja"]')
              .click();
            assert.equal(
              await staticPage.locator("html").getAttribute("lang"),
              "ja",
            );
          }
        } finally {
          await noJs.close();
        }
        console.log(
          `${name}: ${prefix || "root"} switches, UI, links and no-JS passed`,
        );
      }
      for (const locale of locales) {
        const denied = await browser.newContext({
          viewport,
          isMobile: mobile,
          hasTouch: mobile,
        });
        try {
          await denied.addInitScript(() => {
            Storage.prototype.setItem = () => {
              throw Error("denied");
            };
          });
          const p = await denied.newPage();
          await p.goto(`${origin}guide/`);
          await p
            .locator(`#language-selector a[hreflang="${locale.id}"]`)
            .click();
          await p.waitForFunction(
            () => !document.querySelector("input").disabled,
          );
          assert.equal(
            await p.locator("#checklist-save-status").innerText(),
            localeUi(locale.id).strings.unavailable,
          );
          await p.locator("input").first().check();
          await p.locator("#reset-checklist-progress").click();
          assert.equal(
            await p.locator("#checklist-save-status").innerText(),
            localeUi(locale.id).strings.resetUnavailable,
          );
          assert.equal(await p.locator("input:checked").count(), 0);
        } finally {
          await denied.close();
        }
      }
      // Missing localized data disables its dependent behavior instead of fetching English.
      const blocked = await browser.newContext({ viewport });
      try {
        const p = await blocked.newPage();
        const urls = [];
        p.on("request", (r) => urls.push(r.url()));
        await p.route("**/locales/de/ui.json", (route) =>
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: '{"schema":1,"locale":"de","strings":{}}',
          }),
        );
        const failure = p.waitForEvent(
          "console",
          (message) =>
            message.type() === "error" &&
            message.text().includes("Checklist UI"),
        );
        await p.goto(`${origin}guide/de/`);
        await failure;
        assert.equal(await p.locator("input:disabled").count(), 66);
        assert.ok(!urls.some((url) => url.includes("locales/en/ui.json")));
      } finally {
        await blocked.close();
      }
      assert.deepEqual(errors, []);
      const result = {
        name,
        engine: browser.version(),
        viewport,
        switches: 32,
        rootAndPrefix: true,
        noJs: true,
        localizedUi: true,
        storageDenial: true,
        failClosed: true,
      };
      report.cases.push(result);
      console.log(JSON.stringify(result));
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
  fs.writeFileSync(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
}
assert.ok(report.cases.length, "No browser profile matched");
