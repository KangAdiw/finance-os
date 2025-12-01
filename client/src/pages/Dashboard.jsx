import { useState, useEffect } from "react";
import axios from "axios";
import SummaryCards from "../components/SummaryCards";
import SalaryChart from "../components/SalaryChart";

const Dashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [targetAmount, setTargetAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("finance_token");

        const [salaryRes, expenseRes, userRes] = await Promise.all([
          axios.get("https://finance-os-neon.vercel.app/salary"),
          axios.get("https://finance-os-neon.vercel.app/expenses"),
          axios
            .get("https://finance-os-neon.vercel.app/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: { target_amount: 0 } })),
        ]);

        setSalaries(salaryRes.data);
        setExpenses(expenseRes.data);

        const dbTarget = Number(userRes.data?.target_amount);
        const localTarget = Number(localStorage.getItem("finance_target"));
        setTargetAmount(dbTarget > 0 ? dbTarget : localTarget > 0 ? localTarget : 10000000);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  const totalUsdt = salaries.reduce((acc, curr) => acc + Number(curr.amount_usdt), 0);
  const totalIncomeIdr = salaries.reduce((acc, curr) => acc + Number(curr.amount_idr), 0);
  const totalExpenseIdr = expenses.reduce((acc, curr) => acc + Number(curr.amount_idr), 0);
  const netBalance = totalIncomeIdr - totalExpenseIdr;

  // --- PERBAIKAN UTAMA DI SINI ---
  const processChartData = () => {
    // Helper: Pastikan tanggal jadi format YYYY-MM-DD string yang aman
    const getDateString = (dateInput) => {
      if (!dateInput) return null;
      try {
        const d = new Date(dateInput);
        // Mengubah ke ISO String (2025-12-01T...) lalu ambil depannya
        return d.toISOString().split("T")[0];
      } catch (e) {
        return null;
      }
    };

    // 1. Ambil semua tanggal unik
    const salaryDates = salaries.map((s) => getDateString(s.transaction_date)).filter((d) => d);
    const expenseDates = expenses.map((e) => getDateString(e.expense_date)).filter((d) => d);

    // Gabungkan dan urutkan tanggal
    const allDates = [...new Set([...salaryDates, ...expenseDates])].sort();

    // 2. Mapping data
    return allDates.map((dateStr) => {
      // Hitung total income di tanggal ini
      const income = salaries.filter((s) => getDateString(s.transaction_date) === dateStr).reduce((sum, item) => sum + Number(item.amount_idr), 0);

      // Hitung total expense di tanggal ini
      const expense = expenses.filter((e) => getDateString(e.expense_date) === dateStr).reduce((sum, item) => sum + Number(item.amount_idr), 0);

      return {
        // Format Tampilan: "1 Des"
        date: new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        income,
        expense,
      };
    });
  };

  const chartData = processChartData();

  if (loading) return <div className="p-8 text-center text-slate-500">Menyiapkan Dashboard...</div>;

  return (
    <div className="space-y-6">
      <SummaryCards totalUsdt={totalUsdt} totalIdr={totalIncomeIdr} totalExpense={totalExpenseIdr} balance={netBalance} formatRupiah={formatRupiah} targetAmount={targetAmount} />

      {/* Pastikan chartData dikirim ke sini */}
      <SalaryChart data={chartData} formatRupiah={formatRupiah} />
    </div>
  );
};

export default Dashboard;
