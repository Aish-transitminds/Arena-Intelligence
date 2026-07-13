import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a typical desktop size
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('NETWORK ERROR:', response.url(), response.status());
    }
  });

  console.log("Navigating to production site...");
  await page.goto('https://arena-intelligence.vercel.app/fan/transport', { waitUntil: 'networkidle0' });
  
  // Wait a few seconds to let any animations/data load
  await new Promise(r => setTimeout(r, 5000));
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log("Screenshot saved to screenshot.png");
  
  await browser.close();
})();
