import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, TrendingUp, CheckCircle2, ChevronRight, Lightbulb } from 'lucide-react';
import { AiInsightResponse } from '../types';

interface AiInsightsCardProps {
  onTriggerAiAnalysis: () => Promise<AiInsightResponse>;
}

export const AiInsightsCard: React.FC<AiInsightsCardProps> = ({ onTriggerAiAnalysis }) => {
  const [insight, setInsight] = useState<AiInsightResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await onTriggerAiAnalysis();
      setInsight(res);
    } catch (err: any) {
      setError('ไม่สามารถเรียกใช้ Gemini AI ได้ในขณะนี้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-lg mb-6 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-emerald-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Gemini AI Sales & ERP Stock Analyst
              </h2>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ระบบปัญญาประดิษฐ์วิเคราะห์แนวโน้มยอดขาย แจ้งเตือนสินค้าที่ต้องสั่งเติม และตรวจสอบส่วนต่างการตัดยอด
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'กำลังวิเคราะห์ด้วย AI...' : 'วิเคราะห์ข้อมูลด้วย AI'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {insight ? (
        <div className="space-y-4 animate-fade-in text-xs">
          {/* Executive Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200">
            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5 text-xs">
              <Lightbulb className="w-4 h-4" /> บทสรุปสำหรับพนักงานขาย & ผู้จัดการ:
            </div>
            <p className="leading-relaxed text-slate-300">{insight.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Highlights */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> ประเด็นยอดขายเด่น
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {insight.keyHighlights?.map((item, i) => (
                  <li key={i} className="leading-tight">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Advice */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> คำแนะนำคลังสินค้า
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {insight.stockAlertsAdvice?.map((item, i) => (
                  <li key={i} className="leading-tight">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sales Tactics */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" /> กลยุทธ์การขายแนะนำ
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {insight.salesTactics?.map((item, i) => (
                  <li key={i} className="leading-tight">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <p>กดปุ่ม <strong>"วิเคราะห์ข้อมูลด้วย AI"</strong> เพื่อให้ Gemini ประมวลผลยอดขายและแนะนำการเติมสต็อกสินค้าอัตโนมัติ</p>
        </div>
      )}
    </div>
  );
};
