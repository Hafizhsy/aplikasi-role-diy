import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, details } = await req.json();

  // Struktur Log yang tersimpan
  const logEntry = {
    timestamp: new Date().toISOString(),
    user: session.user.name,
    email: session.user.email,
    wilayah: session.user.wilayah,
    roles: session.user.roles,
    action: action, // Contoh: "MENGAKSES_HALAMAN_JOGJA"
    details: details
  };

  // Di sini kamu bisa tambahkan kode Prisma/Sequelize untuk simpan ke DB
  console.log("--- AUDIT LOG RECORDED ---");
  console.table(logEntry);

  return NextResponse.json({ message: "Log recorded" });
}