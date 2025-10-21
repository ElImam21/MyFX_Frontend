import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const collection = db.collection("trade_result");

    // Ambil semua trade yang punya kolom pair
    const trades = await collection.find({ pair: { $exists: true } }).toArray();

    if (trades.length === 0) {
      return NextResponse.json({ success: true, pairs: [] });
    }

    // Kelompokkan berdasarkan pair
    const grouped = {};
    for (const trade of trades) {
      const pair = trade.pair;
      const result = trade.result;
      const plValue = parseFloat(trade.pl || "0");

      if (!grouped[pair]) {
        grouped[pair] = {
          totalTrades: 0,
          wins: 0,
          losses: 0,
          breakEven: 0,
          totalPl: 0,
        };
      }

      grouped[pair].totalTrades++;
      grouped[pair].totalPl += plValue;

      if (result === "Profit") grouped[pair].wins++;
      else if (result === "Loss") grouped[pair].losses++;
      else if (result === "Break Even") grouped[pair].breakEven++;
    }

    // Ubah ke array dan hitung win rate
    const pairsArray = Object.entries(grouped).map(([pair, data]) => {
      const winRate = (data.wins / data.totalTrades) * 100;
      return {
        pair,
        totalTrades: data.totalTrades,
        winRate: parseFloat(winRate.toFixed(2)),
        profitLoss: parseFloat(data.totalPl.toFixed(2)),
      };
    });

    // Urutkan berdasarkan jumlah trade terbanyak
    pairsArray.sort((a, b) => b.totalTrades - a.totalTrades);

    // Ambil 3 teratas
    const top3Pairs = pairsArray.slice(0, 3);

    return NextResponse.json({
      success: true,
      pairs: top3Pairs,
    });
  } catch (error) {
    console.error("GET /api/stats/pairterpopuler error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pair terpopuler" },
      { status: 500 }
    );
  }
}
