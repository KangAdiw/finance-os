import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import SalaryForm from "../components/SalaryForm";
import SalaryTable from "../components/SalaryTable";
import ExportButton from "../components/ExportButton"; // Import Baru

const IncomePage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ amount_usdt: "", transaction_date: "", description: "" });
  const [editId, setEditId] = useState(null);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get("https://finance-os-neon.vercel.app/salary");
      setSalaries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filteredSalaries = salaries.filter((item) => {
    const term = searchTerm.toLowerCase();
    const desc = item.description ? item.description.toLowerCase() : "";
    const usdt = item.amount_usdt.toString();
    const dateIndo = new Date(item.transaction_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }).toLowerCase();
    return desc.includes(term) || usdt.includes(term) || dateIndo.includes(term);
  });

  // --- PERSIAPAN DATA EXCEL ---
  // Kita rapikan datanya biar kolom Excel-nya bagus
  const dataToExport = filteredSalaries.map((item) => ({
    Tanggal: new Date(item.transaction_date).toLocaleDateString("id-ID"),
    Keterangan: item.description,
    "Nominal (USDT)": item.amount_usdt,
    "Rate Kurs (IDR)": item.exchange_rate,
    "Total (IDR)": item.amount_idr,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`https://finance-os-neon.vercel.app/salary/${editId}`, formData);
        alert("✅ Data Berhasil Diupdate!");
      } else {
        await axios.post("https://finance-os-neon.vercel.app/salary", formData);
        alert("✅ Data Berhasil Disimpan!");
      }
      setFormData({ amount_usdt: "", transaction_date: "", description: "" });
      setEditId(null);
      setIsModalOpen(false);
      fetchSalaries();
    } catch (error) {
      alert("❌ Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      await axios.delete(`https://finance-os-neon.vercel.app/salary/${id}`);
      fetchSalaries();
    }
  };

  const handleEditMode = (item) => {
    setEditId(item.id);
    setFormData({
      amount_usdt: item.amount_usdt,
      transaction_date: item.transaction_date.split("T")[0],
      description: item.description,
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditId(null);
    setFormData({ amount_usdt: "", transaction_date: "", description: "" });
    setIsModalOpen(true);
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tombol Action Group */}
        <div className="flex gap-2 w-full md:w-auto">
          {/* Tombol EXPORT (Hijau) */}
          <ExportButton data={dataToExport} fileName="Laporan_Gaji_USDT" sheetName="Pemasukan" />

          {/* Tombol TAMBAH (Biru) */}
          <button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm">
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>

      <SalaryTable salaries={filteredSalaries} formatRupiah={formatRupiah} handleEditMode={handleEditMode} handleDelete={handleDelete} />

      <SalaryForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading} editId={editId} />
    </div>
  );
};

export default IncomePage;
