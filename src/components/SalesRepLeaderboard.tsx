import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Users,
  Search,
  ArrowUpDown,
  ShoppingBag,
  TrendingUp,
  Target,
  Building2,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { SalesRep, Branch } from '../types';

interface SalesRepLeaderboardProps {
  salesReps: SalesRep[];
  branches: Branch[];
  onOpenQuickSaleWithRep: (rep: SalesRep) => void;
}

type SortField = 'dailyRevenue' | 'monthlyRevenue' | 'targetPercent' | 'ordersToday' | 'name';

export const SalesRepLeaderboard: React.FC<SalesRepLeaderboardProps> = ({
  salesReps,
  branches,
  onOpenQuickSaleWithRep,
}) => {
  const [sortField, setSortField] = useState<SortField>('dailyRevenue');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Filter and sort sales reps
  const processedReps = useMemo(() => {
    let result = [...salesReps];

    // Branch Filter
    if (selectedBranchId !== 'all') {
      result = result.filter((r) => r.branchId === selectedBranchId);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.branchName.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortField === 'name') {
        const nameA = a.name;
        const nameB = b.name;
        return sortOrder === 'asc' ? nameA.localeCompare(nameB, 'th') : nameB.localeCompare(nameA, 'th');
      }

      let valA = 0;
      let valB = 0;

      if (sortField === 'dailyRevenue') {
        valA = a.dailyRevenue;
        valB = b.dailyRevenue;
      } else if (sortField === 'monthlyRevenue') {
        valA = a.monthlyRevenue;
        valB = b.monthlyRevenue;
      } else if (sortField === 'targetPercent') {
        valA = a.monthlyTarget > 0 ? (a.monthlyRevenue / a.monthlyTarget) * 100 : 0;
        valB = b.monthlyTarget > 0 ? (b.monthlyRevenue / b.monthlyTarget) * 100 : 0;
      } else if (sortField === 'ordersToday') {
        valA = a.ordersToday;
        valB = b.ordersToday;
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return result;
  }, [salesReps, selectedBranchId, searchQuery, sortField, sortOrder]);

  // Overall statistics calculation
  const totalDailyRevenue = useMemo(() => salesReps.reduce((acc, r) => acc + r.dailyRevenue, 0), [salesReps]);
  const totalOrdersToday = useMemo(() => salesReps.reduce((acc, r) => acc + r.ordersToday, 0), [salesReps]);
  const activeOnlineCount = useMemo(() => salesReps.filter((r) => r.status === 'online').length, [salesReps]);
  const topPerformer = useMemo(() => {
    if (salesReps.length === 0) return null;
    return [...salesReps].sort((a, b) => b.dailyRevenue - a.dailyRevenue)[0];
  }, [salesReps]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-6 space-y-6">
      {/* Top Title & Real-time Live Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white tracking-tight">
                รายชื่อพนักงานขายทำยอด Real-time
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                Live Ranking
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              จัดลำดับยอดขายพนักงานแบบเรียลไทม์ และส่งข้อมูลเชื่อมโยงกับระบบ ECount ERP
            </p>
          </div>
        </div>

        {/* Quick Overall Summary Badges & Collapse Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs overflow-x-auto pb-1 md:pb-0">
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 shrink-0">
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">ออนไลน์ประจำการ</div>
              <div className="font-bold text-white">{activeOnlineCount} / {salesReps.length} คน</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 shrink-0">
            <ShoppingBag className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">ยอดขายทีมวันนี้</div>
              <div className="font-bold text-emerald-400">฿{totalDailyRevenue.toLocaleString()}</div>
            </div>
          </div>

          {topPerformer && (
            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 flex items-center gap-2 shrink-0">
              <CrownIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-amber-300">อันดับ 1 ประจำวัน</div>
                <div className="font-bold text-white truncate max-w-[100px]">{topPerformer.name}</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 ml-auto"
            title={isCollapsed ? 'ขยายตารางอันดับพนักงานขาย' : 'ย่อตารางอันดับพนักงานขาย'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4 text-amber-400" />
                <span>ขยายตาราง</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 text-amber-400" />
                <span>ย่อตาราง</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Top 3 Podium Highlights */}
      {salesReps.length >= 3 && selectedBranchId === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2">
          {/* Rank 1 Gold */}
          {(() => {
            const r1 = [...salesReps].sort((a, b) => b.dailyRevenue - a.dailyRevenue)[0];
            if (!r1) return null;
            const pct = r1.monthlyTarget > 0 ? Math.min(100, Math.round((r1.monthlyRevenue / r1.monthlyTarget) * 100)) : 0;
            return (
              <div className="relative p-4 rounded-2xl bg-gradient-to-b from-amber-500/15 via-slate-950 to-slate-950 border-2 border-amber-500/40 shadow-lg shadow-amber-500/5 order-1 md:order-2 transform md:-translate-y-1 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <CrownIcon className="w-3 h-3" /> CHAMPION #1
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="relative">
                    <img src={r1.avatar} alt={r1.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-amber-300 truncate">{r1.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{r1.branchName}</div>
                    <div className="text-[10px] text-slate-500">{r1.code}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-slate-400">ยอดขายวันนี้</div>
                    <div className="text-base font-black text-emerald-400">฿{r1.dailyRevenue.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">เป้าหมายเดือน ({pct}%)</div>
                    <div className="text-xs font-bold text-slate-200">฿{r1.monthlyRevenue.toLocaleString()}</div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenQuickSaleWithRep(r1)}
                  className="w-full mt-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-1 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>ทำรายการขายให้พนักงานนี้</span>
                </button>
              </div>
            );
          })()}

          {/* Rank 2 Silver */}
          {(() => {
            const r2 = [...salesReps].sort((a, b) => b.dailyRevenue - a.dailyRevenue)[1];
            if (!r2) return null;
            const pct = r2.monthlyTarget > 0 ? Math.min(100, Math.round((r2.monthlyRevenue / r2.monthlyTarget) * 100)) : 0;
            return (
              <div className="relative p-4 rounded-2xl bg-gradient-to-b from-slate-400/10 via-slate-950 to-slate-950 border border-slate-700 shadow-md order-2 md:order-1 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Medal className="w-3 h-3" /> SILVER #2
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="relative">
                    <img src={r2.avatar} alt={r2.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-400" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-200 truncate">{r2.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{r2.branchName}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-slate-400">ยอดขายวันนี้</div>
                    <div className="text-sm font-bold text-emerald-400">฿{r2.dailyRevenue.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">เป้าเดือน ({pct}%)</div>
                    <div className="text-xs font-semibold text-slate-300">฿{r2.monthlyRevenue.toLocaleString()}</div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenQuickSaleWithRep(r2)}
                  className="w-full mt-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  <span>ขายให้พนักงานนี้</span>
                </button>
              </div>
            );
          })()}

          {/* Rank 3 Bronze */}
          {(() => {
            const r3 = [...salesReps].sort((a, b) => b.dailyRevenue - a.dailyRevenue)[2];
            if (!r3) return null;
            const pct = r3.monthlyTarget > 0 ? Math.min(100, Math.round((r3.monthlyRevenue / r3.monthlyTarget) * 100)) : 0;
            return (
              <div className="relative p-4 rounded-2xl bg-gradient-to-b from-amber-700/10 via-slate-950 to-slate-950 border border-amber-800/40 shadow-md order-3 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3" /> BRONZE #3
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="relative">
                    <img src={r3.avatar} alt={r3.name} className="w-11 h-11 rounded-full object-cover border-2 border-amber-700" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-200 truncate">{r3.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{r3.branchName}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-slate-400">ยอดขายวันนี้</div>
                    <div className="text-sm font-bold text-emerald-400">฿{r3.dailyRevenue.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">เป้าเดือน ({pct}%)</div>
                    <div className="text-xs font-semibold text-slate-300">฿{r3.monthlyRevenue.toLocaleString()}</div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenQuickSaleWithRep(r3)}
                  className="w-full mt-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  <span>ขายให้พนักงานนี้</span>
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Control Toolbar: Sorting & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        {/* Search & Branch Select */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาพนักงาน / รหัส..."
              className="w-full bg-slate-900 text-white text-xs rounded-xl border border-slate-800 pl-8 pr-3 py-1.5 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">ทุกสาขา</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900">
                  {b.name.replace('สาขา', '').split(' (')[0].trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options Buttons (จัดลำดับพนักงานขาย) */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap mr-1 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            เรียงตาม:
          </span>

          <button
            onClick={() => toggleSort('dailyRevenue')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-all ${
              sortField === 'dailyRevenue'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ยอดขายวันนี้ {sortField === 'dailyRevenue' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>

          <button
            onClick={() => toggleSort('monthlyRevenue')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-all ${
              sortField === 'monthlyRevenue'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ยอดขายเดือนนี้ {sortField === 'monthlyRevenue' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>

          <button
            onClick={() => toggleSort('targetPercent')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-all ${
              sortField === 'targetPercent'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            % ทะลุเป้า {sortField === 'targetPercent' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>

          <button
            onClick={() => toggleSort('ordersToday')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-all ${
              sortField === 'ordersToday'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            จำนวนออเดอร์ {sortField === 'ordersToday' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>

          <button
            onClick={() => toggleSort('name')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-all ${
              sortField === 'name'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ชื่อ {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 tracking-wider">
            <tr>
              <th className="py-3 px-2.5 w-10 text-center whitespace-nowrap">ลำดับ</th>
              <th className="py-3 px-3 whitespace-nowrap">พนักงานขาย / ตำแหน่ง</th>
              <th className="py-3 px-3 whitespace-nowrap">สังกัดสาขา</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">ยอดขายวันนี้</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">ออเดอร์วันนี้</th>
              <th className="py-3 px-3 whitespace-nowrap">เป้าหมายประจำเดือน</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">สถานะ</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">การจัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {processedReps.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 whitespace-nowrap">
                  ไม่พบข้อมูลพนักงานขายที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              processedReps.map((rep, index) => {
                const globalRank =
                  [...salesReps]
                    .sort((a, b) => b.dailyRevenue - a.dailyRevenue)
                    .findIndex((r) => r.id === rep.id) + 1;

                const targetPct =
                  rep.monthlyTarget > 0
                    ? Math.round((rep.monthlyRevenue / rep.monthlyTarget) * 100)
                    : 0;

                return (
                  <tr
                    key={rep.id}
                    className="hover:bg-slate-900/80 transition-colors group"
                  >
                    {/* Rank Badge */}
                    <td className="py-3 px-2.5 text-center font-bold whitespace-nowrap">
                      {globalRank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black border border-amber-500/40 shadow-sm text-xs">
                          🥇
                        </span>
                      ) : globalRank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 font-black border border-slate-400/40 text-xs">
                          🥈
                        </span>
                      ) : globalRank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-black border border-amber-700/40 text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-xs">#{index + 1}</span>
                      )}
                    </td>

                    {/* Sales Rep Profile */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <img
                            src={rep.avatar}
                            alt={rep.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-slate-950 ${
                              rep.status === 'online'
                                ? 'bg-emerald-400'
                                : rep.status === 'busy'
                                ? 'bg-amber-400'
                                : 'bg-slate-500'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{rep.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                              {rep.code}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{rep.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px] whitespace-nowrap">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{rep.branchName.replace('สาขา', '').split(' (')[0].trim()}</span>
                      </span>
                    </td>

                    {/* Daily Revenue */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="font-black text-sm text-emerald-400">
                        ฿{rep.dailyRevenue.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">อัปเดตเรียลไทม์</div>
                    </td>

                    {/* Orders Today - Clean Unclipped Badge */}
                    <td className="py-3 px-3 text-center font-bold text-white whitespace-nowrap">
                      <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 whitespace-nowrap shadow-inner">
                        <span className="text-emerald-400 font-black">{rep.ordersToday}</span>
                        <span className="text-slate-400 font-medium text-[11px]">บิล</span>
                      </span>
                    </td>

                    {/* Monthly Target Progress */}
                    <td className="py-3 px-3 w-36 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">
                            ฿{rep.monthlyRevenue.toLocaleString()}
                          </span>
                          <span
                            className={`font-bold ${
                              targetPct >= 100
                                ? 'text-emerald-400'
                                : targetPct >= 75
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {targetPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              targetPct >= 100
                                ? 'bg-emerald-400'
                                : targetPct >= 75
                                ? 'bg-amber-400'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(100, targetPct)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 text-right">
                          เป้า: ฿{rep.monthlyTarget.toLocaleString()}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          rep.status === 'online'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : rep.status === 'busy'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            rep.status === 'online'
                              ? 'bg-emerald-400 animate-pulse'
                              : rep.status === 'busy'
                              ? 'bg-amber-400'
                              : 'bg-slate-500'
                          }`}
                        />
                        {rep.status === 'online'
                          ? 'ออนไลน์'
                          : rep.status === 'busy'
                          ? 'กำลังขาย'
                          : 'ออฟไลน์'}
                      </span>
                    </td>

                    {/* Quick Action Button */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onOpenQuickSaleWithRep(rep)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1 ml-auto whitespace-nowrap shadow-sm"
                      >
                        <Zap className="w-3 h-3" />
                        <span>ทำรายการขาย</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
};

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
    </svg>
  );
}
