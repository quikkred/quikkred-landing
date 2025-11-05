"use client";

import { motion } from "framer-motion";
import { Download, RefreshCw, Filter, Search, Calendar } from "lucide-react";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onRefresh?: () => void;
  onExport?: () => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  showDateRange?: boolean;
  showFilter?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  customActions?: React.ReactNode;
  isLoading?: boolean;
}

const PageHeader = ({
  title,
  description,
  icon: Icon,
  onRefresh,
  onExport,
  onSearch,
  showSearch = true,
  showDateRange = false,
  showFilter = true,
  showExport = true,
  showRefresh = true,
  customActions,
  isLoading = false
}: PageHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
            {description && (
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {showRefresh && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          )}

          {showExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </motion.button>
          )}

          {customActions}
        </div>
      </div>

      {/* Search and Filters Bar */}
      {(showSearch || showDateRange || showFilter) && (
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Date Range */}
          {showDateRange && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                className="bg-transparent text-slate-300 text-sm border-none outline-none"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                className="bg-transparent text-slate-300 text-sm border-none outline-none"
              />
            </div>
          )}

          {/* Filter Toggle */}
          {showFilter && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;