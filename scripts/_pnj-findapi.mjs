#!/usr/bin/env node
// Find PNJ's product API endpoint
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function tryEndpoint(name, url, headers = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'application/json', ...headers },
      signal: AbortSignal.timeout(10000),
    });
    const text = await res.text();
    const isJson = text.startsWith('{') || text.startsWith('[');
    console.log(`${name}: HTTP ${res.status} ${isJson ? 'JSON' : 'Non-JSON'} (${text.length} chars)`);
    if (isJson && text.length > 10) {
      console.log(`  Response: ${text.slice(0, 600)}`);
    }
    return { status: res.status, body: text };
  } catch (e) {
    console.log(`${name}: Error - ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('=== Edge API ===');
  // Try the edge API directly
  await tryEndpoint('GET edge-api base', 'https://edge-api.pnj.io/');
  await tryEndpoint('GET edge-api products', 'https://edge-api.pnj.io/ecom-frontend/v1/products', { origin: 'https://www.pnj.com.vn' });
  await tryEndpoint('POST edge-api products', 'https://edge-api.pnj.io/ecom-frontend/v1/products', { 'Content-Type': 'application/json', origin: 'https://www.pnj.com.vn' });
  
  console.log('\n=== pnj.io subdomain ===');
  await tryEndpoint('api.pnj.io', 'https://api.pnj.io/');
  await tryEndpoint('api.pnj.io products', 'https://api.pnj.io/products', { origin: 'https://www.pnj.com.vn' });
  
  console.log('\n=== pnj.com.vn API ===');
  await tryEndpoint('/api v1', 'https://www.pnj.com.vn/api/v1', { 'X-Requested-With': 'XMLHttpRequest' });
  await tryEndpoint('/api v1 products', 'https://www.pnj.com.vn/api/v1/products', { 'X-Requested-With': 'XMLHttpRequest', Referer: 'https://www.pnj.com.vn/nhan' });
  await tryEndpoint('/api v1 category=nhan', 'https://www.pnj.com.vn/api/v1/products?category=nhan&page=1&limit=20', { 'X-Requested-With': 'XMLHttpRequest', Referer: 'https://www.pnj.com.vn/nhan' });
  
  console.log('\n=== Search/GraphQL ===');
  await tryEndpoint('graphql', 'https://www.pnj.com.vn/graphql', { 'Content-Type': 'application/json' });
  await tryEndpoint('POST search', 'https://www.pnj.com.vn/api/search', { 'Content-Type': 'application/json' });

  console.log('\n=== Try product slugs from site ===');
  // Known product patterns
  await tryEndpoint('product by slug PNJ-1234', 'https://www.pnj.com.vn/api/products/PNJ-1234', { 'X-Requested-With': 'XMLHttpRequest' });
  await tryEndpoint('product detail', 'https://www.pnj.com.vn/api/product/detail?slug=PNJ-1234', { 'X-Requested-With': 'XMLHttpRequest' });

  console.log('\n=== SSR product detail page ===');
  const detailRes = await fetch('https://www.pnj.com.vn/nhan/nhan-kim-cuong-pnj-12345', {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(10000),
  });
  console.log(`Product detail page: HTTP ${detailRes.status}`);
  const detailHtml = await detailRes.text();
  console.log('HTML length:', detailHtml.length);
  const nextData = detailHtml.match(/__NEXT_DATA__[^>]*>([\s\S]*?)<\/script>/);
  if (nextData) {
    console.log('Next data found:', nextData[1].slice(0, 800));
  }
  // Search for API endpoint patterns
  const apiPattern = /["']([^"']*(?:api|graphql|v1\/|ajax|product\/list|listProduct)[^"']*)["']/gi;
  let m;
  const apis = new Set();
  while ((m = apiPattern.exec(detailHtml)) !== null) {
    if (!m[1].includes('cdn-cgi') && !m[1].includes('google')) apis.add(m[1]);
  }
  console.log(`API patterns in detail page: ${apis.size}`);
  for (const a of apis) console.log('  ' + a);
}

main().catch(console.error);
