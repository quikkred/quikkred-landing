import type { MetadataRoute } from "next";

const SITE_URL = "https://www.quikkred.in";

/**
 * Dynamic robots.txt — served at /robots.txt.
 *
 * Disallow rules cover authenticated and internal routes that should never
 * appear in search results. The sitemap pointer ensures crawlers find the
 * canonical map of public URLs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/user",
          "/user/*",
          "/api/*",
          "/login",
          "/profile",
          "/settings",
          "/notifications",
          "/debug-cookies",
          "/select-language",
          "/aa-callback",
          "/auth/*",
          "/authorize-mandate",
          "/kyc",
          "/payments",
          "/referrals",
          "/reports",
          "/verify-truecaller",
          "/loaders-demo",
        ],
      },
      // Block the bigger AI/scraper bots from training on the corpus.
      {
        userAgent: ["GPTBot", "Google-Extended", "CCBot", "anthropic-ai", "ClaudeBot"],
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
