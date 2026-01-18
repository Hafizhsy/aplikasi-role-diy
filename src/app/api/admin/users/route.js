import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.roles.includes("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!session.accessToken) {
    console.error("DEBUG ERROR: Access token tidak ditemukan atau expired");
    return NextResponse.json({ error: "Access token tidak ditemukan" }, { status: 401 });
  }
 try {
  // Pastikan URL realm-nya benar (di gambar kamu realm-nya adalah 'pemda')
  const url = "http://localhost:8080/admin/realms/pemda/users";
  
  const response = await fetch(url, {
    headers: {
      // Pastikan session.accessToken benar-benar ada
      Authorization: `Bearer ${session.accessToken}`, 
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    console.error("DEBUG KEYCLOAK ERROR:", errorDetail);
    return NextResponse.json({ error: "Keycloak menolak akses" }, { status: response.status });
  }

  const data = await response.json();
  console.log("DEBUG DATA USER:", data); // Lihat di terminal VS Code apakah muncul datanya
  return NextResponse.json(data);
} catch (error) {
  console.error("ERROR FETCH USERS:", error);
  return NextResponse.json({ error: "Gagal mengambil data pengguna" }, { status: 500 });
}           
}