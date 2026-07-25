import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Layers, Building2, Calendar } from 'lucide-react';
import { WeeklySalesData, Branch, Category } from '../types';

interface WeeklySalesChartProps {
  data: WeeklySalesData[];
  branches: Branch[];
  categories: Category[];
}

type ChartMode = 'comparison' | 'branch' | 'category';

export const WeeklySalesChart: React.FC<WeeklySalesChartProps> = ({
  data,
  branches,
  categories,
}) => {
  const [chartMode, setChartMode] = useState<ChartMode>('comparison');

  // Compute total sales for current week vs prior week
  const currentWeekTotal = data.reduce((acc, item) => acc + item.currentWeekSales, 0);
  const previousWeekTotal = data.reduce((acc, item) => acc + item.previousWeekSales, 0);
  const growthPercent = Math.round(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100);

  // Formatting helper for currency in Thai Baht
  const formatBaht = (value: number) => `฿${value.toLocaleString()}`;

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                กราฟเปรียบเทียบยอดขายรายสัปดาห์
              </h2>
              <p className="text-xs text-slate-400">
                วิเคราะห์แนวโน้มรายได้ สัปดาห์นี้ vs สัปดาห์ก่อน และจำแนกตามสาขา / ประเภทสินค้า
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-xs">
          <button
            onClick={() => setChartMode('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              chartMode === 'comparison'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>เปรียบเทียบรายสัปดาห์</span>
          </button>

          <button
            onClick={() => setChartMode('branch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              chartMode === 'branch'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>แยกตามสาขา</span>
          </button>

          <button
            onClick={() => setChartMode('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              chartMode === 'category'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>แยกตามประเภท</span>
          </button>
        </div>
      </div>

      {/* Summary KPI banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between px-2">
          <span className="text-slate-400">ยอดขายรวมสัปดาห์นี้:</span>
          <strong className="text-white text-sm font-bold">฿{currentWeekTotal.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between px-2 sm:border-l border-slate-800">
          <span className="text-slate-400">ยอดขายสัปดาห์ก่อน:</span>
          <strong className="text-slate-300 text-sm">฿{previousWeekTotal.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between px-2 sm:border-l border-slate-800">
          <span className="text-slate-400">อัตราการเติบโต (Growth):</span>
          <span className={`text-sm font-bold ${growthPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'comparison' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [formatBaht(Number(value)), '']}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) =>
                  value === 'currentWeekSales' ? 'ยอดขายสัปดาห์นี้' : 'ยอดขายสัปดาห์ก่อน'
                }
              />
              <Area
                type="monotone"
                dataKey="currentWeekSales"
                name="currentWeekSales"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCurrent)"
              />
              <Area
                type="monotone"
                dataKey="previousWeekSales"
                name="previousWeekSales"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorPrevious)"
              />
            </AreaChart>
          ) : chartMode === 'branch' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [formatBaht(Number(value)), '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="branchSales.bkk-siam" name="กรุงเทพฯ - นิคมบางปู" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="branchSales.cm-maya" name="เชียงใหม่ - นิคมลำพูน" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="branchSales.pkt-patong" name="ภูเก็ต - ศูนย์ภาคใต้" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="branchSales.kk-central" name="ขอนแก่น - ศูนย์ภาคอีสาน" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [formatBaht(Number(value)), '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="categorySales.control-breaker" name="อุปกรณ์ควบคุม & เบรกเกอร์" fill="#10b981" stackId="a" />
              <Bar dataKey="categorySales.motors-drives" name="มอเตอร์ & อินเวอร์เตอร์" fill="#f59e0b" stackId="a" />
              <Bar dataKey="categorySales.plc-sensors" name="เซนเซอร์ & พีแอลซี (PLC)" fill="#06b6d4" stackId="a" />
              <Bar dataKey="categorySales.cables-wiring" name="สายไฟ & ท่อร้อยสาย" fill="#6366f1" stackId="a" />
              <Bar dataKey="categorySales.lighting-power" name="โคมไฟ & พาวเวอร์ซัพพลาย" fill="#ec4899" stackId="a" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
