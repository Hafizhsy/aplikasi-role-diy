import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    // Destructuring datanya
    const { judul, kategori, deskripsi, userEmail } = body;

    // CEK DI TERMINAL: Kalau userEmail muncul 'undefined', berarti masalahnya di FRONTEND
    console.log("DATA DARI FRONTEND:", { judul, kategori, deskripsi, userEmail });

    if (!userEmail) {
      return NextResponse.json({ error: "Email user tidak ditemukan!" }, { status: 400 });
    }

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
    console.error("NYOH ERRORNYA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}