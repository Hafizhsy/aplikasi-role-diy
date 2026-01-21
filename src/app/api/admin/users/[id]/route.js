import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// TARUH DI LUAR BIAR BISA DIBACA SEMUA FUNGSI
const BASE_URL = `http://localhost:8080/admin/realms/pemda`;
const CLIENT_UUID = "3a117525-0efc-4396-9851-0616ec7010a9";

// --- FUNGSI UPDATE (PUT) ---
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { wilayah, role } = await req.json();

  if (!session || !session.user.roles.includes("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // 1. Update Wilayah
    await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ attributes: { wilayah: [wilayah] } }),
    });

    // 2. Bersihkan Role Lama
    const oldRolesRes = await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, { headers });
    const oldRoles = await oldRolesRes.json();
    if (oldRoles.length > 0) {
      await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify(oldRoles),
      });
    }

    // 3. Pasang Role Baru
    const roleRes = await fetch(`${BASE_URL}/clients/${CLIENT_UUID}/roles/${role}`, { headers });
    const roleData = await roleRes.json();
    await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, {
      method: "POST",
      headers,
      body: JSON.stringify([{ id: roleData.id, name: roleData.name }]),
    });

    return NextResponse.json({ message: "Update Berhasil" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- FUNGSI HAPUS (DELETE) ---
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || !session.user.roles.includes("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Keycloak: ${errorText}` }, { status: res.status });
    }

    return NextResponse.json({ message: "User Berhasil Dihapus" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}