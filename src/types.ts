export type BranchId = 'all' | 'bkk-siam' | 'cm-maya' | 'pkt-patong' | 'kk-central';
export type CategoryId = 'all' | 'espresso-machines' | 'coffee-grinders' | 'steamers-boilers' | 'auto-tampers' | 'water-filtration';

export interface Branch {
  id: BranchId;
  code: string;
  name: string;
  location: string;
  manager: string;
}

export interface Category {
  id: CategoryId;
  code: string;
  name: string;
  iconName?: string;
}

export interface ProductItem {
  id: string;
  code: string; // ERP Item Code (e.g. EC-PRD-01)
  name: string;
  category: CategoryId;
  categoryName: string;
  branchId: BranchId;
  branchName: string;
  stock: number;
  minStockLevel: number; // Low stock threshold
  reorderQuantity: number;
  price: number;
  unit: string;
  lastUpdated: string;
  supplier: string;
}

export interface DailyCutoffRecord {
  id: string;
  cutoffDate: string; // YYYY-MM-DD
  time: string;
  salesRepName: string;
  branchId: BranchId;
  branchName: string;
  totalRevenue: number;
  cashAmount: number;
  transferAmount: number;
  creditCardAmount: number;
  expectedCashInDrawer: number;
  actualCashInDrawer: number;
  variance: number; // positive = overage, negative = shortage
  note: string;
  status: 'pending' | 'verified' | 'closed';
  ecountSynced: boolean;
  ecountRefNo?: string;
  createdAt: string;
}

export interface SalesTarget {
  salesRepName: string;
  period: string; // e.g., "กรกฎาคม 2026"
  monthlyTarget: number;
  monthlyRevenue: number;
  dailyTarget: number;
  dailyRevenue: number;
  totalOrdersToday: number;
  avgOrderValue: number;
}

export interface WeeklySalesData {
  dayName: string; // จ., อ., พ., พฤ., ศ., ส., อา.
  date: string;
  currentWeekSales: number;
  previousWeekSales: number;
  branchSales: Record<string, number>;
  categorySales: Record<string, number>;
}

export interface ECountConfig {
  zone: string; // e.g. COM, BA
  comCode: string;
  userId: string;
  apiKey: string;
  syncMode: 'simulation' | 'live';
  isConnected: boolean;
  sessionId?: string;
  lastSyncAt?: string;
  autoSyncIntervalMinutes: number;
}

export interface FilterState {
  branchId: BranchId;
  categoryId: CategoryId;
  period: 'today' | 'this_week' | 'this_month';
  searchQuery: string;
  lowStockOnly: boolean;
}

export interface AiInsightResponse {
  summary: string;
  keyHighlights: string[];
  stockAlertsAdvice: string[];
  salesTactics: string[];
  cutoffCheckStatus: 'normal' | 'warning' | 'critical';
}

export interface SalesRep {
  id: string;
  code: string;
  name: string;
  avatar: string;
  branchId: BranchId;
  branchName: string;
  role: string;
  dailyRevenue: number;
  monthlyRevenue: number;
  monthlyTarget: number;
  ordersToday: number;
  status: 'online' | 'busy' | 'offline';
  lastActiveTime: string;
}
