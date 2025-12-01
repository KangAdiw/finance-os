import { DollarSign, Save, X, Calendar, FileText, Tag } from "lucide-react";

const ExpenseForm = ({ isOpen, onClose, formData, setFormData, handleSubmit, loading }) => {
  if (!isOpen) return null;

  const categories = ["Makanan", "Transportasi", "Tempat Tinggal", "Hiburan", "Kesehatan", "Tagihan", "Lainnya"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">💸 Catat Pengeluaran</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nominal */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nominal (IDR)</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <DollarSign size={18} />
              </div>
              <input
                type="number"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                placeholder="Contoh: 25000"
                value={formData.amount_idr}
                onChange={(e) => setFormData({ ...formData, amount_idr: e.target.value })}
              />
            </div>
          </div>

          {/* Kategori (Dropdown) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag size={18} />
              </div>
              <select
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="" disabled>
                  Pilih Kategori
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FileText size={18} />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                placeholder="Contoh: Nasi Padang"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex justify-center items-center gap-2 mt-2">
            {loading ? (
              "Menyimpan..."
            ) : (
              <>
                <Save size={18} /> Simpan Pengeluaran
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
