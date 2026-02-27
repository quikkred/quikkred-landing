/**
 * QuikkredAgent — Singleton orchestrator
 * Manages device identity, location, behavioral biometrics, sync, contacts, and push.
 */

import { getOrCreateDeviceId, getDeviceIdSync } from './storage';
import { captureLocation, type EnhancedLocation } from './location';
import { behavioralCollector, type BehavioralData } from './behavioral';
import { syncEngine } from './sync';
import { isContactPickerAvailable, pickContacts, submitContacts, type ContactEntry } from './contacts';
import { registerServiceWorker, subscribePush, getNotificationPermission, requestNotificationPermission } from './push';
import { deviceFingerprint } from '@/lib/device-fingerprint';
import { API_BASE_URL } from '@/lib/config';
import getToken from '@/lib/getToken';

export interface AgentSnapshot {
  customerId: string | null;
  deviceId: string;
  fingerprintId: string | null;
  visitorId: string | null;
  type: string;
  location: EnhancedLocation;
  behavioral: BehavioralData;
  battery: { charging: boolean | null; level: number | null } | null;
  network: { connectionType: string | null; effectiveType: string | null; onLine: boolean };
  page: string;
  ipAddress: string | null;
  permissions: Record<string, string>;
  timestamp: number;
}

export interface RiskScoreResponse {
  success: boolean;
  riskScore: number;
  riskLevel: string;
  flags: any[];
  networkAnalysis?: {
    connectedBorrowers: number;
    ringDetected: boolean;
    ringPath: any[];
    sharedContacts: number;
    defaulterConnections: number;
  };
}

class QuikkredAgent {
  private deviceId: string = '';
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private customerId: string | null = null;

  /**
   * Initialize the agent. Idempotent — safe to call multiple times.
   */
  async init(): Promise<string> {
    if (this.initialized) return this.deviceId;
    if (this.initPromise) { await this.initPromise; return this.deviceId; }

    this.initPromise = this._doInit();
    await this.initPromise;
    return this.deviceId;
  }

  private async _doInit(): Promise<void> {
    if (typeof window === 'undefined') return;

    // 1. Get persistent device ID
    this.deviceId = await getOrCreateDeviceId();

    // 2. Start behavioral collection
    behavioralCollector.start();

    // 3. Register service worker
    this.swRegistration = await registerServiceWorker();

    // 4. Set up sync engine with snapshot provider
    syncEngine.setSnapshotProvider((type?: string) => this.captureSnapshot(type));

    // 5. Skip initial snapshot — will be sent after login via linkCustomer()

    // 6. Set up page close beacon
    window.addEventListener('beforeunload', () => {
      try {
        const sync = getDeviceIdSync();
        if (sync) {
          syncEngine.sendBeacon('/agent/heartbeat', {
            customerId: this.customerId || localStorage.getItem('userId'),
            deviceId: sync,
            type: 'pageclose',
            page: window.location.href,
            timestamp: Date.now(),
          });
        }
      } catch { /* ignore */ }
    });

    this.initialized = true;
  }

  /**
   * Capture a full snapshot of all agent data.
   */
  async captureSnapshot(type: string = 'snapshot'): Promise<AgentSnapshot> {
    const [location, battery] = await Promise.all([
      captureLocation(),
      this.getBattery(),
    ]);

    const fp = deviceFingerprint.get();
    const visitorId = typeof window !== 'undefined' ? localStorage.getItem('qk_visitor_id') : null;
    const customerId = this.customerId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);

    return {
      customerId,
      deviceId: this.deviceId,
      fingerprintId: fp?.fingerprintId || null,
      visitorId,
      type,
      location,
      behavioral: behavioralCollector.snapshot(),
      battery,
      network: this.getNetwork(),
      page: typeof window !== 'undefined' ? window.location.href : '',
      ipAddress: null,
      permissions: await this.getPermissions(),
      timestamp: Date.now(),
    };
  }

  /**
   * Start the heartbeat (every 5 min).
   */
  startHeartbeat(): void {
    syncEngine.startHeartbeat();
  }

  /**
   * Stop the heartbeat.
   */
  stopHeartbeat(): void {
    syncEngine.stopHeartbeat();
  }

  /**
   * Link agent to a customer (call after login).
   */
  async linkCustomer(customerId: string): Promise<void> {
    if (!customerId) return;
    this.customerId = customerId;
    // Send snapshot with customerId after login
    try {
      const snapshot = await this.captureSnapshot();
      await syncEngine.send('/agent/snapshot', snapshot);
    } catch { /* non-critical */ }
  }

  /**
   * Get the device ID (sync).
   */
  getDeviceId(): string {
    return this.deviceId || getDeviceIdSync() || '';
  }

  /**
   * Request all permissions (location, notification, camera).
   */
  async requestPermissions(): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    // Location
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      results.location = pos ? 'granted' : 'denied';
    } catch {
      results.location = 'denied';
    }

    // Notifications
    results.notifications = await requestNotificationPermission();

    // Subscribe to push if granted
    if (results.notifications === 'granted' && this.swRegistration) {
      await subscribePush(this.swRegistration, this.deviceId, this.customerId || undefined);
    }

    return results;
  }

  /**
   * Pick contacts via Contact Picker API.
   */
  async pickContacts(count?: number): Promise<ContactEntry[]> {
    return pickContacts(count);
  }

  /**
   * Submit contacts for fraud analysis.
   */
  async submitContacts(customerId: string, contacts: ContactEntry[], applicationId?: string) {
    return submitContacts(customerId, contacts, applicationId);
  }

  /**
   * Check if contact picker is available.
   */
  hasContactPicker(): boolean {
    return isContactPickerAvailable();
  }

  /**
   * Monitor a form field for behavioral biometrics.
   */
  monitorFormField(action: 'focus' | 'blur'): void {
    if (action === 'focus') behavioralCollector.onFieldFocus();
    else behavioralCollector.onFieldBlur();
  }

  /**
   * Fetch risk score from the backend for a customer.
   * Tries admin endpoint first, falls back to contacts endpoint for customer role.
   */
  async fetchRiskScore(customerId?: string): Promise<RiskScoreResponse | null> {
    const id = customerId || this.customerId || localStorage.getItem('userId');
    if (!id) return null;

    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Try admin risk endpoint
      const res = await fetch(`${API_BASE_URL}/api/tracking/agent/risk/${id}`, {
        method: 'GET',
        headers,
      });

      if (res.ok) return await res.json();

      // If 403 (customer role), fall back to contacts endpoint with empty contacts
      if (res.status === 403) {
        const fallback = await fetch(`${API_BASE_URL}/api/tracking/agent/contacts`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ customerId: id, contacts: [] }),
        });

        if (fallback.ok) return await fallback.json();
      }

      return null;
    } catch {
      return null;
    }
  }

  // --- Private helpers ---

  private async getBattery(): Promise<{ charging: boolean | null; level: number | null } | null> {
    try {
      const batt = await (navigator as any).getBattery?.();
      if (!batt) return null;
      return { charging: batt.charging, level: batt.level != null ? Math.round(batt.level * 100) : null };
    } catch { return null; }
  }

  private getNetwork(): { connectionType: string | null; effectiveType: string | null; onLine: boolean } {
    const conn = (navigator as any).connection || (navigator as any).mozConnection;
    return {
      connectionType: conn?.type || null,
      effectiveType: conn?.effectiveType || null,
      onLine: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };
  }

  private async getPermissions(): Promise<Record<string, string>> {
    const perms: Record<string, string> = {};
    if (typeof navigator === 'undefined' || !navigator.permissions) return perms;

    const queryMap: Record<string, string> = {
      geolocation: 'location',
      notifications: 'notifications',
      camera: 'camera',
      contacts: 'contacts',
    };

    for (const [queryName, key] of Object.entries(queryMap)) {
      try {
        const status = await navigator.permissions.query({ name: queryName as PermissionName });
        perms[key] = status.state;
      } catch {
        perms[key] = 'unknown';
      }
    }
    return perms;
  }
}

// Singleton
export const quikkredAgent = new QuikkredAgent();
export default quikkredAgent;
