# 🏦 Quikkred - AI-Powered NBFC Platform

> **Your Gateway to Prosperity** - Instant loans with AI-driven decisions and multilingual support

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.2-2d3748?style=flat-square&logo=prisma)](https://prisma.io/)

## 🌟 Overview

**Quikkred** is a revolutionary NBFC (Non-Banking Financial Company) platform that democratizes access to instant loans across India. Built with cutting-edge AI technology and supporting 13 Indian languages, Quikkred transforms the traditional lending landscape with:

- ⚡ **Instant Approval** - AI-powered decisions in under 30 seconds
- 🌐 **Multilingual Support** - Available in 13 Indian languages
- 🛡️ **Bank-Grade Security** - ISO 27001 certified with RBI compliance
- 📱 **Mobile-First Design** - Optimized for smartphones and tablets
- 🤖 **AI-Driven Intelligence** - Smart risk assessment and personalization

## 🚀 Features

### 💰 Loan Products
- **Personal Loans** - Up to ₹5,00,000 with flexible repayment
- **Salary Advance** - Quick cash against salary
- **Emergency Loans** - Instant funds for medical emergencies
- **Travel Loans** - Finance your dream vacations
- **Festival Advance** - Celebrate without financial stress

### 🌍 Language Support
- **English** - Primary language
- **Hindi** (हिन्दी) - National language
- **Regional Languages**: Marathi, Gujarati, Punjabi, Bengali, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese, Urdu

### 🔧 Technical Features
- **AI-Powered Risk Assessment** - Advanced ML algorithms
- **Real-time Document Verification** - OCR and AI validation
- **Automated Credit Scoring** - Dynamic risk evaluation
- **Seamless KYC** - Digital onboarding process
- **Multiple Payment Gateways** - Razorpay, UPI, Net Banking
- **WhatsApp Integration** - Customer support via WhatsApp
- **Voice Call Support** - Multilingual voice assistance

## 📚 Developer Documentation

### For Developers
- 📖 **[Backend Developer Guide](./BACKEND_DEVELOPER_GUIDE.md)** - Complete backend architecture, API documentation, and development workflow
- 🎨 **[Frontend Developer Guide](./FRONTEND_DEVELOPER_GUIDE.md)** - Frontend architecture, component library, and UI development guide
- 📝 **[API Documentation](./API_DOCUMENTATION.md)** - Detailed API endpoints and integration guide
- 🧪 **[Testing Guide](./TESTING_GUIDE.md)** - Testing strategies and implementation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.3 with Turbopack
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand + React Context

### Backend
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **File Storage**: AWS S3
- **Queue System**: BullMQ with Redis
- **Email**: SendGrid + Nodemailer
- **SMS/WhatsApp**: Twilio

### AI & ML
- **Document Processing**: AWS Textract + Tesseract.js
- **Risk Assessment**: Custom ML models
- **Credit Scoring**: AI-driven algorithms
- **Fraud Detection**: Real-time monitoring

### Infrastructure
- **Deployment**: Vercel (Frontend) + AWS (Backend)
- **Database**: PostgreSQL on AWS RDS
- **Cache**: Redis Cloud
- **CDN**: AWS CloudFront
- **Monitoring**: Sentry

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- PostgreSQL 14.0 or higher
- Redis 6.0 or higher
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ocpltech/Quikkred.git
cd Quikkred
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/Quikkred"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# AWS Services
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="Quikkred-documents"

# Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Communications
SENDGRID_API_KEY="your-sendgrid-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"

# Redis
REDIS_URL="redis://localhost:6379"
```

5. **Database Setup**
```bash
npx prisma migrate dev
npx prisma db seed
```

6. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to see the application.

## 📁 Project Structure

```
Quikkred/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── apply/             # Loan application pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   └── products/          # Product pages
├── backend/               # Backend services
│   ├── lib/               # Core libraries
│   ├── services/          # Business logic
│   └── utils/             # Utilities
├── components/            # React components
├── lib/                   # Shared libraries
├── locales/               # Translation files
├── prisma/                # Database schema
├── public/                # Static assets
└── scripts/               # Utility scripts
```

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification

### Loan Application Endpoints
- `POST /api/loans/apply` - Submit loan application
- `GET /api/loans/status/:id` - Check application status
- `POST /api/loans/documents` - Upload documents

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/applications` - List user applications

For complete API documentation, see [API_SPECIFICATION.md](./docs/API_SPECIFICATION.md)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t Quikkred .
docker run -p 3001:3001 Quikkred
```

### Vercel Deployment
```bash
vercel --prod
```

## 🔒 Security Features

- **End-to-End Encryption** - All data encrypted in transit and at rest
- **Multi-Factor Authentication** - OTP-based verification
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive data sanitization
- **CSRF Protection** - Built-in Next.js security
- **SQL Injection Prevention** - Prisma ORM protection
- **XSS Protection** - Content Security Policy

## 🌍 Localization

The platform supports 13 Indian languages with complete translations:

- **English** (`en`) - Default
- **Hindi** (`hi`) - हिन्दी
- **Marathi** (`mr`) - मराठी
- **Gujarati** (`gu`) - ગુજરાતી
- **Punjabi** (`pa`) - ਪੰਜਾਬੀ
- **Bengali** (`bn`) - বাংলা
- **Tamil** (`ta`) - தமிழ்
- **Telugu** (`te`) - తెలుగు
- **Kannada** (`kn`) - ಕನ್ನಡ
- **Malayalam** (`ml`) - മലയാളം
- **Odia** (`or`) - ଓଡ଼ିଆ
- **Assamese** (`as`) - অসমীয়া
- **Urdu** (`ur`) - اردو

### Adding New Languages
1. Create translation file in `locales/{language-code}.json`
2. Update `LanguageContext.tsx` with new language
3. Test UI components with new translations

## 🧪 Testing

### Run Tests
```bash
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:coverage      # Coverage report
```

### Linting & Code Quality
```bash
npm run lint               # ESLint
npm run type-check         # TypeScript
npm run format             # Prettier
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for mobile-first experience
- **Bundle Size**: < 1MB initial load
- **API Response Time**: < 200ms average
- **Database Queries**: Optimized with Prisma

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use Prettier for formatting
- Write comprehensive tests
- Document new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Developer Documentation
- 📖 **[Backend Developer Guide](./BACKEND_DEVELOPER_GUIDE.md)** - Complete backend documentation
- 🎨 **[Frontend Developer Guide](./FRONTEND_DEVELOPER_GUIDE.md)** - Complete frontend documentation
- 📝 **[API Documentation](./API_DOCUMENTATION.md)** - API endpoints reference
- 🔧 **[Setup Guide](./SETUP_GUIDE.md)** - Environment setup instructions

### Developer Support
- **WhatsApp**: Developers have direct access to project owner's WhatsApp
- **GitHub Issues**: [Report bugs or request features](https://github.com/Quikkred/issues)
- **Backend Team**: backend@Quikkred.com
- **Frontend Team**: frontend@Quikkred.com

### Business Inquiries
- **Partnerships**: partners@Quikkred.com
- **Enterprise**: enterprise@Quikkred.com
- **Press**: press@Quikkred.com

---

## 🏆 Recognition

- **RBI Licensed NBFC** - Fully compliant with regulatory requirements
- **ISO 27001 Certified** - Information security management
- **AAA Credit Rating** - Highest credit worthiness
- **Startup India Recognized** - Government backed innovation

---

<div align="center">

**Built with ❤️ by the Quikkred Team**

[Website](https://Quikkred.com) • [API Docs](./docs/API_SPECIFICATION.md) • [Support](mailto:support@quikkred.com)

</div>