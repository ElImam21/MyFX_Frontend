import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("myfx");

    const trades = await db.collection("trade_result").find({}).toArray();

    const currentMonth = new Date().getMonth() + 1; // 1–12

    const filteredTrades = trades.filter(trade => {
      if (!trade.createdAt) return false;

      const datePart = trade.createdAt.split(" ")[0]; // "YYYY-MM-DD"
      const parts = datePart.split("-"); // ["YYYY","MM","DD"]
      if (parts.length !== 3) return false;

      const tradeMonth = parseInt(parts[1], 10);
      return tradeMonth === currentMonth;
    });

    if (filteredTrades.length === 0) {
      return NextResponse.json(
        { success: true, totalPl: 0.00, status: "Tidak ada data bulan ini" },
        { status: 200 }
      );
    }

    // Hitung total PL
    const totalPl = filteredTrades.reduce((acc, trade) => {
      const value = parseFloat(trade.pl);
      if (!isNaN(value)) acc += value;
      return acc;
    }, 0);

    const status = totalPl >= 0 ? "Profit" : "Loss";

    return NextResponse.json(
      { success: true, totalPl: parseFloat(totalPl.toFixed(2)), status },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET totalPl error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghitung total profit/loss" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
