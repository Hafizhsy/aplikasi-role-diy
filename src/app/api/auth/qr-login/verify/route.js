import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, error: "Token tidak ditemukan." }, { status: 400 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(process.env.NEXTAUTH_SECRET)
    );

    if (payload.purpose !== "qr-login") {
      return NextResponse.json({ valid: false, error: "Token QR tidak valid." }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Token QR sudah kedaluwarsa atau tidak valid." }, { status: 401 });
  }
}
