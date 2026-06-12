#!/usr/bin/env node
/**
 * jewelry-crawler.mjs  —  Polished jewelry e-commerce data crawler
 *
 * Crawls a product listing page, extracts structured product data, and
 * writes the result to a JSON or CSV file.
 *
 * Usage:
 *   node scripts/jewelry-crawler.mjs
 *   node scripts/jewelry-crawler.mjs --config ./scripts/my-config.json
 *   node scripts/jewelry-crawler.mjs --url "https://..." --output ./data/products.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

// ─── Helpers ────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const map = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      map[key] = val;
    }
  }
  return map;
}

function loadConfig(cli) {
  let cfg = {};

  // 1. default config
  const defaultPath = resolve(__dirname, 'config.json');
  if (existsSync(defaultPath)) {
    cfg = JSON.parse(readFileSync(defaultPath, 'utf-8'));
  }

  // 2. --config override
  if (cli.config) {
    const overridePath = resolve(process.cwd(), cli.config);
    const overrides = JSON.parse(readFileSync(overridePath, 'utf-8'));
    cfg = deepMerge(cfg, overrides);
  }

  // 3. individual CLI flags override
  if (cli.url) cfg.url = cli.url;
  if (cli.output) cfg.output = { ...cfg.output, file: cli.output };
  if (cli.delay) cfg.crawler = { ...cfg.crawler, delayMs: parseInt(cli.delay, 10) };

  return cfg;
}

function deepMerge(base, overrides) {
  const result = { ...base };
  for (const [k, v] of Object.entries(overrides)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && result[k] && typeof result[k] === 'object') {
      result[k] = deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

function extractAttr($el, selector, attr = 'text') {
  const el = selector ? $el.find(selector).first() : $el;
  if (!el.length) return null;
  if (attr === 'text') return el.text().trim();
  return el.attr(attr) || null;
}

function resolveUrl(base, href) {
  if (!href) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

// ─── Core crawler ───────────────────────────────────────────────────────────

async function crawlPage(config) {
  const { url, selectors, crawler } = config;
  const { delayMs = 1500, maxRetries = 3, timeoutMs = 30000, userAgent } = crawler || {};

  console.log(`[crawler] Fetching ${url} ...`);

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent || 'Mozilla/5.0 (compatible; CDW-Crawler/1.0)',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const html = await res.text();
      console.log(`[crawler] Received ${(html.length / 1024).toFixed(1)} KB`);

      return parseProducts(html, url, selectors);
    } catch (err) {
      lastError = err;
      console.warn(`[crawler] Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt < maxRetries) {
        const backoff = delayMs * attempt;
        console.log(`[crawler] Waiting ${backoff} ms before retry ...`);
        await sleep(backoff);
      }
    }
  }

  throw new Error(`All ${maxRetries} attempts failed. Last error: ${lastError?.message}`);
}

function parseProducts(html, baseUrl, sel) {
  const $ = cheerio.load(html);
  const products = [];

  $(sel.productContainer).each((_, el) => {
    const $el = $(el);

    const name = extractAttr($el, sel.name);
    if (!name) return; // skip items without a name

    const priceRaw = extractAttr($el, sel.price);
    const imageSrc = extractAttr($el, sel.image, 'src');
    const linkHref = extractAttr($el, sel.link, 'href');
    const category = extractAttr($el, sel.category);
    const description = extractAttr($el, sel.description);

    const price = priceRaw
      ? priceRaw.replace(/[^\d.,]/g, '').trim()
      : null;

    products.push({
      name,
      price: priceRaw,
      priceNumeric: price,
      image: resolveUrl(baseUrl, imageSrc),
      link: resolveUrl(baseUrl, linkHref),
      category: category || null,
      description: description || null,
      scrapedAt: new Date().toISOString(),
      sourceUrl: baseUrl,
    });
  });

  return products;
}

// ─── Output ─────────────────────────────────────────────────────────────────

function writeOutput(products, config) {
  const out = config.output || {};
  const format = out.format || 'json';
  let filePath = out.file || resolve(__dirname, 'output', `products.${format}`);

  // resolve relative to cwd if not absolute
  if (!filePath.startsWith('/') && !/^[A-Z]:\\/i.test(filePath)) {
    filePath = resolve(process.cwd(), filePath);
  }

  mkdirSync(dirname(filePath), { recursive: true });

  if (format === 'csv') {
    const headers = ['name', 'price', 'priceNumeric', 'image', 'link', 'category', 'description', 'scrapedAt', 'sourceUrl'];
    const esc = (v) => (v != null ? `"${String(v).replace(/"/g, '""')}"` : '');
    const rows = products.map((p) => headers.map((h) => esc(p[h])).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    writeFileSync(filePath, csv, 'utf-8');
    console.log(`[crawler] Wrote ${products.length} products to ${filePath} (CSV)`);
  } else {
    writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`[crawler] Wrote ${products.length} products to ${filePath} (JSON)`);
  }

  return filePath;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const cli = parseArgs();

  if (cli.help || cli.h) {
    console.log(`
Usage:
  node scripts/jewelry-crawler.mjs [options]

Options:
  --config <path>    Path to config JSON (default: ./scripts/config.json)
  --url <url>        Override target URL
  --output <path>    Override output file path
  --delay <ms>       Override delay between retries
  --help, -h         Show this help

Config file fields:
  url              (required) Target product listing page
  selectors        (required) CSS selectors for scraping fields
  crawler.delayMs  Delay between retries (default 1500)
  crawler.maxRetries  Retry count (default 3)
  crawler.timeoutMs  Request timeout (default 30000)
  output.format    "json" or "csv"
  output.file      Output file path

Example:
  node scripts/jewelry-crawler.mjs --url "https://example.com/jewelry" --output ./data/products.json
`);
    return;
  }

  let config;
  try {
    config = loadConfig(cli);
  } catch (err) {
    console.error(`[crawler] Failed to load config: ${err.message}`);
    process.exit(1);
  }

  if (!config.url) {
    console.error('[crawler] No target URL configured. Set "url" in config or pass --url.');
    process.exit(1);
  }

  if (!config.selectors?.productContainer || !config.selectors?.name || !config.selectors?.price) {
    console.error('[crawler] Missing required selectors: productContainer, name, price.');
    process.exit(1);
  }

  try {
    const products = await crawlPage(config);
    if (products.length === 0) {
      console.warn('[crawler] No products found. Check your selectors and URL.');
    }
    writeOutput(products, config);
  } catch (err) {
    console.error(`[crawler] Fatal: ${err.message}`);
    process.exit(1);
  }
}

main();
