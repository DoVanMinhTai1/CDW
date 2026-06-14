#!/usr/bin/env node
// Inspect PNJ website structure for crawler development
const BASE_URL = 'https://www.pnj.com.vn';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch(BASE_URL, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    signal: AbortSignal.timeout(20000),
  });
  const html = await res.text();
  console.log('Status:', res.status, 'Length:', html.length);
  
  // Find all API/product/category URLs in scripts and links
  const apiPattern = /https?:\/\/[^"']*(?:api|graphql|ajax|product|category|search)[^"']*/gi;
  let matches;
  const apis = new Set();
  while ((matches = apiPattern.exec(html)) !== null) {
    apis.add(matches[0]);
  }
  console.log('\n=== API/Data endpoints ===');
  for (const a of apis) console.log(a);
  
  // Find script src URLs
  const scriptSrc = /src="([^"]+\.(?:js|json)[^"]*)"/g;
  const scripts = new Set();
  while ((matches = scriptSrc.exec(html)) !== null) {
    if (!matches[1].includes('google') && !matches[1].includes('gtm')) {
      scripts.add(matches[1]);
    }
  }
  console.log('\n=== Internal JS (first 20) ===');
  let i = 0;
  for (const s of scripts) {
    if (i++ >= 20) break;
    console.log(s);
  }
  
  // Look for inline JSON data
  const jsonBlocks = html.match(/<script[^>]*>[\s\S]{0,100}(?:products|items|productList|data\[)[\s\S]{0,500}<\/script>/gi);
  if (jsonBlocks) console.log('\n=== Found inline product data scripts:', jsonBlocks.length);
  
  // Look for .html product links
  const productLinks = new Set();
  const linkPat = /href="([^"]+\.html)"/g;
  while ((matches = linkPat.exec(html)) !== null) {
    productLinks.add(matches[1]);
  }
  console.log('\n=== .html links (first 30) ===');
  i = 0;
  for (const l of productLinks) {
    if (i++ >= 30) break;
    console.log(l);
  }
}

main().catch(console.error);
