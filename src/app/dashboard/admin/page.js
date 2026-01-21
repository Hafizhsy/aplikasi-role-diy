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
  // --- STATE MODAL EDIT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // --- STATE MODAL TAMBAH ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    wilayah: "jogja",
    role: "operator"
  });

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

  // --- LOGIKA EDIT ---
  const handleEdit = (user) => {
    setSelectedUser({
      ...user,
      wilayah: user.wilayah || "umum",
      role: user.role || "operator",
    });
    setIsModalOpen(true);
  };

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
        fetchUsers();
      } else {
        alert("Gagal memperbarui data.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIKA TAMBAH ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("User Baru Berhasil Ditambahkan!");
        setIsAddModalOpen(false);
        setNewUser({ username: "", email: "", firstName: "", lastName: "", password: "", wilayah: "jogja", role: "operator" });
        fetchUsers();
      } else {
        const err = await res.json();
        alert("Gagal: " + err.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userId, username) => {
  if (confirm(`Apakah Anda yakin ingin menghapus user "${username}"? Tindakan ini tidak bisa dibatalkan.`)) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("User berhasil dihapus!");
        fetchUsers(); // Refresh tabel setelah hapus
      } else {
        alert("Gagal menghapus user.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    }
  }
};

  if (loading) return <div className="p-6 text-slate-600 font-medium tracking-tight animate-pulse">Memproses data dari Keycloak...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">👤 Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm">Kelola hak akses dan wilayah kerja pegawai DIY.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
        >
          + Tambah User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nama & Email</th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Wilayah</th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <p className="text-sm font-bold text-slate-800">{u.firstName || u.username} {u.lastName || ""}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{u.email}</p>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600 uppercase border border-slate-200">
                    {wilayahLabels[u.wilayah] || u.wilayah}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {u.role}
                  </span>
                </td>
                 <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Tombol Edit */}
                    <button 
                      onClick={() => handleEdit(u)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Edit Akses"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    {/* Tombol Hapus */}
                    <button 
                      onClick={() => handleDelete(u.id, u.username)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Hapus Pengguna"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL TAMBAH USER --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Tambah Pegawai Baru</h2>
              <p className="text-xs text-slate-500">Data akan langsung terdaftar di Keycloak Server.</p>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Username</label>
                <input required className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Username login" onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Nama Depan</label>
                <input required className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Nama Belakang</label>
                <input className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Email</label>
                <input required type="email" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="contoh@jogjaprov.go.id" onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Password</label>
                <input required type="password" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Min. 6 Karakter" onChange={(e) => setNewUser({...newUser, password: e.target.value})} />             
                 </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Wilayah Tugas</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" value={newUser.wilayah} onChange={(e) => setNewUser({...newUser, wilayah: e.target.value})}>
                  <option value="jogja">Yogyakarta</option>
                  <option value="manado">Kota Manado</option>
                  <option value="umum">Umum / Pusat</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Level Akses</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="operator">Operator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="col-span-2 pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition">Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:bg-slate-300">
                  {isSaving ? "MEMPROSES..." : "DAFTARKAN PEGAWAI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT AKSES (Tetap Ada) --- */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Update Hak Akses</h2>
              <p className="text-xs text-slate-500 mt-1">Target: <span className="font-bold">{selectedUser.email}</span></p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Wilayah Tugas</label>
                <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={selectedUser.wilayah} onChange={(e) => setSelectedUser({...selectedUser, wilayah: e.target.value})}>
                  <option value="jogja">Yogyakarta</option>
                  <option value="manado">Kota Manado</option>
                  <option value="umum">Umum / Pusat</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Level Pengguna</label>
                <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={selectedUser.role} onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}>
                  <option value="operator">Operator (Input Data)</option>
                  <option value="admin">Administrator (Full Akses)</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 uppercase">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 text-xs font-black bg-blue-600 text-white rounded-lg shadow-lg disabled:bg-slate-300 transition-all uppercase tracking-widest">
                {isSaving ? "SAVING..." : "SIMPAN PERUBAHAN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}