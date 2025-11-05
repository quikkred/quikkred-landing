'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Tri-Phase Loading: Phase 1 - Ultra-light splash with animated logo
 * CSS-only animation, no blocking JS, respects reduced-motion
 */
export default function LoadingSplash() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-green-gold"
      role="status"
      aria-live="polite"
      aria-label="Loading application"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: 'easeOut',
          }}
        >
          <Image
            src="/logo.png"
            alt="Quikkred"
            width={200}
            height={200}
            priority
            className="mx-auto mb-4"
          />
        </motion.div>

        {!prefersReducedMotion && (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: '300ms' }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
