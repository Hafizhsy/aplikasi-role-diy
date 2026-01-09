"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const handlelogout = async() => {

  const realm = "pemda";
  const clientId = "web-app";
  const idToken = session?.id_token;
  const logoutUrl = `http://localhost:8080/realms/${realm}/protocol/openid-connect/logout?client_id=${clientId}&id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}`;
    await signOut({ redirect: false });
    window.location.href = logoutUrl;
  };

  if (status === "loading") { 
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
        <p className="text-gray-600">Menghubungkan...</p>
      </main>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full border-t-4 border-blue-900">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">
          Sistem Informasi Pemda DIY
        </h1>
        
        {!session ? (
          <div>
            <p className="mb-6 text-gray-600">login untuk mengakses manajemen role.</p>
            <button 
              onClick={() => signIn("keycloak")}
              className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition font-bold"
            >
              LOGIN DENGAN KEYCLOAK
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-700">Login berhasil!</h2>
            <div className="mt-4 text-left bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Informasi User:</p>
              <p className="mt-1"><strong>Nama:</strong> {session.user.name}</p>
              <p className="mb-3"><strong>Email:</strong> {session.user.email}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold border-t pt-2">Roles Anda:</p>
              {/* Ini adalah bagian untuk mengecek apakah Role sudah masuk atau belum */}
              <pre className="text-xs bg-black text-green-400 p-3 mt-2 rounded overflow-x-auto">
                {JSON.stringify(session.user.roles || "Role tidak ditemukan", null, 2)}
              </pre>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Masuk ke Dashboard
              </button>
              <button 
                onClick={handlelogout}
                className="w-full text-gray-500 text-sm hover:underline mt-2 font-medium"
              >
                Logout dari Sistem
              </button>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-xs text-gray-400">
        Pemerintah Daerah Daerah Istimewa Yogyakarta &copy; 2026
      </p>
    </main>
  );
}