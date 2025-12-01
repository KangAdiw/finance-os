import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle Login/Register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isLoginMode ? "https://finance-os-neon.vercel.app/auth/login" : "https://finance-os-neon.vercel.app/auth/register";

    try {
      const response = await axios.post(url, formData);

      if (isLoginMode) {
        // LOGIN SUKSES:
        // 1. Simpan Token & User info ke LocalStorage
        localStorage.setItem("finance_token", response.data.token);
        localStorage.setItem("finance_name", response.data.user.name);

        // 2. Pindah ke Dashboard
        alert("Login Berhasil! 🚀");
        navigate("/");
      } else {
        // REGISTER SUKSES:
        alert("Registrasi Berhasil! Silakan Login.");
        setIsLoginMode(true); // Pindah ke mode login
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Gambar/Warna */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">FinanceOS</h2>
          <p className="text-blue-100 text-sm mt-1">Kelola keuanganmu dengan aman.</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">{isLoginMode ? "Selamat Datang Kembali!" : "Buat Akun Baru"}</h3>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama (Cuma muncul pas Register) */}
            {!isLoginMode && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4">
              {loading ? "Memproses..." : isLoginMode ? "Masuk Sekarang" : "Daftar Akun"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              {isLoginMode ? "Daftar di sini" : "Login di sini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
