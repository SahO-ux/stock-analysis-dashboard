import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tickerOrCode: { type: String },
    exchange: { type: String },
    purchasePrice: { type: Number },
    qty: { type: Number },
    investment: { type: Number },
    portfolioPct: { type: Number },
    cmp: { type: Number },
    presentValue: { type: Number },
    gainLoss: { type: Number },
    gainLossPct: { type: Number },
    marketCap: { type: Number },
    peRatio: { type: Number },
    latestEarnings: { type: Number },
    sector: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Holding ||
  mongoose.model("Holding", HoldingSchema);
