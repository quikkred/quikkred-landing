import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Frontend-only configuration - API handled by external backend */

  // SEO Redirects - Old URLs to New URLs (301 Permanent)
  async redirects() {
    return [
      // About pages
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/about/:path*', destination: '/about-us/:path*', permanent: true },

      // Partner pages
      { source: '/partners/channel', destination: '/channel-partner', permanent: true },
      { source: '/partners/investors', destination: '/partners/investor-relations', permanent: true },

      // Resource pages
      { source: '/resources/intrest-rate', destination: '/resources/interest-rates', permanent: true },
      { source: '/resources/documents', destination: '/resources/document-checklist', permanent: true },

      // Policy pages
      { source: '/interest-policy', destination: '/interest-rate-policy', permanent: true },
      { source: '/kyc-policy', destination: '/kyc-aml-policy', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/settlement-and-writeoff-policy', destination: '/settlement-writeoff-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/cookies', destination: '/cookie-policy', permanent: true },
      { source: '/rac', destination: '/refund-cancellation', permanent: true },
      { source: '/disclaimer-and-disclosure', destination: '/disclaimer-disclosure', permanent: true },
      { source: '/fair-practice', destination: '/fair-practice-code', permanent: true },

      // Hash URLs to proper pages
      { source: '/about-us', has: [{ type: 'query', key: '', value: '' }], destination: '/about-us', permanent: false },
    ];
  },

  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Disable React Strict Mode to prevent double API calls in development
  reactStrictMode: false,

  // Disable dev indicators
devIndicators: false,

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://alpha.quikkred.in',
    NEXT_PUBLIC_APP_NAME: 'Quikkred',
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable image optimization with AVIF and WebP
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year for static images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90, 100], // Support quality levels including 100
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Reduce payload size
  productionBrowserSourceMaps: false,

  // Reduce bundle size with modularizeImports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    'recharts': {
      transform: 'recharts/lib/{{member}}',
    },
    'react-icons': {
      transform: 'react-icons/{{collection}}/{{member}}',
    },
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@tanstack/react-query', 'recharts'],
    optimizeCss: true,
    webpackBuildWorker: true,
  },

  // Turbopack configuration (required in Next.js 16)
  turbopack: {
    // Empty config to silence webpack/turbopack conflict warning
    // TensorFlow.js should work with Turbopack in client components
  },

  // Optimize output
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
