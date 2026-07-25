import React, { useState } from 'react';
import { X, PlusCircle, Package, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../types';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onRestock: (productId: string, addQuantity: number, note: string) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  onClose,
  product,
  onRestock,
}) => {
  const [addQuantity, setAddQuantity] = useState<number>(20);
  const [note, setNote] = useState<string>('เติมสินค้าตามใบสั่งซื้อ ECount ERP PO-2026-009');

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addQuantity <= 0) return;
    onRestock(product.id, addQuantity, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                เติมสต็อกสินค้า (Restock Inventory)
              </h3>
              <p className="text-xs text-slate-400">
                เพิ่มจำนวนสินค้าคงเหลือและอัปเดตระบบ ECount ERP
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-emerald-400">{product.code}</div>
            <div className="text-sm font-bold text-white">{product.name}</div>
            <div className="flex justify-between items-center text-xs text-slate-400 pt-1 border-t border-slate-800">
              <span>สต็อกคงเหลือปัจจุบัน:</span>
              <strong className="text-amber-400 font-bold">{product.stock} {product.unit}</strong>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>จุดเตือนสั่งซื้อ (Reorder Point):</span>
              <strong className="text-slate-200">{product.minStockLevel} {product.unit}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              จำนวนสินค้าที่รับเพิ่ม ({product.unit})
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAddQuantity((q) => Math.max(1, q - 5))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors"
              >
                -5
              </button>
              <input
                type="number"
                min={1}
                value={addQuantity}
                onChange={(e) => setAddQuantity(Math.max(1, Number(e.target.value)))}
                className="flex-1 bg-slate-800 text-center font-bold text-amber-400 text-base rounded-xl border border-slate-700 py-2 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setAddQuantity((q) => q + 5)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors"
              >
                +5
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">สต็อกคงเหลือใหม่หลังเติม:</span>
            <span className="text-sm font-bold text-emerald-400">
              {product.stock + addQuantity} {product.unit}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              หมายเหตุ / เลขที่ใบสั่งซื้อ PO
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ระบุเลขที่ PO หรือบันทึกการรับสินค้า..."
              className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-amber-400 focus:outline-none"
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
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all"
            >
              ยืนยันเติมสต็อก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
