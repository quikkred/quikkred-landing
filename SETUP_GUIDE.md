# 🚀 Quikkred NBFC Platform - Setup Guide

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ or Supabase account
- Redis server or Upstash account
- Git

## 🛠️ Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/Quikkred.git
cd Quikkred

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Essential Services

Edit `.env` file and add minimum required services:

```env
# Database (Choose one)
# Option 1: Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/Quikkred"

# Option 2: Supabase (Free tier)
# Sign up at https://supabase.com
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres"

# Authentication Secret (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-generated-secret-here
JWT_SECRET=your-generated-jwt-secret

# Redis (Choose one)
# Option 1: Local Redis
REDIS_URL=redis://localhost:6379

# Option 2: Upstash (Free tier)
# Sign up at https://upstash.com
REDIS_URL=redis://default:your-password@your-endpoint.upstash.io:port
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
# Start the development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 🎯 Minimum Viable Product (MVP) Setup

To get a working MVP, configure these services:

### Step 1: Payment Gateway (Razorpay)

1. Sign up at [Razorpay](https://dashboard.razorpay.com)
2. Get test API keys from Dashboard → Account & Settings → API Keys
3. Add to `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_key_secret
```

### Step 2: Basic KYC (Test Mode)

For testing, use mock KYC verification:

```env
# Enable test mode
TEST_MODE=true
SKIP_KYC_VERIFICATION=true
TEST_USER_MOBILE=9999999999
TEST_USER_OTP=123456
```

### Step 3: AI Services (Optional for MVP)

Get OpenAI API key from [platform.openai.com](https://platform.openai.com):

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

## 📱 Test the Platform

### 1. Create Test User

```bash
# Use the API or UI to create a test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9999999999",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### 2. Test Loan Application

1. Navigate to http://localhost:3000
2. Click "Apply Now"
3. Use test credentials:
   - Mobile: 9999999999
   - OTP: 123456
4. Complete loan application

### 3. Test Admin Dashboard

Access admin features at http://localhost:3000/admin
- Default admin: admin@Quikkred.com / Admin@123

## 🚨 Common Issues & Solutions

### Issue 1: Database Connection Failed

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If using Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Issue 2: Redis Connection Failed

```bash
# Install and start Redis locally
brew install redis  # macOS
brew services start redis

# Or use Docker
docker run --name redis -p 6379:6379 -d redis
```

### Issue 3: Prisma Migration Issues

```bash
# Reset database and re-run migrations
npx prisma migrate reset --force
npx prisma generate
```

### Issue 4: Port Already in Use

```bash
# Change port in package.json or use different port
PORT=3001 npm run dev
```

## 🔧 Development Tools

### Prisma Studio (Database GUI)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

### API Testing

```bash
# Install REST Client extension in VS Code
# Use .http files in /api-tests folder

# Or use curl
curl http://localhost:3000/api/health
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy
```

## 📦 Production Deployment

### Option 1: Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
```

### Option 2: Railway/Render (Full Stack)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy

### Option 3: Docker

```bash
# Build Docker image
docker build -t Quikkred .

# Run container
docker run -p 3000:3000 --env-file .env Quikkred
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Check code quality
npm run lint
npm run type-check
```

## 📊 Monitoring Setup

### 1. Error Tracking (Sentry)

```bash
# Install Sentry
npx @sentry/wizard@latest -i nextjs

# Add DSN to .env
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 2. Analytics (Google Analytics)

Add to `.env`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS in production
- [ ] Set secure headers
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Review and rotate API keys
- [ ] Enable 2FA for admin accounts

## 📚 Additional Resources

- [API Documentation](http://localhost:3000/api-docs)
- [Architecture Overview](/docs/ARCHITECTURE.md)
- [External Services Setup](/EXTERNAL_SERVICES_SETUP.md)
- [Contributing Guidelines](/CONTRIBUTING.md)

## 🆘 Need Help?

- Check [Issues](https://github.com/yourusername/Quikkred/issues)
- Join our [Discord](https://discord.gg/Quikkred)
- Email: support@quikkred.com

## 📝 License

This project is proprietary and confidential.

---

**Happy Coding! 🚀**

*Last updated: September 2024*