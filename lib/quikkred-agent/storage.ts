/**
 * Triple-Storage Persistent Device ID
 * Uses localStorage + IndexedDB + cookie for resilient device identification.
 * If user clears one, others recover it.
 */

const STORAGE_KEY = 'qk_device_id';
const COOKIE_NAME = 'qk_did';
const IDB_STORE = 'device';
const IDB_DB = 'QuikkredAgent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function generateDeviceId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  const rand2 = Math.random().toString(36).substring(2, 6);
  return `qkd_${ts}_${rand}${rand2}`;
}

// --- Cookie ---
function getCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// --- localStorage ---
function getLS(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function setLS(value: string): void {
  try { localStorage.setItem(STORAGE_KEY, value); } catch { /* ignore */ }
}

// --- IndexedDB ---
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getIDB(): Promise<string | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(STORAGE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
      tx.oncomplete = () => db.close();
    });
  } catch { return null; }
}

async function setIDB(value: string): Promise<void> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put(value, STORAGE_KEY);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    });
  } catch { /* ignore */ }
}

/**
 * Get or create a persistent device ID.
 * Recovers from any single storage being cleared.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  if (typeof window === 'undefined') return '';

  // Read from all three sources
  const fromLS = getLS();
  const fromCookie = getCookie();
  let fromIDB: string | null = null;
  try { fromIDB = await getIDB(); } catch { /* ignore */ }

  // Find the first available ID
  const existing = fromLS || fromCookie || fromIDB;

  if (existing) {
    // Heal any missing stores
    if (!fromLS) setLS(existing);
    if (!fromCookie) setCookie(existing);
    if (!fromIDB) setIDB(existing).catch(() => {});
    return existing;
  }

  // Generate new ID and store everywhere
  const newId = generateDeviceId();
  setLS(newId);
  setCookie(newId);
  setIDB(newId).catch(() => {});
  return newId;
}

/**
 * Get the device ID synchronously (localStorage/cookie only, no IndexedDB).
 * Returns null if not yet initialized.
 */
export function getDeviceIdSync(): string | null {
  if (typeof window === 'undefined') return null;
  return getLS() || getCookie() || null;
}
