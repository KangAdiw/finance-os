import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import ExportButton from "../components/ExportButton"; // Import Baru

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    amount_idr: "",
    category: "",
    expense_date: "",
    description: "",
  });

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    const term = searchTerm.toLowerCase();
    const cat = item.category ? item.category.toLowerCase() : "";
    const desc = item.description ? item.description.toLowerCase() : "";
    const amount = item.amount_idr.toString();
    const dateIndo = new Date(item.expense_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }).toLowerCase();

    return cat.includes(term) || desc.includes(term) || amount.includes(term) || dateIndo.includes(term);
  });

  // --- DATA EXCEL ---
  const dataToExport = filteredExpenses.map((item) => ({
    Tanggal: new Date(item.expense_date).toLocaleDateString("id-ID"),
    Kategori: item.category,
    Keterangan: item.description,
    "Nominal (IDR)": item.amount_idr,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/expenses", formData);
      alert("✅ Pengeluaran Berhasil Disimpan!");
      setFormData({ amount_idr: "", category: "", expense_date: "", description: "" });
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      alert("❌ Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus data pengeluaran ini?")) {
      await axios.delete(`http://localhost:5000/expenses/${id}`);
      fetchExpenses();
    }
  };

  const handleAddNew = () => {
    setFormData({ amount_idr: "", category: "", expense_date: "", description: "" });
    setIsModalOpen(true);
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  return (
    <div className="space-y-6">
      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Cari: Makanan, Bensin, dll..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Tombol Export Hijau */}
          <ExportButton data={dataToExport} fileName="Laporan_Pengeluaran" sheetName="Pengeluaran" />

          <button onClick={handleAddNew} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm">
            <Plus size={18} />
            Catat
          </button>
        </div>
      </div>

      <ExpenseTable expenses={filteredExpenses} formatRupiah={formatRupiah} handleDelete={handleDelete} />

      <ExpenseForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default ExpensesPage;
