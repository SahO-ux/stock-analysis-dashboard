import yahooFinance from "yahoo-finance2";
import googleFinance from "google-finance";
import limiter from "@/lib/limiter";

export const tryQuoteVariants = async (rawTicker) => {
  const t = String(rawTicker || "").trim();
  if (!t) return { price: null, pe: null, earnings: null, tickerOrCode: null };
  // `${t}.NS`
  const tries = [t, `${t}.NS`, `${t}.BO`]; // Indian tickers often need suffix

  for (const candidate of tries) {
    try {
      // Get stock details from Yahoo
      const yahooRes = await limiter.schedule(() =>
        yahooFinance.quote(candidate)
      );

      // Current Market Price
      const price =
        yahooRes?.regularMarketPrice ??
        yahooRes?.price?.regularMarketPrice ??
        null;

      // googleFinance.companyNews(
      //   {
      //     symbol: "NASDAQ:AAPL",
      //   },
      //   function (err, news) {
      //     //...
      //   }
      // );

      // For Getting Latest Earnings and P/E ratio,
      // the following library did not worked nor the google-finance2
      // and finnub platform was asking for premium subscription in order to get these info
      // We can still scrape data from google finance's quotes page
      // Eg.https://www.google.com/finance/quote/ADANIPORTS:NSE
      // by using cheerio, but its highly unreliable
      // So I reverted back to whats yahoo is providing and using the most relevant
      // fields for P/E ratio and Latest Earnings

      const pe =
        yahooRes?.trailingPE ??
        yahooRes?.defaultKeyStatistics?.trailingPE ??
        yahooRes?.summaryDetail?.trailingPE ??
        null;

      // EPS (TTM) — a commonly used “latest earnings per share”
      // EPS / earnings extraction (best-effort)
      const earnings =
        yahooRes?.epsTrailingTwelveMonths ??
        yahooRes?.epsCurrentYear ??
        yahooRes?.epsForward ??
        null;

      if (
        price !== null ||
        pe !== null ||
        earnings !== null ||
        stockName !== ""
      ) {
        // If got all then exit
        return {
          price,
          pe,
          earnings,
          name: yahooRes?.longName || "",
          exchangeName: yahooRes?.fullExchangeName || "NSE",
          tickerOrCode: candidate,
        };
      }
    } catch (err) {
      // continue with next ticker variant
      continue;
    }
  }

  return { price: null, pe: null, earnings: null, tickerOrCode: null };
};
