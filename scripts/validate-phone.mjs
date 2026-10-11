import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(
    "Usage: node scripts/validate-phone.mjs [--mode baseline|navigation|navigation-edges|layout|interaction] [--site directory-or-URL] [--output directory] [--full] [--profile name]",
  );
  process.exit(0);
}
const option = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const mode = option("--mode", "baseline");
assert.ok(
  [
    "baseline",
    "navigation",
    "navigation-edges",
    "layout",
    "interaction",
  ].includes(mode),
  `Unknown mode: ${mode}`,
);
const root = path.resolve(import.meta.dirname, "..");
const site = option("--site", root);
const output = path.resolve(
  option("--output", path.join(root, "artifacts/phone-validation", mode)),
);
const modules =
  process.env.NODE_PATH ||
  path.join(root, "artifacts/.runtime-tools/node/node_modules");
const require = createRequire(import.meta.url);
const playwright = require(path.join(modules, "playwright"));
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(
  root,
  "artifacts/.runtime-tools/browsers",
);
fs.mkdirSync(output, { recursive: true });
let server;
let base = site;
if (!/^https?:/.test(site)) {
  const siteRoot = path.resolve(site);
  server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = path.resolve(
      siteRoot,
      `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`,
    );
    if (!file.startsWith(`${siteRoot}${path.sep}`)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const bytes = fs.readFileSync(file);
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html; charset=utf-8",
          ".css": "text/css",
          ".js": "text/javascript",
          ".json": "application/json",
          ".png": "image/png",
          ".webp": "image/webp",
        }[path.extname(file)] || "application/octet-stream",
      );
      res.end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}/`;
}
const matrix = [
  ["android", "chromium", 412, 915, true],
  ["android-narrow", "chromium", 360, 800, true],
  ["iphone", "webkit", 393, 852, true],
  ["iphone-wide", "webkit", 430, 932, true],
  ["desktop", "chromium", 1280, 800, false],
];
if (args.includes("--full"))
  matrix.push(
    ["phone-wide", "chromium", 480, 900, true],
    ["android-landscape", "chromium", 915, 412, true],
    ["iphone-landscape", "webkit", 852, 393, true],
    ["stress", "chromium", 320, 740, true],
    ["tablet", "webkit", 768, 1024, true],
    ["desktop-wide", "chromium", 1920, 1080, false],
  );
const chrome = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"]]
  .filter(Boolean)
  .map((p) => path.join(p, "Google/Chrome/Application/chrome.exe"))
  .find((p) => fs.existsSync(p));
if (chrome) matrix.push(["chrome-stable", "chromium", 412, 915, true, chrome]);
const report = {
  mode,
  playwright: require(path.join(modules, "playwright/package.json")).version,
  site,
  cases: [],
  errors: [],
};
async function screenshot(page, name) {
  await page.screenshot({ path: path.join(output, `${name}.png`) });
}
async function navigationChecks(page, name) {
  const phone = await page.locator("#phone-route-trigger").isVisible();
  const hashes = await page
    .locator(".phase-rail a")
    .evaluateAll((nodes) => nodes.map((n) => n.hash));
  if (phone) {
    await page.locator("#phone-route-trigger").click();
    await screenshot(page, `${name}-route`);
    const small = await page
      .locator("#route-sheet a, #route-sheet button")
      .evaluateAll((nodes) =>
        nodes
          .filter((n) => n.getBoundingClientRect().height < 44)
          .map((n) => n.textContent),
      );
    assert.deepEqual(small, [], "Route controls smaller than 44px");
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => document.activeElement?.id === "phone-route-trigger",
    );
  }
  for (const hash of hashes) {
    if (phone) await page.locator("#phone-route-trigger").click();
    else if (hash.startsWith("#warp-"))
      await page.locator('[data-phase="warp"]').click();
    else if (["#flight", "#titanium", "#ils-automate"].includes(hash))
      await page.locator('[data-phase="ils"]').click();
    await page.locator(`.phase-rail a[href="${hash}"]`).click();
    await page.waitForFunction((hash) => location.hash === hash, hash);
    if (phone)
      assert.equal(
        await page.locator("#route-sheet").evaluate((n) => n.open),
        false,
      );
  }
  await page.goBack();
  await page.waitForFunction(() => location.hash === "#warp-automate");
  for (const hash of await page
    .locator(".reference-menu a")
    .evaluateAll((ns) => ns.map((n) => n.hash))) {
    await page.locator(".reference-menu > summary").click();
    await page.locator(`.reference-menu a[href="${hash}"]`).click();
    assert.equal(
      await page.locator(".reference-menu").evaluate((n) => n.open),
      false,
    );
  }
  await page.locator(".back-top").click();
  if (phone) {
    await page.locator("#phone-route-trigger").focus();
    await page.keyboard.press("Enter");
    await page.locator("#route-sheet .phone-sheet-close").click();
    await page.locator("#phone-route-trigger").click();
    await page.mouse.click(2, 2);
    assert.equal(
      await page.locator("#route-sheet").evaluate((n) => n.open),
      false,
    );
  }
}
async function layoutChecks(page, name, width) {
  const scan = async () =>
    page.evaluate(() => {
      const overflow = [...document.querySelectorAll("main *")]
        .filter((n) => {
          const r = n.getBoundingClientRect();
          return (
            r.width &&
            (r.right > innerWidth + 1 || r.left < -1) &&
            !n.closest(".table-scroll, .guide-wordmark-crop")
          );
        })
        .map(
          (n) =>
            `${n.tagName}.${n.className}: ${n.textContent.trim().slice(0, 80)}`,
        )
        .slice(0, 12);
      return {
        overflow,
        document: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
  assert.deepEqual(
    await scan(),
    { overflow: [], document: false },
    "Collapsed page overflow",
  );
  await page
    .locator("main details")
    .evaluateAll((ns) => ns.forEach((n) => (n.open = true)));
  assert.deepEqual(
    await scan(),
    { overflow: [], document: false },
    "Expanded page overflow",
  );
  if (width <= 620) {
    const cramped = await page
      .locator(".phone-stack td")
      .evaluateAll((ns) =>
        ns
          .filter(
            (n) =>
              n.getBoundingClientRect().width <
              n.closest("table").getBoundingClientRect().width - 3,
          )
          .map((n) => n.textContent.slice(0, 30)),
      );
    assert.deepEqual(
      cramped,
      [],
      "Dashboard fields must use the reading width",
    );
  }
  for (const table of await page.locator(".table-scroll").all()) {
    await table.evaluate((n) => (n.scrollLeft = n.scrollWidth));
    assert.equal(
      await table.evaluate(
        (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
      ),
      true,
    );
    await table.evaluate((n) => (n.scrollLeft = 0));
  }
  for (const id of ["blue", "yellow", "purple", "logistics"]) {
    await page.locator(`#${id} table`).first().scrollIntoViewIfNeeded();
    await screenshot(page, `${name}-${id}-dashboard`);
  }
  const cards = [];
  for (const card of await page.locator("details.build-card").all()) {
    cards.push(
      await card.evaluate((n) => ({
        id: n.id,
        width: n.getBoundingClientRect().width,
        open: n.open,
        clipped: [...n.querySelectorAll(".card-body, .route-chain")].some(
          (x) => x.scrollWidth > x.clientWidth + 1,
        ),
      })),
    );
  }
  assert.equal(cards.length, 19);
  assert.ok(
    cards.every((c) => c.open && !c.clipped),
    "All expanded production cards must fit",
  );
  await page.locator("details.build-card").first().scrollIntoViewIfNeeded();
  await screenshot(page, `${name}-production`);
  if (["android", "iphone"].includes(name)) {
    for (const [lang, title] of [
      ["de", "Praktischer Leitfaden für deinen Spielfortschritt"],
      ["zh-CN", "实用流程指南"],
      ["ja", "実践的な進行ガイド"],
    ]) {
      await page.locator("html").evaluate((n, lang) => (n.lang = lang), lang);
      await page
        .locator(".guide-title-subtitle")
        .evaluate((n, title) => (n.textContent = title), title);
      await page.evaluate(() => scrollTo(0, 0));
      await screenshot(page, `${name}-${lang}-sample`);
      assert.deepEqual(await scan(), { overflow: [], document: false });
    }
    await page.addStyleTag({
      content: "html { font-size: 200%; } body { font-size: 32px; }",
    });
    await page.locator("#yellow table").first().scrollIntoViewIfNeeded();
    await screenshot(page, `${name}-text-200`);
    assert.deepEqual(
      await scan(),
      { overflow: [], document: false },
      "200% text overflow",
    );
  }
  return {
    cards,
    tables: await page.locator("table").count(),
    checks:
      "collapsed/expanded geometry, dashboard width, table scrolling, language samples and 200% text",
  };
}
async function interactionChecks(page, context, name, width, height) {
  const phone = await page.locator("#phone-route-trigger").isVisible();
  const reference = page.locator('#yellow [data-tech-id="2203"]').first();
  const sheet = page.locator("#tech-sheet");
  const tip = page.locator("#tech-tooltip");
  await reference.click();
  await tip.waitFor({ state: "visible" });
  if (phone) {
    assert.equal(await sheet.evaluate((n) => n.open), true);
    await sheet.locator(".phone-sheet-close").click();
    await page.waitForFunction(
      () => document.activeElement?.dataset.techId === "2203",
    );
    await page.keyboard.press("Enter");
    await sheet.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await sheet.waitFor({ state: "hidden" });
    await reference.click();
    const box = await sheet.boundingBox();
    await page.mouse.click(2, Math.max(2, box.y - 5));
    await sheet.waitFor({ state: "hidden" });
    await page.locator("#phone-route-trigger").click();
    assert.equal(await sheet.evaluate((n) => n.open), false);
    await page.locator('#route-sheet a[href="#yellow"]').click();

    const longest = await page.evaluate(async () => {
      const data = await fetch(
        new URL("assets/data/tech-reference.json", document.baseURI),
      ).then((r) => r.json());
      const details = await fetch(
        new URL("assets/data/tech-tooltip-details.json", document.baseURI),
      ).then((r) => r.json());
      const refs = [...document.querySelectorAll(".tech-ref")];
      const score = (n) => {
        const d = data[n.dataset.techId],
          t = details[n.dataset.techId];
        return JSON.stringify([d?.required, d?.implicitRequired, t?.unlocks])
          .length;
      };
      const n = refs.sort((a, b) => score(b) - score(a))[0];
      for (let p = n.parentElement; p; p = p.parentElement)
        if (p.tagName === "DETAILS") p.open = true;
      return n.dataset.techId;
    });
    await page.locator(`[data-tech-id="${longest}"]`).first().click();
    await sheet.waitFor({ state: "visible" });
    await screenshot(page, `${name}-technology`);
    if (["android", "iphone"].includes(name)) {
      await page.setViewportSize({ width: height, height: width });
      const enlarged = await page.addStyleTag({
        content:
          "#tech-sheet { font-size: 200%; } #tech-sheet .tech-tooltip { font-size: inherit; }",
      });
      await sheet.evaluate((n) => (n.scrollTop = n.scrollHeight));
      assert.ok(
        await sheet.evaluate((n) => n.scrollTop > 0),
        "Long details must scroll in landscape",
      );
      assert.ok(
        await tip
          .locator(".tech-tooltip-line")
          .last()
          .evaluate(
            (n) =>
              n.getBoundingClientRect().bottom <=
              n.closest("dialog").getBoundingClientRect().bottom,
          ),
      );
      await screenshot(page, `${name}-technology-landscape`);
      await enlarged.evaluate((n) => n.remove());
      await page.setViewportSize({ width, height });
      await page.setViewportSize({ width: 1280, height: 800 });
      await sheet.waitFor({ state: "hidden" });
      assert.equal(await tip.getAttribute("role"), "tooltip");
      await page.setViewportSize({ width, height });
      await page.waitForFunction(
        () =>
          document.querySelector(".tech-ref").getAttribute("aria-haspopup") ===
          "dialog",
      );
      await reference.click();
      await sheet.waitFor({ state: "visible" });
    }
    await sheet.locator(".phone-sheet-close").click();
    await sheet.waitFor({ state: "hidden" });
  } else {
    await page.keyboard.press("Escape");
    await tip.waitFor({ state: "hidden" });
    await reference.blur();
    await page.mouse.move(0, 0);
    await reference.hover();
    await tip.waitFor({ state: "visible" });
    await screenshot(page, `${name}-technology-hover`);
    await page.mouse.move(0, 0);
    await tip.waitFor({ state: "hidden" });
    await reference.focus();
    await tip.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
  }
  const labels = await page
    .locator(".task-list-item-checkbox")
    .evaluateAll((ns) => ns.every((n) => n.labels.length === 1));
  assert.ok(labels, "Every checkbox needs a native label");
  const checkbox = page.locator(".task-list-item-checkbox").first();
  await page.locator(".checklist-label").first().click();
  assert.equal(await checkbox.isChecked(), true);
  await page.reload();
  await page.waitForFunction(
    () => document.querySelector(".task-list-item-checkbox").checked,
  );
  await checkbox.focus();
  await page.keyboard.press("Space");
  assert.equal(await checkbox.isChecked(), false);
  await checkbox.check();
  await page.evaluate(() => localStorage.setItem("unrelated-fixture", "keep"));
  await page.locator("#reset-checklist-progress").click();
  assert.equal(
    await page.locator(".task-list-item-checkbox:checked").count(),
    0,
  );
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("dsp-guide:checklist-state:v1"),
    ),
    null,
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("unrelated-fixture")),
    "keep",
  );
  if (phone) {
    const small = await page
      .locator(
        ".checklist-label, .checklist-label-tail, .card-control, .checklist-reset, .build-card > summary",
      )
      .evaluateAll((ns) =>
        ns
          .filter(
            (n) =>
              n.getBoundingClientRect().width &&
              n.getBoundingClientRect().height < 44,
          )
          .map((n) => n.className),
      );
    assert.deepEqual(small, [], "Touch controls must be at least 44 px high");
  }
  await page.locator(".checklist-label").first().scrollIntoViewIfNeeded();
  await screenshot(page, `${name}-checklists`);
  for (const control of await page
    .locator('#blue [data-card-action="open"]')
    .all())
    await control.click();
  assert.ok(
    await page
      .locator("#blue .build-card")
      .evaluateAll((ns) => ns.every((n) => n.open)),
  );
  for (const control of await page
    .locator('#blue [data-card-action="close"]')
    .all())
    await control.click();
  assert.equal(await page.locator("#blue .build-card[open]").count(), 0);
  if (["android", "iphone"].includes(name)) {
    await page.locator("#checklist-universe-matrix").evaluate((n) => {
      for (let p = n.parentElement; p; p = p.parentElement)
        if (p.tagName === "DETAILS") p.open = true;
    });
    await page.locator("#checklist-universe-label .tech-ref").click();
    await sheet.waitFor({ state: "visible" });
    assert.equal(
      await page.locator("#checklist-universe-matrix").isChecked(),
      false,
    );
    await sheet.locator(".phone-sheet-close").click();
    await sheet.waitFor({ state: "hidden" });
    await page.locator(".checklist-label-tail").click();
    assert.equal(
      await page.locator("#checklist-universe-matrix").isChecked(),
      true,
    );
    const denied = await context.newPage();
    await denied.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Denied for validation", "SecurityError");
        },
      }),
    );
    await denied.goto(base);
    await denied.waitForFunction(
      () =>
        document.querySelector(".task-list-item-checkbox").disabled === false,
    );
    assert.match(
      await denied.locator("#checklist-save-status").innerText(),
      /unavailable/,
    );
    await denied.locator(".checklist-label").first().click();
    assert.equal(
      await denied.locator(".task-list-item-checkbox").first().isChecked(),
      true,
    );
    await denied.locator("#reset-checklist-progress").click();
    assert.equal(
      await denied.locator(".task-list-item-checkbox:checked").count(),
      0,
    );
    await denied.close();
  }
  return "details dismissal/focus/scrolling, desktop hover/keyboard, native labels, touch targets, save/reload, reset and denied storage";
}
try {
  for (const [name, engine, width, height, mobile, executablePath] of matrix) {
    if (option("--profile", name) !== name) continue;
    if (mode === "navigation-edges" && !["android", "iphone"].includes(name))
      continue;
    const browser = await playwright[engine].launch({ executablePath });
    const entry = {
      name,
      engine,
      version: browser.version(),
      width,
      height,
      mobile,
    };
    report.cases.push(entry);
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: mobile,
      hasTouch: mobile,
      deviceScaleFactor: mobile ? 3 : 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on("pageerror", (error) =>
      report.errors.push(`${name}: ${error.message}`),
    );
    page.on("response", (response) => {
      if (response.status() >= 400 && response.url().startsWith(base))
        report.errors.push(`${name}: ${response.status()} ${response.url()}`);
    });
    try {
      await page.goto(base);
      await page.waitForFunction(
        () =>
          document.querySelector(".task-list-item-checkbox")?.disabled ===
          false,
      );
      await page.addStyleTag({
        content:
          "html { scroll-behavior: auto !important; } * { animation: none !important; transition: none !important; }",
      });
      if (mode === "navigation-edges") {
        await page.locator("#phone-route-trigger").click();
        await page.setViewportSize({ width: height, height: width });
        await page.locator("#route-sheet .phone-sheet-close").click();
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForFunction(
          () =>
            document.querySelector(".phase-rail").parentElement ===
            document.body,
        );
        await page.setViewportSize({ width, height });
        await page.addStyleTag({
          content: ":root { --phone-safe-bottom: 34px; }",
        });
        assert.ok(
          await page
            .locator("#phone-route-trigger")
            .evaluate(
              (n) => innerHeight - n.getBoundingClientRect().bottom >= 34,
            ),
        );
        await screenshot(page, `${name}-safe-area`);
        const plain = await browser.newContext({
          viewport: { width, height },
          javaScriptEnabled: false,
          isMobile: true,
          hasTouch: true,
        });
        const plainPage = await plain.newPage();
        await plainPage.goto(base);
        await plainPage.locator('.stage-tab[href="#warp-outpost"]').click();
        assert.ok(plainPage.url().endsWith("#warp-outpost"));
        await plain.close();
        entry.checks = [
          "orientation",
          "desktop/phone transition",
          "simulated safe area",
          "no-JS stage links",
        ];
        console.log(`${name}: navigation edges passed`);
        continue;
      }
      entry.baseline = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        cards: document.querySelectorAll("details.build-card").length,
        checklists: document.querySelectorAll(".task-list-item-checkbox")
          .length,
        navigation: [...document.querySelectorAll(".rail-tab, .stage-tab")].map(
          (n) => ({ hash: n.hash, height: n.getBoundingClientRect().height }),
        ),
        tooltipPointerEvents: getComputedStyle(
          document.getElementById("tech-tooltip"),
        ).pointerEvents,
      }));
      assert.equal(entry.baseline.cards, 19);
      assert.equal(entry.baseline.checklists, 66);
      await screenshot(page, `${name}-opening`);
      if (mode === "navigation") await navigationChecks(page, name);
      if (mode === "interaction") {
        entry.interaction = await interactionChecks(
          page,
          context,
          name,
          width,
          height,
        );
        console.log(`${name}: interaction passed`);
        continue;
      }
      if (mode === "layout") {
        entry.layout = await layoutChecks(page, name, width);
        console.log(`${name}: layout passed`);
        continue;
      }
      await page.goto(`${base}#yellow`);
      await page.waitForFunction(() =>
        document.querySelector('[data-phase="yellow"].active'),
      );
      const card = page.locator("#yellow details.build-card").first();
      await card.locator("summary").first().click();
      assert.equal(await card.evaluate((n) => n.open), true);
      await screenshot(page, `${name}-card`);
      await page.locator('#yellow [data-tech-id="2203"]').first().click();
      await page.waitForFunction(() =>
        document.querySelector("#tech-tooltip").classList.contains("visible"),
      );
      assert.match(
        await page.locator("#tech-tooltip").innerText(),
        /Mechanical Frame/,
      );
      await page.keyboard.press("Escape");
      const checkbox = page.locator(".task-list-item-checkbox").first();
      await checkbox.check();
      await page.reload();
      await page.waitForFunction(
        () =>
          document.querySelector(".task-list-item-checkbox")?.checked === true,
      );
      entry.checks = [
        "document inventory",
        "hash navigation",
        "card disclosure",
        "technology details",
        "checklist reload",
      ];
      console.log(`${name}: passed (${engine} ${entry.version})`);
    } catch (error) {
      report.errors.push(`${name}: ${error.stack}`);
      await screenshot(page, `${name}-failure`);
      console.error(`${name}: ${error.message}`);
    } finally {
      await context.close();
      await browser.close();
    }
  }
} finally {
  server?.close();
}
fs.writeFileSync(
  path.join(output, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(
  `Phone ${mode}: ${report.cases.length} cases, ${report.errors.length} errors. Evidence: ${output}`,
);
if (report.errors.length) process.exitCode = 1;
