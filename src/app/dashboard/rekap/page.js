import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getLaporan() {
  // Mengambil semua data laporan dari database, urutkan dari yang terbaru
  return await prisma.laporan.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function RekapLaporan() {
  const dataLaporan = await getLaporan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Rekap Laporan Kegiatan</h1>
        <p className="text-sm text-slate-500">Daftar seluruh aktivitas yang telah diinput ke dalam sistem.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Judul</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kategori</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pengirim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dataLaporan.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm text-slate-600">
                  {new Date(item.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>
                <td className="p-4 text-sm font-medium text-slate-800">{item.judul}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase">
                    {item.kategori}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{item.userEmail}</td>
              </tr>
            ))}
            {dataLaporan.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400 italic">Belum ada data laporan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}