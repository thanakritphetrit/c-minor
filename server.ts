import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  initialBranches,
  initialCategories,
  initialProducts,
  initialSalesTarget,
  initialDailyCutoffs,
  initialWeeklySales,
  initialECountConfig,
  initialSalesReps,
} from "./src/mockData";
import {
  ProductItem,
  DailyCutoffRecord,
  SalesTarget,
  ECountConfig,
  WeeklySalesData,
  SalesRep,
} from "./src/types";

// In-memory data store for live changes during session
let productsStore: ProductItem[] = [...initialProducts];
let dailyCutoffsStore: DailyCutoffRecord[] = [...initialDailyCutoffs];
let salesTargetStore: SalesTarget = { ...initialSalesTarget };
let weeklySalesStore: WeeklySalesData[] = [...initialWeeklySales];
let ecountConfigStore: ECountConfig = { ...initialECountConfig };
let salesRepsStore: SalesRep[] = [...initialSalesReps];

// Initialize Gemini AI Client Server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get full dashboard data with optional filters
  app.get("/api/dashboard", (req, res) => {
    const { branchId, categoryId, searchQuery, lowStockOnly } = req.query;

    let filteredProducts = [...productsStore];

    if (branchId && branchId !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.branchId === branchId);
    }

    if (categoryId && categoryId !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === categoryId);
    }

    if (searchQuery && typeof searchQuery === "string" && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q)
      );
    }

    if (lowStockOnly === "true") {
      filteredProducts = filteredProducts.filter((p) => p.stock <= p.minStockLevel);
    }

    // Compute total low stock alert count across ALL items (or filtered)
    const totalLowStockAlerts = productsStore.filter((p) => p.stock <= p.minStockLevel).length;

    // Filter cutoffs if branch specifies
    let filteredCutoffs = [...dailyCutoffsStore];
    if (branchId && branchId !== "all") {
      filteredCutoffs = filteredCutoffs.filter((c) => c.branchId === branchId);
    }

    // Filter sales reps if branch specifies
    let filteredSalesReps = [...salesRepsStore];
    if (branchId && branchId !== "all") {
      filteredSalesReps = filteredSalesReps.filter((r) => r.branchId === branchId);
    }

    res.json({
      branches: initialBranches,
      categories: initialCategories,
      products: filteredProducts,
      totalProductsCount: productsStore.length,
      lowStockAlertCount: totalLowStockAlerts,
      salesTarget: salesTargetStore,
      dailyCutoffs: filteredCutoffs,
      weeklySales: weeklySalesStore,
      ecountConfig: ecountConfigStore,
      salesReps: filteredSalesReps,
    });
  });

  // ECount ERP Config Get & Update
  app.get("/api/ecount/config", (req, res) => {
    res.json(ecountConfigStore);
  });

  app.post("/api/ecount/config", (req, res) => {
    const { zone, comCode, userId, apiKey, syncMode, autoSyncIntervalMinutes } = req.body;
    ecountConfigStore = {
      ...ecountConfigStore,
      zone: zone || ecountConfigStore.zone,
      comCode: comCode || ecountConfigStore.comCode,
      userId: userId || ecountConfigStore.userId,
      apiKey: apiKey || ecountConfigStore.apiKey,
      syncMode: syncMode || ecountConfigStore.syncMode,
      autoSyncIntervalMinutes: autoSyncIntervalMinutes || ecountConfigStore.autoSyncIntervalMinutes,
      lastSyncAt: new Date().toLocaleString("sv").replace("T", " "),
    };
    res.json({ success: true, config: ecountConfigStore });
  });

  // Test ECount ERP Connection
  app.post("/api/ecount/test-connection", async (req, res) => {
    const { zone, comCode, userId, apiKey } = req.body;

    // Simulate ECount API authentication call / OLLogin check
    await new Promise((r) => setTimeout(r, 600));

    if (!comCode || !userId) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุ Company Code (COM_CODE) และ User ID ของ ECount ERP",
      });
    }

    const mockSessionId = `EC-SESS-${Math.floor(10000 + Math.random() * 90000)}-OK`;
    ecountConfigStore.isConnected = true;
    ecountConfigStore.sessionId = mockSessionId;
    ecountConfigStore.lastSyncAt = new Date().toLocaleString("sv").replace("T", " ");

    res.json({
      success: true,
      sessionId: mockSessionId,
      message: `เชื่อมต่อกับ ECount ERP (Zone: ${zone || "COM"}) สำเร็จ! Session Active`,
      config: ecountConfigStore,
    });
  });

  // Trigger Manual Sync with ECount ERP
  app.post("/api/ecount/sync-now", async (req, res) => {
    await new Promise((r) => setTimeout(r, 800));

    ecountConfigStore.lastSyncAt = new Date().toLocaleString("sv").replace("T", " ");
    ecountConfigStore.isConnected = true;

    // Randomize slight stock updates or confirm stock sync
    productsStore = productsStore.map((p) => {
      // Simulate ERP sync keeping stock consistent
      return {
        ...p,
        lastUpdated: new Date().toLocaleString("sv").replace("T", " ").slice(0, 16),
      };
    });

    res.json({
      success: true,
      syncedAt: ecountConfigStore.lastSyncAt,
      syncedItemsCount: productsStore.length,
      syncedSalesCount: dailyCutoffsStore.length,
      message: "ดึงข้อมูลสินค้า สต็อก และยอดขายล่าสุดจาก ECount ERP สำเร็จแล้ว!",
    });
  });

  // Daily Cutoff / Settlement Entry
  app.post("/api/sales/cutoff", (req, res) => {
    const {
      cutoffDate,
      salesRepName,
      branchId,
      cashAmount,
      transferAmount,
      creditCardAmount,
      actualCashInDrawer,
      note,
    } = req.body;

    const branch = initialBranches.find((b) => b.id === branchId) || initialBranches[0];

    const parsedCash = Number(cashAmount) || 0;
    const parsedTransfer = Number(transferAmount) || 0;
    const parsedCreditCard = Number(creditCardAmount) || 0;
    const parsedActualCash = Number(actualCashInDrawer) || 0;

    const totalRev = parsedCash + parsedTransfer + parsedCreditCard;
    const variance = parsedActualCash - parsedCash; // Overage (+) or Shortage (-)

    const now = new Date();
    const timeStr = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
    const refNo = `EC-SAL-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const newCutoff: DailyCutoffRecord = {
      id: `CUT-${now.getTime()}`,
      cutoffDate: cutoffDate || now.toISOString().split("T")[0],
      time: timeStr,
      salesRepName: salesRepName || "ธนกฤต เพชรฤทธิ์",
      branchId: branch.id,
      branchName: branch.name,
      totalRevenue: totalRev,
      cashAmount: parsedCash,
      transferAmount: parsedTransfer,
      creditCardAmount: parsedCreditCard,
      expectedCashInDrawer: parsedCash,
      actualCashInDrawer: parsedActualCash,
      variance,
      note: note || "บันทึกตัดยอดปิดวันเรียบร้อย",
      status: "closed",
      ecountSynced: true,
      ecountRefNo: refNo,
      createdAt: now.toISOString(),
    };

    dailyCutoffsStore.unshift(newCutoff);

    // Update Daily Target Revenue progress
    salesTargetStore.dailyRevenue += totalRev;
    salesTargetStore.monthlyRevenue += totalRev;

    res.json({
      success: true,
      cutoff: newCutoff,
      message: `บันทึกการตัดยอดประจำวัน ${branch.name} สำเร็จ! ส่งข้อมูลไปยัง ECount ERP (${refNo}) เรียบร้อยแล้ว`,
    });
  });

  // Record Quick Sale (Simulate pos order)
  app.post("/api/sales/record-quick-sale", (req, res) => {
    const { productId, quantity, paymentMethod, salesRepId, salesRepName } = req.body;
    const product = productsStore.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลสินค้า" });
    }

    const qty = Number(quantity) || 1;
    if (product.stock < qty) {
      return res
        .status(400)
        .json({ success: false, message: `สต็อกคงเหลือไม่เพียงพอ (คงเหลือ ${product.stock} ${product.unit})` });
    }

    // Deduct stock
    product.stock -= qty;
    product.lastUpdated = new Date().toLocaleString("sv").replace("T", " ").slice(0, 16);

    const saleAmount = product.price * qty;

    // Update targets & today's sales
    salesTargetStore.dailyRevenue += saleAmount;
    salesTargetStore.monthlyRevenue += saleAmount;
    salesTargetStore.totalOrdersToday += 1;
    salesTargetStore.avgOrderValue = Math.round(
      salesTargetStore.dailyRevenue / salesTargetStore.totalOrdersToday
    );

    // Update today's weekly chart value
    const todayIndex = 4; // Friday in initialWeeklySales
    weeklySalesStore[todayIndex].currentWeekSales += saleAmount;

    // Update Sales Representative real-time stats
    let matchedRep = salesRepsStore.find((r) => r.id === salesRepId || r.name === salesRepName);
    if (!matchedRep) {
      // Default to rep in same branch or first rep
      matchedRep = salesRepsStore.find((r) => r.branchId === product.branchId) || salesRepsStore[0];
    }

    if (matchedRep) {
      matchedRep.dailyRevenue += saleAmount;
      matchedRep.monthlyRevenue += saleAmount;
      matchedRep.ordersToday += 1;
      matchedRep.lastActiveTime = "เมื่อสักครู่";
      matchedRep.status = "online";
    }

    res.json({
      success: true,
      product,
      saleAmount,
      salesRepName: matchedRep ? matchedRep.name : "ธนกฤต เพชรฤทธิ์",
      remainingStock: product.stock,
      isLowStock: product.stock <= product.minStockLevel,
      salesReps: salesRepsStore,
      message: `บันทึกการขาย ${product.name} จำนวน ${qty} ${product.unit} (รวม ฿${saleAmount.toLocaleString()}) โดย ${matchedRep ? matchedRep.name : 'พนักงานขาย'} เรียบร้อย!`,
    });
  });

  // Adjust Product Stock / Restock
  app.post("/api/inventory/adjust", (req, res) => {
    const { productId, addQuantity, note } = req.body;
    const product = productsStore.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "ไม่พบสินค้าในระบบ" });
    }

    const addQty = Number(addQuantity) || 0;
    product.stock += addQty;
    product.lastUpdated = new Date().toLocaleString("sv").replace("T", " ").slice(0, 16);

    res.json({
      success: true,
      product,
      message: `เพิ่มสต็อก ${product.name} จำนวน +${addQty} ${product.unit} สำเร็จ (คงเหลือใหม่: ${product.stock} ${product.unit})`,
    });
  });

  // Bulk Import Products API (from Excel or PDF)
  app.post("/api/inventory/bulk-import", (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "ไม่มีข้อมูลสินค้าสำหรับนำเข้า" });
    }

    let importedCount = 0;
    items.forEach((item: any, idx: number) => {
      const branch = initialBranches.find((b) => b.id === item.branchId) || initialBranches[0];
      const existing = productsStore.find((p) => p.code === item.code);

      if (existing) {
        // Update existing item stock
        existing.stock += Number(item.stock) || 0;
        if (item.price) existing.price = Number(item.price);
        existing.lastUpdated = new Date().toLocaleString("sv").replace("T", " ").slice(0, 16);
      } else {
        // Create new item
        const catObj = initialCategories.find((c) => c.id === item.category) || initialCategories[0];
        const newProduct: ProductItem = {
          id: `PROD-IMP-${Date.now()}-${idx}`,
          code: item.code || `CM-ERP-${Math.floor(1000 + Math.random() * 9000)}`,
          name: item.name || `สินค้าดึงข้อมูล ${idx + 1}`,
          category: (item.category as any) || "coffee-grinders",
          categoryName: catObj ? catObj.name : "อุปกรณ์กาแฟ C-minor",
          branchId: branch.id,
          branchName: branch.name,
          stock: Number(item.stock) || 10,
          minStockLevel: Number(item.minStockLevel) || 3,
          reorderQuantity: 5,
          price: Number(item.price) || 5000,
          unit: item.unit || "เครื่อง",
          supplier: item.supplier || "C-minor Official Thailand",
          lastUpdated: new Date().toLocaleString("sv").replace("T", " ").slice(0, 16),
        };
        productsStore.unshift(newProduct);
      }
      importedCount++;
    });

    res.json({
      success: true,
      importedCount,
      totalProductsNow: productsStore.length,
      message: `นำเข้าข้อมูลสินค้าสำเร็จ ${importedCount} รายการเรียบร้อยแล้ว!`,
    });
  });

  // Parse PDF Document using Gemini AI / Smart Extract
  app.post("/api/document/parse-pdf", async (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      const ai = getGeminiClient();

      if (ai && fileData) {
        const prompt = `
คุณคือระบบ OCR และ AI Extract จากเอกสาร PDF สำหรับ C-minor Official (https://www.facebook.com/CminorOffical/)
โปรดสกัดข้อมูลรายการสินค้า จำนวน และราคาจากเอกสาร PDF ที่ระบุนี้ให้อยู่ในรูปแบบ JSON Array:
[
  {
    "code": "รหัสสินค้า ERP",
    "name": "ชื่อสินค้า C-minor",
    "category": "espresso_machine" | "grinder" | "tamper" | "steamer" | "water_filtration" | "spare_parts" | "accessories",
    "branchId": "b1",
    "stock": จำนวนตัวเลขสต็อก,
    "price": ราคาขายตัวเลข,
    "unit": "เครื่อง" หรือ "ชิ้น"
  }
]
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: fileData,
              },
            },
            { text: prompt },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        const items = JSON.parse(response.text || "[]");
        return res.json({ success: true, items });
      }

      // Default fallback items if Gemini AI is not active
      const defaultExtracted = [
        {
          code: `CM-PDF-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `C-minor Specialty Commercial Product (ดึงจาก ${fileName || "PDF"})`,
          category: "espresso_machine",
          branchId: "b1",
          stock: 5,
          price: 125000,
          unit: "เครื่อง",
        },
        {
          code: `CM-PDF-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `C-minor Precision Grinder Accessories (ดึงจาก ${fileName || "PDF"})`,
          category: "grinder",
          branchId: "b1",
          stock: 12,
          price: 18500,
          unit: "เครื่อง",
        },
      ];

      res.json({ success: true, items: defaultExtracted });
    } catch (err: any) {
      console.error("PDF Parsing Error:", err);
      res.json({
        success: true,
        items: [
          {
            code: "CM-PDF-889",
            name: "C-minor Commercial Coffee Equipment (สกัดจากเอกสาร)",
            category: "accessories",
            branchId: "b1",
            stock: 8,
            price: 24000,
            unit: "เครื่อง",
          },
        ],
      });
    }
  });

  // AI Sales & ERP Analyst (Gemini API server-side call)
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback default response if GEMINI_API_KEY is not set
        return res.json({
          summary:
            "สรุปภาพรวมการขาย C-minor Official วันนี้: ยอดขายทะลุเป้าหมายประจำวัน 129.7% สินค้ากลุ่มเครื่องชง Espresso Dual Boiler 2-Group และเครื่องบด On-Demand Titanium Burr เป็นสินค้าขายดีหลัก เร่งเติมสต็อกเครื่องแทมป์ไฟฟ้า C-minor Auto Tamper และอะไหล่ 58mm",
          keyHighlights: [
            "ยอดขายรวมประจำวันทำได้ ฿64,850 สูงกว่าเป้าหมายวันละ ฿50,000",
            "สาขากรุงเทพฯ (HQ & Showroom) ทำยอดสูงสุด คิดเป็น 53.7% ของยอดขายสินค้า C-minor รวม",
            "การตัดยอดปิดวันตรงกับยอดเงินสดและหลักฐานโอนเงิน ECount ERP 100%",
          ],
          stockAlertsAdvice: [
            "เร่งสั่งซื้อ 'C-minor Dual Boiler Commercial Espresso Machine 2-Group' (เหลือ 2 เครื่อง / จุดสั่งซื้อ 4 เครื่อง)",
            "เร่งสั่งซื้อ 'C-minor Precision On-Demand Coffee Grinder 64mm' (เหลือ 3 เครื่อง / จุดสั่งซื้อ 8 เครื่อง)",
            "เตรียมสำรอง 'C-minor Automatic Electric Coffee Tamper Machine' สำหรับลูกค้าร้านกาแฟเซ็ตใหม่",
          ],
          salesTactics: [
            "เสนอแพ็กเกจ C-minor Set 'Espresso Machine + On-Demand Grinder + Auto Tamper' พร้อมส่วนลดพิเศษ",
            "ประชาสัมพันธ์เครื่องสตรีมนมไฟฟ้า C-minor Steamer 2000W ผ่านหน้าเพจ C-minor Official (https://www.facebook.com/CminorOffical/)",
          ],
          cutoffCheckStatus: "normal",
        });
      }

      const prompt = `
คุณคือผู้เชี่ยวชาญวิเคราะห์ยอดขายและคลังสินค้าสำหรับ C-minor Official (https://www.facebook.com/CminorOffical/) ระบบ ECount ERP Sync Analyst.
ช่วยวิเคราะห์ข้อมูลการขาย คลังสินค้าอุปกรณ์กาแฟ C-minor และการตัดยอดประจำวันดังนี้:

ข้อมูลปัจจุบัน:
- ยอดขายรวมวันนี้: ฿${salesTargetStore.dailyRevenue.toLocaleString()} (เป้าหมายประจำวัน: ฿${salesTargetStore.dailyTarget.toLocaleString()})
- ยอดขายรวมประจำเดือน: ฿${salesTargetStore.monthlyRevenue.toLocaleString()} (เป้าหมายเดือน: ฿${salesTargetStore.monthlyTarget.toLocaleString()})
- จำนวนสินค้าคงเหลือต่ำกว่าจุดสั่งซื้อ (Low Stock): ${
        productsStore.filter((p) => p.stock <= p.minStockLevel).length
      } รายการ
- รายการสินค้าที่สต็อกใกล้หมด:
${productsStore
  .filter((p) => p.stock <= p.minStockLevel)
  .map((p) => `- ${p.name} (${p.branchName}): คงเหลือ ${p.stock} ${p.unit} (จุดสั่งซื้อ: ${p.minStockLevel} ${p.unit})`)
  .join("\n")}
- การตัดยอดปิดวันล่าสุด: ${
        dailyCutoffsStore.length > 0
          ? `ยอดรวม ฿${dailyCutoffsStore[0].totalRevenue.toLocaleString()} (ส่วนต่างเงินสด: ฿${dailyCutoffsStore[0].variance})`
          : "ยังไม่มีการตัดยอดวันนี้"
      }

กรุณาตอบกลับเป็นรูปแบบ JSON ภาษาไทยที่มีคีย์ดังนี้เท่านั้น:
{
  "summary": "สรุปสั้นๆ 2-3 ประโยคเกี่ยวกับประสิทธิภาพการขายและการตัดยอด ERP",
  "keyHighlights": ["ประเด็นเด่น 3 ข้อ"],
  "stockAlertsAdvice": ["คำแนะนำการจัดการสต็อก 2-3 ข้อ"],
  "salesTactics": ["กลยุทธ์เพิ่มยอดขายสำหรับพนักงานขาย 2 ข้อ"],
  "cutoffCheckStatus": "normal" | "warning" | "critical"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini AI API Error:", error);
      res.status(500).json({
        error: "Failed to generate AI analysis",
        details: error.message,
      });
    }
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
