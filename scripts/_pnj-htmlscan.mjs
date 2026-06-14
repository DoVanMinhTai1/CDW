#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(__dirname, '_pnj-ssr-nhan.html'), 'utf-8');

console.log('Total length:', html.length);

// All script src tags
const srcRegex = /src="([^"]+)"/g;
const scripts = [];
let m;
while ((m = srcRegex.exec(html)) !== null) {
  scripts.push(m[1]);
}
const internal = scripts.filter(s => 
  !s.includes('google') && !s.includes('gtm') && !s.includes('facebook') && !s.includes('cdn-cgi')
);
console.log('\nInternal scripts:');
internal.slice(0, 40).forEach(s => console.log('  ' + s));

// Look for API URLs in the HTML
const apiPattern = /["']([^"']*(?:api|graphql|v1\/|ajax|product\/list|search)[^"']*)["']/gi;
const apis = [];
while ((m = apiPattern.exec(html)) !== null) {
  apis.push(m[1]);
}
const uniqueApis = [...new Set(apis)];
console.log('\nAPI-like URLs found:');
uniqueApis.slice(0, 30).forEach(u => console.log('  ' + u));

// Look for NEXT_PUBLIC_ vars / runtime config
const envPattern = /NEXT_PUBLIC_[^=]+="?([^"&]+)"?/g;
const envs = [];
while ((m = envPattern.exec(html)) !== null) {
  envs.push(m[0]);
}
console.log('\nEnv vars:');
envs.forEach(e => console.log('  ' + e));

// Look for API base URL patterns
const baseUrlPatterns = [/baseURL\s*[:=]\s*["']([^"']+)/gi, /baseUrl\s*[:=]\s*["']([^"']+)/gi, /apiUrl\s*[:=]\s*["']([^"']+)/gi, /url\s*[:=]\s*["']([^"']*api[^"']+)/gi];
for (const pat of baseUrlPatterns) {
  while ((m = pat.exec(html)) !== null) {
    console.log('Base URL match:', m[0]);
  }
}

// Find lines containing specific key patterns
const lines = html.split('\n');
console.log('\nLines with "baseURL" or "baseUrl":');
lines.filter(l => /baseURL|baseUrl|BASE_URL|API_URL|api_url/i.test(l)).forEach(l => console.log('  ' + l.trim().slice(0, 200)));

console.log('\nLines with fetch or axios:');
lines.filter(l => /fetch\(|axios\.|XMLHttpRequest/.test(l)).slice(0, 20).forEach(l => console.log('  ' + l.trim().slice(0, 200)));

// Find all Next.js chunk references
console.log('\nNext.js chunks (first 30):');
const chunkPat = /\/_next\/static\/chunks\/([^"']+)/g;
const chunks = [];
while ((m = chunkPat.exec(html)) !== null) {
  chunks.push(m[1]);
}
[...new Set(chunks)].slice(0, 30).forEach(c => console.log('  ' + c));
