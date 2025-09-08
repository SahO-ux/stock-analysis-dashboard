import mongoose from "mongoose";

const globalAny = global;
if (!globalAny._mongo) globalAny._mongo = { conn: null, promise: null };

export async function connectToDB() {
  if (globalAny._mongo.conn) return globalAny._mongo.conn;
  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI missing in .env.local");

  if (!globalAny._mongo.promise) {
    globalAny._mongo.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((m) => {
        console.log("⚡⚡ MongoDB Connected ⚡⚡");
        return m;
      });
  }
  globalAny._mongo.conn = await globalAny._mongo.promise;
  return globalAny._mongo.conn;
}
