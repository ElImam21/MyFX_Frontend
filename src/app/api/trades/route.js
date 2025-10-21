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
    const { pair, result, note, sl, tp, lotSize, pl } = await req.json();

    if (!pair || !result) {
      return NextResponse.json(
        { success: false, message: "Pair dan Result wajib diisi" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const collection = db.collection("trade_result");

    const createdAt = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .replace("T", " ");

    await collection.insertOne({
      pair,
      result,
      note,
      sl,
      tp,
      lotSize,
      pl,
      createdAt,
    });

    return NextResponse.json(
      { success: true, message: "Data trade berhasil disimpan" },
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
