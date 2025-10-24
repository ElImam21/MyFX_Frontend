import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        console.log("📊 GET /api/stats/equity dipanggil");

        const db = await connectDB();
        const collection = db.collection("equity");

        // Ambil semua dokumen, hanya field equity saja
        const data = await collection.find({}, { projection: { equity: 1 } }).toArray();

        if (!data || data.length === 0) {
            return NextResponse.json({
                success: true,
                message: "Tidak ada data equity ditemukan",
                equity: [],
            });
        }

        // Format hasil agar lebih bersih
        const equityList = data.map(item => ({
            _id: item._id,
            equity: item.equity ?? 0,
        }));

        console.log("✅ Data equity ditemukan:", equityList.length);

        // Ambil nilai equity dari dokumen pertama yang punya field equity valid
        const equityValue = data.find(item => typeof item.equity === 'number')?.equity ?? 0;

        return NextResponse.json({
            success: true,
            message: "Data equity berhasil diambil",
            equity: equityValue, // ✅ sekarang hanya angka, bukan array
        });
    } catch (error) {
        console.error("❌ Gagal mengambil data equity:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal mengambil data equity",
            log: error.message,
        }, { status: 500 });
    }
}
