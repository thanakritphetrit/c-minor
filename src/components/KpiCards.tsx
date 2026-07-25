import React from 'react';
import { Target, TrendingUp, DollarSign, AlertTriangle, FileSpreadsheet, CheckCircle2, ArrowUpRight, Wallet, CreditCard, Landmark } from 'lucide-react';
import { SalesTarget, DailyCutoffRecord, ProductItem } from '../types';

interface KpiCardsProps {
  salesTarget: SalesTarget;
  dailyCutoffs: DailyCutoffRecord[];
  products: ProductItem[];
  onOpenCutoffModal: () => void;
  onFilterLowStock: () => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  salesTarget,
  dailyCutoffs,
  products,
  onOpenCutoffModal,
  onFilterLowStock,
}) => {
  // Compute monthly % and daily %
  const monthlyPercent = Math.min(
    100,
    Math.round((salesTarget.monthlyRevenue / salesTarget.monthlyTarget) * 100)
  );
  const dailyPercent = Math.min(
    200,
    Math.round((salesTarget.dailyRevenue / salesTarget.dailyTarget) * 100)
  );

  // Compute low stock items
  const lowStockItems = products.filter((p) => p.stock <= p.minStockLevel);

  // Latest cutoff today
  const latestCutoff = dailyCutoffs[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Monthly Sales Target Progress */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              เป้าหมายยอดขายประจำเดือน
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {monthlyPercent}%
            </span>
          </div>

          <div className="mb-2">
            <div className="text-2xl font-black text-white tracking-tight">
              ฿{salesTarget.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              จากเป้าหมาย ฿{salesTarget.monthlyTarget.toLocaleString()} ({salesTarget.period})
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden my-3 p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, monthlyPercent)}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <span>คงเหลืออีก:</span>
          <strong className="text-slate-200">
            ฿{Math.max(0, salesTarget.monthlyTarget - salesTarget.monthlyRevenue).toLocaleString()}
          </strong>
        </div>
      </div>

      {/* 2. Today's Revenue & Daily Target */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              รายได้ยอดขายวันนี้
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                dailyPercent >= 100
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {dailyPercent >= 100 ? 'ทะลุเป้าวัน!' : `${dailyPercent}% ของเป้า`}
            </span>
          </div>

          <div className="mb-2">
            <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span>฿{salesTarget.dailyRevenue.toLocaleString()}</span>
              <span className="text-xs font-normal text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +17% vs เมื่อวาน
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              เป้าหมายวันละ ฿{salesTarget.dailyTarget.toLocaleString()} ({salesTarget.totalOrdersToday} ออเดอร์)
            </div>
          </div>

          {/* Payment Split Badges */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap text-[11px]">
            <span className="bg-slate-900/90 text-emerald-300 border border-slate-700/80 px-2 py-1 rounded-md flex items-center gap-1">
              <Wallet className="w-3 h-3 text-emerald-400" /> เงินสด 35%
            </span>
            <span className="bg-slate-900/90 text-teal-300 border border-slate-700/80 px-2 py-1 rounded-md flex items-center gap-1">
              <Landmark className="w-3 h-3 text-teal-400" /> โอน 50%
            </span>
            <span className="bg-slate-900/90 text-indigo-300 border border-slate-700/80 px-2 py-1 rounded-md flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-indigo-400" /> บัตร 15%
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>ยอดขายเฉลี่ย/บิล:</span>
          <strong className="text-slate-200">฿{salesTarget.avgOrderValue.toFixed(0)}</strong>
        </div>
      </div>

      {/* 3. Daily Cutoff Status (ตัดยอดประจำวัน) */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              การตัดยอดปิดวันประจำวัน
            </span>
            {latestCutoff ? (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ตัดยอดแล้ว
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold px-2 py-0.5 rounded-md">
                ยังไม่ปิดรอบ
              </span>
            )}
          </div>

          {latestCutoff ? (
            <div>
              <div className="text-xl font-bold text-white tracking-tight">
                ฿{latestCutoff.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span>{latestCutoff.time}</span>
                <span>•</span>
                <span className="text-slate-300">{latestCutoff.branchName.split(' - ')[0]}</span>
              </div>

              {/* Variance Indicator */}
              <div className="mt-3 p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs flex items-center justify-between">
                <span className="text-slate-400">ส่วนต่างเงินสดในเก๊ะ:</span>
                <span
                  className={`font-bold ${
                    latestCutoff.variance === 0
                      ? 'text-emerald-400'
                      : latestCutoff.variance > 0
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {latestCutoff.variance === 0
                    ? 'ตรง 100% (฿0)'
                    : `ส่วนต่าง ฿${latestCutoff.variance.toLocaleString()}`}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 my-2">
              ยังไม่มีการสรุปยอดเงินสดประจำวัน สามารถกดตัดยอดปิดวันเพื่อกระทบยอดกับ ECount ERP
            </p>
          )}
        </div>

        <button
          onClick={onOpenCutoffModal}
          className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
          <span>บันทึกตัดยอดปิดวันใหม่</span>
        </button>
      </div>

      {/* 4. Low-Stock Inventory Warning Monitor */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              การเตือนสต็อกสินค้าใกล้หมด
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                lowStockItems.length > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {lowStockItems.length > 0 ? `${lowStockItems.length} รายการเตือน` : 'สต็อกปกติ'}
            </span>
          </div>

          <div className="mb-2">
            <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span className={lowStockItems.length > 0 ? 'text-amber-400' : 'text-white'}>
                {lowStockItems.length}
              </span>
              <span className="text-xs font-normal text-slate-400">รายการต่ำกว่าจุดสั่งซื้อ</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {lowStockItems.length > 0
                ? `เช่น: ${lowStockItems.slice(0, 2).map((i) => i.name).join(', ')}`
                : 'ระดับสต็อกสินค้าทุกสาขาเพียงพอสำหรับการขายประจำวัน'}
            </p>
          </div>
        </div>

        <button
          onClick={onFilterLowStock}
          className={`w-full mt-3 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            lowStockItems.length > 0
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{lowStockItems.length > 0 ? 'ดูรายการสินค้าต้องสั่งเพิ่ม' : 'ตรวจสอบสต็อกสินค้า'}</span>
        </button>
      </div>
    </div>
  );
};
