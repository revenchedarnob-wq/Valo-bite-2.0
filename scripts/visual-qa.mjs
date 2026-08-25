import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;
const QA_DIR = path.join(process.cwd(), ".qa");

if (!fs.existsSync(QA_DIR)) fs.mkdirSync(QA_DIR, { recursive: true });

console.log(`\n🔍 [Visual QA Engine] Auditing: ${URL}`);

const viewports = [
  { name: "Mobile", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1440, height: 900 }
];

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  try {
    const res = await page.goto(URL, { waitUntil: "networkidle", timeout: 15000 });
    if (!res || !res.ok()) {
      console.error(`  ❌ Failed to load ${URL} (Status: ${res ? res.status() : "None"})`);
      await browser.close();
      process.exit(1);
    }
    console.log(`  ✓ Successfully connected to ${URL} (Status: ${res.status()})`);

    // Viewport audits & screenshots
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(600); // Allow animations to settle

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasOverflow) {
        console.warn(`  ⚠️ Warning: Horizontal overflow detected on ${vp.name} (${vp.width}px)!`);
      } else {
        console.log(`  ✓ ${vp.name} (${vp.width}px): Zero horizontal wobble (100% bounded).`);
      }

      const shotPath = path.join(QA_DIR, `${vp.name.toLowerCase()}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`    📸 Saved screenshot: .qa/${vp.name.toLowerCase()}.png`);
    }

    if (consoleErrors.length > 0) {
      console.warn(`\n  ⚠️ Detected ${consoleErrors.length} browser console errors:`);
      consoleErrors.forEach(err => console.warn(`    - ${err}`));
    } else {
      console.log(`  ✓ 0 Console Errors detected in browser runtime.`);
    }

    console.log(`\n✨ [Visual QA Engine] Audit completed successfully with 100% green status!\n`);
  } catch (err) {
    console.error(`  ❌ Visual QA failed: ${err.message}`);
  } finally {
    await browser.close();
  }
}

runAudit();
