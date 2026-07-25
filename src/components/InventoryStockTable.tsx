import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, ShoppingCart, RefreshCw, Layers, Building2, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { ProductItem } from '../types';

interface InventoryStockTableProps {
  products: ProductItem[];
  onOpenRestockModal: (product: ProductItem) => void;
  onOpenQuickSaleModalWithProduct: (product: ProductItem) => void;
}

export const InventoryStockTable: React.FC<InventoryStockTableProps> = ({
  products,
  onOpenRestockModal,
  onOpenQuickSaleModalWithProduct,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lowStockCount = products.filter((p) => p.stock <= p.minStockLevel).length;

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-4 sm:p-5 shadow-sm mb-6 transition-all">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isCollapsed ? '' : 'mb-4'}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-tight">
                สต็อกสินค้าคงเหลือ & ระบบแจ้งเตือนเติมสินค้า (ECount ERP)
              </h2>
              {lowStockCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> เตือน {lowStockCount} รายการ
                </span>
              )}
            </div>
            {!isCollapsed && (
              <p className="text-xs text-slate-400">
                ติดตามปริมาณสินค้าคงค้าง จุดสั่งซื้อใหม่ (Reorder Point) และจัดการเติมสต็อกเรียลไทม์
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
            แสดงผล <strong>{products.length}</strong> รายการ
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
            title={isCollapsed ? 'ขยายตารางต๊อกสินค้า' : 'ย่อตารางสต็อกสินค้า'}
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
          {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-900/60 shadow-inner">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap">รหัส ERP</th>
              <th className="py-2.5 px-3">ชื่อสินค้า</th>
              <th className="py-2.5 px-2.5 whitespace-nowrap">หมวดหมู่</th>
              <th className="py-2.5 px-2.5 whitespace-nowrap">สาขา</th>
              <th className="py-2.5 px-2.5 text-center whitespace-nowrap">คงเหลือ / เตือน</th>
              <th className="py-2.5 px-2.5 text-right whitespace-nowrap">ราคา/หน่วย</th>
              <th className="py-2.5 px-2.5 text-center whitespace-nowrap">สถานะ</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 whitespace-nowrap">
                  ไม่พบรายการสินค้าตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const isLowStock = item.stock <= item.minStockLevel;
                const isOutOfStock = item.stock === 0;
                const stockPercent = Math.min(100, Math.round((item.stock / (item.minStockLevel * 2)) * 100));

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/60 transition-colors ${
                      isLowStock ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    {/* ERP Code */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-300 text-[11px] whitespace-nowrap">
                      {item.code}
                    </td>

                    {/* Product Name & Supplier */}
                    <td className="py-2 px-2.5 max-w-[180px] sm:max-w-[220px]">
                      <div className="font-bold text-white text-xs leading-snug truncate" title={item.name}>{item.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.supplier.replace(/https?:\/\/\S+/g, '').trim() || item.supplier}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2 px-2 whitespace-nowrap">
                      <span className="bg-slate-800 text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded text-[10px] font-medium inline-block max-w-[110px] truncate" title={item.categoryName}>
                        {item.categoryName}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="py-2 px-2 whitespace-nowrap">
                      <span className="text-slate-300 inline-flex items-center gap-1 text-[11px] whitespace-nowrap bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.branchName.replace('สาขา', '').split(' (')[0].trim()}</span>
                      </span>
                    </td>

                    {/* Stock level & Progress gauge */}
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      <div className="font-bold text-xs text-white">
                        <span className={isLowStock ? 'text-amber-400 font-black' : 'text-emerald-400 font-black'}>
                          {item.stock}
                        </span>{' '}
                        <span className="text-slate-400 font-normal text-[10px]">{item.unit}</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        (เตือน &lt; {item.minStockLevel})
                      </div>
                      {/* Gauge */}
                      <div className="w-16 mx-auto bg-slate-800 rounded-full h-1 overflow-hidden mt-0.5">
                        <div
                          className={`h-full rounded-full ${
                            isOutOfStock
                              ? 'bg-rose-500'
                              : isLowStock
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.max(8, stockPercent)}%` }}
                        />
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-2.5 text-right font-bold text-white text-xs whitespace-nowrap">
                      ฿{item.price.toLocaleString()}
                      <span className="text-slate-400 font-normal text-[10px] block">/{item.unit}</span>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      {isOutOfStock ? (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> หมด
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> ใกล้หมด
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> เพียงพอ
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenQuickSaleModalWithProduct(item)}
                          className="px-2 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-[11px] font-medium flex items-center gap-1 transition-colors shadow-sm"
                          title="บันทึกการขายสินค้านี้"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>ขาย</span>
                        </button>

                        <button
                          onClick={() => onOpenRestockModal(item)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-sm"
                          title="เติมสต็อกสินค้า"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+เติม</span>
                        </button>
                      </div>
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
