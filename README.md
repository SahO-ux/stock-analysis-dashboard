# Stock Analysis Dashboard (Next.js)

A responsive stock portfolio dashboard that displays live holdings and market data.  
Built with **Next.js**, **React**, **TailwindCSS**, **Yahoo Finance** and **react-data-grid**.

---

## ✨ Features

- Live portfolio view with auto-refresh (default 15s)
- Gain/Loss highlighting (green/red)
- Sector grouping with summaries (Investment, Present Value, Gain/Loss) by toggling "Group by sector" checkbox
- CSV export
- Initial load skeleton + background refresh indicator
- Server-side caching & rate limiting to reduce API calls

---

## 📦 Prerequisites

- Node.js **>= 18**
- npm (or yarn)
- MongoDB (for seeding initial data, refer seed/seed.js JSON or models/Holding.js file for schema overview). Eg:-
  {
    "tickerOrCode": "GAIL",
    "purchasePrice": 170,
    "qty": 200,
    "sector": "Energy"
  }

---

## 🚀 Setup & Usage

### 1. Clone repo:
git clone <https://github.com/SahO-ux/stock-analysis-dashboard.git>
cd <repo-folder>

### 2. Install dependencies:
npm install

### 3. Configure environment variables:
MONGODB_URI=<your_mongoDB_URL>

### 4. Seed sample data:
node seed/seed.js

### 5. Run dev server:
npm run dev

🧪 Verification
- Run npm run dev and open dashboard
- On first load → skeleton loader shown
- Auto-refresh every 15s
- Toggle Group by sector
- Use Export CSV buttons

⚠️ Notes
- Data is fetched from unofficial finance library (yahoo-finance2). Values may vary.
- For production use, I recommend a reliable paid market data API like Finnhub https://finnhub.io/docs/api.
- CSV export is client-side; very large datasets may impact memory.

