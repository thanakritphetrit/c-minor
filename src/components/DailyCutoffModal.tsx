import React, { useState } from 'react';
import { X, FileSpreadsheet, CheckCircle2, AlertTriangle, Printer, Wallet, Landmark, CreditCard, Send, History } from 'lucide-react';
import { Branch, DailyCutoffRecord, BranchId } from '../types';
import { CMinorLogo } from './CMinorLogo';

interface DailyCutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  dailyCutoffs: DailyCutoffRecord[];
  onSaveCutoff: (cutoffData: {
    cutoffDate: string;
    salesRepName: string;
    branchId: BranchId;
    cashAmount: number;
    transferAmount: number;
    creditCardAmount: number;
    actualCashInDrawer: number;
    note: string;
  }) => void;
}

export const DailyCutoffModal: React.FC<DailyCutoffModalProps> = ({
  isOpen,
  onClose,
  branches,
  dailyCutoffs,
  onSaveCutoff,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [cutoffDate, setCutoffDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [salesRepName, setSalesRepName] = useState<string>('ธนกฤต เพชรฤทธิ์');
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>('bkk-siam');
  const [cashAmount, setCashAmount] = useState<string>('8500');
  const [transferAmount, setTransferAmount] = useState<string>('12350');
  const [creditCardAmount, setCreditCardAmount] = useState<string>('4000');
  const [actualCashInDrawer, setActualCashInDrawer] = useState<string>('8500');
  const [note, setNote] = useState<string>('ตรวจสอบนับเงินสดเก๊ะรอบปิดวันถูกต้อง ตรงกับ ECount ERP');
  const [printedCutoff, setPrintedCutoff] = useState<DailyCutoffRecord | null>(null);

  if (!isOpen) return null;

  const parsedCash = Number(cashAmount) || 0;
  const parsedTransfer = Number(transferAmount) || 0;
  const parsedCredit = Number(creditCardAmount) || 0;
  const parsedActualCash = Number(actualCashInDrawer) || 0;

  const calculatedTotal = parsedCash + parsedTransfer + parsedCredit;
  const variance = parsedActualCash - parsedCash; // Overage (+) or Shortage (-)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCutoff({
      cutoffDate,
      salesRepName,
      branchId: selectedBranchId,
      cashAmount: parsedCash,
      transferAmount: parsedTransfer,
      creditCardAmount: parsedCredit,
      actualCashInDrawer: parsedActualCash,
      note,
    });
    // Set for receipt view
    const branch = branches.find((b) => b.id === selectedBranchId);
    const mockReceipt: DailyCutoffRecord = {
      id: `CUT-${Date.now()}`,
      cutoffDate,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      salesRepName,
      branchId: selectedBranchId,
      branchName: branch ? branch.name : 'สาขากรุงเทพ',
      totalRevenue: calculatedTotal,
      cashAmount: parsedCash,
      transferAmount: parsedTransfer,
      creditCardAmount: parsedCredit,
      expectedCashInDrawer: parsedCash,
      actualCashInDrawer: parsedActualCash,
      variance,
      note,
      status: 'closed',
      ecountSynced: true,
      ecountRefNo: `EC-SAL-${cutoffDate.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    setPrintedCutoff(mockReceipt);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                ระบบสรุปและตัดยอดการขายประจำวัน (Daily Cutoff & Settlement)
              </h3>
              <p className="text-xs text-slate-400">
                กระทบยอดเงินสด โอน บัตรเครดิต พร้อมส่งบันทึกไปยัง ECount ERP
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

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-4 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('create');
              setPrintedCutoff(null);
            }}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>บันทึกการตัดยอดปิดวัน</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ประวัติการตัดยอด ({dailyCutoffs.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {printedCutoff ? (
            /* Printable Daily Cutoff Receipt View */
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-700 rounded-2xl p-6 text-slate-200 space-y-4 shadow-inner">
                <div className="text-center border-b border-slate-800 pb-4">
                  <div className="flex justify-center mb-2">
                    <CMinorLogo size="sm" variant="badge" showSubtitle={true} />
                  </div>
                  <div className="text-xs text-amber-400 font-bold tracking-widest uppercase">
                    ECount ERP Official Document
                  </div>
                  <h4 className="text-lg font-black text-white mt-0.5">
                    ใบสรุปการตัดยอดการขายและกระทบยอดเงินสดประจำวัน
                  </h4>
                  <p className="text-xs text-slate-400">{printedCutoff.branchName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">เลขที่อ้างอิง ERP:</span>{' '}
                    <strong className="text-emerald-400 font-mono">{printedCutoff.ecountRefNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">วันที่ / เวลา:</span>{' '}
                    <strong className="text-white">{printedCutoff.cutoffDate} {printedCutoff.time}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">พนักงานผู้ตัดยอด:</span>{' '}
                    <strong className="text-white">{printedCutoff.salesRepName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">สถานะ ECount:</span>{' '}
                    <strong className="text-emerald-400">ส่งข้อมูลเข้า ERP เรียบร้อย</strong>
                  </div>
                </div>

                <div className="border-t border-b border-slate-800 py-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" /> ยอดขายเงินสด (Cash):
                    </span>
                    <strong className="text-white">฿{printedCutoff.cashAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-teal-400" /> ยอดขายเงินโอน (Bank Transfer):
                    </span>
                    <strong className="text-white">฿{printedCutoff.transferAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> ยอดขายบัตรเครดิต (Credit Card):
                    </span>
                    <strong className="text-white">฿{printedCutoff.creditCardAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-amber-400">ยอดขายรวมสุทธิประจำวัน:</span>
                    <span className="text-white">฿{printedCutoff.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="text-slate-400">เงินสดนับจริงในเก๊ะ:</div>
                    <div className="text-white font-bold text-sm">
                      ฿{printedCutoff.actualCashInDrawer.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400">ผลต่าง (Variance):</div>
                    <div
                      className={`font-bold text-sm ${
                        printedCutoff.variance === 0
                          ? 'text-emerald-400'
                          : printedCutoff.variance > 0
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {printedCutoff.variance === 0
                        ? 'ตรงตามระบบ 100%'
                        : printedCutoff.variance > 0
                        ? `เงินเกิน +฿${printedCutoff.variance.toLocaleString()}`
                        : `เงินขาด -฿${Math.abs(printedCutoff.variance).toLocaleString()}`}
                    </div>
                  </div>
                </div>

                {printedCutoff.note && (
                  <div className="text-xs text-slate-400 italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    หมายเหตุ: {printedCutoff.note}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>พิมพ์ใบบันทึกปิดยอด</span>
                </button>
                <button
                  onClick={() => {
                    setPrintedCutoff(null);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>เสร็จสิ้น</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'create' ? (
            /* Cutoff Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Branch */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">สาขา</label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value as BranchId)}
                    className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-amber-400 focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">วันที่ตัดยอด</label>
                  <input
                    type="date"
                    value={cutoffDate}
                    onChange={(e) => setCutoffDate(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sales Rep Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อพนักงานผู้รับผิดชอบ</label>
                <input
                  type="text"
                  value={salesRepName}
                  onChange={(e) => setSalesRepName(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Payment Split Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>จำแนกประเภทรายได้ยอดขาย (บาท)</span>
                  <span className="text-white text-sm font-black">
                    รวมทั้งหมด: ฿{calculatedTotal.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Cash */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-emerald-400" /> ยอดเงินสดในระบบ (Cash)
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  {/* Transfer */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <Landmark className="w-3 h-3 text-teal-400" /> ยอดเงินโอน/QR (Transfer)
                    </label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2 focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  {/* Credit Card */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-indigo-400" /> บัตรเครดิต (Credit Card)
                    </label>
                    <input
                      type="number"
                      value={creditCardAmount}
                      onChange={(e) => setCreditCardAmount(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2 focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cash Reconciliation / Variance Check */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">กระทบยอดเงินสดนับจริงในลิ้นชัก (Cash Reconciliation)</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      variance === 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : variance > 0
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {variance === 0
                      ? 'ตรงตามระบบ 100%'
                      : variance > 0
                      ? `เงินเกิน +฿${variance.toLocaleString()}`
                      : `เงินขาด -฿${Math.abs(variance).toLocaleString()}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      เงินสดที่คาดหวังตามระบบ:
                    </label>
                    <div className="text-sm font-bold text-slate-200 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                      ฿{parsedCash.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      ระบุเงินสดที่นับได้จริงในเก๊ะ:
                    </label>
                    <input
                      type="number"
                      value={actualCashInDrawer}
                      onChange={(e) => setActualCashInDrawer(e.target.value)}
                      className="w-full bg-slate-800 text-white text-sm font-bold rounded-xl border border-slate-700 px-3 py-2 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">หมายเหตุ / คำอธิบายเพิ่มเติม</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2 focus:border-amber-400 focus:outline-none"
                  placeholder="ระบุเหตุผลส่วนต่าง หรือรายละเอียดเพิ่มเติม..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>ยืนยันการตัดยอด & ส่ง ECount ERP</span>
                </button>
              </div>
            </form>
          ) : (
            /* Cutoff History List */
            <div className="space-y-3">
              {dailyCutoffs.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">฿{item.totalRevenue.toLocaleString()}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded">
                        {item.ecountRefNo || 'EC-SAL-SYNCED'}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1 flex items-center gap-2">
                      <span>{item.branchName}</span>
                      <span>•</span>
                      <span>{item.cutoffDate} ({item.time})</span>
                      <span>•</span>
                      <span className="text-slate-300">{item.salesRepName}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="text-slate-300 font-medium">
                      เงินสด: ฿{item.cashAmount.toLocaleString()} | โอน: ฿{item.transferAmount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      {item.variance === 0
                        ? 'ยอดตรง 100%'
                        : `ส่วนต่าง: ฿${item.variance.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
