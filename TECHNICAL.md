---

## 📄 TECHNICAL.md

# Technical Document — Stock Analysis Dashboard

## 🎯 Goal
Deliver a portfolio dashboard that auto-refreshes with live data, supports grouping by sector, highlights gains/losses, and provides CSV exports.

---

## 🔑 Key Challenges & Solutions

### 1. Unofficial finance APIs
- **Challenge:** It was mentioned to get P/E and latest earnings from google-finance, but due to non-maintenance, this library was not working even
  after following its' documentation on https://www.npmjs.com/package/google-finance, and scraping data from google finance page (Eg. https://www.google.com/finance/quote/ADANIPORTS:NSE, here "ADANIPORTS:NSE" is stock symbol)
  by using cheerio is not reliable and to get reliable P/E & latest earnings we should rely on paid APIs such as Finnhub https://finnhub.io/docs/api/introduction.
  So I used existing yahoo-finance2 for getting this values, that is, P/E as trailingPE & Latest earnings as epsTrailingTwelveMonths, returned by yahoo respectively.
  
- **Solution:** Used `yahoo-finance2` + server-side caching (`node-cache`) + bottleneck(`bootleneck`) to reduce API hits. Added UI disclaimer about unofficial sources at bottom of table.

---

### 2. Rate limiting & performance
- **Challenge:** Refreshing every 15s for multiple stocks could hit rate limits.  
- **Solution:** Cache results in memory (TTL ~15s) + bottleneck that allows ~4–5 requests per second to `yahoo-finance2`. API endpoint aggregates data once, frontend only makes a single request.

---

### 3. Hydration & SSR quirks in Next.js
- **Challenge:** Dynamic values (like fonts) caused mismatch between server and client renders.  
- **Solution:** Moved problematic logic into client components, kept layout SSR-safe.

---

### 4. Styling `react-data-grid`
- **Challenge:** Tailwind utility classes weren’t applying due to grid’s CSS specificity.  
- **Solution:** Used `cellClass` and `headerCellClass` to apply Tailwind styles at cell level. Added targeted overrides in `globals.css`.

---

### 5. Real-time UX
- **Challenge:** Show refresh activity without disrupting the user.  
- **Solution:**  
  - Used `isLoading` → show initial skeleton loader.  
  - Used `isValidating` → show subtle “Portfolio Updating…” with animated dots.  
  - Disabled export CSV & Group by Sector controls while fetching to avoid conflicts.

---

### 6. Sector Grouping
- **Challenge:** Display grouped portfolio data (totals per sector).  
- **Solution:**  
  - Backend sends grouped structure with totals.  
  - Frontend renders collapsible sections per-sector.

---

## 📊 Data Shape

**sampleHoldings.json**

  [{
    "tickerOrCode": "GAIL",
    "purchasePrice": 170,
    "qty": 200,
    "sector": "Energy"
  }, ...]

**Holding Schema**

  {
    tickerOrCode: { type: String, required: true, unique: true },
    purchasePrice: { type: Number, required: true, default: 0 },
    qty: { type: Number, required: true, default: 0 },
    sector: { type: String, required: true, default: "Other" },
  }
