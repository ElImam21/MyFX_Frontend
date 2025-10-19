import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// GET: Ambil semua data trade
export async function GET() {
  try {
    await client.connect();
    const db = client.db("myfx");
    const trades = await db.collection("trade_result")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json(trades, { status: 200 });
  } catch (error) {
    console.error("GET trades error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data trade" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST: Tambah data trade baru
export async function POST(req) {
  try {
    const { pair, result, note, sl, tp, lotSize, pl } = await req.json();

    if (!pair || !result) {
      return NextResponse.json(
        { success: false, message: "Pair dan Result wajib diisi" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("myfx");
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
    console.error("POST trades error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT: Update data trade
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { pair, result, note, sl, tp, lotSize, pl } = await req.json();

    if (!pair || !result) {
      return NextResponse.json(
        { success: false, message: "Pair dan Result wajib diisi" },
        { status: 400 }
      );
    }

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
    console.error("PUT trade error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE: Hapus data trade
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
      { success: true, message: "Data trade berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE trade error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
