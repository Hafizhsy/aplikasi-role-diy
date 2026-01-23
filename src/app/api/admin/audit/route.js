import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.roles.includes("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const REALM = "pemda";
  const BASE_URL = `http://localhost:8080/admin/realms/${REALM}`;

  try {
    const headers = { Authorization: `Bearer ${session.accessToken}` };
    const response = await fetch(`${BASE_URL}/events`, { headers });
    const events = await response.json();

    if (!response.ok) throw new Error("Gagal mengambil data Keycloak");

    // FILTER: Hanya ambil event yang bermakna bagi Admin
    const importantEvents = events.filter(e => 
      ["LOGIN", "LOGIN_ERROR", "LOGOUT", "LOGOUT_ERROR", "REGISTER", "UPDATE_PASSWORD"].includes(e.type) &&
      (e.details?.username || e.userId)
    );

    const formattedLogs = importantEvents.map((event, index) => {
      const getFriendlyType = (type) => {
        const types = {
          "LOGIN": "Login Berhasil",
          "LOGIN_ERROR": "Gagal Masuk",
          "LOGOUT": "Keluar Sistem",
          "LOGOUT_ERROR": "Sesi Terputus",
          "REGISTER": "Akun Baru",
          "UPDATE_PASSWORD": "Ganti Password"
        };
        return types[type] || type.replace(/_/g, " ");
      };

      return {
        id: event.id || index.toString(),
        username: event.details?.username || "User Unidentified",
        email: event.userId ? `ID: ${event.userId.substring(0, 8)}...` : "System",
        aktivitas: getFriendlyType(event.type),
        detail: event.error ? `Kendala: ${event.error}` : `Akses dari IP ${event.ipAddress}`,
        wilayah: "PUSAT", 
        waktu: new Date(event.time).toISOString(),
        status: event.error ? "error" : "success"
      };
    });

    return NextResponse.json(formattedLogs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}