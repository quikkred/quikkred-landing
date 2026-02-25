/**
 * Contact Access
 * Uses navigator.contacts (Chrome Android) with manual entry fallback.
 */

import { API_BASE_URL } from '@/lib/config';

export interface ContactEntry {
  name: string;
  phone: string;
  relationship: string;
}

/**
 * Check if the Contact Picker API is available (Chrome Android only).
 */
export function isContactPickerAvailable(): boolean {
  return typeof window !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window;
}

/**
 * Open the native contact picker (Chrome Android).
 * Returns selected contacts with name and phone.
 */
export async function pickContacts(count: number = 5): Promise<ContactEntry[]> {
  if (!isContactPickerAvailable()) return [];

  try {
    const contacts = await (navigator as any).contacts.select(
      ['name', 'tel'],
      { multiple: true }
    );

    return contacts.slice(0, count).map((c: any) => ({
      name: c.name?.[0] || '',
      phone: c.tel?.[0] || '',
      relationship: '', // User fills this in
    }));
  } catch {
    return []; // User cancelled or API error
  }
}

/**
 * Submit contacts to backend for fraud analysis.
 */
export async function submitContacts(
  customerId: string,
  contacts: ContactEntry[],
  deviceId: string
): Promise<{ success: boolean; riskScore?: number; flags?: any[] }> {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/tracking/agent/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ customerId, contacts, deviceId }),
    });

    if (!res.ok) return { success: false };
    return await res.json();
  } catch {
    return { success: false };
  }
}
