import { useState, useEffect } from "react";
import { Trash2, ChevronLeft, ChevronRight, Tag } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden border-t-4 border-t-red-500">
      <div className="p-6 bg-gradient-to-r from-white to-slate-50 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Pengeluaran</h2>
        <p className="text-xs text-slate-500">Daftar belanja dan tagihan yang tercatat.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
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
                  Belum ada pengeluaran. Hemat pangkal kaya!
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
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {expenses.length > 0 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Hal. <b>{currentPage}</b> dari {totalPages}
          </div>
          <div className="flex gap-2">
            <button onClick={prevPage} disabled={currentPage === 1} className="p-2 bg-white border rounded hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextPage} disabled={currentPage === totalPages} className="p-2 bg-white border rounded hover:bg-slate-50 disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
