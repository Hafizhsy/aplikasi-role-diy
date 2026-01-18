// src/app/dashboard/jogja/page.js
import Link from "next/link";

export default function LayananDIYPage() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Portal Layanan Terpadu DIY</h1>
          <p className="text-gray-500">Manajemen data khusus wilayah kerja Yogyakarta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-dashed border-gray-300 rounded-lg hover:bg-blue-50 transition cursor-pointer">
          <h4 className="font-bold text-blue-900">Input Laporan Harian DIY</h4>
          <p className="text-sm text-gray-600 mt-1">Khusus pendataan statistik wilayah Yogyakarta.</p>
        </div>
        
        <div className="p-4 border border-dashed border-gray-300 rounded-lg hover:bg-blue-50 transition cursor-pointer">
          <h4 className="font-bold text-blue-900">Database Pegawai DIY</h4>
          <p className="text-sm text-gray-600 mt-1">Akses daftar personel di lingkungan Pemda DIY.</p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Kembali ke Dashboard Utama
        </Link>
      </div>
    </div>
  );
}