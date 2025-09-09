import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema(
  {
    tickerOrCode: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    qty: { type: Number, required: true },
    sector: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Holding ||
  mongoose.model("Holding", HoldingSchema);
