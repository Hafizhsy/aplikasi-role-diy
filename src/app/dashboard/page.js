"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

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
        {/* Tambahkan widget informasi lainnya di sini */}
      </div>
    </div>
  );
}