import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import IncomePage from "./pages/IncomePage";
import ExpensesPage from "./pages/ExpensesPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage"; // Import Halaman Login

// KOMPONEN SATPAM (Protected Route)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("finance_token");
  // Kalau gak ada token, paksa pindah ke halaman /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Kalau ada token, silakan masuk
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login (Bebas Akses) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route Utama (Diproteksi oleh Satpam) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
