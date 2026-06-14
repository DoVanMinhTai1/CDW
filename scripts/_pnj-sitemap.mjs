#!/usr/bin/env node
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function check(path) {
  try {
    const res = await fetch(`https://www.pnj.com.vn${path}`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(10000),
    });
    const text = await res.text();
    console.log(`${path}: HTTP ${res.status}, ${text.length} chars`);
    console.log(text.slice(0, 1500));
    return text;
  } catch (e) {
    console.log(`${path}: Error - ${e.message}`);
    return null;
  }
}

const paths = [
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/robots.txt',
  '/product-sitemap.xml',
  '/category-sitemap.xml',
  '/sitemap_products_1.xml',
  '/feed',
  '/rss',
  '/product.rss',
];

for (const p of paths) {
  await check(p);
}
