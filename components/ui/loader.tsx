'use client';

import { motion } from 'framer-motion';

// Simple className utility
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'spinner' | 'dots' | 'pulse' | 'brand';
  className?: string;
  fullScreen?: boolean;
}

export function Loader({ size = 'md', variant = 'brand', className, fullScreen = false }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'flex items-center justify-center';

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn(sizeClasses[size], 'relative', className)}>
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        );

      case 'dots':
        return (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-emerald-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={cn(sizeClasses[size], 'bg-emerald-600 rounded-full', className)}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        );

      case 'brand':
        return (
          <div className={cn('relative', sizeClasses[size], className)}>
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-emerald-600 border-r-emerald-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 border-4 border-transparent border-b-gold-500 border-l-gold-500 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner circle with logo */}
            <div className="absolute inset-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center">
              <span className="text-gold-400 font-bold text-xl">₹</span>
            </div>
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        );

      default:
        return (
          <div className={cn(sizeClasses[size], 'relative', className)}>
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        );
    }
  };

  if (fullScreen) {
    return (
      <div className={containerClasses}>
        <div className="text-center">
          {renderLoader()}
          <motion.p
            className="mt-4 text-gray-600 font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return <div className={containerClasses}>{renderLoader()}</div>;
}

// Page Loader Component
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gold-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 border-8 border-transparent border-t-emerald-600 border-r-emerald-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Middle rotating ring */}
          <motion.div
            className="absolute inset-4 border-6 border-transparent border-b-gold-500 border-l-gold-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          {/* Inner circle */}
          <motion.div
            className="absolute inset-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(34, 197, 94, 0.3)',
                '0 0 40px rgba(34, 197, 94, 0.6)',
                '0 0 20px rgba(34, 197, 94, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-gold-400 font-bold text-4xl">₹</span>
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.h2
          className="text-3xl font-heading font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Quikkred
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Trust. Grow. Shine.
        </motion.p>

        {/* Loading dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-emerald-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Button Loader (for inline button loading states)
export function ButtonLoader({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-5 w-5', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Skeleton Loader for content
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)}>
      <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
    </div>
  );
}
