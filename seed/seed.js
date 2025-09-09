const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "<your-mongodb-uri>";
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in environment or edit seed/seed.js");
  process.exit(1);
}

const HoldingSchema = new mongoose.Schema(
  {
    tickerOrCode: { type: String, required: true, unique: true },
    purchasePrice: { type: Number, required: true, default: 0 },
    qty: { type: Number, required: true, default: 0 },
    sector: { type: String, required: true, default: "Other" },
  },
  { timestamps: true }
);
const Holding =
  mongoose.models?.Holding || mongoose.model("Holding", HoldingSchema);

// Load SAMPLE JSON
const holdingsFile = path.join(__dirname, "sampleHoldings.json");
const seedHoldings = JSON.parse(fs.readFileSync(holdingsFile, "utf-8"));

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB — seeding holdings...");
  await Holding.deleteMany({});
  await Holding.insertMany(seedHoldings);
  console.log("Seed complete. Inserted:", seedHoldings.length);
  process.exit(0);
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
