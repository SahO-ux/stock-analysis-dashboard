import React, { useMemo, useState } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";

import EmptyRowsRenderer from "./utils/EmptyRowsRenderer";
import { gridColumns } from "./utils/constants";

export default function GroupedPortfolio({
  sectors = {},
  isFetching = false,
  isLoading = false,
}) {
  const columns = useMemo(() => gridColumns(), []);
  const [open, setOpen] = useState(() => ({}));

  // build sector list from backend object (preserve order of keys)
  const sectorList = useMemo(() => {
    return Object.keys(sectors || {}).map((k) => ({
      name: k,
      metadata: sectors[k] || {},
      holdings: Array.isArray(sectors[k]?.holdings) ? sectors[k].holdings : [],
    }));
  }, [sectors]);

  const toggle = (name) => setOpen((s) => ({ ...s, [name]: !s[name] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">
          Sectors: {sectorList.length}
        </div>
        <div className="text-sm text-gray-500">
          {isLoading ? "Portfolio Updating…" : ""}
        </div>
      </div>

      {/* sectors */}
      {sectorList.map((sec) => {
        const meta = sec.metadata || {};
        // prefer precomputed totals from backend, otherwise compute from holdings
        const totalInvestment =
          meta.totalInvestment ??
          sec.holdings.reduce((s, r) => s + Number(r.investment || 0), 0);
        const totalPresentValue =
          meta.totalPresentValue ??
          sec.holdings.reduce((s, r) => s + Number(r.presentValue || 0), 0);
        const totalGainLoss =
          meta.totalGainLoss ??
          sec.holdings.reduce((s, r) => s + Number(r.gainLoss || 0), 0);
        const isOpen = !!open[sec.name];

        return (
          <section
            key={sec.name}
            className="border rounded bg-white shadow-sm overflow-hidden"
          >
            <header
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => !isFetching && toggle(sec.name)}
              role="button"
              aria-expanded={isOpen}
            >
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {sec.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Investment:{" "}
                  <span className="font-medium">{totalInvestment}</span>
                  <span className="mx-2">•</span>
                  Present value:{" "}
                  <span className="font-medium">{totalPresentValue}</span>
                  <span className="mx-2">•</span>
                  Gain/Loss:{" "}
                  <span
                    className={
                      totalGainLoss >= 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {totalGainLoss}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  {sec.holdings.length} holdings
                </div>
                <div className="text-sm text-gray-500">
                  {isOpen ? "▾" : "▸"}
                </div>
              </div>
            </header>

            {/* collapsible holdings table */}
            {isOpen && (
              <div className="p-3 border-t">
                <div style={{ height: 320, overflow: "auto" }}>
                  <DataGrid
                    className="rdg-light"
                    columns={columns}
                    rows={(sec.holdings || []).map((r, i) => ({
                      id: r._id ?? `${i}-${r.name}`,
                      ...r,
                    }))}
                    onRowsChange={() => {}}
                    defaultColumnOptions={{ resizable: true }}
                    components={{ noRowsFallback: <EmptyRowsRenderer /> }}
                    rowKeyGetter={(row) => row.id}
                    rowHeight={42}
                    headerRowHeight={44}
                  />
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
