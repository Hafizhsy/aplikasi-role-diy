import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const encoder = new TextEncoder();

function getJwtSecret() {
  return encoder.encode(process.env.NEXTAUTH_SECRET);
}

export async function GET() {
  if (!process.env.NEXTAUTH_SECRET || !process.env.NEXTAUTH_URL) {
    return NextResponse.json(
      { error: "NEXTAUTH_SECRET dan NEXTAUTH_URL wajib diisi." },
      { status: 500 }
    );
  }

  const token = await new SignJWT({ purpose: "qr-login" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2m")
    .setJti(crypto.randomUUID())
    .sign(getJwtSecret());

  const loginUrl = new URL(process.env.NEXTAUTH_URL);
  loginUrl.searchParams.set("qr_login_token", token);

  const qrImageUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
  qrImageUrl.searchParams.set("size", "220x220");
  qrImageUrl.searchParams.set("margin", "12");
  qrImageUrl.searchParams.set("data", loginUrl.toString());

  return NextResponse.json({
    token,
    loginUrl: loginUrl.toString(),
    qrImageUrl: qrImageUrl.toString(),
    expiresIn: 120,
  });
}
