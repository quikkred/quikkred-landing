import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Frontend-only configuration - API handled by external backend */

  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Disable React Strict Mode to prevent double API calls in development
  reactStrictMode: false,

  // Disable dev indicators
devIndicators: false,

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
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

  eslint: {
    ignoreDuringBuilds: true,
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

  // Optimize output
  poweredByHeader: false,
  compress: true,

  // Bundle analyzer (optional - uncomment to analyze)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.optimization.splitChunks.cacheGroups = {
  //       default: false,
  //       vendors: false,
  //       lib: {
  //         test: /[\/]node_modules[\/]/,
  //         name: 'vendor',
  //         chunks: 'all',
  //         priority: 10,
  //       },
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
