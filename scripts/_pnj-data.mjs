#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_ID = 'UcC4SJTBrEvKVh73fKChD';
const BASE = `https://www.pnj.com.vn/_next/data/${BUILD_ID}/vi`;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch(`${BASE}/nhan.json`, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(30000),
  });
  const data = await res.json();
  const pp = data.pageProps || {};
  console.log('pageProps keys:', Object.keys(pp));
  
  // Dump full response to a file for analysis
  writeFileSync(resolve(__dirname, '_pnj-raw-data.json'), JSON.stringify(data, null, 2), 'utf-8');
  console.log('Full data written to scripts/_pnj-raw-data.json');
  
  // Print important sections
  for (const key of Object.keys(pp)) {
    const val = pp[key];
    if (Array.isArray(val)) {
      console.log(`\n[${key}] Array(${val.length}):`);
      if (val.length > 0) console.log('  first item:', JSON.stringify(val[0]).slice(0, 500));
    } else if (val && typeof val === 'object') {
      const str = JSON.stringify(val);
      console.log(`\n[${key}] Object (${str.length} chars):`);
      console.log(str.slice(0, 1000));
    }
  }
}

main().catch(console.error);
