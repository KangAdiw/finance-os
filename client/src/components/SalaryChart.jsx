import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SalaryChart = ({ data, formatRupiah }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
      {/* Header Grafik */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Analisis Arus Kas</h2>
          <p className="text-sm text-slate-500">Perbandingan Pemasukan vs Pengeluaran Harian</p>
        </div>

        {/* Legend Custom (Penunjuk Warna) */}
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div> Pemasukan
          </div>
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Pengeluaran
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {/* Gradasi Biru (Income) */}
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              {/* Gradasi Merah (Expense) */}
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />

            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} width={40} />

            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} formatter={(value, name) => [formatRupiah(value), name === "income" ? "Pemasukan" : "Pengeluaran"]} />

            {/* Area Pemasukan (Biru) */}
            <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />

            {/* Area Pengeluaran (Merah) */}
            <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalaryChart;
