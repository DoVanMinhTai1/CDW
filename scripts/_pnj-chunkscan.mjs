#!/usr/bin/env node
// Fetch PNJ Next.js category page chunk to find the API call pattern
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Get the category page chunk that handles product list
  const chunkUrls = [
    'https://www.pnj.com.vn/site/_next/static/chunks/pages/danh-muc/%5B...slug%5D-0068dea0388c56ad.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/1648-1420d186edc24a12.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/8651-6d9e43b25fff3420.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/8278-549f1b3bc6f6e908.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/2782-c6088d4bb040769b.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/3677-1366f38a532861c9.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/9102-d803d2ada2d00f07.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/1999-827e89397ff6c0d0.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/5719-ac9a9a2a06a2dc18.js',
    'https://www.pnj.com.vn/site/_next/static/chunks/7257-f74845caf3c8105d.js',
  ];

  for (const url of chunkUrls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) });
      const js = await res.text();
      console.log(`\n=== ${url.split('/').pop()} (${js.length} chars) ===`);
      
      // Search for API fetching patterns
      const patterns = ['api.pnj', 'fetch(', 'axios', '/api/', 'productList', 'listProduct', 'getProducts', 'loadMore', 'getAllProducts'];
      for (const p of patterns) {
        if (js.includes(p)) {
          const idx = js.indexOf(p);
          const context = js.slice(Math.max(0, idx - 50), idx + 200);
          console.log(`  Found "${p}" at ${idx}:`);
          console.log(`    ...${context}...`);
        }
      }
      
      // Look for "edge-api" or API base URL patterns
      const apis = js.match(/["'](https?:\/\/[^"']*(?:api|graphql|v1\/)[^"']*)["']/g);
      if (apis) {
        console.log(`  API URLs found: ${apis.length}`);
        apis.forEach(a => console.log(`    ${a}`));
      }
      
      const fetchPattern = /\.(?:get|post|put|delete)\(['"]([^'"]+)['"]/g;
      let m;
      while ((m = fetchPattern.exec(js)) !== null) {
        if (m[1].includes('api') || m[1].includes('v1')) {
          console.log(`  API call: ${m[0]}`);
        }
      }
    } catch (e) {
      console.log(`${url.split('/').pop()}: Error - ${e.message}`);
    }
  }
}

main().catch(console.error);
