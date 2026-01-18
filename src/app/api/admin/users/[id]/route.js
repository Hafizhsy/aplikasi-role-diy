import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const body = await req.json();

  const BASE_URL = `http://localhost:8080/admin/realms/pemda`;
  const CLIENT_UUID = "3a117525-0efc-4396-9851-0616ec7010a9";

  try {
    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // HANYA UPDATE WILAYAH, JANGAN KIRIM EMAIL
    await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ attributes: { wilayah: [body.wilayah] } }),
    });

    // UPDATE ROLE
    const roleRes = await fetch(`${BASE_URL}/clients/${CLIENT_UUID}/roles/${body.role}`, { headers });
    const roleData = await roleRes.json();
    await fetch(`${BASE_URL}/users/${id}/role-mappings/clients/${CLIENT_UUID}`, {
      method: "POST",
      headers,
      body: JSON.stringify([{ id: roleData.id, name: roleData.name }]),
    });

    return NextResponse.json({ message: "Sistem Aman & Berhasil Update" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}