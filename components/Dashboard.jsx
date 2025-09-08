"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

import PortfolioGrid from "@/components/PortfolioGrid";
import GroupedPortfolio from "@/components/GroupedPortfolio";

const fetcher = (url) => fetch(url).then((r) => r.json());
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Dashboard() {
  // isLoading is true only for one time when comp mounts and api gets called
  const { data, error, isValidating, isLoading } = useSWR(
    "/api/portfolio",
    fetcher,
    {
      refreshInterval: 15 * 1000,
    }
  );

  // initial load when there's no data yet
  const isInitialLoad =
    typeof isLoading !== "undefined" ? isLoading : !data && isValidating;

  const [grouped, setGrouped] = useState(false);

  const holdings = data?.holdings ?? [];
  const totalInvestment =
    data?.totalInvestment ??
    holdings.reduce((s, h) => s + (h.investment || 0), 0);

  const sectorsCount = useMemo(
    () => Object.keys(data?.sectors || {}).length,
    [data]
  );

  if (error)
    return (
      <div className="p-4 text-red-600">
        Error loading portfolio: {error.message || "network error"}
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Portfolio Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Live portfolio view • Auto-refreshes every 15s
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Total Investment</div>
          <div className="text-xl font-semibold">
            {INR.format(totalInvestment)}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={grouped}
            onChange={() => {
              if (isInitialLoad || isValidating)
                return toast.error("Portfolio is updating, please wait");
              setGrouped((g) => !g);
            }}
            className="h-4 w-4"
            // disabled={isInitialLoad || isValidating}
          />
          Group by sector
        </label>
      </header>

      {grouped ? (
        <GroupedPortfolio
          sectors={data?.sectors ?? {}}
          isFetching={isInitialLoad}
          isLoading={isValidating}
        />
      ) : (
        <PortfolioGrid
          sectorsCount={sectorsCount}
          data={holdings}
          isFetching={isInitialLoad}
          isLoading={isValidating}
        />
      )}
    </div>
  );
}
