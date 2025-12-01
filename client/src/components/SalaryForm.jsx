import { DollarSign, Save, X, Calendar, FileText } from "lucide-react";

const SalaryForm = ({ isOpen, onClose, formData, setFormData, handleSubmit, loading, editId }) => {
  // Jika modal tidak "open", jangan tampilkan apa-apa (null)
  if (!isOpen) return null;

  return (
    // 1. Overlay Hitam Transparan (Background Dim)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
      {/* 2. Kotak Modal Putih */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ring-1 ring-slate-900/5">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">{editId ? "✏️ Edit Transaksi" : "✨ Tambah Pemasukan"}</h2>
          <button onClick={onClose} className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm border border-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Input Nominal */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah (USDT)</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                step="0.01"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                placeholder="0.00"
                value={formData.amount_usdt}
                onChange={(e) => setFormData({ ...formData, amount_usdt: e.target.value })}
              />
            </div>
          </div>

          {/* Input Tanggal */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Transaksi</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Calendar size={20} />
              </div>
              <input
                type="date"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              />
            </div>
          </div>

          {/* Input Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan / Sumber</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <FileText size={20} />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                placeholder="Contoh: Gaji Project A"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Tombol */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2 font-bold text-sm ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {loading ? (
                "Sedang Memproses..."
              ) : (
                <>
                  <Save size={18} />
                  {editId ? "Simpan Perubahan" : "Simpan Transaksi"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryForm;
