import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const realm = "pemda";
const clientUUID = "3a117525-0efc-4396-9851-0616ec7010a9";
const baseUrl = `http://localhost:8080/admin/realms/${realm}`;

// --- FUNGSI AMBIL DATA USER (GET) ---
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("admin")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const headers = { Authorization: `Bearer ${session.accessToken}` };
    const response = await fetch(`${baseUrl}/users`, { headers });
    const users = await response.json();

    const fullData = await Promise.all(
      users.map(async (user) => {
        try {
          const roleRes = await fetch(`${baseUrl}/users/${user.id}/role-mappings/clients/${clientUUID}`, { headers });
          const roles = await roleRes.json();
          const isAdmin = roles.some(r => r.name.toLowerCase() === 'admin');
          return {
            ...user,
            role: isAdmin ? "admin" : "operator",
            wilayah: user.attributes?.wilayah?.[0] || "umum"
          };
        } catch (e) {
          return { ...user, role: "operator", wilayah: "umum" };
        }
      })
    );
    return NextResponse.json(fullData);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// --- FUNGSI TAMBAH USER BARU (POST) ---
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("admin")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const headers = { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" };

    // 1. Create User
    const userRes = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        enabled: true,
        attributes: { wilayah: [body.wilayah] },
        credentials: [{ type: "password", value: body.password, temporary: false }]
      }),
    });

    if (!userRes.ok) throw new Error("Gagal create user");

    // 2. Get User ID Baru
    const getNewUser = await fetch(`${baseUrl}/users?username=${body.username}`, { headers });
    const newUser = await getNewUser.json();
    const newUserId = newUser[0].id;

    // 3. Assign Role
    const roleDetailRes = await fetch(`${baseUrl}/clients/${clientUUID}/roles/${body.role}`, { headers });
    const roleDetail = await roleDetailRes.json();

    await fetch(`${baseUrl}/users/${newUserId}/role-mappings/clients/${clientUUID}`, {
      method: "POST",
      headers,
      body: JSON.stringify([{ id: roleDetail.id, name: roleDetail.name }]),
    });

    return NextResponse.json({ message: "User Berhasil Dibuat" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}