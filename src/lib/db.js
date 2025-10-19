import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log("🔗 Connecting to:", uri);

const options = {
  serverSelectionTimeoutMS: 10000,
};

let client;
let clientPromise;

if (!uri) throw new Error("❌ MONGODB_URI belum diatur di .env.local");

try {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} catch (err) {
  console.error("❌ Gagal inisialisasi koneksi MongoDB:", err);
}

export async function connectDB() {
  try {
    const connectedClient = await clientPromise;
    console.log("✅ Terhubung ke MongoDB Atlas");
    return connectedClient.db("myfx");
  } catch (err) {
    console.error("❌ Gagal konek ke MongoDB:", err);
    throw err;
  }
}
