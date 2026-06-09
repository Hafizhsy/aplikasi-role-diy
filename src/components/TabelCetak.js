"use client";

export default function TabelCetak({ dataLaporan }) {
  const handlePrint = () => {
    // 1. Tambah class ke body buat trigger mode cetak
    document.body.classList.add("printing-mode");
    // 2. Panggil print browser
    window.print();
    // 3. Hapus lagi biar tampilan web balik normal
    document.body.classList.remove("printing-mode");
  };

  return (
    <>
      <div className="flex justify-end mb-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          CETAK PDF
        </button>
      </div>

      {/* Bungkus area yang mau dicetak dengan ID khusus */}
      <div id="rekap-tabel" className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm printable-content">
        {/* Header yang cuma muncul pas diprint */}
        <div className="hidden print-header text-center mb-8 border-b-4 border-double border-black pb-4">
          <h1 className="text-xl font-bold uppercase">Pemerintah Daerah Daerah Istimewa Yogyakarta</h1>
          <h2 className="text-lg font-bold uppercase">Rekapitulasi Laporan Aktivitas Harian</h2>
        </div>

        <table className="w-full border-collapse border border-slate-300">
          <thead className="bg-slate-50">
            <tr>
              <th className="border p-3 text-left text-xs text-slate-800 font-bold uppercase">Tanggal</th>
              <th className="border p-3 text-left text-xs text-slate-800 font-bold uppercase">Judul</th>
              <th className="border p-3 text-left text-xs text-slate-800 font-bold uppercase">Kategori</th>
              <th className="border p-3 text-left text-xs text-slate-800 font-bold uppercase">Pengirim</th>
            </tr>
          </thead>
          <tbody>
            {dataLaporan.map((item) => (
              <tr key={item.id}>
                <td className="border p-3 text-xs text-slate-800">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                <td className="border p-3 text-xs text-slate-800">{item.judul}</td>
                <td className="border p-3 text-xs text-slate-800">{item.kategori}</td>
                <td className="border p-3 text-xs text-slate-800">{item.userEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS Langsung di dalam tag style biar gak ilang */}
      <style>{`
        @media print {
          /* Sembunyikan semuanya tanpa kecuali */
          body * {
            visibility: hidden !important;
            margin: 0;
          }
          /* Tampilkan cuma area tabel */
          #rekap-tabel, #rekap-tabel * {
            visibility: visible !important;
          }
          /* Paksa posisi area tabel ke pojok kiri atas kertas */
          #rekap-tabel {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Munculkan header yang tadinya hidden */
          .print-header {
            display: block !important;
          }
          /* Hilangkan tombol cetak dari PDF */
          .print\:hidden {
            display: none !important;
          }
          /* Atur margin kertas */
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </>
  );
}