#!/usr/bin/env node
// Try to get an auth token by loading the page and capturing cookies
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // 1. First request to get cookies
  const res1 = await fetch('https://www.pnj.com.vn/nhan', {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
  });
  const cookies = res1.headers.getSetCookie?.() || [];
  console.log('Cookies from initial request:');
  cookies.forEach(c => console.log('  ' + c.split(';')[0]));
  
  const setCookie = res1.headers.get('set-cookie');
  console.log('Set-Cookie header:', setCookie?.slice(0, 200));
  
  // 2. Try different API endpoints with various auth approaches
  const headers = {
    'User-Agent': UA,
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Referer': 'https://www.pnj.com.vn/nhan',
    'Origin': 'https://www.pnj.com.vn',
    'Accept': 'application/json, text/plain, */*',
  };
  
  // Copy cookies from initial response
  if (cookies.length > 0) {
    headers['Cookie'] = cookies.join('; ');
  }
  
  console.log('\n=== Trying edge-api with cookies ===');
  const edgeRes = await fetch('https://edge-api.pnj.io/ecom-frontend/v1/products?category=639&page=1&limit=20', {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  console.log(`Status: ${edgeRes.status}`);
  const edgeText = await edgeRes.text();
  console.log(`Response: ${edgeText.slice(0, 500)}`);
  
  // 3. Try the pnj.com.vn/api with form data
  console.log('\n=== Trying POST to /api/search with JSON body ===');
  const searchRes = await fetch('https://www.pnj.com.vn/api/search', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: 'nhan', page: 1, limit: 20 }),
    signal: AbortSignal.timeout(10000),
  });
  console.log(`Status: ${searchRes.status}`);
  const searchText = await searchRes.text();
  console.log(`Response: ${searchText.slice(0, 500)}`);
  
  // 4. Try the /api/v1 with specific endpoint
  console.log('\n=== Trying /api/v1/product/list ===');
  const listRes = await fetch('https://www.pnj.com.vn/api/v1/product/list', {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  console.log(`Status: ${listRes.status}`);
  const listText = await listRes.text();
  console.log(`Response: ${listText.slice(0, 500)}`);
  
  // 5. Try graphql
  console.log('\n=== Trying POST /graphql ===');
  const gqlRes = await fetch('https://www.pnj.com.vn/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: '{ products(category: "nhan") { id name price } }' }),
    signal: AbortSignal.timeout(10000),
  });
  console.log(`Status: ${gqlRes.status}`);
  const gqlText = await gqlRes.text();
  console.log(`Response: ${gqlText.slice(0, 500)}`);
  
  // 6. Try edge-api with apiKey
  console.log('\n=== Trying edge-api with API key ===');
  const edgeKeyRes = await fetch('https://edge-api.pnj.io/ecom-frontend/v1/products?category=639&page=1&limit=20', {
    headers: {
      ...headers,
      'x-api-key': '3PSWGkjX7GueCSy38keBikLd8JjizIjA',
      'Authorization': 'Bearer 3PSWGkjX7GueCSy38keBikLd8JjizIjA',
    },
    signal: AbortSignal.timeout(10000),
  });
  console.log(`Status: ${edgeKeyRes.status}`);
  const edgeKeyText = await edgeKeyRes.text();
  console.log(`Response: ${edgeKeyText.slice(0, 500)}`);
}

main().catch(console.error);
