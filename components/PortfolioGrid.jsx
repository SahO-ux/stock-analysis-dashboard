"use client";
import React, { useMemo } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import toast from "react-hot-toast";

import { csvHeaders, csvKeys, gridColumns } from "./utils/constants";
import EmptyRowsRenderer from "./utils/EmptyRowsRenderer";
import LoaderBar from "./utils/LoaderBar";

export default function PortfolioGrid({
  data = [],
  isFetching = false,
  isLoading = false,
  sectorsCount,
}) {
  const columns = useMemo(() => gridColumns(), []);

  // rows: show all data at once
  const rows = useMemo(
    () =>
      (Array.isArray(data) ? data : []).map((r, i) => ({
        id: r._id ?? `${i}-${r.name}-${r.tickerOrCode}`,
        ...r,
      })),
    [data]
  );

  // CSV export: uses csvKeys (the actual object keys) and csvHeaders (human headers)
  const exportCSV = () => {
    if (isFetching || !rows.length) return; // guard during initial fetch

    const csv = [
      csvHeaders.join(","),
      ...rows.map((r) =>
        csvKeys
          .map((k) => {
            const v = r[k];
            if (v == null) return "";
            // numbers preserved, strings quoted
            return typeof v === "number"
              ? String(v)
              : `"${String(v).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded successfully");
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden relative">
      <div className="p-3 border-b flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Total Stocks:</div>
          <div className="font-medium">{rows.length}</div>
          <div className="text-sm text-gray-600">Total Sectors:</div>
          <div className="font-medium">{sectorsCount}</div>

          <button
            onClick={() => exportCSV()}
            className={`${
              isFetching || isLoading
                ? "disabled:cursor-not-allowed opacity-50"
                : ""
            } ml-3 px-3 py-1 rounded bg-blue-600 text-white text-sm`}
            disabled={isFetching || isLoading}
            aria-disabled={isFetching || isLoading}
          >
            Export CSV
          </button>

          <div className="ml-3 text-sm text-gray-600">
            {isLoading ? "Portfolio Updating…" : ""}
          </div>
        </div>
      </div>

      <div style={{ overflow: "auto" }}>
        <DataGrid
          className="rdg-light fill-grid"
          style={{ height: "calc(100vh - 313px)" }}
          columns={columns}
          rows={rows}
          onRowsChange={() => {}}
          defaultColumnOptions={{ resizable: true }}
          components={{
            noRowsFallback: <EmptyRowsRenderer />,
          }}
          rowKeyGetter={(row) => row.id}
          rowHeight={42}
          headerRowHeight={44}
        />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50 text-sm text-gray-600">
        <div />
        <div>
          <footer className="mt-6 text-xs text-gray-400">
            Data is fetched from unofficial finance endpoints. Values may vary.
          </footer>
        </div>
      </div>

      {/* initial fetch overlay */}
      {isFetching && (
        <div className="grid-fetch-overlay" aria-live="polite">
          <div className="grid-fetch-inner">
            <LoaderBar rows={8} />
            <div className="mt-2 text-sm text-gray-600">Loading portfolio…</div>
          </div>
        </div>
      )}
    </div>
  );
}
