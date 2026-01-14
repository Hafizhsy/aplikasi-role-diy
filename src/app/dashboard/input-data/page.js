"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function InputLaporan() {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];
  const isAdmin = roles.includes("admin");
  const userWilayah = session?.user?.wilayah || "umum";
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Pelayanan Publik",
    deskripsi: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("/api/laporan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        userEmail: session?.user?.email,// Mengambil email dari session Keycloak
        wilayah: userWilayah,
      }),
    });

    if (response.ok) {
      alert("Laporan Berhasil Tersimpan di Database!");
      // Reset form atau pindah halaman
    } else {
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  // ... sisa kode tampilan form (sama seperti sebelumnya)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800">Form Laporan Kegiatan Dinas</h1>
          <p className="text-sm text-slate-500">Silakan isi detail kegiatan harian Anda di bawah ini.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Kegiatan</label>
            <input 
              type="text" 
              required
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              placeholder="Contoh: Rapat Koordinasi IT"
              onChange={(e) => setFormData({...formData, judul: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-md text-slate-800"
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              >
                <option>Pelayanan Publik</option>
                <option>Infrastruktur</option>
                <option>Kesehatan</option>
                <option>Pendidikan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal</label>
              <input 
                type="date" 
                value={formData.tanggal || ""}
                className="w-full p-2 border border-slate-300 rounded-md text-slate-800"
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Kegiatan</label>
            <textarea 
              rows="4"
              className="w-full p-2 border border-slate-300 rounded-md text-slate-800"
              placeholder="Jelaskan detail kegiatan..."
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Kirim Laporan
          </button>
          {isAdmin && (
            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <h3 className="text-sm font-bold text-amber-800 mb-2">Catatan untuk Admin:</h3>
              <p className="text-sm text-amber-700">
                Sebagai admin, Anda dapat mengakses semua laporan dari berbagai wilayah. Pastikan untuk meninjau laporan secara berkala dan memberikan umpan balik kepada operator di lapangan.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}