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

export const offlineStorage = {
  // Retrieve all stored inspections from local offline storage
  getAll(): OfflineInspection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Retrieve inspections specifically for a project ID
  getByProject(projectId: string): OfflineInspection[] {
    return this.getAll().filter(i => i.project_id === projectId);
  },

  // Save new inspection to offline queue
  save(inspection: Omit<OfflineInspection, 'id' | 'sync_status' | 'created_at'>): OfflineInspection {
    const all = this.getAll();
    const newRecord: OfflineInspection = {
      ...inspection,
      id: `INSP-OFFLINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sync_status: 'PENDING_SYNC',
      created_at: new Date().toISOString()
    };
    all.unshift(newRecord);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage quota or storage error:', e);
    }
    return newRecord;
  },

  // Count pending items waiting to sync
  getPendingCount(): number {
    return this.getAll().filter(i => i.sync_status === 'PENDING_SYNC').length;
  },

  // Attempt to sync all pending inspections with FastAPI backend
  async syncPending(onProgress?: (syncedCount: number, total: number) => void): Promise<{ synced: number; failed: number }> {
    const all = this.getAll();
    const pending = all.filter(i => i.sync_status === 'PENDING_SYNC');
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
          material_observations: 'Inspected via Mobile Field PWA',
          labour_activity_observations: 'Verified with GPS Satellite lock & camera',
          general_remarks: `${item.notes} [Synced from Offline Mobile Outbox - Captured at ${new Date(item.timestamp).toLocaleString('en-IN')}]`,
          photo_urls: item.photo_data_url ? [item.photo_data_url] : []
        });

        // Mark as synced
        item.sync_status = 'SYNCED';
        synced++;
        if (onProgress) onProgress(synced, pending.length);
      } catch (err) {
        console.warn('Failed to sync item:', item.id, err);
        failed++;
      }
    }

    // Update storage with synced statuses
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { synced, failed };
  },

  // Clear completed synced records
  clearSynced(): void {
    const pendingOnly = this.getAll().filter(i => i.sync_status === 'PENDING_SYNC');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingOnly));
  }
};
