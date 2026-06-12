#!/usr/bin/env node
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Log all network requests to find API calls
  const apiCalls = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('api') || url.includes('product') || url.includes('graphql') || url.includes('edge')) {
      apiCalls.push({ url, method: req.method(), headers: req.headers() });
    }
  });

  console.log('Navigating to PNJ nhẫn category...');
  await page.goto('https://www.pnj.com.vn/nhan', { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('\nPage loaded!');
  console.log('Title:', await page.title());
  console.log('URL:', page.url());
  
  // Log API calls
  console.log(`\nAPI calls captured (${apiCalls.length}):`);
  apiCalls.slice(0, 20).forEach(c => {
    console.log(`  ${c.method} ${c.url.substring(0, 150)}`);
  });
  
  // Wait a bit more for dynamic content
  await page.waitForTimeout(3000);
  
  // Get the page HTML
  const html = await page.content();
  
  // Find product elements
  const productSelectors = [
    '.product-card', '.product-item', '[data-product-card]', 
    '.ty-grid-list', '.ty-product', '.product-grid-item',
    '[class*="product"]', '[class*="Product"]',
    'article', '[class*="item-product"]', '[class*="ItemProduct"]',
    'li[class*="product"]', 'div[class*="product"]',
  ];
  
  for (const sel of productSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      console.log(`\nSelector "${sel}": ${count} matches`);
    }
  }
  
  // Look for any grid or list items
  const gridSelectors = [
    '.grid', '.list', '.row', '[class*="grid"]', '[class*="list"]', '[class*="Grid"]', '[class*="List"]',
    'section', 'main', '.content', '[class*="container"]', '[class*="wrapper"]',
  ];
  for (const sel of gridSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0 && count < 50) {
      console.log(`Container "${sel}": ${count} matches`);
    }
  }
  
  // Get all divs with class names that might be product containers
  const allDivs = await page.evaluate(() => {
    const divs = document.querySelectorAll('div[class]');
    const classNames = new Set();
    divs.forEach(d => {
      d.className.split(/\s+/).forEach(c => {
        if (c) classNames.add(c);
      });
    });
    return [...classNames].filter(c => 
      c.toLowerCase().includes('product') || 
      c.toLowerCase().includes('item') || 
      c.toLowerCase().includes('card') ||
      c.toLowerCase().includes('grid') ||
      c.toLowerCase().includes('list') ||
      c.toLowerCase().includes('shop')
    );
  });
  console.log('\nRelevant CSS classes found:');
  allDivs.slice(0, 50).forEach(c => console.log('  .' + c));
  
  // Try to find product elements by looking at the actual rendered structure
  const productCount = await page.evaluate(() => {
    // Check for product-related elements
    const anchors = document.querySelectorAll('a[href*="pnj-"]');
    return anchors.length;
  });
  console.log(`\nLinks containing "pnj-": ${productCount}`);
  
  // Get first few product links
  const sampleLinks = await page.evaluate(() => {
    return [...document.querySelectorAll('a[href*="/nhan/"]')].slice(0, 10).map(a => ({
      href: a.href,
      text: a.textContent?.trim().slice(0, 80),
      class: a.className,
    }));
  });
  console.log('\nSample product links:');
  sampleLinks.forEach(l => console.log(`  ${l.text || '(no text)'} -> ${l.href}`));
  
  // Dump full HTML to file for detailed analysis
  const { writeFileSync } = await import('node:fs');
  writeFileSync('scripts/_pnj-rendered.html', html, 'utf-8');
  console.log('\nFull rendered HTML saved to scripts/_pnj-rendered.html');

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
