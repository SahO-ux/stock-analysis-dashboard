import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import {
  fetchHoldingsFromDB,
  computeTotalInvestment,
  enrichHoldings,
  groupHoldingsBySector,
} from "@/lib/helpers";
import cache from "@/lib/cache";

export async function GET() {
  try {
    // connect DB
    await connectToDB();

    // fetch from DB
    const holdings = await fetchHoldingsFromDB();

    // empty handling
    if (!holdings || !holdings?.length) {
      return NextResponse.json({
        totalInvestment: 0,
        holdings: [],
        sectors: {},
      });
    }

    // 3) compute totals purchase price * qty
    const totalInvestment = computeTotalInvestment(holdings);

    // enrich holdings (price, pe, earnings, etc.) by using cache
    const enriched = await enrichHoldings(holdings, cache, totalInvestment);

    // sector grouping & aggregates
    const sectors = groupHoldingsBySector(enriched);

    return NextResponse.json({ totalInvestment, holdings: enriched, sectors });
  } catch (err) {
    // console.error("portfolio API error:", err);
    return new NextResponse(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
