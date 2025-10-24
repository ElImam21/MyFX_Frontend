import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// GET — Ambil semua data trade
export async function GET() {
  try {
    const db = await connectDB();
    const trades = await db
      .collection("trade_result")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json(trades, { status: 200 });
  } catch (error) {
    console.error("GET /api/trades error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data trade" },
      { status: 500 }
    );
  }
}

// POST — Tambah data trade baru
export async function POST(req) {
  try {
    const { pair, type, result, note, sl, tp, lotSize, pl } = await req.json();

    if (!pair || !type || !result) {
      return NextResponse.json(
        { success: false, message: "Pair, Type, dan Result wajib diisi" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const tradeCollection = db.collection("trade_result");
    const equity = db.collection("equity");

    const createdAt = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .replace("T", " ");

    await tradeCollection.insertOne({
      pair,
      type,
      result,
      note,
      sl,
      tp,
      lotSize,
      pl,
      createdAt,
    });

    // 💰 Update equity otomatis
    const profitLoss = parseFloat(pl) || 0;
    if (!isNaN(profitLoss)) {
      await equity.updateOne(
        {},
        { $inc: { equity: profitLoss } } // tambah atau kurangi sesuai pl
      );
    }

    return NextResponse.json(
      { success: true, message: "Data trade berhasil disimpan dan equity diperbarui" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/trades error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
