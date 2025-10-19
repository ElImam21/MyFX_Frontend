import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// PUT — Update trade
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { pair, result, note, sl, tp, lotSize, pl } = await req.json();

    await client.connect();
    const db = client.db("myfx");
    const collection = db.collection("trade_result");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          pair,
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

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Data trade berhasil diupdate" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/trades/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE — Hapus trade
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await client.connect();
    const db = client.db("myfx");
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
  } finally {
    await client.close();
  }
}
