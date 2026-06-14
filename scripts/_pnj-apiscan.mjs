#!/usr/bin/env node
// Scan PNJ Next.js site for API endpoints
const BASE = 'https://www.pnj.com.vn';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function getJson(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) });
    const text = await res.text();
    return { status: res.status, body: text.slice(0, 2000), type: res.headers.get('content-type') };
  } catch (e) {
    return { status: 0, error: e.message };
  }
}

async function main() {
  // 1. Get home page and find build ID
  const homeRes = await fetch(BASE, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
  const html = await homeRes.text();
  
  // Build ID
  const buildIdMatch = html.match(/"buildId"\s*:\s*"([^"]+)"/) || html.match(/__NEXT_DATA__[^>]*>([^<]+)/);
  if (buildIdMatch) {
    console.log('Build ID found:', buildIdMatch[1]);
    // Try Next.js data route
    const buildId = buildIdMatch[1];
    console.log('\n--- Trying Next.js data routes ---');
    const pages = ['/trang-suc-nu.json', '/nhan.json', '/day-chuyen.json', '/nhan-cau-hon.json'];
    for (const page of pages) {
      const url = `https://www.pnj.com.vn/_next/data/${buildId}/vi${page}`;
      const r = await getJson(url);
      console.log(`${url}: HTTP ${r.status} ${r.type ? r.type.slice(0,50) : ''}`);
      if (r.body.length > 100) console.log(`  Body preview: ${r.body.slice(0, 300)}`);
    }
  }

  // 2. Try some known API patterns
  console.log('\n--- Trying API endpoints ---');
  const apis = [
    '/api/products',
    '/api/product',
    '/api/category',
    '/api/v1/products',
    '/api/v1/categories',
    '/graphql',
    '/api',
  ];
  for (const api of apis) {
    const r = await getJson(`${BASE}${api}`);
    if (r.status !== 404 && r.status !== 0) {
      console.log(`${api}: HTTP ${r.status} ${r.type ? r.type.slice(0,80) : ''}`);
    }
  }

  // 3. Look for SSR page content (maybe categories have actual SSR)
  console.log('\n--- Trying potential SSR category pages ---');
  const cats = [
    '/nhan', '/day-chuyen', '/bong-tai', '/lac-tay', '/vong-tay',
    '/trang-suc-nu', '/trang-suc-nam',
    '/bo-suu-tap',
  ];
  for (const cat of cats) {
    const url = `${BASE}${cat}`;
    const r = await getJson(url);
    console.log(`${cat}: HTTP ${r.status} (${(r.body||'').length} chars)`);
    if (r.status === 200 && r.body.length > 5000) {
      console.log(`  First 500 chars: ${r.body.slice(0,500)}`);
    }
  }

  // 4. Look for JSON-LD or embedded product data in home page
  console.log('\n--- Searching home page for data ---');
  const ld = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (ld) console.log(`JSON-LD blocks: ${ld.length}`);
  
  // Look for __NEXT_DATA__
  const nextData = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextData) console.log(`__NEXT_DATA__ found: ${nextData[1].slice(0, 500)}...`);
}

main().catch(console.error);
