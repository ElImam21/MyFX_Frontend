import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const trades = await db.collection("trade_result").find({}).toArray();

    const currentMonth = new Date().getMonth() + 1;

    // Filter trade bulan ini
    const monthlyTrades = trades.filter((t) => {
      if (!t.createdAt) return false;
      const datePart = t.createdAt.split(" ")[0];
      const parts = datePart.split("-");
      if (parts.length < 2) return false;
      const tradeMonth = parseInt(parts[1], 10);
      return tradeMonth === currentMonth;
    });

    // Group by tanggal
    const groupedData = {};

    monthlyTrades.forEach((trade) => {
      const date = trade.createdAt.split(" ")[0]; // YYYY-MM-DD
      const pl = parseFloat(trade.pl) || 0;
      const type = trade.result;

      if (!groupedData[date]) {
        groupedData[date] = { profit: 0, loss: 0, breakEven: 0 };
      }

      if (type === "Profit") groupedData[date].profit += pl;
      else if (type === "Loss") groupedData[date].loss += Math.abs(pl);
      else if (type === "Break Even") groupedData[date].breakEven += pl;
    });

    // Ubah ke format array agar mudah digunakan di frontend chart
    const chartData = Object.entries(groupedData).map(([date, values]) => ({
      date,
      profit: parseFloat(values.profit.toFixed(2)),
      loss: parseFloat(values.loss.toFixed(2)),
      breakEven: parseFloat(values.breakEven.toFixed(2)),
    }));

    return NextResponse.json({ success: true, chartData });
  } catch (error) {
    console.error("GET chart trade error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat data chart trade" },
      { status: 500 }
    );
  }
}
