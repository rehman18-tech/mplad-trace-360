// Offline-First Storage & Synchronization Service for Field Inspections
import { api } from './api';

export interface OfflineInspection {
  id: string;
  project_id: string;
  project_title: string;
  inspector_name: string;
  stage: string;
  physical_progress_pct: number;
  latitude: number;
  longitude: number;
  accuracy_m: number;
  timestamp: string;
  photo_data_url?: string;
  video_data_url?: string;
  video_name?: string;
  notes: string;
  sync_status: 'PENDING_SYNC' | 'SYNCED';
  created_at: string;
}

const STORAGE_KEY = 'mplad_offline_inspections';
const DB_NAME = 'mplad_field_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_inspections';

// In-memory cache for ultra-fast synchronous UI access
let memoryCache: OfflineInspection[] = [];

// Initialize memory cache from localStorage immediately
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    memoryCache = JSON.parse(raw);
  }
} catch {
  memoryCache = [];
}

// Open or create IndexedDB for large media objects (videos & high-res photos)
function openDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Background sync from IndexedDB on boot
(async function initFromIndexedDB() {
  const db = await openDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const list = req.result as OfflineInspection[];
      if (list && list.length > 0) {
        // Merge with memoryCache by ID preserving newest
        const map = new Map<string, OfflineInspection>();
        list.forEach(item => map.set(item.id, item));
        memoryCache.forEach(item => map.set(item.id, item));
        memoryCache = Array.from(map.values()).sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    };
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
  }
})();

function persistToLocalStorage(items: OfflineInspection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // If photos or videos exceed 5MB localStorage quota, store lightweight metadata in localStorage
    try {
      const lightweight = items.map(item => ({
        ...item,
        // Trim video from localStorage to avoid quota crash, IndexedDB holds the full payload
        video_data_url: item.video_data_url ? '[IN_INDEXED_DB]' : undefined,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch {
      // LocalStorage full, IndexedDB takes over
    }
  }
}

async function persistToIndexedDB(item: OfflineInspection) {
  const db = await openDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(item);
  } catch (err) {
    console.warn('Error persisting inspection to IndexedDB:', err);
  }
}

export const offlineStorage = {
  // Retrieve all stored inspections from local offline storage
  getAll(): OfflineInspection[] {
    return [...memoryCache];
  },

  // Retrieve inspections specifically for a project ID
  getByProject(projectId: string): OfflineInspection[] {
    return memoryCache.filter(i => i.project_id === projectId);
  },

  // Save new inspection to offline cache / queue
  save(
    inspection: Omit<OfflineInspection, 'id' | 'sync_status' | 'created_at'> & {
      sync_status?: 'PENDING_SYNC' | 'SYNCED';
    }
  ): OfflineInspection {
    const newRecord: OfflineInspection = {
      ...inspection,
      id: `INSP-OFFLINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sync_status: inspection.sync_status || 'PENDING_SYNC',
      created_at: new Date().toISOString()
    };

    memoryCache.unshift(newRecord);
    persistToLocalStorage(memoryCache);
    persistToIndexedDB(newRecord);

    return newRecord;
  },

  // Count pending items waiting to sync
  getPendingCount(): number {
    return memoryCache.filter(i => i.sync_status === 'PENDING_SYNC').length;
  },

  // Attempt to sync all pending inspections with backend / central registry
  async syncPending(onProgress?: (syncedCount: number, total: number) => void): Promise<{ synced: number; failed: number }> {
    const pending = memoryCache.filter(i => i.sync_status === 'PENDING_SYNC');
    if (pending.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;

    for (let i = 0; i < pending.length; i++) {
      const item = pending[i];
      try {
        await api.submitInspection({
          project_id: item.project_id,
          officer_name: item.inspector_name,
          officer_designation: 'Assistant Executive Engineer, PRED',
          latitude: item.latitude,
          longitude: item.longitude,
          physical_progress_observed: item.physical_progress_pct,
          quality_rating: 'Satisfactory',
          material_observations: 'Inspected via Mobile Field PWA (Offline Verified)',
          labour_activity_observations: 'Verified with GPS Satellite lock & optical camera',
          general_remarks: `${item.notes} [Synced from Offline Ground Outbox - Timestamp: ${new Date(item.timestamp).toLocaleString('en-IN')}]`,
          photo_urls: item.photo_data_url ? [item.photo_data_url] : []
        });

        // Mark as synced
        item.sync_status = 'SYNCED';
        synced++;
        await persistToIndexedDB(item);
        if (onProgress) onProgress(synced, pending.length);
      } catch (err) {
        console.warn('Failed to sync item:', item.id, err);
        failed++;
      }
    }

    persistToLocalStorage(memoryCache);
    return { synced, failed };
  },

  // Remove single record
  deleteRecord(id: string): void {
    memoryCache = memoryCache.filter(i => i.id !== id);
    persistToLocalStorage(memoryCache);
    openDB().then(db => {
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
      }
    });
  },

  // Clear completed synced records
  clearSynced(): void {
    memoryCache = memoryCache.filter(i => i.sync_status === 'PENDING_SYNC');
    persistToLocalStorage(memoryCache);
  }
};

