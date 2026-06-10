import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Frontend-only configuration - API handled by external backend */

  // SEO Redirects - Old URLs to New URLs (301 Permanent)
  async redirects() {
    return [
      // About pages
      { source: "/about", destination: "/about-us", permanent: true },
      {
        source: "/about/:path*",
        destination: "/about-us/:path*",
        permanent: true,
      },

      // Partner pages — consolidated to /partners/* URL structure
      // Lending Partner Program (was /partners)
      { source: '/partners', destination: '/partners/lending-partner-program', permanent: true },
      { source: '/partners/apply', destination: '/partners/lending-partner-program/apply', permanent: true },
      { source: '/partners/edd/:id', destination: '/partners/lending-partner-program/edd/:id', permanent: true },
      // Proprietor Network (was /partners/proprietor)
      { source: '/partners/proprietor', destination: '/partners/proprietor-network', permanent: true },
      { source: '/partners/proprietor/:path*', destination: '/partners/proprietor-network/:path*', permanent: true },
      // Channel Partner (was /our-partners/channel and /channel-partner)
      { source: '/partners/channel', destination: '/partners/channel-partner', permanent: true },
      { source: '/channel-partner', destination: '/partners/channel-partner', permanent: true },
      { source: '/our-partners/channel', destination: '/partners/channel-partner', permanent: true },
      // Collection Partner (was /collect-partner)
      { source: '/collect-partner', destination: '/partners/collection-partner', permanent: true },
      // Investor Relations (was /our-partners/investor-relations and /partners/investors)
      { source: '/partners/investors', destination: '/partners/investor-relations', permanent: true },
      { source: '/our-partners/investor-relations', destination: '/partners/investor-relations', permanent: true },

      // Resource pages
      {
        source: "/resources/intrest-rate",
        destination: "/resources/interest-rates",
        permanent: true,
      },
      {
        source: "/resources/documents",
        destination: "/resources/document-checklist",
        permanent: true,
      },

      // Policy pages
      {
        source: "/interest-policy",
        destination: "/interest-rate-policy",
        permanent: true,
      },
      {
        source: "/kyc-policy",
        destination: "/kyc-aml-policy",
        permanent: true,
      },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      {
        source: "/settlement-and-writeoff-policy",
        destination: "/settlement-writeoff-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      { source: "/cookies", destination: "/cookie-policy", permanent: true },
      { source: "/rac", destination: "/refund-cancellation", permanent: true },
      {
        source: "/disclaimer-and-disclosure",
        destination: "/disclaimer-disclosure",
        permanent: true,
      },
      {
        source: "/fair-practice",
        destination: "/fair-practice-code",
        permanent: true,
      },

      // Hash URLs to proper pages
      {
        source: "/about-us",
        has: [{ type: "query", key: "", value: "" }],
        destination: "/about-us",
        permanent: false,
      },
    ];
  },

  async headers() {
    // Safe env handling
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://alpha.quikkred.in";
    const authUrl = process.env.NEXTAUTH_URL || "https://quikkred.in";

    let apiDomain = "https://alpha.quikkred.in";
    let appDomain = "https://quikkred.in";

    try {
      if (apiUrl && apiUrl !== "false") {
        apiDomain = new URL(apiUrl).origin;
      }
      if (authUrl && authUrl !== "false") {
        appDomain = new URL(authUrl).origin;
      }
    } catch (e) {
      console.warn("Invalid ENV URL:", { apiUrl, authUrl });
    }

    // WebSocket variants of the API + app domains (wss:// equivalents)
    const apiWsDomain = apiDomain.replace(/^https?:\/\//, "wss://");
    const appWsDomain = appDomain.replace(/^https?:\/\//, "wss://");

    return [
      {
        source: "/(.*)",
        headers: [
          // TEMPORARY (Meta Event Setup Tool): X-Frame-Options is absolute and
          // cannot allowlist Facebook, so it's disabled here while framing is
          // scoped to Facebook via CSP frame-ancestors below. REVERT after
          // event setup: restore `{ key: "X-Frame-Options", value: "DENY" }`
          // and set frame-ancestors back to 'none'.
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(), geolocation=(self), interest-cohort=()",
          },
          {
            // Best Practices audit: origin isolation. unsafe-none would fail
            // popup auth flows we don't have, so same-origin is the right level
            // for a public marketing site.
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://connect.facebook.net https://cdn.jsdelivr.net https://checkout.razorpay.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            img-src 'self' data: https: blob:;
            font-src 'self' data: https://fonts.gstatic.com;
            worker-src 'self' blob:;
            connect-src 'self' ${apiDomain} ${appDomain} ${apiWsDomain} ${appWsDomain} https://alpha.quikkred.in wss://alpha.quikkred.in https://b2b.quikkred.in https://alpha-b2b.quikkred.in https://ifsc.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://www.google.com https://stats.g.doubleclick.net https://googleads.g.doubleclick.net https://td.doubleclick.net https://connect.facebook.net https://www.facebook.com https://*.conversionsapigateway.com https://*.a.run.app https://cdn.jsdelivr.net https://storage.googleapis.com;
            frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://dunsregistered.dnb.com https://profiles.dunsregistered.com;
            frame-ancestors 'self' https://www.facebook.com https://business.facebook.com;
            upgrade-insecure-requests;
          `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
      // Long-cache static assets — Lighthouse flagged 4h TTL on images/videos/svgs
      // costing ~3.2 MB of repeat-visit savings. Filenames in /videos/ are stable;
      // root-level logo/favicon are stable too. Next.js fingerprints anything under
      // /_next/static already, so those don't need overriding here.
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf|mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Enable React Strict Mode to catch common bugs
  reactStrictMode: true,

  // Disable dev indicators
  devIndicators: false,

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.quikkred.in",
    NEXT_PUBLIC_APP_NAME: "Quikkred",
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Enable image optimization with AVIF and WebP
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year for static images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90, 100], // Support quality levels including 100
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Best Practices audit was flagging "Missing source maps for large
  // first-party JavaScript". Enabling here ships .map files alongside the JS;
  // browsers fetch them only when DevTools is open, so users don't pay the cost.
  productionBrowserSourceMaps: true,

  // Reduce bundle size with modularizeImports
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    recharts: {
      transform: "recharts/lib/{{member}}",
    },
    "react-icons": {
      transform: "react-icons/{{collection}}/{{member}}",
    },
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@tanstack/react-query",
      "recharts",
    ],
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
