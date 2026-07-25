import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { WeeklySalesChart } from './components/WeeklySalesChart';
import { InventoryStockTable } from './components/InventoryStockTable';
import { AiInsightsCard } from './components/AiInsightsCard';
import { SalesRepLeaderboard } from './components/SalesRepLeaderboard';
import { DailyCutoffModal } from './components/DailyCutoffModal';
import { ECountConfigModal } from './components/ECountConfigModal';
import { QuickSaleModal } from './components/QuickSaleModal';
import { RestockModal } from './components/RestockModal';
import { ExcelPdfDataModal } from './components/ExcelPdfDataModal';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  Branch,
  Category,
  ProductItem,
  SalesTarget,
  DailyCutoffRecord,
  WeeklySalesData,
  ECountConfig,
  FilterState,
  BranchId,
  CategoryId,
  AiInsightResponse,
  SalesRep,
} from './types';

export default function App() {
  // Main Data States
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [salesTarget, setSalesTarget] = useState<SalesTarget | null>(null);
  const [dailyCutoffs, setDailyCutoffs] = useState<DailyCutoffRecord[]>([]);
  const [weeklySales, setWeeklySales] = useState<WeeklySalesData[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [ecountConfig, setEcountConfig] = useState<ECountConfig>({
    zone: 'COM',
    comCode: '883921',
    userId: 'SALES_OFFICER_01',
    apiKey: 'ec_live_api_key_th_883921_x992',
    syncMode: 'simulation',
    isConnected: true,
    sessionId: 'EC-SESS-99281-OK',
    autoSyncIntervalMinutes: 5,
  });

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    branchId: 'all',
    categoryId: 'all',
    period: 'today',
    searchQuery: '',
    lowStockOnly: false,
  });

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Modals
  const [isCutoffModalOpen, setIsCutoffModalOpen] = useState<boolean>(false);
  const [isECountModalOpen, setIsECountModalOpen] = useState<boolean>(false);
  const [isQuickSaleModalOpen, setIsQuickSaleModalOpen] = useState<boolean>(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<boolean>(false);
  const [isExcelPdfModalOpen, setIsExcelPdfModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedSalesRepId, setSelectedSalesRepId] = useState<string | undefined>(undefined);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch Dashboard Data from Server API
  const loadDashboardData = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        branchId: filters.branchId,
        categoryId: filters.categoryId,
        searchQuery: filters.searchQuery,
        lowStockOnly: filters.lowStockOnly ? 'true' : 'false',
      });

      const res = await fetch(`/api/dashboard?${queryParams.toString()}`);
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลแดชบอร์ดได้');
      const data = await res.json();

      setBranches(data.branches || []);
      setCategories(data.categories || []);
      setProducts(data.products || []);
      setSalesTarget(data.salesTarget || null);
      setDailyCutoffs(data.dailyCutoffs || []);
      setWeeklySales(data.weeklySales || []);
      setSalesReps(data.salesReps || []);
      if (data.ecountConfig) setEcountConfig(data.ecountConfig);
    } catch (err: any) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล', true);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Sync with ECount ERP
  const handleSyncECount = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/ecount/sync-now', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'ซิงค์ข้อมูลกับ ECount ERP สำเร็จ!');
        loadDashboardData();
      } else {
        showToast(data.message || 'ซิงค์ข้อมูลล้มเหลว', true);
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการซิงค์ข้อมูล ECount ERP', true);
    } finally {
      setIsSyncing(false);
    }
  };

  // Test Connection
  const handleTestConnection = async (testData: {
    zone: string;
    comCode: string;
    userId: string;
    apiKey: string;
  }) => {
    setIsTestingConnection(true);
    try {
      const res = await fetch('/api/ecount/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'เชื่อมต่อล้มเหลว');
      }
      if (data.config) setEcountConfig(data.config);
      showToast(data.message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Save ECount Config
  const handleSaveECountConfig = async (newConfig: Partial<ECountConfig>) => {
    try {
      const res = await fetch('/api/ecount/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      const data = await res.json();
      if (data.success) {
        setEcountConfig(data.config);
        showToast('บันทึกการตั้งค่า ECount ERP เรียบร้อยแล้ว');
      }
    } catch (err) {
      showToast('ไม่สามารถบันทึกการตั้งค่าได้', true);
    }
  };

  // Save Daily Cutoff
  const handleSaveDailyCutoff = async (cutoffData: {
    cutoffDate: string;
    salesRepName: string;
    branchId: BranchId;
    cashAmount: number;
    transferAmount: number;
    creditCardAmount: number;
    actualCashInDrawer: number;
    note: string;
  }) => {
    try {
      const res = await fetch('/api/sales/cutoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cutoffData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'ตัดยอดปิดวันสำเร็จ!');
        loadDashboardData();
      }
    } catch (err) {
      showToast('ไม่สามารถบันทึกการตัดยอดได้', true);
    }
  };

  // Record POS Sale
  const handleRecordSale = async (
    productId: string,
    quantity: number,
    paymentMethod: string,
    salesRepId?: string
  ) => {
    try {
      const res = await fetch('/api/sales/record-quick-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, paymentMethod, salesRepId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        loadDashboardData();
      } else {
        showToast(data.message || 'บันทึกการขายล้มเหลว', true);
      }
    } catch (err) {
      showToast('ไม่สามารถบันทึกการขายได้', true);
    }
  };

  const handleOpenQuickSaleWithRep = (rep: SalesRep) => {
    setSelectedSalesRepId(rep.id);
    setSelectedProduct(null);
    setIsQuickSaleModalOpen(true);
  };

  // Restock Product
  const handleRestockProduct = async (productId: string, addQuantity: number, note: string) => {
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, addQuantity, note }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        loadDashboardData();
      }
    } catch (err) {
      showToast('ไม่สามารถเพิ่มสต็อกได้', true);
    }
  };

  // Bulk Import Products from Excel or PDF
  const handleImportProducts = async (newProducts: Partial<ProductItem>[]) => {
    try {
      const res = await fetch('/api/inventory/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newProducts }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'นำเข้าข้อมูลสินค้าเรียบร้อยแล้ว!');
        loadDashboardData();
      } else {
        showToast(data.message || 'นำเข้าข้อมูลล้มเหลว', true);
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าเข้าคลัง', true);
    }
  };

  // AI Analysis Trigger
  const handleTriggerAiAnalysis = async (): Promise<AiInsightResponse> => {
    const res = await fetch('/api/ai/analyze', { method: 'POST' });
    if (!res.ok) throw new Error('Failed AI request');
    return await res.json();
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      branchId: 'all',
      categoryId: 'all',
      period: 'today',
      searchQuery: '',
      lowStockOnly: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-12">
      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-bounce-short ${
            toastMessage.isError
              ? 'bg-rose-900/90 text-rose-100 border-rose-500/50'
              : 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50'
          }`}
        >
          {toastMessage.isError ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        ecountConfig={ecountConfig}
        lowStockCount={products.filter((p) => p.stock <= p.minStockLevel).length}
        onOpenECountModal={() => setIsECountModalOpen(true)}
        onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
        onOpenQuickSaleModal={() => {
          setSelectedProduct(null);
          setIsQuickSaleModalOpen(true);
        }}
        onOpenExcelPdfModal={() => setIsExcelPdfModalOpen(true)}
        onSyncECount={handleSyncECount}
        isSyncing={isSyncing}
      />

      {/* Filter Bar */}
      <FilterBar
        branches={branches}
        categories={categories}
        filters={filters}
        lowStockCount={products.filter((p) => p.stock <= p.minStockLevel).length}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400 font-medium">
              กำลังเชื่อมต่อและดึงข้อมูลยอดขาย ล่าสุดจาก ECount ERP...
            </p>
          </div>
        ) : (
          <>
            {/* KPI Summary Cards */}
            {salesTarget && (
              <KpiCards
                salesTarget={salesTarget}
                dailyCutoffs={dailyCutoffs}
                products={products}
                onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
                onFilterLowStock={() => handleFilterChange({ lowStockOnly: true })}
              />
            )}

            {/* AI Insights Banner */}
            <AiInsightsCard onTriggerAiAnalysis={handleTriggerAiAnalysis} />

            {/* Real-time Sales Representatives Performance Leaderboard */}
            <SalesRepLeaderboard
              salesReps={salesReps}
              branches={branches}
              onOpenQuickSaleWithRep={handleOpenQuickSaleWithRep}
            />

            {/* Weekly Sales Comparison Graph */}
            <WeeklySalesChart data={weeklySales} branches={branches} categories={categories} />

            {/* Inventory Stock Table & Low Stock Alerts */}
            <InventoryStockTable
              products={products}
              onOpenRestockModal={(product) => {
                setSelectedProduct(product);
                setIsRestockModalOpen(true);
              }}
              onOpenQuickSaleModalWithProduct={(product) => {
                setSelectedProduct(product);
                setIsQuickSaleModalOpen(true);
              }}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/90 border-t border-slate-800/80 text-slate-400 py-6 px-4 sm:px-6 lg:px-8 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-orange-500/20">
              C
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                ออกแบบโดย <span className="text-amber-400 font-extrabold">นายธนกฤต เพชรฤทธิ์</span>
              </p>
              <p className="text-[11px] text-slate-400">
                C-minor Integration V.1 • ระบบบริหารจัดการสต็อก & ยอดขายเชื่อมต่อ ECount ERP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-3 py-1 rounded-full font-bold shadow-inner">
              ● System Online V.1
            </span>
            <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[11px] px-3 py-1 rounded-full font-mono">
              ECount API Sync Ready
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DailyCutoffModal
        isOpen={isCutoffModalOpen}
        onClose={() => setIsCutoffModalOpen(false)}
        branches={branches}
        dailyCutoffs={dailyCutoffs}
        onSaveCutoff={handleSaveDailyCutoff}
      />

      <ECountConfigModal
        isOpen={isECountModalOpen}
        onClose={() => setIsECountModalOpen(false)}
        config={ecountConfig}
        onSaveConfig={handleSaveECountConfig}
        onTestConnection={handleTestConnection}
        isTesting={isTestingConnection}
      />

      <QuickSaleModal
        isOpen={isQuickSaleModalOpen}
        onClose={() => setIsQuickSaleModalOpen(false)}
        products={products}
        selectedProduct={selectedProduct}
        salesReps={salesReps}
        selectedSalesRepId={selectedSalesRepId}
        onRecordSale={handleRecordSale}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        product={selectedProduct}
        onRestock={handleRestockProduct}
      />

      <ExcelPdfDataModal
        isOpen={isExcelPdfModalOpen}
        onClose={() => setIsExcelPdfModalOpen(false)}
        products={products}
        salesReps={salesReps}
        dailyCutoffs={dailyCutoffs}
        onImportProducts={handleImportProducts}
        onShowToast={showToast}
      />
    </div>
  );
}
