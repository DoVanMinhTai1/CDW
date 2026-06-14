#!/usr/bin/env node
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const chunks = [
  '9102-d803d2ada2d00f07.js',
  '3677-1366f38a532861c9.js',
  '8651-6d9e43b25fff3420.js',
];

async function fetchChunk(name) {
  const url = `https://www.pnj.com.vn/site/_next/static/chunks/${name}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) });
  return await res.text();
}

async function main() {
  for (const name of chunks) {
    const js = await fetchChunk(name);
    console.log(`\n=== ${name} (${js.length} chars) ===`);
    
    // Search for "product" related function names
    const productFuncs = js.match(/\.(?:get|post|put)\(['"][^'"]*(?:product|Product|listProduct|getAllProduct|searchProduct|filterProduct)[^'"]*['"]\)/g);
    if (productFuncs) {
      console.log('Product API calls:', productFuncs.length);
      productFuncs.forEach(f => console.log(`  ${f}`));
    }
    
    // Look for any string containing /v1/ or /v2/ with product
    const v1Calls = js.match(/['"][^'"]*\/v[12]\/[^'"]*(?:product|item|search|filter|list)[^'"]*['"]/gi);
    if (v1Calls) {
      console.log('v1/v2 product calls:', v1Calls.length);
      v1Calls.forEach(c => console.log(`  ${c}`));
    }
    
    // Search for "await" + ".get/post" patterns
    const awaitPattern = /await\s+\w+\.(?:get|post|put|delete)\(['"]([^'"]+)['"]/g;
    let m;
    const calls = [];
    while ((m = awaitPattern.exec(js)) !== null) {
      calls.push(m[1]);
    }
    if (calls.length > 0) {
      console.log(`\nAll API calls (${calls.length}):`);
      calls.forEach(c => {
        if (c.includes('api') || c.includes('product') || c.includes('search') || c.includes('filter')) {
          console.log(`  ${c}`);
        }
      });
    }
    
    // Find any edge-api URLs
    const edgeApi = js.match(/['"](https?:\/\/edge[^'"]*)['"]/g);
    if (edgeApi) {
      console.log('\nEdge API URLs:');
      [...new Set(edgeApi)].forEach(u => console.log(`  ${u}`));
    }
  }
}

main().catch(console.error);
