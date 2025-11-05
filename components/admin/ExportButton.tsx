"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  data?: any[];
  filename?: string;
  showDropdown?: boolean;
}

const ExportButton = ({
  onExportCSV,
  onExportExcel,
  onExportPDF,
  data = [],
  filename = "export",
  showDropdown = true
}: ExportButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExportCSV = () => {
    if (onExportCSV) {
      onExportCSV();
    } else if (data.length > 0) {
      // Default CSV export
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    setShowMenu(false);
  };

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    }
    setShowMenu(false);
  };

  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    }
    setShowMenu(false);
  };

  if (!showDropdown) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExportCSV}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Export</span>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Export</span>
      </motion.button>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full mt-2 w-48 glass rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50"
        >
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-slate-200"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Export as CSV</span>
          </button>
          {onExportExcel && (
            <button
              onClick={handleExportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-slate-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-sm">Export as Excel</span>
            </button>
          )}
          {onExportPDF && (
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-slate-200"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Export as PDF</span>
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ExportButton;