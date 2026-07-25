import React from 'react';
import { Filter, Search, Building2, Layers, AlertCircle, RotateCcw } from 'lucide-react';
import { Branch, Category, FilterState, BranchId, CategoryId } from '../types';

interface FilterBarProps {
  branches: Branch[];
  categories: Category[];
  filters: FilterState;
  lowStockCount: number;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  branches,
  categories,
  filters,
  lowStockCount,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 py-2 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left side: Branch and Category selectors */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>ตัวกรอง:</span>
          </div>

          {/* Branch Dropdown */}
          <div className="relative">
            <select
              value={filters.branchId}
              onChange={(e) => onFilterChange({ branchId: e.target.value as BranchId })}
              className="appearance-none bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium rounded-lg border border-slate-700 pl-7 pr-6 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">ทุกสาขา</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name.replace('สาขา', '').split(' (')[0].trim()}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filters.categoryId}
              onChange={(e) => onFilterChange({ categoryId: e.target.value as CategoryId })}
              className="appearance-none bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium rounded-lg border border-slate-700 pl-7 pr-6 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">ทุกประเภทสินค้า</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Low Stock Toggle Button */}
          <button
            onClick={() => onFilterChange({ lowStockOnly: !filters.lowStockOnly })}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filters.lowStockOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700/80 text-slate-300 border-slate-700'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${filters.lowStockOnly ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>เตือนสินค้าใกล้หมด</span>
            {lowStockCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 text-[10px] rounded-full">
                {lowStockCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side: Search Box and Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <input
              type="text"
              placeholder="ค้นหาชื่อ / รหัส ERP..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full bg-slate-800 text-white text-xs placeholder-slate-400 rounded-lg border border-slate-700 pl-7 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>

          {(filters.branchId !== 'all' ||
            filters.categoryId !== 'all' ||
            filters.lowStockOnly ||
            filters.searchQuery !== '') && (
            <button
              onClick={onResetFilters}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="รีเซ็ตตัวกรอง"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
