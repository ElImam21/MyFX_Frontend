import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    // Gunakan koneksi dari global connection caching
    const db = await connectDB();

    // Hitung total dokumen di koleksi trade_result
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
  }
}
