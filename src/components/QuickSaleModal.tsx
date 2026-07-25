import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Wallet, Landmark, CreditCard, AlertTriangle, UserCheck } from 'lucide-react';
import { ProductItem, SalesRep } from '../types';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  selectedProduct?: ProductItem | null;
  salesReps?: SalesRep[];
  selectedSalesRepId?: string;
  onRecordSale: (productId: string, quantity: number, paymentMethod: string, salesRepId?: string) => void;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProduct,
  salesReps = [],
  selectedSalesRepId,
  onRecordSale,
}) => {
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [salesRepId, setSalesRepId] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
    } else if (products.length > 0) {
      setProductId(products[0].id);
    }
  }, [selectedProduct, products]);

  useEffect(() => {
    if (selectedSalesRepId) {
      setSalesRepId(selectedSalesRepId);
    } else if (salesReps.length > 0) {
      setSalesRepId(salesReps[0].id);
    }
  }, [selectedSalesRepId, salesReps]);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === productId) || products[0];
  const totalPrice = currentProduct ? currentProduct.price * quantity : 0;
  const isStockInsufficient = currentProduct ? currentProduct.stock < quantity : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || isStockInsufficient) return;
    onRecordSale(currentProduct.id, quantity, paymentMethod, salesRepId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                บันทึกรายการขายสินค้า (Record POS Sale)
              </h3>
              <p className="text-xs text-slate-400">
                บันทึกยอดขายเพื่อปรับลดสต็อกและสะสมยอดขายปิดวันเรียลไทม์
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
          {/* Select Sales Representative */}
          {salesReps.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>พนักงานขายผู้ทำรายการ (Sales Rep)</span>
              </label>
              <select
                value={salesRepId}
                onChange={(e) => setSalesRepId(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
              >
                {salesReps.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.code}) — {rep.branchName} [วันนี้: ฿{rep.dailyRevenue.toLocaleString()}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Select Product */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">เลือกรายการสินค้า</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs rounded-xl border border-slate-700 px-3 py-2.5 focus:border-emerald-400 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) — ฿{p.price.toLocaleString()} [คงเหลือ: {p.stock} {p.unit}]
                </option>
              ))}
            </select>
          </div>

          {currentProduct && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ราคาต่อหน่วย:</span>
                <strong className="text-white text-sm">฿{currentProduct.price.toLocaleString()} /{currentProduct.unit}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">สต็อกคงเหลือปัจจุบัน:</span>
                <span className={`font-bold ${currentProduct.stock <= currentProduct.minStockLevel ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {currentProduct.stock} {currentProduct.unit}
                </span>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">จำนวนที่ขาย</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="flex-1 bg-slate-800 text-center font-bold text-white text-base rounded-xl border border-slate-700 py-2 focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">ช่องทางการชำระเงิน</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-2 rounded-xl border font-medium flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>เงินสด</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 px-2 rounded-xl border font-medium flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>เงินโอน/QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`py-2 px-2 rounded-xl border font-medium flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>บัตรเครดิต</span>
              </button>
            </div>
          </div>

          {/* Total Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">ราคารวมสุทธิ:</span>
            <span className="text-xl font-black text-emerald-400">฿{totalPrice.toLocaleString()}</span>
          </div>

          {isStockInsufficient && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>สินค้าในสต็อกไม่เพียงพอ กรุณาเติมสต็อกก่อนทำรายการขาย</span>
            </div>
          )}

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
              disabled={isStockInsufficient}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              ยืนยันการขาย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
