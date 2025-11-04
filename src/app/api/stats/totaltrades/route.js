import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    // Ambil tanggal hari ini
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Buat prefix bulan dalam format "YYYY-MM"
    const monthPrefix = `${year}-${month}`;

    // Ambil semua trade bulan ini berdasarkan prefix "YYYY-MM"
    const trades = await db.collection("trade_result")
      .find({ createdAt: { $regex: `^${monthPrefix}` } })
      .toArray();

    if (trades.length === 0) {
      return NextResponse.json({
        success: true,
        totalTrades: 0,
        message: "Tidak ada trade bulan ini",
      });
    }

    // Kelompokkan berdasarkan tanggal (YYYY-MM-DD)
    const grouped = {};
    for (const trade of trades) {
      const datePart = trade.createdAt.split(" ")[0]; // ambil "2025-11-04" dari "2025-11-04 14:08:51"
      grouped[datePart] = (grouped[datePart] || 0) + 1;
    }

    // Ubah ke format array
    const formattedData = Object.keys(grouped).map(date => ({
      date,
      totalTrades: grouped[date],
    }));

    // Hitung total trade bulan ini
    const totalTrades = trades.length;

    return NextResponse.json(
      {
        success: true,
        totalTrades,
        data: formattedData,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET totalTrades error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghitung total trades", error: error.message },
      { status: 500 }
    );
  }
}
