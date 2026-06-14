#!/usr/bin/env node
// Quick test of PNJ website structure
const BASE_URL = 'https://www.pnj.com.vn';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function testFetch(path) {
  const url = `${BASE_URL}${path}`;
  console.log(`\n=== ${url} ===`);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    console.log(`Status: ${res.status}, Length: ${text.length}`);
    // Search for product-related content
    const searches = [
      'product-grid', 'product-card', 'product-item', 'ty-grid-list', 
      'ty-product', 'data-product', 'product_', 'grid-list',
      'product-list', 'category-products', 'products-grid'
    ];
    for (const s of searches) {
      if (text.includes(s)) console.log(`  Found: "${s}" at pos ${text.indexOf(s)}`);
    }
    // Find all href links
    const hrefRegex = /href="([^"]+)"/g;
    let m;
    const links = [];
    while ((m = hrefRegex.exec(text)) !== null) {
      if (m[1].includes('trang-suc') || m[1].includes('nhan') || m[1].includes('day-chuyen')) {
        links.push(m[1]);
      }
    }
    if (links.length > 0) {
      console.log(`  Category/product links:`);
      links.slice(0, 20).forEach(l => console.log(`    ${l}`));
    }
    // Look for JSON data
    const jsonMatch = text.match(/window\.__PRELOADED_STATE__\s*=\s*({.+?});/) ||
                       text.match(/<script[^>]*>[\s\S]{0,500}products[\s\S]{0,500}<\/script>/i);
    if (jsonMatch) console.log(`  Found preloaded state or product script`);
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
}

const paths = [
  '/',  // home
  '/nhan.html',
  '/trang-suc-nu/',  
  '/trang-suc-nu.html',
  '/day-chuyen.html',
  '/nhan-cau-hon.html',
];

for (const p of paths) {
  await testFetch(p);
}
