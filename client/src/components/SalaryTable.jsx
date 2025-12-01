import { useState, useEffect } from "react";
import { History, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const SalaryTable = ({ salaries, formatRupiah, handleEditMode, handleDelete }) => {
  // --- KONFIGURASI PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Menampilkan 5 data per halaman

  // Reset ke halaman 1 jika data berubah (misal saat melakukan pencarian)
  useEffect(() => {
    setCurrentPage(1);
  }, [salaries]);

  // Hitung data yang harus ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salaries.slice(indexOfFirstItem, indexOfLastItem);

  // Hitung total halaman
  const totalPages = Math.ceil(salaries.length / itemsPerPage);

  // Fungsi Pindah Halaman
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden border-t-4 border-t-blue-600">
      {/* Header Tabel */}
      <div className="p-6 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">Riwayat Transaksi</h2>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, salaries.length)} dari total {salaries.length} data
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-y border-slate-100">
              <th className="py-4 px-6">Tanggal & Keterangan</th>
              <th className="py-4 px-6">Nominal (USDT)</th>
              <th className="py-4 px-6">Rate IDR</th>
              <th className="py-4 px-6 text-right">Total (IDR)</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salaries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 italic">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{new Date(item.transaction_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{item.description || "-"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-sm">${item.amount_usdt}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">Rp {Number(item.exchange_rate).toLocaleString("id-ID")}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-bold text-slate-800">{formatRupiah(item.amount_idr)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditMode(item)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION (Hanya muncul jika data lebih dari 0) */}
      {salaries.length > 0 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Halaman <span className="font-bold text-slate-700">{currentPage}</span> dari {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-all ${
                currentPage === 1 ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed" : "bg-white text-slate-600 border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition-all ${
                currentPage === totalPages ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed" : "bg-white text-slate-600 border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;
