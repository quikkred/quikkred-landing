/**
 * Push Notification Service
 * Service Worker registration, VAPID key management, push subscription.
 */

import { API_BASE_URL } from '@/lib/config';

const SW_PATH = '/sw.js';
const VAPID_KEY_STORAGE = 'qk_vapid_key';

// Convert base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register the service worker.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, { scope: '/' });
    return registration;
  } catch (err) {
    console.error('[Agent] SW registration failed:', err);
    return null;
  }
}

/**
 * Fetch the VAPID public key from backend.
 */
async function getVapidKey(): Promise<string | null> {
  // Check cache first
  const cached = localStorage.getItem(VAPID_KEY_STORAGE);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/api/notification/vapid-key`);
    if (!res.ok) return null;
    const data = await res.json();
    const key = data.vapidKey || data.publicKey;
    if (key) localStorage.setItem(VAPID_KEY_STORAGE, key);
    return key || null;
  } catch {
    return null;
  }
}

/**
 * Subscribe to push notifications.
 */
export async function subscribePush(
  registration: ServiceWorkerRegistration,
  deviceId: string,
  customerId?: string
): Promise<PushSubscription | null> {
  try {
    // Check existing subscription
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing;

    const vapidKey = await getVapidKey();
    if (!vapidKey) return null;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    });

    // Send subscription to backend
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    await fetch(`${API_BASE_URL}/api/notification/push-subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        deviceId,
        customerId,
      }),
    });

    return subscription;
  } catch {
    return null;
  }
}

/**
 * Check notification permission status.
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return await Notification.requestPermission();
}
