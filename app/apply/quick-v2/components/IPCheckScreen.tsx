'use client';

import { motion } from 'framer-motion';
import { Loader2, MapPin, Shield, XCircle, RefreshCw, Phone } from 'lucide-react';

interface IPCheckLoadingProps {
  message?: string;
}

export function IPCheckLoading({ message = 'Checking service availability...' }: IPCheckLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-10 h-10 text-[#25B181]" />
          </div>
          <motion.div
            className="absolute inset-0 w-20 h-20 mx-auto border-4 border-[#25B181]/30 border-t-[#25B181] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mt-6">{message}</h2>
        <p className="text-gray-500 mt-2">This will only take a moment</p>

        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Your data is secure</span>
        </div>
      </div>
    </motion.div>
  );
}

interface BlockedScreenProps {
  type: 'vpn' | 'region' | 'error';
  message?: string;
  state?: string;
  onRetry?: () => void;
}

export function BlockedScreen({ type, message, state, onRetry }: BlockedScreenProps) {
  const content = {
    vpn: {
      icon: <Shield className="w-12 h-12 text-red-500" />,
      title: 'VPN Detected',
      description: 'Please disable your VPN or proxy and try again. We need to verify your actual location for regulatory compliance.',
      action: 'Disable VPN and Retry',
    },
    region: {
      icon: <MapPin className="w-12 h-12 text-orange-500" />,
      title: 'Service Not Available',
      description: `We're sorry, but our services are currently not available in ${state || 'your region'}. We are working to expand our coverage.`,
      action: null,
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      title: 'Something Went Wrong',
      description: message || 'We couldn\'t verify your location. Please try again.',
      action: 'Try Again',
    },
  };

  const { icon, title, description, action } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        {type === 'region' && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-orange-700">
              <strong>Unavailable regions:</strong> Andaman & Nicobar, Arunachal Pradesh, Assam,
              Jammu & Kashmir, Ladakh, Lakshadweep, Manipur, Meghalaya, Mizoram, Nagaland,
              Sikkim, Tripura, Daman & Diu
            </p>
          </div>
        )}

        {action && onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-3 bg-[#25B181] text-white rounded-xl font-medium hover:bg-[#1d8f6a] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            {action}
          </button>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Need help?</p>
          <a
            href="tel:+919599238889"
            className="inline-flex items-center gap-2 text-[#25B181] font-medium hover:underline"
          >
            <Phone className="w-4 h-4" />
            +91 9599238889
          </a>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Go back to home
        </button>
      </div>
    </motion.div>
  );
}

export default { IPCheckLoading, BlockedScreen };
