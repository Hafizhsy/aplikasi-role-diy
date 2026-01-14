"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ManajemenPengguna() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk ambil data dari API yang kita buat tadi
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Gagal load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    alert("Membuka form edit untuk ID: " + userId);
    // Di sini nanti kita buatkan Modal/Popup Edit
  };

  const handleTambah = () => {
    alert("Membuka form tambah user baru");
  };

  if (loading) return <div className="p-6">Memuat data pegawai...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">👤 Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm">Kelola hak akses dan wilayah kerja pegawai secara real-time.</p>
        </div>
        <button 
          onClick={handleTambah}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          + Tambah User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Nama & Email</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Wilayah</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
  {loading ? (
    <tr><td colSpan="3" className="p-4 text-center">Sedang memuat data...</td></tr>
  ) : users.length > 0 ? (
    users.map((u) => (
      <tr key={u.id} className="hover:bg-slate-50 transition">
        <td className="p-4">
          <p className="text-sm font-medium text-slate-800">{u.firstName || u.username} {u.lastName || ""}</p>
          <p className="text-xs text-slate-500">{u.email}</p>
        </td>
        <td className="p-4 text-sm text-slate-600 capitalize">
          {u.attributes?.wilayah?.[0] || "Umum"}
        </td>
        <td className="p-4">
          <button onClick={() => handleEdit(u.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Edit
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr><td colSpan="3" className="p-4 text-center">Tidak ada data user ditemukan.</td></tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}