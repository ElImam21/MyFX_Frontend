import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_myfx";

export async function POST(req) {
  try {
    console.log("🔹 Login API called");

    const { username, password } = await req.json();
    console.log("📥 Received data:", { username, password: "****" });

    const db = await connectDB();
    console.log("✅ Database connected");

    const admin = await db.collection("admin").findOne({ username });
    console.log("📊 Admin found:", !!admin);

    if (!admin) {
      console.warn("⚠️ Username tidak ditemukan:", username);
      return NextResponse.json({ success: false, message: "Username tidak ditemukan" }, { status: 401 });
    }

    console.log("🔐 Comparing password...");
    const validPassword = await bcrypt.compare(password, admin.password);
    console.log("🔍 Password valid:", validPassword);

    if (!validPassword) {
      console.warn("⚠️ Password salah untuk:", username);
      return NextResponse.json({ success: false, message: "Password salah" }, { status: 401 });
    }

    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: "1h" });
    console.log("✅ JWT token dibuat");

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: { username: admin.username },
      token,
    });
  } catch (error) {
    console.error("❌ Login error detail:", error.message, error.stack);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server", log: error.message }, { status: 500 });
  }
}
