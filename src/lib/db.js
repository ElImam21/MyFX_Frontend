import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("❌ MONGODB_URI belum diatur di .env.local");

const options = {
  serverSelectionTimeoutMS: 10000,
};

// Global cache
let cached = global._mongo;
if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    // 🔁 Koneksi sudah ada, langsung return db
    return cached.conn.db;
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, options);
    cached.promise = client.connect().then((client) => {
      console.log("✅ Terhubung ke MongoDB Atlas (baru)");
      return { client, db: client.db("myfx") };
    });
  }

  cached.conn = await cached.promise;
  return cached.conn.db; // 🟢 langsung return db instance
}
