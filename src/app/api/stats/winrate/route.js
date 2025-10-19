import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("myfx");
    const trades = await db.collection("trade_result").find({}).toArray();

    const total = trades.length;
    const wins = trades.filter(t => t.result === "Profit").length;
    const losses = trades.filter(t => t.result === "Loss").length;

    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return NextResponse.json(
      { success: true, winRate, total, wins, losses },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET winRate error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghitung win rate" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
