import { useState, useEffect } from "react";
import { History, Edit2, Trash2, ChevronLeft, ChevronRight, Calendar, DollarSign } from "lucide-react";

const SalaryTable = ({ salaries, formatRupiah, handleEditMode, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [salaries]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salaries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salaries.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">Riwayat Gaji</h2>
          <p className="text-xs text-slate-500 mt-1">Total {salaries.length} transaksi</p>
        </div>
      </div>

      {/* --- TAMPILAN MOBILE (CARD LIST) - Muncul hanya di HP (md:hidden) --- */}
      <div className="md:hidden">
        {salaries.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada data.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentItems.map((item) => (
              <div key={item.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Calendar size={10} />
                      {new Date(item.transaction_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <h4 className="font-bold text-slate-800">{item.description || "Tanpa Keterangan"}</h4>
                  </div>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-100">${item.amount_usdt}</span>
                </div>

                <div className="flex justify-between items-end mt-3">
                  <div>
                    <p className="text-xs text-slate-400">Rate: {Number(item.exchange_rate).toLocaleString("id-ID")}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">{formatRupiah(item.amount_idr)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditMode(item)} className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- TAMPILAN DESKTOP (TABLE) - Muncul hanya di Laptop (hidden md:block) --- */}
      <div className="hidden md:block overflow-x-auto">
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
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{new Date(item.transaction_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{item.description || "-"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-sm border border-emerald-100">${item.amount_usdt}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">Rp {Number(item.exchange_rate).toLocaleString("id-ID")}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-bold text-slate-800">{formatRupiah(item.amount_idr)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditMode(item)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

      {/* Pagination Footer (Muncul di kedua tampilan) */}
      {salaries.length > 0 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Hal. <b>{currentPage}</b> dari {totalPages}
          </div>
          <div className="flex gap-2">
            <button onClick={prevPage} disabled={currentPage === 1} className="p-2 bg-white border rounded hover:bg-slate-50 disabled:opacity-50 shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextPage} disabled={currentPage === totalPages} className="p-2 bg-white border rounded hover:bg-slate-50 disabled:opacity-50 shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;
