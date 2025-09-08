const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "<your-mongodb-uri>";
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in environment or edit seed/seed.js");
  process.exit(1);
}

const HoldingSchema = new mongoose.Schema({
  name: String,
  tickerOrCode: mongoose.Schema.Types.Mixed,
  exchange: String,
  purchasePrice: Number,
  qty: Number,
  investment: Number,
  portfolioPct: Number,
  cmp: Number,
  presentValue: Number,
  gainLoss: Number,
  gainLossPct: Number,
  marketCap: Number,
  peRatio: Number,
  latestEarnings: Number,
  sector: String,
});
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
