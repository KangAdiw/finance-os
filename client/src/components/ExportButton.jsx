import * as XLSX from "xlsx";
import { Download } from "lucide-react";

const ExportButton = ({ data, fileName, sheetName }) => {
  const handleExport = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    // 1. Buat Worksheet (Lembar Kerja Excel) dari Data JSON
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Buat Workbook (Buku Excel) baru
    const workbook = XLSX.utils.book_new();

    // 3. Masukkan Worksheet ke dalam Workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Download file Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm" title="Download Laporan Excel">
      <Download size={18} />
      Export Excel
    </button>
  );
};

export default ExportButton;
