'use client';

import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
};

const roundedMap: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export function Skeleton({ className = '', rounded = 'md', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden bg-gray-100 ${roundedMap[rounded]} ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)',
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className = '',
}: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Skeleton
      rounded="full"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
