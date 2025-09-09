import Holding from "@/models/Holding";
import { tryQuoteVariants } from "./quotes";

export const fetchHoldingsFromDB = async () => {
  const holdings = await Holding.find().lean();
  return Array.isArray(holdings) ? holdings : [];
};

export const computeTotalInvestment = (holdings) => {
  return holdings.reduce((sum, holding) => {
    const investment = holding.purchasePrice * holding.qty;
    return sum + investment;
  }, 0);
};

export const getQuoteWithCache = async (cacheInstance, keyBase) => {
  const cacheKey = `quote:${keyBase}`;
  const cached = cacheInstance.get(cacheKey);

  if (cached) return cached;

  const val = await tryQuoteVariants(keyBase);
  cacheInstance.set(cacheKey, val);
  return val;
};

const enrichHolding = async (h, getQuote, totalInvestment = 0) => {
  const tickerOrName = h.tickerOrCode || h.name;
  const val = await getQuote(tickerOrName);

  // Updating tickerOrCode if require to improve performance
  if (val?.tickerOrCode && h?._id && tickerOrName !== val.tickerOrCode)
    await Holding.findOneAndUpdate(
      { _id: h._id },
      { $set: { tickerOrCode: val.tickerOrCode } }
    );

  const cmp = val?.price ?? h.cmp ?? null;
  const qty = Number.isFinite(Number(h.qty)) ? Number(h.qty) : null;

  const investment = Number(h.purchasePrice) * Number(h.qty);
  const portfolioPercent =
    totalInvestment > 0
      ? Number((((investment || 0) / totalInvestment) * 100).toFixed(2))
      : 0;

  const presentValue = cmp != null && qty != null ? cmp * qty : null;
  const gainLoss =
    presentValue != null && investment != null
      ? presentValue - investment
      : null;
  const gainLossPct = investment ? gainLoss / investment : null;

  return {
    ...h,
    name: val.name || h.name,
    exchangeName: val.exchangeName,
    portfolioPercent,
    investment: Number(investment?.toFixed(2)),
    cmp: Number(cmp?.toFixed(2)),
    presentValue: Number(presentValue?.toFixed(2)),
    gainLoss: Number(gainLoss?.toFixed(2)),
    gainLossPct: Number((gainLossPct * 100).toFixed(2)),
    peRatio: Number(val?.pe?.toFixed(2)) ?? null,
    latestEarnings: Number(val?.earnings?.toFixed(2)) ?? null,
    tickerOrCode: val?.tickerOrCode ?? h?.tickerOrCode,
    bookValue: val.bookValue,
    marketCap: val.marketCap,
  };
};

export const enrichHoldings = async (
  holdings,
  cacheInstance,
  totalInvestment
) => {
  const getQuote = (key) => getQuoteWithCache(cacheInstance, key);
  const promises = holdings.map((holding) =>
    enrichHolding(holding, getQuote, totalInvestment)
  );
  return Promise.all(promises);
};

export const groupHoldingsBySector = (enriched) => {
  const sectors = {};
  for (const e of enriched) {
    const s = e.sector || "Unknown";
    if (!sectors[s]) {
      sectors[s] = {
        holdings: [],
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
      };
    }
    sectors[s].holdings.push(e);
    sectors[s].totalInvestment += Number.isFinite(Number(e.investment))
      ? Number(e.investment.toFixed(2))
      : 0;
    sectors[s].totalPresentValue += Number.isFinite(Number(e.presentValue))
      ? Number(Math.round(e.presentValue))
      : 0;
    sectors[s].totalGainLoss += Number.isFinite(Number(e.gainLoss))
      ? Number(e.gainLoss.toFixed(2))
      : 0;
  }
  return sectors;
};
