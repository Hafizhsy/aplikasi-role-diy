import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { judul, kategori, deskripsi, userEmail } = body;

    const laporanBaru = await prisma.laporan.create({
      data: {
        judul,
        kategori,
        deskripsi,
        userEmail,
        tanggal: new Date(),
      },
    });

    return NextResponse.json(laporanBaru, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan laporan" }, { status: 500 });
  }
}