import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap. Next.js serves this at /sitemap.xml.
 * Whenever a new public marketing route is added, register it below.
 *
 * Do NOT include:
 *   - authenticated routes (/dashboard, /user/*, /profile, /settings)
 *   - debug/internal routes (/debug-cookies, /select-language)
 *   - dynamic parametric routes that aren't safe to crawl (/loans/[id], /blog/[blog])
 */

const SITE_URL = "https://www.quikkred.in";
const now = new Date();

// One pass of "lastModified" used everywhere keeps the file deterministic
// across the same deploy; bump on each deploy via the build timestamp.
const lastModified = now;

type Entry = MetadataRoute.Sitemap[number];

const entry = (
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"] = "weekly"
): Entry => ({
  url: `${SITE_URL}${path}`,
  lastModified,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Primary landing pages ─────────────────────────────
    entry("/", 1.0, "daily"),
    entry("/products", 0.9, "weekly"),
    entry("/apply", 0.9, "weekly"),
    entry("/apply/quick", 0.9, "weekly"),
    entry("/eligibility", 0.8, "weekly"),
    entry("/eligibility-check", 0.8, "weekly"),
    entry("/emi-calculator", 0.85, "weekly"),
    entry("/daily-ladder", 0.85, "weekly"),

    // ── About / company ───────────────────────────────────
    entry("/about-us", 0.85, "monthly"),
    entry("/about-us/our-story", 0.7, "monthly"),
    entry("/about-us/leadership-team", 0.7, "monthly"),
    entry("/about-us/csr", 0.6, "monthly"),
    entry("/about-us/press", 0.6, "monthly"),
    entry("/awards", 0.6, "monthly"),
    entry("/careers", 0.65, "weekly"),
    entry("/contact", 0.8, "monthly"),
    entry("/branches", 0.6, "monthly"),
    entry("/testimonials", 0.6, "weekly"),

    // ── Partners ──────────────────────────────────────────
    entry("/our-partners", 0.8, "monthly"),
    entry("/our-partners/corporate", 0.65, "monthly"),
    entry("/our-partners/api", 0.65, "monthly"),
    entry("/partners/lending-partner-program", 0.8, "monthly"),
    entry("/partners/lending-partner-program/apply", 0.7, "monthly"),
    entry("/partners/proprietor-network", 0.75, "monthly"),
    entry("/partners/proprietor-network/apply", 0.7, "monthly"),
    entry("/partners/channel-partner", 0.7, "monthly"),
    entry("/partners/collection-partner", 0.65, "monthly"),
    entry("/partners/investor-relations", 0.7, "monthly"),

    // ── Resources ─────────────────────────────────────────
    entry("/resources", 0.7, "weekly"),
    entry("/resources/blog", 0.7, "weekly"),
    entry("/resources/eligibility", 0.7, "monthly"),
    entry("/resources/eligibility-check", 0.7, "monthly"),
    entry("/resources/emi-calculator", 0.7, "monthly"),
    entry("/resources/document-checklist", 0.7, "monthly"),
    entry("/resources/faqs", 0.7, "monthly"),
    entry("/resources/how-to-apply", 0.7, "monthly"),
    entry("/resources/interest-rates", 0.7, "monthly"),
    entry("/document-checklist", 0.65, "monthly"),
    entry("/downloads", 0.6, "monthly"),
    entry("/interest-rates", 0.7, "monthly"),
    entry("/blog", 0.7, "weekly"),
    entry("/blogs", 0.6, "weekly"),

    // ── Support / regulatory ──────────────────────────────
    entry("/support", 0.65, "monthly"),
    entry("/track-application", 0.6, "monthly"),
    entry("/application-status", 0.6, "monthly"),
    entry("/complaint", 0.6, "yearly"),
    entry("/grievance", 0.65, "yearly"),
    entry("/nodal-officer", 0.6, "yearly"),
    entry("/report-fraud", 0.6, "yearly"),
    entry("/rbi-guidelines", 0.6, "yearly"),
    entry("/account-deletion", 0.5, "yearly"),

    // ── Policies (low frequency, important for trust) ─────
    entry("/privacy-policy", 0.5, "yearly"),
    entry("/terms-and-conditions", 0.5, "yearly"),
    entry("/cookie-policy", 0.4, "yearly"),
    entry("/fair-practice-code", 0.5, "yearly"),
    entry("/grievance-redressal-policy", 0.5, "yearly"),
    entry("/interest-rate-policy", 0.5, "yearly"),
    entry("/kyc-aml-policy", 0.5, "yearly"),
    entry("/credit-policy", 0.45, "yearly"),
    entry("/collection-policy", 0.45, "yearly"),
    entry("/lending-policy", 0.45, "yearly"),
    entry("/investment-policy", 0.4, "yearly"),
    entry("/it-security-policy", 0.4, "yearly"),
    entry("/refund-cancellation", 0.45, "yearly"),
    entry("/settlement-writeoff-policy", 0.4, "yearly"),
    entry("/disclaimer-disclosure", 0.45, "yearly"),
  ];
}
