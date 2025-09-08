const INR_FMT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const NUM = (num) =>
  num == null ? "-" : new Intl.NumberFormat("en-IN").format(Math.round(num));

export const gridColumns = () => {
  const columns = [
    {
      key: "name",
      name: "Particulars",
      cellClass: "text-left font-medium text-gray-800",
      headerCellClass: "text-center",
      formatter: ({ row }) => <div className="cell-content">{row.name}</div>,
      resizable: true,
      frozen: true,
      width: 150,
    },
    {
      key: "tickerOrCode",
      name: "Ticker",
      cellClass: "text-center text-gray-600",
      headerCellClass: "text-center",
      resizable: true,
      width: 110,
    },
    {
      key: "purchasePrice",
      name: "Purchase Price",
      width: 130,
      cellClass: "text-center text-gray-700",
      resizable: true,
      headerCellClass: "text-center",
      formatter: (p) => (
        <div>
          {p.row.purchasePrice ? INR_FMT.format(p.row.purchasePrice) : "-"}
        </div>
      ),
    },
    {
      key: "qty",
      name: "Quantity",
      resizable: true,
      cellClass: "text-center text-gray-700",
      headerCellClass: "text-center",
      width: 70,
      formatter: (p) => <div>{NUM(p.row.qty)}</div>,
    },
    {
      key: "investment",
      name: "Investment",
      resizable: true,
      width: 130,
      cellClass: "text-center text-gray-800 font-medium",
      headerCellClass: "text-center",
      formatter: (p) => <div>{INR_FMT.format(p.row.investment || 0)}</div>,
    },
    {
      key: "portfolioPercent",
      name: "Portfolio (%)",
      resizable: true,
      width: 150,
      cellClass: "text-center text-indigo-500 font-medium",
      headerCellClass: "text-center",
      formatter: (p) => <div>{p.row?.portfolioPercent || 0}</div>,
    },
    {
      key: "exchangeName",
      name: "Exchange Name",
      cellClass: "text-center text-gray-600",
      resizable: true,
      headerCellClass: "text-center",
      formatter: ({ row }) => <div>{row?.exchangeName || "-"}</div>,
      resizable: true,
      width: 140,
    },
    {
      key: "cmp",
      name: "CMP",
      width: 120,
      resizable: true,
      cellClass: "text-center text-gray-700",
      headerCellClass: "text-center",
      formatter: (p) => (
        <div>{p.row.cmp ? INR_FMT.format(p.row.cmp) : "-"}</div>
      ),
    },
    {
      key: "presentValue",
      name: "Present Value",
      width: 150,
      resizable: true,
      cellClass: "text-center text-blue-600 font-medium",
      headerCellClass: "text-center",
      formatter: (p) => <div>{p.row?.presentValue?.toFixed(2) || 0}</div>,
    },

    {
      key: "gainLoss",
      name: "Gain/Loss",
      width: 140,
      headerCellClass: "text-center",
      resizable: true,
      cellClass: (row) =>
        row?.gainLoss > 0
          ? "text-center text-green-600 font-semibold"
          : "text-center text-red-600 font-semibold",
      formatter: (p) => {
        const v = Number(p.row?.gainLoss ?? 0);
        const text = Number.isFinite(v) ? INR_FMT.format(v) : 0;
        return <div>{text}</div>;
      },
    },

    {
      key: "peRatio",
      name: "P/E Ratio",
      width: 90,
      resizable: true,
      cellClass: "text-center text-gray-700",
      headerCellClass: "text-center",
      formatter: (p) => <div>{p.row.peRatio?.toFixed(2) || "-"}</div>,
    },
    {
      key: "latestEarnings",
      name: "Latest Earnings",
      width: 140,
      resizable: true,
      cellClass: "text-center text-gray-600",
      headerCellClass: "text-center",
      formatter: (p) => <div>{p.row.latestEarnings ?? "-"}</div>,
    },
    {
      key: "sector",
      name: "Sector",
      frozen: true,
      cellClass: "text-center text-gray-600",
      headerCellClass: "text-center",
      width: 140,
    },
  ];

  return columns;
};

// CSV export human headers and corresponding object keys (order matters)
export const csvHeaders = gridColumns().map((val) => val.name);

// keys map to the object properties in the same order as csvHeaders
export const csvKeys = gridColumns().map((val) => val.key);
