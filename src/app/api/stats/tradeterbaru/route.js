import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ✅ gunakan koneksi global caching

export async function GET() {
  try {
    // Gunakan koneksi database dari global cache
    const db = await connectDB();

    // Ambil 5 data terbaru dari koleksi trade_result
    const trades = await db
      .collection("trade_result")
      .find({}, { projection: { _id: 1, pair: 1, result: 1, pl: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Format nilai PL sesuai result
    const formattedTrades = trades.map((trade) => {
      const plValue = parseFloat(trade.pl) || 0;
      let formattedPl = plValue.toFixed(2);

      if (trade.result === "Profit") formattedPl = `+${formattedPl}`;

      return {
        _id: trade._id?.toString(),
        pair: trade.pair || "-",
        result: trade.result || "-",
        pl: formattedPl,
        createdAt: trade.createdAt || null,
      };
    });

    return NextResponse.json(
      { success: true, trades: formattedTrades },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET recent-trades error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil trade terbaru" },
      { status: 500 }
    );
  }
}
