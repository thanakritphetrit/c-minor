import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Settings, FileSpreadsheet, ShieldCheck, Clock, ExternalLink, ChevronUp, ChevronDown, FileUp } from 'lucide-react';
import { ECountConfig } from '../types';
import { CMinorLogo } from './CMinorLogo';

interface HeaderProps {
  ecountConfig: ECountConfig;
  lowStockCount: number;
  onOpenECountModal: () => void;
  onOpenCutoffModal: () => void;
  onOpenQuickSaleModal: () => void;
  onOpenExcelPdfModal: () => void;
  onSyncECount: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  ecountConfig,
  lowStockCount,
  onOpenECountModal,
  onOpenCutoffModal,
  onOpenQuickSaleModal,
  onOpenExcelPdfModal,
  onSyncECount,
  isSyncing,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isCompact, setIsCompact] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setTimeString(now.toLocaleDateString('th-TH', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-white sticky top-0 z-30 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 transition-all duration-300 ${isCompact ? 'py-1.5' : 'py-3'}`}>
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer shrink-0">
              <CMinorLogo size={isCompact ? 'sm' : 'md'} variant="badge" showSubtitle={false} className="shadow-lg shadow-orange-500/10" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`font-black tracking-tight bg-gradient-to-r from-orange-400 via-amber-200 to-white bg-clip-text text-transparent transition-all ${isCompact ? 'text-base' : 'text-xl'}`}>
                  C-minor Integration
                </h1>
                {!isCompact && (
                  <>
                    <span className="text-xs text-amber-200 font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      Power Distribution & Installation
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-inner flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> ECount ERP Sync
                    </span>
                  </>
                )}
              </div>
              {!isCompact && (
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                  <a
                    href="https://www.facebook.com/CminorOffical/?locale=th_TH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>C-minor Official Facebook Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-700 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 text-[11px]">
                    <Clock className="w-3 h-3 text-emerald-400 shrink-0" /> {timeString || 'กำลังอัปเดตเวลา...'}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Right Controls & ERP Status */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {/* ECount Connection Status Badge */}
            <button
              onClick={onOpenECountModal}
              className={`flex items-center gap-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition-all group shadow-sm ${isCompact ? 'py-1' : 'py-1.5'}`}
              title="คลิกเพื่อตั้งค่าการเชื่อมต่อ ECount ERP"
            >
              <span className={`w-2 h-2 rounded-full ${ecountConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300 group-hover:text-white transition-colors">
                ERP: <strong className="text-emerald-400">{ecountConfig.comCode || 'Simulated'}</strong>
              </span>
              <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </button>

            {/* Sync Now Button */}
            <button
              onClick={onSyncECount}
              disabled={isSyncing}
              className={`flex items-center gap-1 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-bold transition-all disabled:opacity-50 group shadow-sm ${isCompact ? 'py-1' : 'py-1.5'}`}
              title="ดึงข้อมูลอัปเดตล่าสุดจาก ECount ERP"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span>{isSyncing ? 'ซิงค์...' : isCompact ? 'ดึง ERP' : 'ดึงข้อมูล ERP'}</span>
            </button>

            {/* Excel & PDF Data Button */}
            <button
              onClick={onOpenExcelPdfModal}
              className={`flex items-center gap-1 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm active:scale-95 ${isCompact ? 'py-1' : 'py-1.5'}`}
              title="นำเข้า / สกัดข้อมูล และส่งออกรายงาน Excel & PDF"
            >
              <FileUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{isCompact ? 'Excel/PDF' : 'ดึงข้อมูล Excel/PDF'}</span>
            </button>

            {/* Quick Record Sale Button */}
            <button
              onClick={onOpenQuickSaleModal}
              className={`flex items-center gap-1 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 border border-emerald-400/30 ${isCompact ? 'py-1' : 'py-1.5'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isCompact ? '+ขาย POS' : '+ บันทึกการขาย POS'}</span>
            </button>

            {/* Daily Cutoff Settlement Button */}
            <button
              onClick={onOpenCutoffModal}
              className={`flex items-center gap-1 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/15 transition-all active:scale-95 border border-amber-300/40 ${isCompact ? 'py-1' : 'py-1.5'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isCompact ? 'ตัดยอด' : 'ตัดยอดปิดวัน (Cutoff)'}</span>
            </button>

            {/* Compact Mode Toggle Button */}
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition-all shadow-sm active:scale-95 ml-1"
              title={isCompact ? 'ขยายแถบเมนูแสดงรายละเอียดเต็ม' : 'ย่อแถบเมนูเพื่อเพิ่มพื้นที่การมองเห็น'}
            >
              {isCompact ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px]">ขยายเมนู</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px]">ย่อเมนู</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
