#!/usr/bin/env node
// Get full SSR HTML from PNJ to find product structure
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // SSR page
  const res = await fetch('https://www.pnj.com.vn/nhan', {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
    signal: AbortSignal.timeout(30000),
  });
  const html = await res.text();
  console.log('Status:', res.status, 'Length:', html.length);
  
  // Save for offline analysis
  writeFileSync(resolve(__dirname, '_pnj-ssr-nhan.html'), html, 'utf-8');
  console.log('Saved to scripts/_pnj-ssr-nhan.html');
  
  // Look for API endpoints that fetch product data
  const apiCalls = html.match(/fetch\(['"]([^'"]+)['"]\)|axios\(['"]([^'"]+)['"]\)|url:\s*['"]([^'"]+)['"]|['"](https?:\/\/[^'"]*(?:product|api|search|category)[^'"]*)['"]/gi);
  if (apiCalls) {
    console.log('\nPossible API calls:');
    apiCalls.slice(0, 30).forEach(a => console.log('  ' + a));
  }
  
  // Look for Next.js page data in __NEXT_DATA__
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    const nd = JSON.parse(nextDataMatch[1]);
    console.log('\n__NEXT_DATA__ props keys:', Object.keys(nd.props?.pageProps || {}));
    writeFileSync(resolve(__dirname, '_pnj-next-data.json'), JSON.stringify(nd, null, 2));
    console.log('Saved to scripts/_pnj-next-data.json');
  }
  
  // Try the API endpoint that needed auth
  const apiRes = await fetch('https://www.pnj.com.vn/api/products?category=nhan&page=1&limit=20', {
    headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  console.log(`\n/api/products?category=nhan: HTTP ${apiRes.status}`);
  const txt = await apiRes.text();
  console.log('Response:', txt.slice(0, 2000));
}

main().catch(console.error);
