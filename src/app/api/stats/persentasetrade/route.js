import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const trades = await db.collection("trade_result").find({}).toArray();

    // Ambil bulan saat ini (1–12)
    const currentMonth = new Date().getMonth() + 1;

    // Filter hanya trade bulan ini
    const currentMonthTrades = trades.filter((t) => {
      if (!t.createdAt) return false;
      const datePart = t.createdAt.split(" ")[0];
      const parts = datePart.split("-");
      if (parts.length < 2) return false;
      const tradeMonth = parseInt(parts[1], 10);
      return tradeMonth === currentMonth;
    });

    const total = currentMonthTrades.length || 1; // hindari pembagian nol

    const profitCount = currentMonthTrades.filter((t) => t.result === "Profit").length;
    const lossCount = currentMonthTrades.filter((t) => t.result === "Loss").length;
    const beCount = currentMonthTrades.filter((t) => t.result === "Break Even").length;

    const profitPercent = ((profitCount / total) * 100).toFixed(2);
    const lossPercent = ((lossCount / total) * 100).toFixed(2);
    const bePercent = ((beCount / total) * 100).toFixed(2);

    return NextResponse.json({
      success: true,
      profitPercent: parseFloat(profitPercent),
      lossPercent: parseFloat(lossPercent),
      breakEvenPercent: parseFloat(bePercent),
    });
  } catch (error) {
    console.error("GET persentase trade error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghitung persentase trade" },
      { status: 500 }
    );
  }
}
