/**
 * Browser smoke test.
 *
 *   npm run dev          # in one terminal
 *   npm run smoke        # in another
 *
 * Drives a real browser against the running site and asserts the things that
 * are easy to break and annoying to notice: the theme toggle, every section
 * rendering, the mobile menu, no console errors, and no horizontal overflow
 * on a small phone.
 *
 * Uses whichever Chromium-based browser you already have installed (Edge or
 * Chrome) — nothing extra to download.
 */

import { chromium } from "playwright-core";

const URL = process.env.SMOKE_URL ?? "http://localhost:3000/";

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  const mark = pass ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`  ${mark} ${name}${detail ? `  \x1b[2m${detail}\x1b[0m` : ""}`);
};

async function launch() {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      /* try the next one */
    }
  }
  throw new Error(
    "No Chromium-based browser found. Install Microsoft Edge or Google Chrome, " +
      "or run `npx playwright install chromium`.",
  );
}

const browser = await launch();

try {
  // ── Desktop ──────────────────────────────────────────────
  const ctx = await browser.newContext({
    colorScheme: "light",
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  const res = await page.goto(URL, { waitUntil: "networkidle" });
  check("page responds 200", res?.status() === 200, `status ${res?.status()}`);

  console.log("\n  Sections");
  for (const id of ["top", "about", "skills", "projects", "experience", "contact"]) {
    check(`#${id} present`, (await page.locator(`#${id}`).count()) > 0);
  }

  console.log("\n  Landmarks & headings");
  check("exactly one <h1>", (await page.locator("h1").count()) === 1);
  check("<main> landmark", (await page.locator("main").count()) === 1);
  check("skip link present", (await page.locator('a[href="#main"]').count()) > 0);

  console.log("\n  Theme toggle");
  const toggle = page.locator('button[aria-label="Toggle colour theme"]');
  check("toggle rendered", (await toggle.count()) === 1);
  check("toggle visible", await toggle.isVisible());

  const bgOf = () =>
    page.evaluate(() => ({
      cls: document.documentElement.className,
      bg: getComputedStyle(document.body).backgroundColor,
    }));

  const light = await bgOf();
  check("starts light with OS=light", light.cls.includes("light"), light.bg);

  await toggle.click();
  await page.waitForTimeout(400);
  const dark = await bgOf();
  check("click switches to dark", dark.cls.includes("dark") && dark.bg !== light.bg, dark.bg);

  await toggle.click();
  await page.waitForTimeout(400);
  const back = await bgOf();
  check("click switches back to light", back.bg === light.bg, back.bg);

  await toggle.click();
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  const persisted = await bgOf();
  check("choice survives reload", persisted.cls.includes("dark"), persisted.bg);

  console.log("\n  Chat widget");
  const launcher = page.locator('button[aria-label="Ask a question about my resume"]');
  check("launcher rendered", (await launcher.count()) === 1);
  await launcher.click();
  await page.waitForTimeout(400);
  check("panel opens", (await page.locator('[role="dialog"]').count()) === 1);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("Escape closes panel", (await page.locator('[role="dialog"]').count()) === 0);

  await ctx.close();

  // ── Mobile ───────────────────────────────────────────────
  console.log("\n  Mobile (375px)");
  const mctx = await browser.newContext({
    colorScheme: "light",
    viewport: { width: 375, height: 780 },
    isMobile: true,
    hasTouch: true,
  });
  const mpage = await mctx.newPage();
  mpage.on("pageerror", (e) => consoleErrors.push(String(e)));
  await mpage.goto(URL, { waitUntil: "networkidle" });

  const overflow = await mpage.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check("no horizontal overflow", overflow <= 1, `${overflow}px past viewport`);

  const menuBtn = mpage.locator('button[aria-controls="mobile-menu"]');
  check("menu button visible", await menuBtn.isVisible());
  await menuBtn.click();
  await mpage.waitForTimeout(300);
  check("menu opens", await mpage.locator("#mobile-menu").isVisible());
  check("aria-expanded set", (await menuBtn.getAttribute("aria-expanded")) === "true");
  await mpage.locator('#mobile-menu a[href="#about"]').click();
  await mpage.waitForTimeout(300);
  check("menu closes on nav", (await mpage.locator("#mobile-menu").count()) === 0);

  check("theme toggle reachable on mobile", await mpage.locator('button[aria-label="Toggle colour theme"]').isVisible());

  await mctx.close();

  console.log("\n  Console");
  check("no console errors", consoleErrors.length === 0, consoleErrors[0] ?? "");
  if (consoleErrors.length > 1) {
    consoleErrors.slice(1, 5).forEach((e) => console.log(`      \x1b[2m${e}\x1b[0m`));
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log("");
if (failed.length) {
  console.log(`\x1b[31m${failed.length} of ${results.length} checks failed\x1b[0m\n`);
  process.exit(1);
}
console.log(`\x1b[32mall ${results.length} checks passed\x1b[0m\n`);
