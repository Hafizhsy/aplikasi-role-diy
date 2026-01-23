"use client";
import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  History, 
  Search, 
  User, 
  Clock, 
  MapPin, 
  Activity,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.aktivitas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-slate-500 animate-pulse font-medium italic">Menyinkronkan riwayat aktivitas...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="text-blue-600" /> Audit Log Sistem
          </h1>
          <p className="text-sm text-slate-500 mt-1">Pemantauan aktivitas pengguna secara real-time.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Cari pengguna atau aktivitas..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Aktivitas</p>
            <p className="text-xl font-bold text-slate-700">{logs.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Status Aman</p>
            <p className="text-xl font-bold text-slate-700">{logs.filter(l => l.status === 'success').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Log Kendala</p>
            <p className="text-xl font-bold text-slate-700">{logs.filter(l => l.status === 'error').length}</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Aktivitas</th>
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Wilayah</th>
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Waktu Kejadian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 leading-tight">{log.username}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{log.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {/* Logika Warna Badge Dinamis */}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit border ${
                        log.status === 'success' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {log.aktivitas}
                      </span>
                      <p className="text-[11px] text-slate-400 italic font-medium">{log.detail}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-slate-600 border border-slate-200 shadow-sm">
                      <MapPin size={12} className="text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{log.wilayah}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={14} className="text-slate-400" />
                      <div className="flex flex-col leading-none">
                        <span className="text-xs font-bold text-slate-600">{new Date(log.waktu).toLocaleDateString('id-ID')}</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(log.waktu).toLocaleTimeString('id-ID')} WIB</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-3">
               <ShieldAlert className="text-slate-200" size={48} />
               <p className="text-slate-400 font-medium">Tidak ada riwayat aktivitas yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}