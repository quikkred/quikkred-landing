# Quikkred Landing Page - Project Context

## Project Overview
- **App**: Quikkred Landing Page & Quick Apply Flow
- **Tech Stack**: Next.js 16.0.8, React 19, TypeScript, Tailwind CSS
- **Repo**: https://github.com/Ocpltech/quikkred-landing.git
- **Branch Strategy**:
  - `develop` → Alpha (Hostinger KVM8)
  - `staging` → Beta (AWS ECS)
  - `main` → Production (AWS ECS)

## Current State (Jan 2025)

### Tracking Integration (Completed)
Comprehensive analytics tracking has been added to Quick Apply V2 flow:

**Hooks Created:**
- `lib/hooks/useQuickApplyTracking.ts` - Full application funnel tracking
- `lib/hooks/useMarketingTracking.ts` - Marketing page analytics
- `lib/hooks/useVerificationFrictionTracking` - Measures verification UX (time, attempts, success)

**Components with Tracking:**
- `Page1BasicDetails.tsx` - IP check, step progression
- `Page2PANBank.tsx` - PAN verification, employment selection
- `PostApprovalAadhaar.tsx` - Aadhaar OTP verification
- `PostApprovalBank.tsx` - Bank details verification
- `PostApprovalSelfie.tsx` - Selfie capture tracking
- `MobileVerify.tsx`, `GoogleVerify.tsx`, `TruecallerVerify.tsx` - Auth method tracking

**Events Tracked:**
- Step viewed/completed/abandoned
- Verification attempts (PAN, Aadhaar, Bank, Selfie)
- Authentication methods (Truecaller, Google, OTP)
- Form behavior (field focus, typing, errors)
- BRE processing and loan approval/rejection
- Verification friction (time spent, retry attempts)

### Known Issues
- **Mobile OTP not working** - Needs fix before production deployment
- Scheduled deployment disabled until OTP is fixed

## CI/CD Pipeline

### Deployment Workflow (`.github/workflows/deploy.yml`)
```yaml
# Triggers:
- push to develop → Deploy to Alpha
- push to staging → Deploy to Beta
- push to main → Build & Test only (production on schedule/manual)
- workflow_dispatch with deploy_now=true → Immediate production deploy
- schedule (CURRENTLY DISABLED) → 4 AM IST production deploy
```

### Manual Production Deploy
1. Go to GitHub Actions
2. Select "Quikkred Landing & Dashboard CI/CD Pipeline"
3. Click "Run workflow"
4. Set `deploy_now: true`
5. Run

### Re-enable Scheduled Deployment
Uncomment in `.github/workflows/deploy.yml`:
```yaml
schedule:
  # 4:00 AM IST = 22:30 UTC
  - cron: '30 22 * * *'
```

## API & Backend

### Tracking Endpoints
- `POST /api/tracking/init` - Initialize journey
- `POST /api/tracking/event` - Track single event
- `POST /api/tracking/events/batch` - Batch events
- `POST /api/tracking/link` - Link to customer
- `POST /api/tracking/session/end` - End session

### Config
- API Base URL configured in `lib/config.ts`
- Production: https://api.quikkred.in
- Beta: https://beta.quikkred.in
- Alpha: https://alpha.quikkred.in

## Development

### Running Locally
```bash
cd /Users/mahadev/Desktop/Development/Quikkred-Complete/quikkred-landing
PORT=3006 npm run dev  # Use 3006 if 3000 is taken by CRM
```

### Key Paths
- Quick Apply V2: `/apply/quick-v2`
- Original Quick Apply: `/apply/quick`
- User Dashboard: `/user`

### Related Projects
- **CRM/LOS/LMS**: `/Users/mahadev/Desktop/Development/Quikkred-Complete/quikkred-crm-los-lms` (runs on port 3000)

## Pending Tasks

### Monday TODO
1. Fix Mobile OTP verification flow
2. Re-enable scheduled deployment in deploy.yml
3. Test tracking events are being received by backend
4. Deploy to production

### Future Enhancements
- Add scroll depth tracking to marketing pages
- Add time-on-page tracking
- Add A/B test tracking support

## Contacts & Auth

### Authentication Methods Supported
- Truecaller SDK verification
- Google OAuth
- Mobile OTP

### NextAuth Configuration
- Provider: Truecaller, Google, Credentials
- Route: `/api/auth/[...nextauth]/route.ts`
