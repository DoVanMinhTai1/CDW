#!/usr/bin/env node
/**
 * pnj-crawler.mjs  —  Standalone product crawler for PNJ (Phu Nhuan Jewelry)
 *
 * Fetches product data from PNJ's public product API (edge-cf-api.pnj.io)
 * with optional SSR-based category discovery.  No auth required.
 *
 * Usage:
 *   node scripts/pnj-crawler.mjs
 *   node scripts/pnj-crawler.mjs --categories nhan,day-chuyen
 *   node scripts/pnj-crawler.mjs --category-ids 639,510
 *   node scripts/pnj-crawler.mjs --categories all
 *   node scripts/pnj-crawler.mjs --output ./data/pnj-products.json
 *   node scripts/pnj-crawler.mjs --help
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ────────────────────────────── Constants ───────────────────────────────────

const API_BASE = 'https://edge-cf-api.pnj.io/ecom-frontend/v1/get-product-list';
const CONFIG_BASE = 'https://edge-api.pnj.io/ecom-caching/v1/get-config-list';
const SITE_BASE = 'https://www.pnj.com.vn';

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (compatible; PNJ-Crawler/1.0)';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ────────────────────────────── Known category slugs → likely IDs ────────────
// Used as fallback when SSR discovery fails
const KNOWN_CATEGORIES = {
  nhan: { id: 639, name: 'Nhẫn' },
  'day-chuyen': { id: 550, name: 'Dây chuyền' },
  'mat-day-chuyen': { id: 579, name: 'Mặt dây chuyền' },
  'bong-tai': { id: 539, name: 'Bông tai' },
  lac: { id: 514, name: 'Lắc' },
  'lac-tay': { id: 514, name: 'Lắc tay' },
  'vong-tay': { id: 678, name: 'Vòng tay' },
  charm: { id: 918, name: 'Charm' },
  'day-co': { id: 1250, name: 'Dây cổ' },
  kieng: { id: 1450, name: 'Kiềng' },
  'nhan-cuoi': { id: 3159, name: 'Nhẫn cưới' },
  'nhan-cau-hon': { id: 3159, name: 'Nhẫn cầu hôn' },
  'trang-suc-vang': { id: 510, name: 'Trang sức vàng' },
  'trang-suc-bac': { id: 748, name: 'Trang sức bạc' },
  'dong-ho': { id: 492, name: 'Đồng hồ' },
  'bo-suu-tap': { id: 3160, name: 'Bộ sưu tập' },
};

// ────────────────────────────── Helpers ──────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
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
  let cfg = {
    categories: ['nhan'],
    output: { format: 'json', file: resolve(__dirname, 'output', 'pnj-products.json') },
    crawler: { delayMs: 200, maxRetries: 3, timeoutMs: 30000, userAgent: DEFAULT_UA, maxPagesPerCategory: 10 },
    discoverCategories: true,
  };
  const defaultPath = resolve(__dirname, 'config.pnj.json');
  if (existsSync(defaultPath)) {
    const overrides = JSON.parse(readFileSync(defaultPath, 'utf-8'));
    cfg = deepMerge(cfg, overrides);
  }
  if (cli['config']) {
    const p = resolve(process.cwd(), cli['config']);
    const overrides = JSON.parse(readFileSync(p, 'utf-8'));
    cfg = deepMerge(cfg, overrides);
  }
  if (cli['categories']) cfg.categories = cli['categories'].split(',').map(s => s.trim());
  if (cli['category-ids']) cfg.categoryIds = cli['category-ids'].split(',').map(s => parseInt(s.trim(), 10));
  if (cli['output']) cfg.output.file = cli['output'];
  if (cli['delay']) cfg.crawler.delayMs = parseInt(cli['delay'], 10);
  if (cli['max-pages']) cfg.crawler.maxPagesPerCategory = parseInt(cli['max-pages'], 10);
  if (cli['discover'] === 'false') cfg.discoverCategories = false;
  return cfg;
}

function deepMerge(a, b) {
  const r = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && r[k] && typeof r[k] === 'object')
      r[k] = deepMerge(r[k], v);
    else r[k] = v;
  }
  return r;
}

async function fetchJson(url, headers = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function formatPrice(v) {
  if (v == null) return null;
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^\d.-]/g, '')) : v;
  return isNaN(n) ? null : n;
}

// ────────────────────────── Category ID Discovery ───────────────────────────

async function discoverCategoryIds(cfg) {
  const ids = {};

  // 1. Direct CLI override
  if (cfg.categoryIds) {
    if (cfg.categories?.includes('all')) {
      console.log('[pnj] --category-ids given with "all" — using provided IDs directly');
    }
    return cfg.categoryIds;
  }

  // 2. Fetch SSR homepage to extract __NEXT_DATA__ with category mappings
  try {
    console.log('[pnj] Discovering category IDs from SSR...');
    const html = await (await fetch(`${SITE_BASE}/nhan`, {
      headers: { 'User-Agent': cfg.crawler.userAgent, Accept: 'text/html' },
      signal: AbortSignal.timeout(cfg.crawler.timeoutMs),
    })).text();

    // Parse __NEXT_DATA__
    const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
    if (ndMatch) {
      const nd = JSON.parse(ndMatch[1]);
      const pp = nd.props?.pageProps || {};
      const filterData = pp.initialFilterData || [];
      const catData = pp.categoryData?.data || [];

      // From category data (current page)
      for (const item of catData) {
        if (item.display_type === 'category_data' && item.data?.category_id) {
          ids[item.data.category_id] = item.data.category || `Category ${item.data.category_id}`;
        }
      }

      // From filter data (chu?ng lo?i filter has subcategory IDs)
      for (const f of filterData) {
        if (f.key === 'f_3037' && f.labels) {
          for (const lbl of f.labels) {
            if (lbl.label_id && lbl.label_text) {
              ids[lbl.label_id] = lbl.label_text;
            }
          }
        }
      }
    }

    // 3. Try config endpoint for menu structure with category IDs (optional, may be slow)
    try {
      const configData = await fetchJson(`${CONFIG_BASE}?slug=nhan`, {
        'User-Agent': cfg.crawler.userAgent,
        Origin: SITE_BASE,
      }, 10000);
      const configs = configData.data || [];
      const menuCfg = configs.find(c => c.config_key === 'main_menu_json_structure');
      if (menuCfg) {
        const menu = JSON.parse(menuCfg.config_value);
        const extractMenuIds = (items) => {
          if (!items) return;
          for (const item of items) {
            if (item.path && item.label) {
              // Extract potential category path segment for later mapping
              const slug = item.path.replace(/https?:\/\/[^/]+\/site\/danh-muc\//, '').replace(/\/$/, '').replace(SITE_BASE + '/', '').replace(/\/$/, '');
              ids[slug] = item.label;
            }
            if (item.subMenu) extractMenuIds(item.subMenu);
            if (item.columnItems) extractMenuIds(item.columnItems);
            if (item.columns) extractMenuIds(item.columns);
          }
        };
        extractMenuIds(menu.menu);
      }
    } catch { /* config endpoint is optional */ }
  } catch (err) {
    console.warn(`[pnj] SSR discovery failed: ${err.message}`);
  }

  // 4. Map requested category slugs to IDs
  const slugs = cfg.categories || ['nhan'];
  if (slugs.includes('all')) return Object.keys(KNOWN_CATEGORIES).map(s => KNOWN_CATEGORIES[s].id);

  const result = [];
  for (const slug of slugs) {
    // Check known map
    if (KNOWN_CATEGORIES[slug]) {
      result.push(KNOWN_CATEGORIES[slug].id);
      continue;
    }
    // Check discovered IDs (slug might be a number or name)
    const numSlug = parseInt(slug, 10);
    if (!isNaN(numSlug)) {
      result.push(numSlug);
    } else {
      // Try to find by name from discovered IDs
      const match = Object.entries(ids).find(([, v]) =>
        v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(slug.toLowerCase())
      );
      if (match) result.push(parseInt(match[0], 10));
      else console.warn(`[pnj] Unknown category slug "${slug}" — trying as-is`);
    }
  }
  return result.length > 0 ? result : [639]; // fallback to Nhan
}

// ─────────────────────────── Product Fetching ───────────────────────────────

async function fetchProductsByCategory(categoryId, cfg) {
  const { userAgent, delayMs, maxRetries, timeoutMs, maxPagesPerCategory } = cfg.crawler;
  const allProducts = [];
  const seen = new Set();
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= maxPagesPerCategory) {
    const url = `${API_BASE}?limit=40&page=${page}&category_ids=${categoryId}`;
    console.log(`[pnj]   Fetching category=${categoryId} page=${page} ...`);

    let data;
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        data = await fetchJson(url, {
          'User-Agent': userAgent,
          Origin: SITE_BASE,
          Referer: `${SITE_BASE}/`,
        }, timeoutMs);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[pnj]   Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
        if (attempt < maxRetries) await sleep(delayMs * attempt);
      }
    }

    if (!data) {
      console.error(`[pnj]   Failed after ${maxRetries} retries: ${lastError?.message}`);
      break;
    }

    const products = data.data || [];
    const totalRecords = data.totalRecords || 0;
    console.log(`[pnj]   Got ${products.length} products (${totalRecords} total)`);
    if (products.length === 0) break;

    // Deduplicate by product id
    for (const p of products) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        allProducts.push({
          id: p.id,
          sku: p.sku_13 || null,
          name: p.name || null,
          price: formatPrice(p.price),
          netPrice: formatPrice(p.net_price),
          priceDisplay: p.price != null ? `${(p.price / 1000).toFixed(0)}k` : null,
          image: p.image || null,
          productUrl: p.url || null,
          brand: p.brand || null,
          gender: p.gender || null,
          sizes: p.sizes || [],
          rating: p.rate_rounded || null,
          pnjFast: p.pnj_fast === 1,
          categoryIds: categoryId,
          scrapedAt: new Date().toISOString(),
        });
      }
    }

    hasMore = allProducts.length < totalRecords && products.length > 0;
    page++;

    if (hasMore && page <= maxPagesPerCategory) {
      await sleep(delayMs);
    }
  }

  return allProducts;
}

async function fetchAllCategories(categoryIds, cfg) {
  const allProducts = [];
  for (const catId of categoryIds) {
    console.log(`\n[pnj] Category ID: ${catId}`);
    const products = await fetchProductsByCategory(catId, cfg);
    console.log(`[pnj]   Total: ${products.length} unique products`);
    allProducts.push(...products);
    await sleep(cfg.crawler.delayMs);
  }
  return allProducts;
}

// ─────────────────────────── Output ────────────────────────────────────────

function writeOutput(products, cfg) {
  const out = cfg.output || {};
  const format = out.format || 'json';
  let filePath = out.file || resolve(__dirname, 'output', 'pnj-products.json');
  if (!filePath.startsWith('/') && !/^[A-Z]:\\/i.test(filePath)) {
    filePath = resolve(process.cwd(), filePath);
  }

  mkdirSync(dirname(filePath), { recursive: true });

  if (format === 'csv') {
    const headers = ['id', 'sku', 'name', 'price', 'netPrice', 'image', 'productUrl', 'brand', 'gender', 'sizes', 'rating', 'pnjFast', 'categoryIds', 'scrapedAt'];
    const esc = v => (v != null ? `"${String(v).replace(/"/g, '""')}"` : '');
    const rows = products.map(p => headers.map(h => esc(Array.isArray(p[h]) ? p[h].join(';') : p[h])).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    writeFileSync(filePath, csv, 'utf-8');
    console.log(`[pnj] Wrote ${products.length} products to ${filePath} (CSV)`);
  } else {
    writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`[pnj] Wrote ${products.length} products to ${filePath} (JSON)`);
  }
  return filePath;
}

// ───────────────────────────── Main ─────────────────────────────────────────

async function main() {
  const cli = parseArgs();

  if (cli.help || cli.h) {
    console.log(`
PNJ (Phu Nhuan Jewelry) Product Crawler

Usage:
  node scripts/pnj-crawler.mjs [options]

Options:
  --categories <slugs>   Comma-separated category slugs (default: "nhan")
                          Available: nhan, day-chuyen, bong-tai, lac, vong-tay,
                          charm, day-co, kieng, nhan-cau-hon, trang-suc-vang,
                          trang-suc-bac, dong-ho, bo-suu-tap, all
  --category-ids <ids>   Comma-separated numeric category IDs (overrides --categories)
  --output <path>        Output file path (default: scripts/output/pnj-products.json)
  --format <json|csv>    Output format (default: json)
  --delay <ms>           Delay between API calls (default: 200)
  --max-pages <n>        Max pages per category (default: 10, each page = 40 products)
  --config <path>        Config file path (default: scripts/config.pnj.json)
  --help, -h             Show this help

Examples:
  node scripts/pnj-crawler.mjs
  node scripts/pnj-crawler.mjs --categories nhan,day-chuyen,bong-tai
  node scripts/pnj-crawler.mjs --categories all
  node scripts/pnj-crawler.mjs --category-ids 639,550 --output ./data/pnj.json
`);
    return;
  }

  let cfg;
  try {
    cfg = loadConfig(cli);
  } catch (err) {
    console.error(`[pnj] Config load failed: ${err.message}`);
    process.exit(1);
  }

  // Discover category IDs
  const categoryIds = await discoverCategoryIds(cfg);
  console.log(`[pnj] Using category IDs: [${categoryIds.join(', ')}]`);

  // Crawl
  console.log(`[pnj] Starting crawl (${categoryIds.length} categories)...`);
  const allProducts = await fetchAllCategories(categoryIds, cfg);
  console.log(`\n[pnj] Crawl complete! Total unique products: ${allProducts.length}`);

  if (allProducts.length > 0) {
    writeOutput(allProducts, cfg);
    console.log('[pnj] Done.');
  } else {
    console.warn('[pnj] No products found.');
  }
}

main().catch(err => {
  console.error(`[pnj] Fatal: ${err.message}`);
  process.exit(1);
});
