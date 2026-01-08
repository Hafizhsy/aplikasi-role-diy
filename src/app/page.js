"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">
          Sistem Informasi Pemda DIY
        </h1>
        
        {!session ? (
          <div>
            <p className="mb-6 text-gray-600">Silakan login untuk mengakses manajemen role.</p>
            <button 
              onClick={() => signIn("keycloak")}
              className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
            >
              Login dengan Keycloak
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2">Selamat Datang, <strong>{session.user.name}</strong>!</p>
            <p className="text-sm text-gray-500 mb-6">Role Anda: {session.user.roles?.join(", ") || "Tidak ada role"}</p>
            <button 
              onClick={() => signOut()}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}