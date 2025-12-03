import { DollarSign, Wallet, TrendingDown, TrendingUp, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";

const SummaryCards = ({ totalUsdt, totalIdr, totalExpense, balance, formatRupiah, targetAmount }) => {
  const percentage = targetAmount > 0 ? (balance / targetAmount) * 100 : 0;
  const displayPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="mb-8 relative z-0">
      {/* --- MASTER WALLET CARD --- */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 text-white">
        {/* Dekorasi Background (Lingkaran samar) */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>

        <div className="relative z-10 p-6 md:p-8">
          {/* BAGIAN ATAS: SALDO UTAMA */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <span className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-2 flex items-center gap-2">
              <Wallet size={16} /> Total Saldo Bersih
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">{formatRupiah(balance)}</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${balance >= 0 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}>
              {balance >= 0 ? "Keuangan Sehat 🚀" : "Warning: Defisit ⚠️"}
            </div>
          </div>

          {/* BAGIAN TENGAH: INCOME vs EXPENSE (Grid 2 Kolom) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Income */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                  <ArrowUpRight size={16} />
                </div>
                <span className="text-xs font-bold uppercase">Pemasukan</span>
              </div>
              <p className="text-lg md:text-xl font-bold">{formatRupiah(totalIdr)}</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <DollarSign size={10} /> {totalUsdt.toLocaleString("en-US")} USDT
              </p>
            </div>

            {/* Expense */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-rose-400 mb-1">
                <div className="p-1.5 bg-rose-500/20 rounded-lg">
                  <ArrowDownRight size={16} />
                </div>
                <span className="text-xs font-bold uppercase">Pengeluaran</span>
              </div>
              <p className="text-lg md:text-xl font-bold">{formatRupiah(totalExpense)}</p>
              <p className="text-[10px] text-slate-400 mt-1">Terpakai bulan ini</p>
            </div>
          </div>

          {/* BAGIAN BAWAH: TARGET PROGRESS */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Target Tabungan</p>
                <p className="text-sm font-semibold text-white">{formatRupiah(targetAmount)}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-400">{percentage.toFixed(0)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)] ${percentage >= 100 ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${displayPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
