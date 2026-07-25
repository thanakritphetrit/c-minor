import { Branch, Category, ProductItem, DailyCutoffRecord, SalesTarget, WeeklySalesData, ECountConfig, SalesRep } from './types';

export const initialBranches: Branch[] = [
  { id: 'bkk-siam', code: 'BR-001', name: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)', location: 'กรุงเทพมหานคร / นนทบุรี', manager: 'คุณธนกฤต เพชรฤทธิ์' },
  { id: 'cm-maya', code: 'BR-002', name: 'สาขาเชียงใหม่ (C-minor North Hub)', location: 'เชียงใหม่ / นิมมานฯ', manager: 'คุณนภา วงศ์ใหญ่' },
  { id: 'pkt-patong', code: 'BR-003', name: 'สาขาภูเก็ต (C-minor South Service)', location: 'ภูเก็ต / เมือง', manager: 'คุณอนันต์ สุขเสริฐ' },
  { id: 'kk-central', code: 'BR-004', name: 'สาขาขอนแก่น (C-minor Isan Center)', location: 'ขอนแก่น / เมือง', manager: 'คุณพิมพ์ใจ ดำรงค์' },
];

export const initialCategories: Category[] = [
  { id: 'espresso-machines', code: 'CM-CAT-01', name: 'เครื่องชงกาแฟ Espresso Machines' },
  { id: 'coffee-grinders', code: 'CM-CAT-02', name: 'เครื่องบดกาแฟ Precision Grinders' },
  { id: 'steamers-boilers', code: 'CM-CAT-03', name: 'เครื่องสตรีมนม & หม้อต้มน้ำร้อน' },
  { id: 'auto-tampers', code: 'CM-CAT-04', name: 'เครื่องแทมป์ไฟฟ้า & อุปกรณ์บาริสต้า' },
  { id: 'water-filtration', code: 'CM-CAT-05', name: 'ระบบกรองน้ำ & อะไหล่ C-minor' },
];

export const initialProducts: ProductItem[] = [
  {
    id: 'p1',
    code: 'CM-ESP-2002',
    name: 'C-minor Dual Boiler Commercial Espresso Machine 2-Group (PID Control)',
    category: 'espresso-machines',
    categoryName: 'เครื่องชงกาแฟ Espresso Machines',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    stock: 2,
    minStockLevel: 4, // LOW STOCK
    reorderQuantity: 6,
    price: 185000,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 18:20',
    supplier: 'C-minor Official Thailand (https://www.facebook.com/CminorOffical/)'
  },
  {
    id: 'p2',
    code: 'CM-ESP-1001',
    name: 'C-minor Single Group Specialty Espresso Machine (Rotary Pump)',
    category: 'espresso-machines',
    categoryName: 'เครื่องชงกาแฟ Espresso Machines',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    stock: 5,
    minStockLevel: 3,
    reorderQuantity: 8,
    price: 89000,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 17:45',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p3',
    code: 'CM-GRD-064',
    name: 'C-minor Precision On-Demand Coffee Grinder 64mm Titanium Flat Burr',
    category: 'coffee-grinders',
    categoryName: 'เครื่องบดกาแฟ Precision Grinders',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    stock: 3,
    minStockLevel: 8, // LOW STOCK
    reorderQuantity: 15,
    price: 24500,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 18:10',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p4',
    code: 'CM-GRD-083',
    name: 'C-minor Single Dose Heavy-Duty Commercial Grinder 83mm DLC Burr',
    category: 'coffee-grinders',
    categoryName: 'เครื่องบดกาแฟ Precision Grinders',
    branchId: 'cm-maya',
    branchName: 'สาขาเชียงใหม่ (C-minor North Hub)',
    stock: 4,
    minStockLevel: 5, // LOW STOCK
    reorderQuantity: 10,
    price: 38900,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 16:30',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p5',
    code: 'CM-STM-2000',
    name: 'C-minor Automatic Milk Foam Steamer Unit 2000W (Digital Temp Sensor)',
    category: 'steamers-boilers',
    categoryName: 'เครื่องสตรีมนม & หม้อต้มน้ำร้อน',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    stock: 8,
    minStockLevel: 5,
    reorderQuantity: 12,
    price: 29500,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 15:50',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p6',
    code: 'CM-BLR-010L',
    name: 'C-minor Instant Commercial Hot Water Boiler 10L (Precision Temp Control)',
    category: 'steamers-boilers',
    categoryName: 'เครื่องสตรีมนม & หม้อต้มน้ำร้อน',
    branchId: 'pkt-patong',
    branchName: 'สาขาภูเก็ต (C-minor South Service)',
    stock: 12,
    minStockLevel: 6,
    reorderQuantity: 10,
    price: 18500,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 14:15',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p7',
    code: 'CM-TMP-AUTO',
    name: 'C-minor Automatic Electric Coffee Tamper Machine (Adjustable Pressure 10-30kg)',
    category: 'auto-tampers',
    categoryName: 'เครื่องแทมป์ไฟฟ้า & อุปกรณ์บาริสต้า',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    stock: 2,
    minStockLevel: 6, // LOW STOCK
    reorderQuantity: 12,
    price: 19800,
    unit: 'ชุด',
    lastUpdated: '2026-07-24 18:00',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p8',
    code: 'CM-SCL-FLOW',
    name: 'C-minor Smart Bluetooth Precision Barista Scale & Flow Rate Monitor',
    category: 'auto-tampers',
    categoryName: 'เครื่องแทมป์ไฟฟ้า & อุปกรณ์บาริสต้า',
    branchId: 'kk-central',
    branchName: 'สาขาขอนแก่น (C-minor Isan Center)',
    stock: 18,
    minStockLevel: 10,
    reorderQuantity: 20,
    price: 4850,
    unit: 'เครื่อง',
    lastUpdated: '2026-07-24 13:00',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p9',
    code: 'CM-FLT-RO500',
    name: 'C-minor Commercial RO Water Filtration System 500GPD for Espresso Machines',
    category: 'water-filtration',
    categoryName: 'ระบบกรองน้ำ & อะไหล่ C-minor',
    branchId: 'pkt-patong',
    branchName: 'สาขาภูเก็ต (C-minor South Service)',
    stock: 7,
    minStockLevel: 4,
    reorderQuantity: 10,
    price: 16500,
    unit: 'ชุด',
    lastUpdated: '2026-07-24 12:40',
    supplier: 'C-minor Official Thailand'
  },
  {
    id: 'p10',
    code: 'CM-SPR-GRP58',
    name: 'C-minor Portafilter Bottomless 58mm Stainless Steel Wooden Handle',
    category: 'water-filtration',
    categoryName: 'ระบบกรองน้ำ & อะไหล่ C-minor',
    branchId: 'cm-maya',
    branchName: 'สาขาเชียงใหม่ (C-minor North Hub)',
    stock: 25,
    minStockLevel: 10,
    reorderQuantity: 30,
    price: 2200,
    unit: 'ด้าม',
    lastUpdated: '2026-07-24 11:20',
    supplier: 'C-minor Official Thailand'
  }
];

export const initialSalesTarget: SalesTarget = {
  salesRepName: 'ธนกฤต เพชรฤทธิ์ (C-minor Senior Product Executive)',
  period: 'กรกฎาคม 2026',
  monthlyTarget: 1500000,
  monthlyRevenue: 1285000, // 85.6% completion
  dailyTarget: 50000,
  dailyRevenue: 64850,   // 129.7% today!
  totalOrdersToday: 86,
  avgOrderValue: 754.06,
};

export const initialDailyCutoffs: DailyCutoffRecord[] = [
  {
    id: 'CUT-20260724-01',
    cutoffDate: '2026-07-24',
    time: '18:30 น.',
    salesRepName: 'ธนกฤต เพชรฤทธิ์',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    totalRevenue: 34850,
    cashAmount: 12500,
    transferAmount: 18350,
    creditCardAmount: 4000,
    expectedCashInDrawer: 12500,
    actualCashInDrawer: 12500,
    variance: 0,
    note: 'ตัดยอดขายเครื่องชงและเครื่องบด C-minor รอบเย็น ตรวจสอบยอดตรงกับ ECount ERP',
    status: 'closed',
    ecountSynced: true,
    ecountRefNo: 'EC-CMINOR-20260724-001',
    createdAt: '2026-07-24T18:30:00.000Z'
  },
  {
    id: 'CUT-20260723-01',
    cutoffDate: '2026-07-23',
    time: '18:45 น.',
    salesRepName: 'ธนกฤต เพชรฤทธิ์',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    totalRevenue: 28900,
    cashAmount: 8200,
    transferAmount: 15700,
    creditCardAmount: 5000,
    expectedCashInDrawer: 8200,
    actualCashInDrawer: 8200,
    variance: 0,
    note: 'ส่งมอบเครื่องแทมป์ไฟฟ้าและเครื่องสตรีมนม C-minor สำเร็จ',
    status: 'closed',
    ecountSynced: true,
    ecountRefNo: 'EC-CMINOR-20260723-088',
    createdAt: '2026-07-23T18:45:00.000Z'
  },
  {
    id: 'CUT-20260724-02',
    cutoffDate: '2026-07-24',
    time: '17:50 น.',
    salesRepName: 'นภา วงศ์ใหญ่',
    branchId: 'cm-maya',
    branchName: 'สาขาเชียงใหม่ (C-minor North Hub)',
    totalRevenue: 18400,
    cashAmount: 5400,
    transferAmount: 10000,
    creditCardAmount: 3000,
    expectedCashInDrawer: 5400,
    actualCashInDrawer: 5400,
    variance: 0,
    note: 'ตัดยอดสินค้า C-minor โซนภาคเหนือส่งเข้า ECount ERP สำเร็จ',
    status: 'closed',
    ecountSynced: true,
    ecountRefNo: 'EC-CMINOR-20260724-012',
    createdAt: '2026-07-24T17:50:00.000Z'
  }
];

export const initialWeeklySales: WeeklySalesData[] = [
  {
    dayName: 'จันทร์',
    date: '2026-07-20',
    currentWeekSales: 48500,
    previousWeekSales: 42000,
    branchSales: { 'bkk-siam': 24000, 'cm-maya': 12500, 'pkt-patong': 8000, 'kk-central': 4000 },
    categorySales: { 'espresso-machines': 22000, 'coffee-grinders': 14000, 'steamers-boilers': 6000, 'auto-tampers': 4500, 'water-filtration': 2000 }
  },
  {
    dayName: 'อังคาร',
    date: '2026-07-21',
    currentWeekSales: 52200,
    previousWeekSales: 45400,
    branchSales: { 'bkk-siam': 26000, 'cm-maya': 13200, 'pkt-patong': 8500, 'kk-central': 4500 },
    categorySales: { 'espresso-machines': 24000, 'coffee-grinders': 15000, 'steamers-boilers': 6200, 'auto-tampers': 5000, 'water-filtration': 2000 }
  },
  {
    dayName: 'พุธ',
    date: '2026-07-22',
    currentWeekSales: 51800,
    previousWeekSales: 47100,
    branchSales: { 'bkk-siam': 25500, 'cm-maya': 12800, 'pkt-patong': 8800, 'kk-central': 4700 },
    categorySales: { 'espresso-machines': 23500, 'coffee-grinders': 14800, 'steamers-boilers': 6500, 'auto-tampers': 4800, 'water-filtration': 2200 }
  },
  {
    dayName: 'พฤหัสบดี',
    date: '2026-07-23',
    currentWeekSales: 58600,
    previousWeekSales: 49000,
    branchSales: { 'bkk-siam': 28900, 'cm-maya': 14500, 'pkt-patong': 9200, 'kk-central': 6000 },
    categorySales: { 'espresso-machines': 27000, 'coffee-grinders': 16500, 'steamers-boilers': 7500, 'auto-tampers': 5100, 'water-filtration': 2500 }
  },
  {
    dayName: 'ศุกร์ (วันนี้)',
    date: '2026-07-24',
    currentWeekSales: 64850,
    previousWeekSales: 52000,
    branchSales: { 'bkk-siam': 34850, 'cm-maya': 18400, 'pkt-patong': 7600, 'kk-central': 4000 },
    categorySales: { 'espresso-machines': 30000, 'coffee-grinders': 18500, 'steamers-boilers': 8000, 'auto-tampers': 5850, 'water-filtration': 2500 }
  },
  {
    dayName: 'เสาร์ (ประมาณการ)',
    date: '2026-07-25',
    currentWeekSales: 68000,
    previousWeekSales: 58000,
    branchSales: { 'bkk-siam': 36000, 'cm-maya': 19000, 'pkt-patong': 8000, 'kk-central': 5000 },
    categorySales: { 'espresso-machines': 31000, 'coffee-grinders': 19000, 'steamers-boilers': 9000, 'auto-tampers': 6000, 'water-filtration': 3000 }
  },
  {
    dayName: 'อาทิตย์ (ประมาณการ)',
    date: '2026-07-26',
    currentWeekSales: 62500,
    previousWeekSales: 55000,
    branchSales: { 'bkk-siam': 32500, 'cm-maya': 17500, 'pkt-patong': 7500, 'kk-central': 5000 },
    categorySales: { 'espresso-machines': 28000, 'coffee-grinders': 18000, 'steamers-boilers': 8500, 'auto-tampers': 5500, 'water-filtration': 2500 }
  }
];

export const initialECountConfig: ECountConfig = {
  zone: 'COM',
  comCode: 'CMINOR-883921',
  userId: 'CMINOR_SALES_01',
  apiKey: 'cminor_live_api_key_th_883921_x992',
  syncMode: 'simulation',
  isConnected: true,
  sessionId: 'CMINOR-SESS-99281-OK',
  lastSyncAt: '2026-07-24 18:45:10',
  autoSyncIntervalMinutes: 5,
};

export const initialSalesReps: SalesRep[] = [
  {
    id: 'rep-1',
    code: 'CM-EMP-1001',
    name: 'ธนกฤต เพชรฤทธิ์',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branchId: 'bkk-siam',
    branchName: 'สาขากรุงเทพฯ (HQ & C-minor Showroom)',
    role: 'C-minor Senior Product Specialist',
    dailyRevenue: 34850,
    monthlyRevenue: 780000,
    monthlyTarget: 800000,
    ordersToday: 48,
    status: 'online',
    lastActiveTime: 'เมื่อสักครู่',
  },
  {
    id: 'rep-2',
    code: 'CM-EMP-1002',
    name: 'นภา วงศ์ใหญ่',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    branchId: 'cm-maya',
    branchName: 'สาขาเชียงใหม่ (C-minor North Hub)',
    role: 'Specialty Coffee Tech Lead',
    dailyRevenue: 18400,
    monthlyRevenue: 290000,
    monthlyTarget: 320000,
    ordersToday: 22,
    status: 'online',
    lastActiveTime: '2 นาทีที่แล้ว',
  },
  {
    id: 'rep-3',
    code: 'CM-EMP-1003',
    name: 'อนันต์ สุขเสริฐ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branchId: 'pkt-patong',
    branchName: 'สาขาภูเก็ต (C-minor South Service)',
    role: 'Southern Cafe Consultant',
    dailyRevenue: 7600,
    monthlyRevenue: 140000,
    monthlyTarget: 200000,
    ordersToday: 10,
    status: 'online',
    lastActiveTime: '5 นาทีที่แล้ว',
  },
  {
    id: 'rep-4',
    code: 'CM-EMP-1004',
    name: 'พิมพ์ใจ ดำรงค์',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branchId: 'kk-central',
    branchName: 'สาขาขอนแก่น (C-minor Isan Center)',
    role: 'C-minor POS & Inventory Lead',
    dailyRevenue: 4000,
    monthlyRevenue: 75400,
    monthlyTarget: 180000,
    ordersToday: 6,
    status: 'busy',
    lastActiveTime: '10 นาทีที่แล้ว',
  }
];
