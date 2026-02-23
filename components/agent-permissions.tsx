"use client";

import { useState, useCallback } from 'react';
import { useQuikkredAgent } from '@/hooks/use-quikkred-agent';

interface AgentPermissionsProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (permissions: Record<string, string>) => void;
}

const PERMISSIONS = [
  {
    key: 'location',
    title: 'Location Access',
    description: 'Required for loan verification and fraud prevention as per RBI guidelines.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Get updates on your loan status, payment reminders, and important alerts.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    key: 'camera',
    title: 'Camera Access',
    description: 'Needed for selfie verification during KYC process.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
];

export function AgentPermissions({ isOpen, onClose, onComplete }: AgentPermissionsProps) {
  const { requestPermissions } = useQuikkredAgent();
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState<Record<string, string>>({});

  const handleAllow = useCallback(async () => {
    setLoading(true);
    try {
      const results = await requestPermissions();
      setGranted(results);
      onComplete?.(results);
      // Auto-close after brief delay to show results
      setTimeout(onClose, 1500);
    } catch {
      onClose();
    } finally {
      setLoading(false);
    }
  }, [requestPermissions, onClose, onComplete]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="p-6 max-w-lg mx-auto">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">App Permissions</h2>
            <p className="text-sm text-gray-500 mt-1">
              These permissions help us serve you better and keep your account secure.
            </p>
          </div>

          {/* Permission Items */}
          <div className="space-y-4 mb-6">
            {PERMISSIONS.map((perm) => (
              <div
                key={perm.key}
                className="flex items-start gap-4 p-3 rounded-xl bg-gray-50"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                  {perm.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 text-sm">{perm.title}</h3>
                    {granted[perm.key] === 'granted' && (
                      <span className="text-xs text-emerald-600 font-medium">Allowed</span>
                    )}
                    {granted[perm.key] === 'denied' && (
                      <span className="text-xs text-red-500 font-medium">Denied</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Consent text */}
          <p className="text-[11px] text-gray-400 text-center mb-4 leading-relaxed">
            By allowing permissions, you consent to Quikkred collecting this data for loan processing,
            fraud prevention, and account security as per our{' '}
            <a href="/privacy-policy" className="text-emerald-600 underline">Privacy Policy</a>.
            You can revoke permissions anytime from your browser settings.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Maybe Later
            </button>
            <button
              onClick={handleAllow}
              disabled={loading}
              className="flex-1 py-3 px-4 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Requesting...' : 'Allow All'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default AgentPermissions;
