"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
      wilayah: user.attributes?.wilayah?.[0] || "umum",
      role: "operator", // Kita set default dulu, nanti diupdate lewat API
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
          <h1 className="text-2xl font-bold text-slate-800">👤 Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm">Kelola hak akses dan wilayah kerja pegawai secara real-time.</p>
        </div>
        <button 
          onClick={handleTambah}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
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
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-800">{u.firstName || u.username} {u.lastName || ""}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600 capitalize">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold text-slate-600">
                      {u.attributes?.wilayah?.[0] || "Umum"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleEdit(u)} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline decoration-2 underline-offset-4"
                    >
                      Edit Akses
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="p-4 text-center text-slate-500">Tidak ada data user ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL POPUP EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Update Hak Akses</h2>
              <p className="text-xs text-slate-500 mt-1">{selectedUser?.email}</p>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Dropdown Wilayah */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Wilayah Tugas</label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={selectedUser?.wilayah}
                  onChange={(e) => setSelectedUser({...selectedUser, wilayah: e.target.value})}
                >
                  <option value="jogja">D.I. Yogyakarta</option>
                  <option value="manado">Kota Manado</option>
                  <option value="umum">Umum / Pusat</option>
                </select>
              </div>

              {/* Dropdown Role */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Level Pengguna</label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={selectedUser?.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                >
                  <option value="operator">Operator (Input Data)</option>
                  <option value="admin">Administrator (Full Akses)</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none transition-all"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}