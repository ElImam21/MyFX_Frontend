import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    // Gunakan koneksi dari global connection caching
    const db = await connectDB();
    const trades = await db.collection("trade_result").find({}).toArray();

    const currentMonth = new Date().getMonth() + 1; // 1–12

    // Filter hanya trade bulan ini
    const filteredTrades = trades.filter(trade => {
      if (!trade.createdAt) return false;

      const datePart = trade.createdAt.split(" ")[0]; // "YYYY-MM-DD"
      const parts = datePart.split("-"); // ["YYYY","MM","DD"]
      if (parts.length !== 3) return false;

      const tradeMonth = parseInt(parts[1], 10);
      return tradeMonth === currentMonth;
    });

    // Jika tidak ada data bulan ini
    if (filteredTrades.length === 0) {
      return NextResponse.json(
        { success: true, totalPl: 0.00, status: "Tidak ada data bulan ini" },
        { status: 200 }
      );
    }

    // Hitung total Profit/Loss
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
  }
}
