import { PrismaClient } from "@prisma/client";
import TabelCetak from "@/components/TabelCetak";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

async function getLaporan() {
  return await prisma.laporan.findMany({
    orderBy: {
      tanggal: 'desc'
    }
  });
}

export default async function RekapLaporanPage() {
  const dataLaporan = await getLaporan();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-800">Rekap Laporan Kegiatan</h1>
        <p className="text-sm text-slate-500">Daftar seluruh aktivitas yang telah diinput ke dalam sistem.</p>
      </div>

      {/* Cukup panggil ini, semua urusan tabel & tombol ada di dalemnya */}
      <TabelCetak dataLaporan={dataLaporan} />
    </div>
  );
}
