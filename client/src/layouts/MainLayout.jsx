import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, TrendingDown, Settings, Menu, X, LogOut } from "lucide-react";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin User");

  useEffect(() => {
    const savedName = localStorage.getItem("finance_name");
    if (savedName) setProfileName(savedName);

    setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar dari aplikasi?")) {
      localStorage.removeItem("finance_token");
      localStorage.removeItem("finance_name");
      navigate("/login");
    }
  };

  const menus = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Pemasukan", path: "/income", icon: <Wallet size={20} /> },
    { name: "Pengeluaran", path: "/expenses", icon: <TrendingDown size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* --- 1. MOBILE OVERLAY (Perbaikan: z-[90] agar di atas Header) --- */}
      {isSidebarOpen && <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* --- 2. SIDEBAR (Perbaikan: z-[100] agar PASTI PALING ATAS) --- */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white z-[100] shadow-2xl transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800">
          <div className="flex items-center gap-3 font-bold text-xl tracking-wide">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-xl">F</span>
            </div>
            Finance<span className="text-blue-500">OS</span>
          </div>
          {/* Tombol Close (Sekarang aman karena z-index sidebar paling tinggi) */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white bg-slate-800 p-1 rounded-md">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Main Menu</div>
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.name}
                to={menu.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1" : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400 transition-colors"}>{menu.icon}</span>
                {menu.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <Link to="/settings" className="flex items-center gap-3 px-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm group-hover:ring-2 ring-white transition-all">{profileName.charAt(0)}</div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate w-32">{profileName}</p>
              <p className="text-xs text-slate-500">Klik untuk edit</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* --- 3. MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        {/* HEADER (Perbaikan: z-40 agar di atas konten tapi DI BAWAH menu mobile) */}
        <header className="h-20 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between bg-slate-100/80 backdrop-blur-md border-b border-slate-200/50">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 capitalize truncate max-w-[200px] md:max-w-none">{location.pathname === "/" ? "Dashboard" : location.pathname.replace("/", "")}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/settings" className="p-2 bg-white rounded-full text-slate-500 hover:text-blue-600 shadow-sm border border-slate-200 transition-colors" title="Pengaturan">
              <Settings size={20} />
            </Link>

            <button onClick={handleLogout} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm border border-slate-200 transition-colors" title="Keluar Aplikasi">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
