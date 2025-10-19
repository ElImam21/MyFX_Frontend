import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validasi input sederhana
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const existingUser = await db.collection("admin").findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username sudah terdaftar" },
        { status: 400 }
      );
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan akun baru ke database
    await db.collection("admin").insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Jakarta",
        hour12: false
      }).replace(',', '') // hasilnya misal: "18/10/2025 19:16:58"
    });

    return NextResponse.json(
      { success: true, message: "Akun admin berhasil dibuat" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
