import { useState, useEffect } from "react";
import { Trash2, ChevronLeft, ChevronRight, Tag, Calendar } from "lucide-react";

const ExpenseTable = ({ expenses, formatRupiah, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [expenses]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = expenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden border-t-4 border-t-red-500">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Riwayat Pengeluaran</h2>
          <p className="text-xs text-slate-500">Total {expenses.length} transaksi</p>
        </div>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="md:hidden">
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada data.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentItems.map((item) => (
              <div key={item.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Calendar size={10} />
                      {new Date(item.expense_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <h4 className="font-bold text-slate-800">{item.description || "Tanpa Keterangan"}</h4>
                  </div>
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold border border-red-100 flex items-center gap-1">
                    <Tag size={10} /> {item.category}
                  </span>
                </div>

                <div className="flex justify-between items-end mt-3">
                  <p className="text-sm font-bold text-red-600">{formatRupiah(item.amount_idr)}</p>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-y border-slate-100">
              <th className="py-4 px-6">Tanggal</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Keterangan</th>
              <th className="py-4 px-6 text-right">Nominal</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 italic">
                  Belum ada data pengeluaran.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">{new Date(item.expense_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                      <Tag size={12} /> {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">{item.description}</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-800">{formatRupiah(item.amount_idr)}</td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {expenses.length > 0 && (
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

export default ExpenseTable;
