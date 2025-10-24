import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { pair, type, result, note, sl, tp, lotSize, pl } = await req.json();

    if (!pair || !type || !result) {
      return NextResponse.json(
        { success: false, message: "Pair, Type, dan Result wajib diisi" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const tradeCollection = db.collection("trade_result");
    const equityCollection = db.collection("equity");

    // Ambil data trade lama
    const oldTrade = await tradeCollection.findOne({ _id: new ObjectId(id) });
    if (!oldTrade) {
      return NextResponse.json(
        { success: false, message: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hitung selisih P/L baru dan lama
    const oldPl = parseFloat(oldTrade.pl) || 0;
    const newPl = parseFloat(pl) || 0;
    const difference = newPl - oldPl;

    // Update data trade
    await tradeCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          pair,
          type,
          result,
          note,
          sl,
          tp,
          lotSize,
          pl,
          updatedAt: new Date()
            .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
            .replace("T", " "),
        },
      }
    );

    // 💰 Update equity berdasarkan selisih
    await equityCollection.updateOne({}, { $inc: { equity: difference } });

    return NextResponse.json(
      { success: true, message: "Trade dan equity berhasil diperbarui" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/trades/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE — Hapus trade berdasarkan ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const db = await connectDB();
    const collection = db.collection("trade_result");

    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Trade berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/trades/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
