import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("myfx");
    const totalTrades = await db.collection("trade_result").countDocuments();

    return NextResponse.json(
      { success: true, totalTrades },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET totalTrades error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghitung total trades" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
