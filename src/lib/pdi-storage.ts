import type { BikeSetup, InspectionRecord } from "./pdi-data";
import { defaultBikeSetup } from "./pdi-data";

const DB_NAME = "bikeos-pdi-db";
const DB_VERSION = 1;
const STORE_INSPECTIONS = "inspections";
const LOCAL_STORAGE_ACTIVE_KEY = "bikeos_pdi_active_id";
const LOCAL_STORAGE_BACKUP_KEY = "bikeos_pdi_fallback_inspections";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_INSPECTIONS)) {
        db.createObjectStore(STORE_INSPECTIONS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getLocalStorageFallback(): Record<string, InspectionRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalStorageFallback(
  records: Record<string, InspectionRecord>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_BACKUP_KEY,
      JSON.stringify(records),
    );
  } catch {
    // Storage quota might be exceeded
  }
}

export async function saveInspection(record: InspectionRecord): Promise<void> {
  if (!isBrowser()) return;
  record.updatedAt = Date.now();

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_INSPECTIONS, "readwrite");
      const store = tx.objectStore(STORE_INSPECTIONS);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const fallback = getLocalStorageFallback();
    fallback[record.id] = record;
    setLocalStorageFallback(fallback);
  }
}

export async function getInspection(
  id: string,
): Promise<InspectionRecord | null> {
  if (!isBrowser()) return null;

  try {
    const db = await openDb();
    return await new Promise<InspectionRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_INSPECTIONS, "readonly");
      const store = tx.objectStore(STORE_INSPECTIONS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const fallback = getLocalStorageFallback();
    return fallback[id] || null;
  }
}

export async function listInspections(): Promise<InspectionRecord[]> {
  if (!isBrowser()) return [];

  try {
    const db = await openDb();
    return await new Promise<InspectionRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_INSPECTIONS, "readonly");
      const store = tx.objectStore(STORE_INSPECTIONS);
      const req = store.getAll();
      req.onsuccess = () => {
        const records = (req.result || []) as InspectionRecord[];
        records.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(records);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    const fallback = getLocalStorageFallback();
    const list = Object.values(fallback);
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    return list;
  }
}

export async function deleteInspection(id: string): Promise<void> {
  if (!isBrowser()) return;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_INSPECTIONS, "readwrite");
      const store = tx.objectStore(STORE_INSPECTIONS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const fallback = getLocalStorageFallback();
    delete fallback[id];
    setLocalStorageFallback(fallback);
  }

  if (getActiveInspectionId() === id) {
    clearActiveInspectionId();
  }
}

export function getActiveInspectionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LOCAL_STORAGE_ACTIVE_KEY);
}

export function setActiveInspectionId(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, id);
}

export function clearActiveInspectionId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_STORAGE_ACTIVE_KEY);
}

export async function createNewInspection(
  bikeModel = "New Motorcycle",
  setup: BikeSetup = { ...defaultBikeSetup },
): Promise<InspectionRecord> {
  const newRecord: InspectionRecord = {
    id: `pdi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    bikeModel,
    setup,
    answers: {},
  };
  await saveInspection(newRecord);
  setActiveInspectionId(newRecord.id);
  return newRecord;
}

export function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.75,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
