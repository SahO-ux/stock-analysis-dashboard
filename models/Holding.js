import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema(
  {
    tickerOrCode: { type: String, required: true, unique: true },
    purchasePrice: { type: Number, required: true, default: 0 },
    qty: { type: Number, required: true, default: 0 },
    sector: { type: String, required: true, default: "Other" },
  },
  { timestamps: true }
);

export default mongoose.models.Holding ||
  mongoose.model("Holding", HoldingSchema);
