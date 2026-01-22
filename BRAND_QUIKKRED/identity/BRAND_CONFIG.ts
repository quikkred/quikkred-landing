/**
 * Quikkred Brand Configuration
 * Central configuration for all brand-related settings
 */

export const BRAND_CONFIG = {
  // Company Information
  company: {
    name: "Quikkred",
    tagline: "Prosperity Through Technology",
    legalName: "Quikkred Financial Services Pvt. Ltd.",
    registration: "NBFC-MFI Registration",
    gst: "GSTIN: 27AABCL1234A1Z5",
    cin: "CIN: U65999MH2024PTC123456",
  },

  // Contact Information
  contact: {
    phone: {
      primary: "+91 88888 81111",
      support: "1800-123-5678",
      whatsapp: "+91 88888 81111",
    },
    email: {
      support: "support@quikkred.com",
      care: "care@Quikkred.com",
      business: "business@Quikkred.com",
      careers: "careers@Quikkred.com",
    },
    offices: [
      {
        city: "Mumbai (Head Office)",
        address: "Quikkred Tower, BKC, Bandra East, Mumbai - 400051",
        phone: "+91 22 6789 0000",
      },
      {
        city: "Bangalore",
        address: "Tech Park, Outer Ring Road, Marathahalli, Bangalore - 560037",
        phone: "+91 80 6789 0000",
      },
      {
        city: "Delhi NCR",
        address: "DLF Cyber City, Phase 2, Gurugram - 122002",
        phone: "+91 124 6789 0000",
      },
    ],
  },

  // Product Configuration
  products: {
    salaryAdvance: {
      minAmount: 5000,
      maxAmount: 200000,
      maxMultiplier: 2, // 2x monthly salary
      tenure: [1, 2, 3], // months
      interestRate: 1.5, // per month
      processingFee: 2, // percentage
    },
    personalLoan: {
      minAmount: 10000,
      maxAmount: 500000,
      tenure: [3, 6, 12, 18, 24], // months
      interestRate: 1.5, // per month
      processingFee: 2, // percentage
    },
  },

  // Eligibility Criteria
  eligibility: {
    age: {
      min: 21,
      max: 58,
    },
    income: {
      min: 15000, // monthly
    },
    employment: {
      minMonths: 6,
      type: ["salaried", "self-employed"],
    },
    cibil: {
      min: 650,
    },
  },

  // Partner Companies
  partners: {
    corporates: [
      "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra",
      "Cognizant", "Accenture", "IBM", "Capgemini", "Dell",
      "Amazon", "Flipkart", "Google", "Microsoft", "Oracle",
    ],
    banks: [
      "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra",
      "Yes Bank", "IDFC First", "IndusInd Bank",
    ],
    nbfcs: [
      "Bajaj Finance", "Muthoot Finance", "Manappuram Finance",
    ],
  },

  // Colors (CSS Variables)
  colors: {
    primary: {
      royalBlue: "#2563EB",
      emeraldGreen: "#10B981",
      gold: "#F59E0B",
    },
    secondary: {
      goldLight: "#FCD34D",
      pastelPink: "#FEE2E2",
      lightViolet: "#E9D5FF",
      silver: "#E5E7EB",
    },
    gradients: {
      prosperity: "from-violet-600 to-purple-600",
      Quikkred: "from-[#2563EB] via-[#10B981] to-[#F59E0B]",
      primary: "from-[#2563EB] to-[#10B981]",
    },
  },

  // Typography
  typography: {
    fonts: {
      heading: "Sora",
      body: "Inter",
    },
    sizes: {
      hero: "text-5xl lg:text-7xl",
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl",
      body: "text-base lg:text-lg",
      small: "text-sm",
    },
  },

  // Languages
  languages: [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
    { code: "as", name: "অসমীয়া", flag: "🇮🇳" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
  ],

  // Social Media
  social: {
    linkedin: "https://linkedin.com/company/Quikkred",
    twitter: "https://twitter.com/Quikkred",
    instagram: "https://instagram.com/Quikkred",
    facebook: "https://facebook.com/Quikkred",
    youtube: "https://youtube.com/@Quikkred",
  },

  // SEO & Meta
  seo: {
    title: "Quikkred - Instant Salary Advance & Payday Loans",
    description: "Get instant salary advance up to ₹2 lakhs in 30 seconds. No paperwork, 100% digital. RBI licensed NBFC for salaried employees.",
    keywords: [
      "salary advance",
      "payday loan",
      "instant loan",
      "personal loan",
      "emergency loan",
      "quick loan",
      "NBFC loan",
      "employee loan",
      "advance salary",
      "instant money",
    ],
    ogImage: "/og-image.png",
  },

  // API Endpoints
  api: {
    base: process.env.NEXT_PUBLIC_API_URL || "https://api.Quikkred.com",
    endpoints: {
      apply: "/loan/apply",
      eligibility: "/loan/eligibility",
      calculate: "/loan/calculate",
      track: "/application/track",
      verify: "/kyc/verify",
      cibil: "/credit/score",
    },
  },

  // Feature Flags
  features: {
    videoKyc: true,
    instantDisbursal: true,
    autoDeduction: true,
    emiCalculator: true,
    darkMode: true,
    multilingual: true,
    chatSupport: false, // Coming soon
    mobileApp: false, // Coming soon
    cryptoLoans: false, // Future
  },

  // Compliance & Security
  compliance: {
    rbi: {
      license: "NBFC-MFI/2024/123456",
      validity: "2024-2029",
    },
    certifications: [
      "ISO 27001:2013",
      "PCI DSS Level 1",
      "SOC 2 Type II",
    ],
    security: {
      encryption: "256-bit SSL",
      dataProtection: "GDPR Compliant",
      authentication: "Multi-factor",
    },
  },

  // Support Hours
  support: {
    hours: {
      phone: "24/7",
      chat: "9 AM - 9 PM IST",
      email: "24/7 (Response in 4 hours)",
      office: "Mon-Fri: 10 AM - 6 PM",
    },
    languages: [
      "English", "Hindi", "Marathi", "Gujarati",
      "Bengali", "Tamil", "Telugu", "Kannada",
    ],
  },
};

export default BRAND_CONFIG;