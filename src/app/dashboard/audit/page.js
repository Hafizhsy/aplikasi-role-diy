"use client";
import { useSession } from "next-auth/react";

export default function AuditPage() {
  const { data: session } = useSession();

  // Contoh data dummy (nanti bisa diambil dari database/API Log)
  const auditLogs = [
    { id: 1, user: "User1 Jogja", action: "Login Sistem", wilayah: "jogja", time: "2024-05-20 08:30" },
    { id: 2, user: "User2 Manado", action: "Akses Rekap", wilayah: "manado", time: "2024-05-20 09:15" },
    { id: 3, user: "User1 Jogja", action: "Buka Layanan DIY", wilayah: "jogja", time: "2024-05-20 10:00" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">🛡️ Audit Log Sistem</h1>
        <p className="text-slate-500 text-sm">Pemantauan aktivitas pengguna berdasarkan wilayah kerja.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Pengguna</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Aktivitas</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Wilayah</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition">
                <td className="p-4 text-sm font-medium text-slate-700">{log.user}</td>
                <td className="p-4 text-sm text-slate-600">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 capitalize">{log.wilayah}</td>
                <td className="p-4 text-sm text-slate-500">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}