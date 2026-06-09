"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [qrLogin, setQrLogin] = useState(null);
  const [qrStatus, setQrStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrToken = params.get("qr_login_token");

    if (!qrToken || session) return;

    const loginWithQr = async () => {
      const res = await fetch(`/api/auth/qr-login/verify?token=${encodeURIComponent(qrToken)}`);
      const data = await res.json();

      if (data.valid) {
        await signIn("keycloak", { callbackUrl: "/dashboard" });
      } else {
        setQrStatus("expired");
      }
    };

    loginWithQr();
  }, [session]);

  useEffect(() => {
    if (session) return;

    let refreshTimer;

    const loadQr = async () => {
      setQrStatus("loading");
      try {
        const res = await fetch("/api/auth/qr-login");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Gagal membuat QR login.");
        }

        setQrLogin(data);
        setQrStatus("ready");
        refreshTimer = window.setTimeout(loadQr, (data.expiresIn - 10) * 1000);
      } catch (error) {
        setQrStatus("error");
      }
    };

    loadQr();

    return () => window.clearTimeout(refreshTimer);
  }, [session]);

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
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Login dengan QR
              </p>
              <div className="mt-3 flex justify-center">
                {qrStatus === "ready" && qrLogin?.qrImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrLogin.qrImageUrl}
                    alt="QR login Keycloak"
                    className="h-[220px] w-[220px] rounded-lg border border-gray-200 bg-white p-2"
                  />
                ) : (
                  <div className="flex h-[220px] w-[220px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500">
                    {qrStatus === "error" ? "QR belum tersedia" : "Membuat QR..."}
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Scan QR untuk membuka login provider. Token QR otomatis berganti setiap 2 menit.
              </p>
              {qrStatus === "expired" && (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  Token QR sudah kedaluwarsa. Silakan scan QR baru.
                </p>
              )}
            </div>
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
              <div className="grid grid-cols-1 gap-2 mt-3">
  {session.user.roles?.map((role, index) => (
    <div key={index} className="flex items-center p-2 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="p-2 bg-slate-100 rounded-md mr-3">
        {role === 'admin' ? '🔐' : '👤'}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Level Akses</p>
        <p className="text-sm font-bold text-slate-700 capitalize">{role}</p>
      </div>
    </div>
  ))}
</div>
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
