import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { wilayah, role } = await req.json();

  const BASE_URL = `http://localhost:8080/admin/realms/pemda`;
  const CLIENT_UUID = "3a117525-0efc-4396-9851-0616ec7010a9";

  try {
    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // 1. Update Atribut Wilayah ke Keycloak
    await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ attributes: { wilayah: [wilayah] } }),
    });

    // 2. Hapus semua role client lama agar bersih
    const oldRolesRes = await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, { headers });
    const oldRoles = await oldRolesRes.json();
    if (oldRoles.length > 0) {
      await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, {
        method: "DELETE", headers, body: JSON.stringify(oldRoles),
      });
    }

    // 3. Pasang Role Baru (admin atau operator)
    const roleDetailRes = await fetch(`${BASE_URL}/clients/${CLIENT_UUID}/roles/${role}`, { headers });
    const roleDetail = await roleDetailRes.json();
    await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, {
      method: "POST",
      headers,
      body: JSON.stringify([{ id: roleDetail.id, name: roleDetail.name }]),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}