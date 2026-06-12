# Jewelry Data Crawler

Extracts product data (name, price, image, link, category, description) from jewelry e-commerce websites and saves it as JSON or CSV.

## Quick Start

```bash
# Run with default config (./scripts/config.json)
npm run crawl

# Override URL and output on the fly
npm run crawl -- --url "https://example-store.com/rings" --output ./data/rings.json

# Custom config file
npm run crawl -- --config ./scripts/my-config.json
```

## Configuration

Edit `scripts/config.json`:
- **url** — Target product listing page
- **selectors** — CSS selectors mapping to product fields (at minimum: `productContainer`, `name`, `price`)
- **crawler.userAgent** — Polite identification string
- **crawler.delayMs** — Delay between retries (polite crawling)
- **crawler.maxRetries** — Retry attempts on failure

### Selectors

Each selector is a CSS selector string. The `productContainer` selector matches each product card; all other selectors are resolved **relative to** each container.

| Field | CSS Selector (examples) | Required |
|-------|------------------------|----------|
| `productContainer` | `.product-card`, `[data-product-card]`, `li.product` | Yes |
| `name` | `.product-title`, `h2`, `[data-product-name]` | Yes |
| `price` | `.price`, `[data-price]`, `.product-price` | Yes |
| `image` | `img`, `[data-image]`, `.product-image img` | No |
| `link` | `a[href]`, `[data-url]` | No |
| `category` | `.category`, `.badge`, `[data-category]` | No |
| `description` | `.desc`, `[data-description]`, `.excerpt` | No |

## Output

Default: `scripts/output/products.json`. Supports JSON and CSV via `output.format` in config.

## Example

```bash
node scripts/jewelry-crawler.mjs \
  --url "https://www.cartier.com/en-us/collections/jewelry" \
  --output ./data/cartier.json \
  --delay 2000
```

## Notes

- Uses Native `fetch()` (Node 18+) and `cheerio` for lightweight HTML parsing
- Respects `robots.txt` via polite defaults; add manual delays
- All scraped records include `scrapedAt` and `sourceUrl` metadata
- No existing app code was modified — this script lives independently in `scripts/`
