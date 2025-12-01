import { DollarSign, Wallet, TrendingUp, TrendingDown, Target, PiggyBank } from "lucide-react";

const SummaryCards = ({ totalUsdt, totalIdr, totalExpense, balance, formatRupiah, targetAmount }) => {
  // Hitung Persentase Target (dari Saldo Bersih, bukan Pemasukan Kotor)
  // Karena tabungan itu diambil dari Sisa Uang, bukan Gaji Kotor.
  const percentage = targetAmount > 0 ? (balance / targetAmount) * 100 : 0;
  const displayPercentage = Math.min(Math.max(percentage, 0), 100); // Batasi 0-100%

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-0">
      {/* CARD 1: PEMASUKAN (Income) */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg overflow-hidden group">
        <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform">
          <Wallet size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-blue-100">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <TrendingUp size={16} />
            </div>
            <span className="text-sm font-medium">Total Pemasukan</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{formatRupiah(totalIdr)}</h3>
          <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
            <DollarSign size={10} /> {totalUsdt.toLocaleString("en-US")} USDT
          </p>
        </div>
      </div>

      {/* CARD 2: PENGELUARAN (Expense) - MERAH */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg overflow-hidden group">
        <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform">
          <TrendingDown size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-red-100">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <TrendingDown size={16} />
            </div>
            <span className="text-sm font-medium">Total Pengeluaran</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{formatRupiah(totalExpense)}</h3>
          <p className="text-xs text-red-100 mt-1 opacity-80">Belanja & Tagihan</p>
        </div>
      </div>

      {/* CARD 3: SISA SALDO (Balance) - HIJAU/ABU */}
      <div className={`relative p-6 rounded-2xl text-white shadow-lg overflow-hidden group ${balance >= 0 ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-slate-600 to-slate-700"}`}>
        <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform">
          <PiggyBank size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-emerald-100">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Wallet size={16} />
            </div>
            <span className="text-sm font-medium">Sisa Saldo Bersih</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{formatRupiah(balance)}</h3>
          <p className="text-xs text-emerald-100 mt-1 opacity-80">{balance >= 0 ? "Aman untuk ditabung" : "Warning: Defisit!"}</p>
        </div>
      </div>

      {/* CARD 4: TARGET (Putih) */}
      <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Progress Target</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{percentage.toFixed(1)}%</h4>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Target size={20} />
          </div>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${percentage >= 100 ? "bg-emerald-500" : "bg-blue-600"}`} style={{ width: `${displayPercentage}%` }}></div>
        </div>

        <p className="text-xs text-slate-400">
          Target: <span className="font-semibold text-slate-600">{formatRupiah(targetAmount)}</span>
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
