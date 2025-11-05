# 🎨 Quikkred Frontend Developer Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Component Library](#component-library)
- [State Management](#state-management)
- [Routing & Navigation](#routing--navigation)
- [Styling System](#styling-system)
- [Internationalization](#internationalization)
- [Forms & Validation](#forms--validation)
- [API Integration](#api-integration)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)

## 🎯 Overview

Quikkred's frontend is a modern, responsive web application built with Next.js 15.5.3, featuring a multi-role dashboard system, real-time updates, and support for 13 Indian languages.

### Key Features
- **Multi-Role Dashboards**: Separate interfaces for users, admins, underwriters, collection agents, finance managers, risk analysts, and support agents
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: WebSocket integration for live notifications
- **Multilingual Support**: 13 Indian languages with RTL support
- **Progressive Web App**: Offline capabilities and installable
- **Accessibility**: WCAG 2.1 AA compliant

## 🏗️ Architecture

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                  │
│              (React Components + Tailwind CSS)           │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   State Management Layer                 │
│              (Zustand + React Query + Context)           │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│              (API Clients + WebSocket Client)            │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js API Routes                    │
│                  (Backend Integration)                   │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   ├── LanguageSwitcher
│   │   └── UserMenu
│   ├── Sidebar (Role-based)
│   └── Footer
├── Pages
│   ├── Public
│   │   ├── Home
│   │   ├── Products
│   │   ├── About
│   │   └── Contact
│   ├── Auth
│   │   ├── Login
│   │   ├── Register
│   │   └── ForgotPassword
│   └── Protected
│       ├── Dashboard (Role-based)
│       ├── Profile
│       ├── Loans
│       ├── Documents
│       └── Settings
└── Providers
    ├── AuthProvider
    ├── ThemeProvider
    ├── I18nProvider
    └── QueryProvider
```

## 💻 Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.3 | React framework with SSR/SSG |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.0 | Type safety |
| **Tailwind CSS** | 4.0 | Utility-first CSS |
| **Framer Motion** | 12.23 | Animations |

### UI Libraries
| Library | Purpose | Usage |
|---------|---------|-------|
| **@radix-ui** | Headless UI components | Dialogs, Dropdowns, Tabs |
| **lucide-react** | Icon library | SVG icons |
| **react-icons** | Additional icons | Social media icons |
| **recharts** | Data visualization | Charts & graphs |
| **react-chartjs-2** | Advanced charts | Financial charts |

### State & Data Management
| Library | Purpose | Implementation |
|---------|---------|----------------|
| **zustand** | Global state management | User state, preferences |
| **@tanstack/react-query** | Server state management | API data fetching |
| **socket.io-client** | WebSocket client | Real-time updates |

### Form & Validation
| Library | Purpose | Usage |
|---------|---------|-------|
| **zod** | Schema validation | Form & API validation |
| **react-hook-form** | Form management | Complex forms |

### Internationalization
| Library | Purpose | Configuration |
|---------|---------|--------------|
| **i18next** | i18n framework | Translation management |
| **react-i18next** | React integration | Component translations |
| **i18next-browser-languagedetector** | Language detection | Auto-detect user language |
| **i18next-http-backend** | Translation loading | Dynamic translation files |

## 📁 Project Structure

```
Quikkred/
├── app/                        # Next.js App Router
│   ├── (public)/              # Public routes
│   │   ├── page.tsx           # Home page
│   │   ├── about/             # About page
│   │   ├── products/          # Products pages
│   │   └── contact/           # Contact page
│   ├── (auth)/                # Auth routes
│   │   ├── login/             # Login page
│   │   ├── apply/             # Application form
│   │   └── track-application/ # Track status
│   ├── (protected)/           # Protected routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── profile/           # User profile
│   │   ├── loans/             # Loan management
│   │   ├── documents/         # Document upload
│   │   ├── payments/          # Payment history
│   │   ├── settings/          # User settings
│   │   └── notifications/     # Notifications
│   ├── admin/                 # Admin dashboard
│   ├── underwriter/           # Underwriter portal
│   ├── collection-agent/      # Collection portal
│   ├── finance-manager/       # Finance portal
│   ├── risk-analyst/          # Risk analysis portal
│   ├── support-agent/         # Support portal
│   ├── layout.tsx             # Root layout
│   ├── error.tsx              # Error boundary
│   └── loading.tsx            # Loading state
├── components/                 # Reusable components
│   ├── ui/                    # UI components
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── dialog.tsx         # Modal dialog
│   │   ├── input.tsx          # Form inputs
│   │   ├── select.tsx         # Select dropdown
│   │   └── toast.tsx          # Toast notifications
│   ├── layouts/               # Layout components
│   │   ├── AdminLayout.tsx    # Admin layout
│   │   ├── UserLayout.tsx     # User layout
│   │   └── PublicLayout.tsx   # Public layout
│   ├── admin/                 # Admin components
│   ├── documents/             # Document components
│   ├── communications/        # Communication components
│   └── error/                 # Error components
├── contexts/                  # React contexts
│   ├── AuthContext.tsx        # Authentication
│   ├── ThemeContext.tsx       # Theme management
│   └── SocketContext.tsx      # WebSocket context
├── hooks/                     # Custom hooks
│   ├── useAuth.ts             # Auth hook
│   ├── useSocket.ts           # WebSocket hook
│   ├── useTranslation.ts      # i18n hook
│   └── useApi.ts              # API hook
├── lib/                       # Utility libraries
│   ├── api.ts                 # API client
│   ├── utils.ts               # Helper functions
│   └── validators.ts          # Validation schemas
├── locales/                   # Translation files
│   ├── en/                    # English
│   ├── hi/                    # Hindi
│   ├── mr/                    # Marathi
│   └── ...                    # Other languages
├── public/                    # Static assets
│   ├── images/                # Images
│   ├── icons/                 # Icons
│   └── fonts/                 # Custom fonts
└── styles/                    # Global styles
    └── globals.css            # Global CSS
```

## 🧩 Component Library

### Base Components

#### Button Component
```typescript
// components/ui/button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        variants[variant],
        sizes[size],
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
}
```

#### Card Component
```typescript
// components/ui/card.tsx
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}
```

### Feature Components

#### Loan Calculator
```typescript
// components/loan-calculator.tsx
export function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const [rate] = useState(12.5);

  const emi = calculateEMI(amount, rate, tenure);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">EMI Calculator</h3>
      {/* Calculator UI */}
    </Card>
  );
}
```

#### Language Switcher
```typescript
// components/LanguageSwitcher.tsx
export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'mr', name: 'मराठी' },
    // ... other languages
  ];

  return (
    <Select value={i18n.language} onValueChange={i18n.changeLanguage}>
      {/* Language options */}
    </Select>
  );
}
```

## 🔄 State Management

### Zustand Store
```typescript
// stores/userStore.ts
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### React Query Setup
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Usage in component
export function LoansList() {
  const { data, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: fetchLoans,
  });

  if (isLoading) return <Loading />;
  return <>{/* Render loans */}</>;
}
```

## 🛣️ Routing & Navigation

### Route Protection
```typescript
// components/ProtectedRoute.tsx
export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    if (user && requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, requiredRole]);

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  return <>{children}</>;
}
```

### Dynamic Routing
```typescript
// app/loans/[id]/page.tsx
export default function LoanDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const { data: loan } = useQuery({
    queryKey: ['loan', params.id],
    queryFn: () => fetchLoan(params.id),
  });

  return <LoanDetails loan={loan} />;
}
```

## 🎨 Styling System

### Tailwind Configuration
```javascript
// tailwind.config.ts
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#22c55e',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Component Styling
```typescript
// Utility function for className merging
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  className
)} />
```

## 🌍 Internationalization

### i18n Configuration
```typescript
// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      // ... other languages
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
```

### Translation Files
```json
// locales/en/common.json
{
  "welcome": "Welcome to Quikkred",
  "loan": {
    "apply": "Apply for Loan",
    "status": "Loan Status",
    "emi": "EMI Calculator"
  }
}

// locales/hi/common.json
{
  "welcome": "लक्ष्मीवन में आपका स्वागत है",
  "loan": {
    "apply": "ऋण के लिए आवेदन करें",
    "status": "ऋण की स्थिति",
    "emi": "ईएमआई कैलकुलेटर"
  }
}
```

### Usage in Components
```typescript
export function WelcomeMessage() {
  const { t } = useTranslation();

  return (
    <h1>{t('welcome')}</h1>
  );
}
```

## 📝 Forms & Validation

### Form Implementation
```typescript
// components/forms/LoanApplicationForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loanSchema = z.object({
  amount: z.number().min(10000).max(500000),
  tenure: z.number().min(6).max(60),
  purpose: z.string().min(3),
  employment: z.object({
    type: z.enum(['SALARIED', 'SELF_EMPLOYED']),
    monthlyIncome: z.number().min(15000),
  }),
});

export function LoanApplicationForm() {
  const form = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      amount: 100000,
      tenure: 12,
    },
  });

  const onSubmit = async (data: z.infer<typeof loanSchema>) => {
    // Submit loan application
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## 🔌 API Integration

### API Client
```typescript
// lib/api.ts
class ApiClient {
  private baseURL = '/api';

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  }

  // API methods
  async getLoans() {
    return this.request<Loan[]>('/loans/my-loans');
  }

  async applyForLoan(data: LoanApplication) {
    return this.request<Loan>('/loans/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
```

### WebSocket Integration
```typescript
// hooks/useSocket.ts
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('notification', (data) => {
      // Handle notification
      toast({
        title: data.title,
        description: data.message,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
}
```

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Dynamic imports
const AdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard'),
  {
    loading: () => <LoadingScreen />,
    ssr: false
  }
);
```

### Image Optimization
```typescript
import Image from 'next/image';

export function HeroSection() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero"
      width={1920}
      height={1080}
      priority
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
}
```

### Memoization
```typescript
// Memoized component
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(
    () => processData(data),
    [data]
  );

  return <>{/* Render */}</>;
});
```

## 🧪 Testing

### Unit Testing
```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );

    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing
```typescript
// __tests__/pages/loans.test.tsx
describe('Loans Page', () => {
  it('fetches and displays loans', async () => {
    const { findByText } = render(<LoansPage />);

    expect(await findByText('Personal Loan')).toBeInTheDocument();
    expect(await findByText('₹100,000')).toBeInTheDocument();
  });
});
```

## 🚀 Build & Deployment

### Build Configuration
```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "type-check": "tsc --noEmit"
  }
}
```

### Production Optimizations
```typescript
// next.config.ts
export default {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.Quikkred.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};
```

### Environment Variables
```env
# Frontend environment variables
NEXT_PUBLIC_API_URL=https://api.Quikkred.com
NEXT_PUBLIC_WS_URL=wss://ws.Quikkred.com
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 📚 Best Practices

### Component Guidelines
1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Error Boundaries**: Wrap components in error boundaries
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Performance**: Use React.memo for expensive components

### Code Organization
1. **Barrel Exports**: Use index files for cleaner imports
2. **Absolute Imports**: Configure path aliases in tsconfig
3. **Co-location**: Keep related files together
4. **Separation of Concerns**: Separate business logic from UI

### Performance Tips
1. **Lazy Loading**: Use dynamic imports for large components
2. **Virtual Scrolling**: Implement for long lists
3. **Debouncing**: Debounce search inputs and API calls
4. **Image Optimization**: Use Next.js Image component
5. **Bundle Analysis**: Regular bundle size checks

## 🔧 Troubleshooting

### Common Issues

#### Hydration Mismatch
```typescript
// Solution: Use useEffect for client-only code
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Additional Resources

### Internal Documentation
- [Backend Guide](./BACKEND_DEVELOPER_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Storybook](https://storybook.Quikkred.com)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contact & Support

**For Frontend Development Support:**

### WhatsApp Support
📱 **Direct Contact**: Available on WhatsApp for frontend developers
- Frontend developers have access to project owner's WhatsApp details
- UI/UX discussions and design reviews
- Component architecture guidance

### Other Channels
- **GitHub Issues**: For bug reports and feature requests
- **Email**: frontend@Quikkred.com (for formal communications)

**Note**: Frontend developers have been provided with the project owner's contact details for direct communication and support via WhatsApp.

---

**Last Updated**: December 2024
**Version**: 1.0.0