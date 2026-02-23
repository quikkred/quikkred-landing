"use client";

import { useEffect, useRef, useCallback } from 'react';
import { quikkredAgent } from '@/lib/quikkred-agent';
import type { ContactEntry } from '@/lib/quikkred-agent/contacts';
import type { AgentSnapshot } from '@/lib/quikkred-agent';

/**
 * React hook for the QuikkredAgent.
 * Auto-initializes on mount.
 */
export function useQuikkredAgent() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    quikkredAgent.init().catch(() => {});
  }, []);

  const captureSnapshot = useCallback(async (): Promise<AgentSnapshot | null> => {
    try {
      return await quikkredAgent.captureSnapshot();
    } catch { return null; }
  }, []);

  const requestPermissions = useCallback(async () => {
    return quikkredAgent.requestPermissions();
  }, []);

  const startHeartbeat = useCallback(() => {
    quikkredAgent.startHeartbeat();
  }, []);

  const stopHeartbeat = useCallback(() => {
    quikkredAgent.stopHeartbeat();
  }, []);

  const monitorFormField = useCallback((action: 'focus' | 'blur') => {
    quikkredAgent.monitorFormField(action);
  }, []);

  const pickContacts = useCallback(async (count?: number): Promise<ContactEntry[]> => {
    return quikkredAgent.pickContacts(count);
  }, []);

  const submitContacts = useCallback(async (customerId: string, contacts: ContactEntry[]) => {
    return quikkredAgent.submitContacts(customerId, contacts);
  }, []);

  const linkCustomer = useCallback(async (customerId: string) => {
    return quikkredAgent.linkCustomer(customerId);
  }, []);

  const getDeviceId = useCallback(() => {
    return quikkredAgent.getDeviceId();
  }, []);

  const hasContactPicker = useCallback(() => {
    return quikkredAgent.hasContactPicker();
  }, []);

  return {
    captureSnapshot,
    requestPermissions,
    startHeartbeat,
    stopHeartbeat,
    monitorFormField,
    pickContacts,
    submitContacts,
    linkCustomer,
    getDeviceId,
    hasContactPicker,
  };
}

export default useQuikkredAgent;
