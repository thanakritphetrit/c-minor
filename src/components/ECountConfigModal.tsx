import React, { useState } from 'react';
import { X, Settings, RefreshCw, CheckCircle2, AlertCircle, Database, Key, Server, Code } from 'lucide-react';
import { ECountConfig } from '../types';
import { CMinorLogo } from './CMinorLogo';

interface ECountConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ECountConfig;
  onSaveConfig: (newConfig: Partial<ECountConfig>) => void;
  onTestConnection: (testData: { zone: string; comCode: string; userId: string; apiKey: string }) => Promise<void>;
  isTesting: boolean;
}

export const ECountConfigModal: React.FC<ECountConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTestConnection,
  isTesting,
}) => {
  const [zone, setZone] = useState<string>(config.zone || 'COM');
  const [comCode, setComCode] = useState<string>(config.comCode || '883921');
  const [userId, setUserId] = useState<string>(config.userId || 'SALES_OFFICER_01');
  const [apiKey, setApiKey] = useState<string>(config.apiKey || 'ec_live_api_key_th_883921_x992');
  const [syncMode, setSyncMode] = useState<'simulation' | 'live'>(config.syncMode || 'simulation');
  const [autoSyncInterval, setAutoSyncInterval] = useState<number>(config.autoSyncIntervalMinutes || 5);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setStatusMsg(null);
    try {
      await onTestConnection({ zone, comCode, userId, apiKey });
      setStatusMsg({
        text: `เชื่อมต่อกับ ECount ERP (Zone: ${zone}) สำเร็จ! ออกรหัส Session Token เรียบร้อย`,
        isError: false,
      });
    } catch (err: any) {
      setStatusMsg({
        text: err.message || 'การทดสอบเชื่อมต่อล้มเหลว กรุณาตรวจสอบรหัสผ่านหรือ API Key',
        isError: true,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      zone,
      comCode,
      userId,
      apiKey,
      syncMode,
      autoSyncIntervalMinutes: Number(autoSyncInterval),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CMinorLogo size="sm" variant="badge" showSubtitle={false} className="shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                การตั้งค่าเชื่อมต่อ API ECount ERP
              </h3>
              <p className="text-xs text-slate-400">
                กำหนดค่าการเชื่อมต่อระบบ C-minor เพื่อซิงค์ข้อมูลสินค้า สต็อก และตัดยอดการขายอัตโนมัติ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Status Alert if tested */}
          {statusMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                statusMsg.isError
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              {statusMsg.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Sync Mode Selection */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300">โหมดการซิงค์ข้อมูล (Sync Mode)</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSyncMode('simulation')}
                className={`py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-2 transition-all ${
                  syncMode === 'simulation'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>จำลอง API (Simulation)</span>
              </button>

              <button
                type="button"
                onClick={() => setSyncMode('live')}
                className={`py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-2 transition-all ${
                  syncMode === 'live'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>เชื่อมต่อระบบจริง (Live API)</span>
              </button>
            </div>
          </div>

          {/* API Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Zone */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ECount ERP Zone Server
              </label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="เช่น COM หรือ BA"
                className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* COM_CODE */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Code (COM_CODE)
              </label>
              <input
                type="text"
                value={comCode}
                onChange={(e) => setComCode(e.target.value)}
                placeholder="รหัสบริษัท ECount ERP"
                className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* USER_ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="รหัสผู้ใช้งาน ERP"
                className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Auto Sync Interval */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ระยะเวลาซิงค์อัตโนมัติ (นาที)
              </label>
              <select
                value={autoSyncInterval}
                onChange={(e) => setAutoSyncInterval(Number(e.target.value))}
                className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
              >
                <option value={1}>ทุก 1 นาที (เรียลไทม์)</option>
                <option value={5}>ทุก 5 นาที</option>
                <option value={15}>ทุก 15 นาที</option>
                <option value={30}>ทุก 30 นาที</option>
              </select>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-amber-400" /> API Key / Secret Key (ECount OAPI Key)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="กรอก API Key ของ ECount ERP"
              className="w-full bg-slate-800 text-white text-xs font-mono rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Technical Info / Endpoints info */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1 mb-1">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              ECount Open API Endpoints ที่ใช้งาน:
            </div>
            <div>• <span className="font-mono text-emerald-400">/OAPI/V2/Inventory/GetListInventoryBalance</span> (ดึงสต็อก)</div>
            <div>• <span className="font-mono text-emerald-400">/OAPI/V2/Sale/InsertSale</span> (บันทึกยอดขาย/ตัดยอดประจำวัน)</div>
            <div>• Session Token ล่าสุด: <span className="font-mono text-white">{config.sessionId || 'EC-SESS-ACTIVE'}</span></div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ API'}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
