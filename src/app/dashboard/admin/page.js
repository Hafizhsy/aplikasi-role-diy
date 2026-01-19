"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const wilayahLabels = {
  jogja: "D.I. Yogyakarta",
  manado: "Kota Manado",
  umum: "Umum / Pusat",
};

export default function ManajemenPengguna() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE UNTUK MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi saat tombol Edit diklik
  const handleEdit = (user) => {
    setSelectedUser({
      id: user.id,
      firstName: user.firstName || user.username,
      lastName: user.lastName || "",
      email: user.email,
     wilayah: user.wilayah || "umum",
    role: user.role || "operator", // Kita set default dulu, nanti diupdate lewat API
    });
    setIsModalOpen(true);
  };

  // Fungsi Simpan Perubahan
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });

      if (res.ok) {
        alert("Data User Berhasil Diperbarui!");
        setIsModalOpen(false);
        fetchUsers(); // Refresh tabel
      } else {
        alert("Gagal memperbarui data.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTambah = () => {
    alert("Membuka form tambah user baru");
  };

  if (loading) return <div className="p-6 text-slate-600 font-medium">Memuat data pegawai...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">👤 Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm">Kelola hak akses dan wilayah kerja pegawai DIY.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-200">
          + Tambah User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama & Email</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Wilayah</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
  <tr key={u.id} className="hover:bg-slate-50 transition border-b border-slate-100">
    <td className="p-4">
      <p className="text-sm font-bold text-slate-800">{u.firstName || u.username}</p>
      <p className="text-[11px] text-slate-400">{u.email}</p>
    </td>
    <td className="p-4">
      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">
        {/* Sekarang ngebaca u.wilayah yang dikirim API */}
        {u.wilayah === 'jogja' || u.wilayah === 'diy' ? 'D.I. Yogyakarta' : u.wilayah}
      </span>
    </td>
    <td className="p-4">
      {/* SEKARANG ROLE DINAMIS SESUAI KEYCLOAK */}
      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
        u.role === 'admin' 
          ? 'bg-purple-100 text-purple-700 border-purple-200' 
          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
      }`}>
        {u.role}
      </span>
    </td>
    <td className="p-4">
      <button onClick={() => handleEdit(u)} className="text-blue-600 font-bold underline">Edit Akses</button>
    </td>
  </tr>
))} 
          </tbody>
        </table>
      </div>

      {/* --- MODAL POPUP EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Update Hak Akses</h2>
              <p className="text-xs text-slate-500 mt-1">Mengedit data untuk: <span className="font-bold">{selectedUser?.email}</span></p>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Wilayah Tugas</label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                  value={selectedUser?.wilayah}
                  onChange={(e) => setSelectedUser({...selectedUser, wilayah: e.target.value})}
                >
                  <option value="jogja">D.I. Yogyakarta</option>
                  <option value="manado">Kota Manado</option>
                  <option value="umum">Umum / Pusat</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Level Pengguna</label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                  value={selectedUser?.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                >
                  <option value="operator">Operator (Input Data)</option>
                  <option value="admin">Administrator (Full Akses)</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 uppercase hover:text-slate-600">Batal</button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 text-xs font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 disabled:bg-slate-300 transition-all"
              >
                {isSaving ? "PROSES..." : "SIMPAN PERUBAHAN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}