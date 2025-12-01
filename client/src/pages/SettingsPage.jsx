import { useState, useEffect } from "react";
import { Save, User, Target, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Kita butuh axios

const SettingsPage = () => {
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ambil Token dari penyimpanan
  const token = localStorage.getItem("finance_token");

  // 1. Ambil data asli dari Database saat halaman dibuka
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }, // Kirim token ke backend
        });
        setProfileName(response.data.name);
        setTargetAmount(response.data.target_amount);
      } catch (error) {
        console.error("Gagal mengambil data user", error);
        if (error.response?.status === 401) navigate("/login"); // Kalau token expired, suruh login lagi
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [token, navigate]);

  // 2. Simpan ke Database
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaved(false);

    try {
      await axios.put("http://localhost:5000/auth/update", { name: profileName, target_amount: targetAmount }, { headers: { Authorization: `Bearer ${token}` } });

      // Update juga nama di localStorage biar Sidebar langsung berubah (opsional, biar cepet)
      localStorage.setItem("finance_name", profileName);

      setIsSaved(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      alert("Gagal menyimpan perubahan.");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data profil...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate("/")} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Edit Profil & Target (Database)</h3>
          <p className="text-sm text-slate-500">Data ini tersimpan aman di server, bukan di browser.</p>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Nama Profil
              </label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Target size={18} className="text-emerald-600" /> Target (IDR)
              </label>
              <input type="number" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
            <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
              <Save size={18} /> {isSaved ? "Tersimpan!" : "Simpan ke Database"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
