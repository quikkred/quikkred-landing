/**
 * Sync Engine
 * Heartbeat (5-min interval), Beacon API for page close,
 * offline queue in localStorage, auto-flush on reconnect.
 */

import { API_BASE_URL } from '@/lib/config';

const QUEUE_KEY = 'qk_agent_queue';
const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_QUEUE_SIZE = 50;
const MAX_RETRIES = 3;

interface QueuedPayload {
  endpoint: string;
  data: any;
  attempts: number;
  createdAt: number;
}

function getQueue(): QueuedPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveQueue(queue: QueuedPayload[]): void {
  try {
    // Keep only recent items
    const trimmed = queue.slice(-MAX_QUEUE_SIZE);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
  } catch { /* ignore */ }
}

function addToQueue(endpoint: string, data: any): void {
  const queue = getQueue();
  queue.push({ endpoint, data, attempts: 0, createdAt: Date.now() });
  saveQueue(queue);
}

async function sendPayload(endpoint: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tracking${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export class SyncEngine {
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private snapshotFn: ((type?: string) => Promise<any>) | null = null;
  private flushing = false;

  /**
   * Set the function that produces a snapshot payload for each heartbeat.
   */
  setSnapshotProvider(fn: (type?: string) => Promise<any>): void {
    this.snapshotFn = fn;
  }

  /**
   * Send data to an agent endpoint. Queues if offline.
   */
  async send(endpoint: string, data: any): Promise<boolean> {
    if (!navigator.onLine) {
      addToQueue(endpoint, data);
      return false;
    }

    const ok = await sendPayload(endpoint, data);
    if (!ok) {
      addToQueue(endpoint, data);
    }
    return ok;
  }

  /**
   * Use Beacon API for guaranteed delivery on page close.
   */
  sendBeacon(endpoint: string, data: any): boolean {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
      addToQueue(endpoint, data);
      return false;
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return navigator.sendBeacon(`${API_BASE_URL}/api/tracking${endpoint}`, blob);
  }

  /**
   * Flush the offline queue.
   */
  async flush(): Promise<void> {
    if (this.flushing || !navigator.onLine) return;
    this.flushing = true;

    try {
      const queue = getQueue();
      if (queue.length === 0) return;

      const remaining: QueuedPayload[] = [];

      for (const item of queue) {
        if (item.attempts >= MAX_RETRIES) continue; // Drop after max retries
        // Drop items older than 24 hours
        if (Date.now() - item.createdAt > 24 * 60 * 60 * 1000) continue;

        const ok = await sendPayload(item.endpoint, item.data);
        if (!ok) {
          item.attempts++;
          remaining.push(item);
        }
      }

      saveQueue(remaining);
    } finally {
      this.flushing = false;
    }
  }

  /**
   * Start the heartbeat — sends a snapshot every 5 minutes.
   */
  startHeartbeat(): void {
    if (this.heartbeatTimer) return;

    // Flush any queued data first
    this.flush();

    this.heartbeatTimer = setInterval(async () => {
      if (!this.snapshotFn) return;
      try {
        const snapshot = await this.snapshotFn('heartbeat');
        await this.send('/agent/heartbeat', snapshot);
      } catch { /* ignore heartbeat failures */ }
    }, HEARTBEAT_INTERVAL);

    // Listen for online/offline
    window.addEventListener('online', () => this.flush());
  }

  /**
   * Stop the heartbeat.
   */
  stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Is the heartbeat running?
   */
  isRunning(): boolean {
    return this.heartbeatTimer !== null;
  }
}

export const syncEngine = new SyncEngine();
