import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await mkdir("artifacts", { recursive: true });
await page.screenshot({ path: "artifacts/home-hero-desktop.png" });
for (
  let y = 0;
  y < (await page.evaluate(() => document.body.scrollHeight));
  y += 700
) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(180);
}
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
console.log(
  JSON.stringify(
    {
      title: await page.title(),
      heading: await page.locator("h1").innerText(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      images: await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.map((i) => ({
            src: i.getAttribute("src"),
            loaded: i.complete && i.naturalWidth > 0,
          })),
        ),
      errors,
    },
    null,
    2,
  ),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "artifacts/home-hero-mobile.png" });
await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
console.log(
  "Mobile overflow:",
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
);
await browser.close();
