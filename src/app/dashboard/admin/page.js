export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500">Kelola akses dan otoritas akun di lingkungan Pemerintah DIY.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Tambah Pengguna
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase">Total User</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">1,284</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase">User Aktif</p>
          <p className="text-3xl font-bold text-green-600 mt-2">1,120</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase">Admin</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
      </div>

      {/* Placeholder Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700">Daftar Akun Terbaru</h3>
        </div>
        <div className="p-8 text-center text-slate-400 italic">
          Data sedang dimuat dari server Keycloak...
        </div>
      </div>
    </div>
  );
}