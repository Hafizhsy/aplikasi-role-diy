import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.roles.includes("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!session.accessToken) {
    return NextResponse.json({ error: "Access token tidak ditemukan" }, { status: 401 });
  }

  try {
    const realm = "pemda";
    const clientUUID = "3a117525-0efc-4396-9851-0616ec7010a9"; // PASTIKAN UUID INI BENAR
    const baseUrl = `http://localhost:8080/admin/realms/${realm}`;
    
    // 1. Ambil daftar user mentah (Kodingan asli kamu)
    const response = await fetch(`${baseUrl}/users`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`, 
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Keycloak menolak akses" }, { status: response.status });
    }

    const users = await response.json();

    // 2. TAMBAHAN: Ambil ROLE & WILAYAH asli dari Keycloak untuk setiap user
    const fullData = await Promise.all(
      users.map(async (user) => {
        try {
          // Ambil role client untuk user ini
          const roleRes = await fetch(`${baseUrl}/users/${user.id}/role-mappings/clients/${clientUUID}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          });
          const roles = await roleRes.json();
          
          // Tentukan role: kalau ada role 'admin' di client, set admin. Kalau nggak, operator.
          const isAdmin = roles.some(r => r.name.toLowerCase() === 'admin');

          return {
            ...user,
            role: isAdmin ? "admin" : "operator", // Ini yang bakal dibaca tabel
            wilayah: user.attributes?.wilayah?.[0] || "umum" // Ini wilayah asli dari Keycloak
          };
        } catch (e) {
          return { ...user, role: "operator", wilayah: "umum" };
        }
      })
    );

    return NextResponse.json(fullData);
  } catch (error) {
    console.error("ERROR FETCH USERS:", error);
    return NextResponse.json({ error: "Gagal mengambil data pengguna" }, { status: 500 });
  }           
}