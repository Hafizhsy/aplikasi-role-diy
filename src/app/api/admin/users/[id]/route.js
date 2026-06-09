import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getKeycloakAdminConfig } from "@/lib/auth";

const { adminBaseUrl, clientUuid } = getKeycloakAdminConfig();

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
    const updateUserRes = await fetch(`${adminBaseUrl}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ attributes: { wilayah: [wilayah] } }),
    });
    if (!updateUserRes.ok) {
      const errorText = await updateUserRes.text();
      return NextResponse.json({ error: `Keycloak: ${errorText}` }, { status: updateUserRes.status });
    }

    // 2. Bersihkan Role Lama
    const oldRolesRes = await fetch(`${adminBaseUrl}/users/${id}/role-mappings/clients/${clientUuid}`, { headers });
    const oldRoles = await oldRolesRes.json();
    if (oldRoles.length > 0) {
      await fetch(`${adminBaseUrl}/users/${id}/role-mappings/clients/${clientUuid}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify(oldRoles),
      });
    }

    // 3. Pasang Role Baru
    const roleRes = await fetch(`${adminBaseUrl}/clients/${clientUuid}/roles/${role}`, { headers });
    const roleData = await roleRes.json();
    await fetch(`${adminBaseUrl}/users/${id}/role-mappings/clients/${clientUuid}`, {
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
    const res = await fetch(`${adminBaseUrl}/users/${id}`, {
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
