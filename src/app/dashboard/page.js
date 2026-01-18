"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  // Ambil data wilayah dari session yang sudah kita update di route.js
  const wilayah = session?.user?.wilayah;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, {session?.user?.name}</h1>
      <p className="text-gray-600">Sistem Informasi Manajemen Terpadu DIY</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Role Saat Ini</h3>
          <p className="text-2xl font-bold text-blue-900 mt-1 capitalize">
            {session?.user?.roles?.[0] || "User"}
          </p>
        </div>

        {/* Widget Tambahan untuk cek Wilayah */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Wilayah Kerja</h3>
          <p className="text-2xl font-bold text-green-700 mt-1 capitalize">
            {wilayah || "Umum"}
          </p>
        </div>

        {/* LOGIKA JOGJA: Munculkan widget biru hanya jika user wilayahnya jogja */}
        {wilayah === "Yogyakarta" && (
          <div className="bg-blue-900 p-6 rounded-lg shadow-md border border-blue-800 text-white">
            <h3 className="text-blue-200 text-sm font-medium uppercase">Akses Khusus DIY</h3>
            <p className="text-lg font-semibold mt-2">
              Anda memiliki izin akses layanan lokal Yogyakarta.
            </p>

            <Link href="/dashboard/layanan">
            <button className="mt-3 bg-white text-blue-900 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-100 transition inline-block">
              Buka Layanan DIY
            </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}