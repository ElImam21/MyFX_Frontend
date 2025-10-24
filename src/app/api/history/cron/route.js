import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        const today = new Date();

        // Jalankan hanya pada tanggal 1
        if (today.getDate() !== 1) {
            return NextResponse.json({
                success: false,
                message: "API ini hanya berjalan pada tanggal 1 setiap bulan",
            });
        }

        const db = await connectDB();
        const tradeCollection = db.collection("trade_result");
        const equityCollection = db.collection("equity");
        const historyCollection = db.collection("history");

        // Tentukan rentang tanggal bulan lalu
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        const monthString = `${firstDayLastMonth.getFullYear()}-${String(firstDayLastMonth.getMonth() + 1).padStart(2, "0")}`;

        const trades = await tradeCollection
            .find({
                createdAt: { $regex: `^${monthString}` } // cari string yang diawali "2025-09"
            })
            .toArray();


        if (trades.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Tidak ada trade pada bulan lalu",
            });
        }

        // === 1️⃣ Cari trade dengan kerugian terbesar (max_drawdown) ===
        const losingTrades = trades.filter(t => parseFloat(t.pl) < 0);
        const maxDrawdown = losingTrades.length
            ? Math.min(...losingTrades.map(t => parseFloat(t.pl)))
            : 0;

        // === 2️⃣ Hitung rata-rata rugi (risk_per_trade) ===
        const riskPerTrade = losingTrades.length
            ? losingTrades.reduce((acc, t) => acc + Math.abs(parseFloat(t.pl)), 0) / losingTrades.length
            : 0;

        // === 3️⃣ Ambil equity terakhir dari koleksi admin ===
        const lastEquityData = await equityCollection.findOne(
            { equity: { $exists: true } },
            { sort: { _id: -1 }, projection: { equity: 1 } }
        );
        const lastEquity = lastEquityData?.equity ?? 0;

        // === 4️⃣ Simpan ke koleksi history ===
        const monthLabel = `${firstDayLastMonth.getFullYear()}-${String(
            firstDayLastMonth.getMonth() + 1
        ).padStart(2, "0")}`;

        await historyCollection.insertOne({
            month: monthLabel,
            max_drawdown: maxDrawdown,
            risk_per_trade: riskPerTrade,
            last_equity: lastEquity,
            created_at: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: `Laporan bulanan untuk ${monthLabel} berhasil dibuat`,
            data: {
                max_drawdown: maxDrawdown,
                risk_per_trade: riskPerTrade,
                last_equity: lastEquity,
            },
        });
    } catch (error) {
        console.error("❌ Error di /api/history/cron:", error);
        return NextResponse.json(
            { success: false, message: "Gagal membuat laporan bulanan", error: error.message },
            { status: 500 }
        );
    }
}
