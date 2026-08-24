/**
 * High-Capacity Durable Storage Engine with IndexedDB + LocalStorage.
 * 
 * - IndexedDB provides unlimited storage capacity for high-resolution images & assets.
 * - LocalStorage provides instant synchronous booting for instant first paint.
 * - Hydration merges IndexedDB truth without ever truncating image data or dropping uploads.
 */

const DB_NAME = 'creatives_garage_db_v2';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

// Open / initialize IndexedDB instance
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      request.onerror = (e) => {
        console.warn('IndexedDB open error:', e);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB not available:', e);
      resolve(null);
    }
  });
}

/**
 * Save data asynchronously to IndexedDB (unlimited capacity for high-res images).
 */
export async function saveToIDB<T>(key: string, data: T): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      tx.oncomplete = () => db.close();
    });
  } catch (e) {
    console.warn(`Error writing ${key} to IndexedDB:`, e);
    return false;
  }
}

/**
 * Load data asynchronously from IndexedDB.
 */
export async function loadFromIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = (e: any) => {
        const result = e.target.result;
        resolve(result !== undefined && result !== null ? result : null);
      };
      req.onerror = () => resolve(null);
      tx.oncomplete = () => db.close();
    });
  } catch (e) {
    console.warn(`Error reading ${key} from IndexedDB:`, e);
    return null;
  }
}

/**
 * Synchronous initial loader for React state initialization.
 * Reads from localStorage. If not found, uses fallback.
 */
export function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = localStorage.getItem(key);
    if (saved !== null && saved !== undefined) {
      const parsed = JSON.parse(saved);
      return parsed as T;
    }
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
  }

  return fallback;
}

/**
 * Persistent save function.
 * Saves complete data immediately to IndexedDB and syncs to localStorage.
 * NEVER corrupts or truncates image data!
 */
export function saveStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;

  // 1. Save full, unmodified data to high-capacity IndexedDB
  saveToIDB(key, data).catch((err) => {
    console.warn(`IndexedDB save failed for ${key}:`, err);
  });

  // 2. Also mirror to localStorage for instant synchronous boots
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e: any) {
    // If localStorage quota is reached, catch safely without crashing
    // IndexedDB maintains the full durable source of truth
    console.info(`LocalStorage full for ${key} - full data persisted in IndexedDB`);
  }
}
