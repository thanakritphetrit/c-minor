import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ProductItem,
  DailyCutoffRecord,
  SalesRep,
  ECountConfig,
  SalesTarget,
} from '../types';
import {
  initialProducts,
  initialDailyCutoffs,
  initialSalesReps,
  initialECountConfig,
  initialSalesTarget,
} from '../mockData';

const PRODUCTS_COL = 'products';
const CUTOFFS_COL = 'dailyCutoffs';
const SALES_REPS_COL = 'salesReps';
const SYSTEM_COL = 'systemConfig';

export async function syncFirestoreOnStart() {
  try {
    // 1. Load or Seed Products
    const prodSnap = await getDocs(collection(db, PRODUCTS_COL));
    let products: ProductItem[] = [];
    if (prodSnap.empty) {
      console.log('⚡ Initializing Firebase Firestore products for c-minor-dashboard...');
      const batch = writeBatch(db);
      initialProducts.forEach((p) => {
        batch.set(doc(db, PRODUCTS_COL, p.id), p);
      });
      await batch.commit();
      products = [...initialProducts];
    } else {
      products = prodSnap.docs.map((d) => d.data() as ProductItem);
    }

    // 2. Load or Seed Daily Cutoffs
    const cutoffSnap = await getDocs(collection(db, CUTOFFS_COL));
    let cutoffs: DailyCutoffRecord[] = [];
    if (cutoffSnap.empty) {
      const batch = writeBatch(db);
      initialDailyCutoffs.forEach((c) => {
        batch.set(doc(db, CUTOFFS_COL, c.id), c);
      });
      await batch.commit();
      cutoffs = [...initialDailyCutoffs];
    } else {
      cutoffs = cutoffSnap.docs.map((d) => d.data() as DailyCutoffRecord);
    }

    // 3. Load or Seed Sales Reps
    const repSnap = await getDocs(collection(db, SALES_REPS_COL));
    let salesReps: SalesRep[] = [];
    if (repSnap.empty) {
      const batch = writeBatch(db);
      initialSalesReps.forEach((r) => {
        batch.set(doc(db, SALES_REPS_COL, r.id), r);
      });
      await batch.commit();
      salesReps = [...initialSalesReps];
    } else {
      salesReps = repSnap.docs.map((d) => d.data() as SalesRep);
    }

    // 4. Load or Seed System Config
    const ecountRef = doc(db, SYSTEM_COL, 'ecountConfig');
    const targetRef = doc(db, SYSTEM_COL, 'salesTarget');

    let ecountConfig: ECountConfig = { ...initialECountConfig };
    let salesTarget: SalesTarget = { ...initialSalesTarget };

    const ecountSnap = await getDocs(collection(db, SYSTEM_COL));
    if (ecountSnap.empty) {
      await setDoc(ecountRef, initialECountConfig);
      await setDoc(targetRef, initialSalesTarget);
    } else {
      ecountSnap.docs.forEach((docSnap) => {
        if (docSnap.id === 'ecountConfig') ecountConfig = docSnap.data() as ECountConfig;
        if (docSnap.id === 'salesTarget') salesTarget = docSnap.data() as SalesTarget;
      });
    }

    return {
      products,
      cutoffs,
      salesReps,
      ecountConfig,
      salesTarget,
    };
  } catch (error) {
    console.error('Firebase Firestore Sync Warning:', error);
    return {
      products: initialProducts,
      cutoffs: initialDailyCutoffs,
      salesReps: initialSalesReps,
      ecountConfig: initialECountConfig,
      salesTarget: initialSalesTarget,
    };
  }
}

export async function persistProductToFirebase(product: ProductItem) {
  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product, { merge: true });
  } catch (err) {
    console.error('Error persisting product to Firebase:', err);
  }
}

export async function persistAllProductsToFirebase(products: ProductItem[]) {
  try {
    const batch = writeBatch(db);
    products.forEach((p) => {
      batch.set(doc(db, PRODUCTS_COL, p.id), p, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Error persisting batch products to Firebase:', err);
  }
}

export async function persistCutoffToFirebase(cutoff: DailyCutoffRecord) {
  try {
    await setDoc(doc(db, CUTOFFS_COL, cutoff.id), cutoff, { merge: true });
  } catch (err) {
    console.error('Error persisting cutoff to Firebase:', err);
  }
}

export async function persistSalesRepToFirebase(rep: SalesRep) {
  try {
    await setDoc(doc(db, SALES_REPS_COL, rep.id), rep, { merge: true });
  } catch (err) {
    console.error('Error persisting sales rep to Firebase:', err);
  }
}

export async function persistECountConfigToFirebase(config: ECountConfig) {
  try {
    await setDoc(doc(db, SYSTEM_COL, 'ecountConfig'), config, { merge: true });
  } catch (err) {
    console.error('Error persisting ECount config to Firebase:', err);
  }
}

export async function persistSalesTargetToFirebase(target: SalesTarget) {
  try {
    await setDoc(doc(db, SYSTEM_COL, 'salesTarget'), target, { merge: true });
  } catch (err) {
    console.error('Error persisting sales target to Firebase:', err);
  }
}
