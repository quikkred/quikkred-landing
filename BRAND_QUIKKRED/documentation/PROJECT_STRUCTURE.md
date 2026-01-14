# Quikkred Project Structure & Files

## 📁 Complete Directory Structure

```
Quikkred/
├── 📂 app/                           # Next.js 14 App Router
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles & CSS variables
│   ├── favicon.ico                   # Site favicon
│   │
│   ├── 📂 api/                       # API Routes
│   │   ├── 📂 loan/
│   │   │   └── apply/
│   │   │       └── route.ts         # Loan application API
│   │   ├── 📂 ai/
│   │   │   └── spending-analysis/
│   │   │       └── route.ts         # AI spending analysis
│   │   └── 📂 portfolio/
│   │       └── bad-debt/
│   │           └── route.ts         # Bad debt tracking
│   │
│   ├── 📂 products/                  # Product Pages
│   │   ├── page.tsx                  # All products listing
│   │   ├── 📂 personal-loan/
│   │   │   └── page.tsx             # Personal loan page
│   │   └── 📂 salary-advance/
│   │       └── page.tsx             # Salary advance page
│   │
│   ├── 📂 apply/                     # Application Flow
│   │   └── page.tsx                  # Multi-step application form
│   │
│   ├── 📂 resources/                 # Resource Pages
│   │   ├── 📂 emi-calculator/
│   │   │   └── page.tsx             # EMI calculator tool
│   │   └── 📂 faqs/
│   │       └── page.tsx             # FAQ page
│   │
│   ├── 📂 contact/                   # Contact
│   │   └── page.tsx                  # Contact form & info
│   │
│   ├── 📂 login/                     # Authentication
│   │   └── page.tsx                  # Login page
│   │
│   ├── 📂 track-application/         # Tracking
│   │   └── page.tsx                  # Application status
│   │
│   └── 📂 about/                     # About Section
│       └── page.tsx                  # About us page
│
├── 📂 components/                    # React Components
│   ├── header.tsx                    # Navigation header
│   ├── footer.tsx                    # Site footer
│   ├── hero-section.tsx              # Landing hero
│   ├── loading-screen.tsx            # Loading animation
│   ├── security-banner.tsx           # Security notice
│   ├── loan-calculator.tsx           # Calculator component
│   ├── feature-cards.tsx             # Feature showcase
│   └── providers.tsx                 # Context providers
│
├── 📂 lib/                           # Utilities & Config
│   └── i18n.ts                       # Internationalization
│
├── 📂 locales/                       # Translation Files
│   ├── en.json                       # English
│   ├── hi.json                       # Hindi
│   ├── mr.json                       # Marathi
│   ├── gu.json                       # Gujarati
│   ├── pa.json                       # Punjabi
│   ├── bn.json                       # Bengali
│   ├── ta.json                       # Tamil
│   ├── te.json                       # Telugu
│   ├── kn.json                       # Kannada
│   ├── ml.json                       # Malayalam
│   ├── or.json                       # Odia
│   ├── as.json                       # Assamese
│   └── ur.json                       # Urdu
│
├── 📂 public/                        # Static Assets
│   └── (images, icons)               # Public files
│
├── 📂 BRAND_SriKuberONE/               # Brand Assets & Docs
│   ├── 📂 identity/
│   │   └── BRAND_IDENTITY.md        # Brand guidelines
│   ├── 📂 documentation/
│   │   ├── PROJECT_STATUS.md        # Project progress
│   │   ├── PROJECT_STRUCTURE.md     # This file
│   │   └── README.md                # Original readme
│   ├── 📂 assets/
│   │   └── (logos, images)          # Brand assets
│   └── 📂 guidelines/
│       └── (style guides)            # Design guidelines
│
├── 📄 Config Files
│   ├── next.config.mjs               # Next.js configuration
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── tsconfig.json                 # TypeScript config
│   ├── package.json                  # Dependencies
│   ├── package-lock.json            # Lock file
│   ├── postcss.config.mjs           # PostCSS config
│   ├── .gitignore                    # Git ignore
│   └── .eslintrc.json               # ESLint config
│
└── 📄 Root Files
    └── next-env.d.ts                # Next.js types

```

---

## 📄 Key Files Description

### Core Application Files

#### `/app/layout.tsx`
- Root layout wrapper
- Font initialization (Inter, Sora)
- Provider setup
- Global components (Header, Footer, SecurityBanner)

#### `/app/page.tsx`
- Landing page
- LoadingScreen component
- Hero section with apply form
- Feature sections
- Trust indicators

#### `/app/globals.css`
- CSS custom properties
- Color variables (Lucky colors theme)
- Gradient definitions
- Tailwind utilities

### Component Files

#### `/components/header.tsx`
- Main navigation
- Product dropdown
- Mobile responsive menu
- Login/Apply CTAs

#### `/components/footer.tsx`
- Company info
- Quick links
- Legal links
- Newsletter signup
- Social links

#### `/components/hero-section.tsx`
- Multilingual apply form
- Language selector
- Quick eligibility check
- Trust badges

#### `/components/loading-screen.tsx`
- Gateway animation
- Language selection (first visit)
- Progress indication
- Welcome messages

### API Routes

#### `/app/api/loan/apply/route.ts`
- Loan application processing
- AI credit scoring
- 500+ data point analysis
- Instant decisioning

#### `/app/api/ai/spending-analysis/route.ts`
- Privacy-preserving analysis
- Data anonymization
- Spending patterns
- Risk assessment

### Product Pages

#### `/app/products/personal-loan/page.tsx`
- Product details
- EMI calculator
- Eligibility criteria
- Application CTA

#### `/app/products/salary-advance/page.tsx`
- Payday loan focus
- Company partnerships
- Auto-deduction info
- Quick approval

### Application Flow

#### `/app/apply/page.tsx`
- 5-step form wizard
- Personal details
- Employment info
- Document upload
- Loan requirements
- Review & submit

---

## 🎨 Styling Structure

### CSS Variables (globals.css)
```css
:root {
  --royal-blue: #2563EB;
  --emerald-green: #10B981;
  --gold: #F59E0B;
  --gold-light: #FCD34D;
  --pastel-pink: #FEE2E2;
  --light-violet: #E9D5FF;
  --silver: #E5E7EB;
}
```

### Gradient Classes
```css
.gradient-prosperity
.gradient-Quikkred
.gradient-primary
.shadow-gold
.shadow-lucky
.hover-lucky
```

---

## 🌐 Internationalization

### Supported Languages (13)
1. English (en)
2. Hindi (hi)
3. Marathi (mr)
4. Gujarati (gu)
5. Punjabi (pa)
6. Bengali (bn)
7. Tamil (ta)
8. Telugu (te)
9. Kannada (kn)
10. Malayalam (ml)
11. Odia (or)
12. Assamese (as)
13. Urdu (ur)

### Translation Structure
```json
{
  "loading": {
    "welcome": "Welcome message",
    "tagline": "Tagline text",
    "preparing": "Status message"
  },
  "gateway": {
    "features": {
      "secure": "Security text",
      "instant": "Speed text"
    }
  }
}
```

---

## 🔧 Configuration Files

### `next.config.mjs`
- Turbopack enabled
- Image optimization
- Environment variables

### `tailwind.config.ts`
- Custom color palette
- Font families
- Dark mode support
- Custom animations

### `tsconfig.json`
- Path aliases (@/*)
- Strict mode
- Next.js optimizations

---

## 📦 Dependencies

### Core
- next: 15.5.3
- react: 19.0.0
- typescript: ^5

### UI/UX
- tailwindcss: ^3.4.1
- framer-motion: ^11.18.0
- lucide-react: ^0.468.0

### Utilities
- react-query: ^5.63.0
- i18next: ^24.3.2
- react-i18next: ^15.2.3

### Development
- eslint: ^8
- postcss: ^8
- autoprefixer: ^10.4.20

---

## 🚀 Commands

```bash
# Development
npm run dev         # Start dev server
npm run build       # Production build
npm run start       # Start production
npm run lint        # Run linter

# Git
git status          # Check changes
git add .           # Stage all
git commit          # Commit changes
git push           # Push to remote
```

---

## 📝 Environment Variables

```env
# Required (create .env.local)
NEXT_PUBLIC_API_URL=
DATABASE_URL=
JWT_SECRET=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Optional
NEXT_PUBLIC_GA_ID=
SENTRY_DSN=
REDIS_URL=
```

---

## 🔗 Important Links

- Local Dev: http://localhost:3000
- Production: https://Quikkred.com (planned)
- Documentation: /BRAND_SriKuberONE/
- GitHub: (repository URL)

---

Last Updated: January 2025
Version: 1.0