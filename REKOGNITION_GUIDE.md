# AWS Rekognition Face Liveness + KYC Verification — Complete Guide

**Branch**: `feature/aws-rekognition-liveness`
**Deadline**: 6 hours
**Assigned To**: Sreenath
**Date**: 2026-02-11

---

## Overview

We're replacing the old SurePass face liveness API with **AWS Rekognition** for two critical operations:

1. **Liveness Detection** — Is this a real person (not a photo of a photo, screen, mask)?
2. **Aadhaar Face Match** — Does the selfie match the Aadhaar photo we have on file?

Both happen in a **single API call** from the frontend. The backend handles both steps internally.

---

## Complete Verification Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                            │
│                                                                      │
│  User opens camera → Captures selfie → Clicks "Verify & Use Photo"  │
│                            │                                         │
│                            ▼                                         │
│          POST /api/kyc/face/rekognition/verify                       │
│          Body: FormData { photo: selfie.jpg }                        │
│          Header: Authorization: Bearer <token>                       │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                              │
│                                                                      │
│  Step 1: Validate customer exists + Aadhaar is verified              │
│          → Fetches customer.aadhaarImage from DB                     │
│          → If Aadhaar not verified → 400 error                       │
│                                                                      │
│  Step 2: AWS Rekognition DetectFaces (LIVENESS CHECK)                │
│          → Sends selfie buffer to Rekognition                        │
│          → Checks 5 liveness indicators:                             │
│             ✓ Face Confidence ≥ 90%                                  │
│             ✓ Eyes Open (confidence ≥ 80%)                           │
│             ✓ Image Sharpness ≥ 50                                   │
│             ✓ Image Brightness ≥ 50                                  │
│             ✓ Frontal Pose (yaw < 30°, pitch < 30°)                 │
│          → Must pass 4 out of 5 checks                              │
│          → If FAIL → Returns error with specific failure reasons     │
│                                                                      │
│  Step 3: AWS Rekognition CompareFaces (AADHAAR MATCH)                │
│          → Source: selfie buffer                                     │
│          → Target: aadhaarImage (base64 → buffer)                    │
│          → Similarity Threshold: 70%                                 │
│          → If FAIL → "Face does not match Aadhaar photo"             │
│                                                                      │
│  Step 4: Upload selfie to S3 + Update Application                    │
│          → Upload via documentsUpload() → S3 bucket                  │
│          → Update application.verificationChecklist                  │
│          → Update customer.faceMatchScore + profile photo            │
│          → Return success + photo URL                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## What's Already Done (Backend)

All backend code is committed and pushed to `main` + `feature/aws-rekognition-liveness`.

### New Files
| File | Purpose |
|------|---------|
| `src/services/rekognitionLivenessService.js` | AWS Rekognition SDK wrapper — 4 functions |

### Modified Files
| File | Changes |
|------|---------|
| `src/controller/kycController.js` | 3 new controller functions added at end of file |
| `src/route/kycRoute.js` | 3 new routes added |

### API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `POST` | `/api/kyc/face/rekognition/verify` | **Main endpoint** — Liveness + Aadhaar match in one call | ADMIN, CUSTOMER, CREDIT_MANAGER, VERIFIER |
| `POST` | `/api/kyc/face/rekognition/create-session` | Create session for future Amplify component (not used yet) | Same |
| `GET` | `/api/kyc/face/rekognition/session-result/:sessionId` | Get session results (not used yet) | Same |

### Main Endpoint: `/api/kyc/face/rekognition/verify`

**Request:**
```
POST /api/kyc/face/rekognition/verify
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

FormData:
  - photo: <selfie image file (JPEG/PNG)>
  - customerId: <optional, auto-resolved for CUSTOMER role>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Face liveness verified successfully via AWS Rekognition",
  "data": {
    "livenessStatus": true,
    "livenessScore": 100,
    "faceMatchSimilarity": 95.3,
    "photo": "https://s3.amazonaws.com/quikkred-nbfc-documents/...",
    "provider": "AWS_REKOGNITION"
  }
}
```

**Liveness Failed (200):**
```json
{
  "success": false,
  "message": "Face liveness check failed. Please ensure your face is clearly visible, eyes open, and in good lighting.",
  "data": {
    "livenessStatus": false,
    "livenessScore": 60,
    "checks": {
      "faceConfidence": true,
      "eyesOpen": false,
      "goodSharpness": true,
      "goodBrightness": false,
      "frontalPose": true
    }
  }
}
```

**Aadhaar Match Failed (200):**
```json
{
  "success": false,
  "message": "Face does not match Aadhaar photo",
  "data": {
    "reason": "FACE_NOT_MATCHED",
    "similarity": 45.2,
    "threshold": 70
  }
}
```

**Errors:**
- `400` — customerId missing, Aadhaar not verified, no Aadhaar image, no selfie
- `404` — Customer not found, Application not found
- `500` — AWS Rekognition service error

---

## What's Already Done (Frontend)

### Changed Files
| File | Change |
|------|--------|
| `components/camera/SelfieCapture.tsx` | Endpoint: `/api/kyc/face/verification` → `/api/kyc/face/rekognition/verify` |
| `app/apply/quick-v2/components/PostApprovalSelfie.tsx` | Endpoint: `/api/kyc/face/verification` → `/api/kyc/face/rekognition/verify` |
| `app/login/page.tsx` | Links: `/apply/quick-v2` → `/apply/quick` |
| `tsconfig.json` | Added `playwright.config.ts` to exclude |

---

## What Sreenath Needs To Do

### CRITICAL FIX 1: Environment Files

All 3 `.env` files currently point to **beta** instead of **production**:

**`.env.local`** (for local development):
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.quikkred.in

# production truecaller
NEXT_PUBLIC_TRUECALLER_PARTNER_KEY=jKals7364aeff7733491a900303975143e31b
NEXT_PUBLIC_TRUECALLER_APP_NAME="quikkred"
```

**`.env.production`** (for production builds):
```env
NEXTAUTH_URL=https://quikkred.in
NEXT_PUBLIC_API_URL=https://api.quikkred.in

# production truecaller
NEXT_PUBLIC_TRUECALLER_PARTNER_KEY=jKals7364aeff7733491a900303975143e31b
NEXT_PUBLIC_TRUECALLER_APP_NAME="quikkred"
```

**`.env.beta`** (keep as-is for beta builds):
```env
NEXTAUTH_URL=https://app-beta.quikkred.in
NEXT_PUBLIC_API_URL=https://beta.quikkred.in

# beta truecaller
NEXT_PUBLIC_TRUECALLER_PARTNER_KEY=SBvVib9bedd87e1b24af8887d8efac3264540
NEXT_PUBLIC_TRUECALLER_APP_NAME="quikkred-beta"
```

**Also fix `lib/config.ts`** — change fallback from `alpha` to production:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quikkred.in';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.quikkred.in';
```

### CRITICAL FIX 2: `/apply/quick` Page Selfie Integration

The `/apply/quick/page.tsx` also uses `SelfieCapture` component (imported at line 15). This component is already updated to use the Rekognition endpoint, so **no changes needed** in the quick page itself — the `SelfieCapture` component handles the API call.

Verify that:
1. `SelfieCapture` is imported: `import SelfieCapture from "@/components/camera/SelfieCapture";`
2. The component opens camera, captures photo, sends to `/api/kyc/face/rekognition/verify`
3. On success (`data.success && data.data?.livenessStatus`), it calls `onCapture(file)` and closes

### TASK 3: Test the Complete Flow

1. **Login** → Go to `/apply/quick`
2. Complete PAN + Aadhaar verification first (Aadhaar image must be stored)
3. Reach selfie step → Camera opens
4. Capture photo → Click "Verify & Use Photo"
5. Backend flow:
   - DetectFaces checks liveness (4/5 checks must pass)
   - CompareFaces matches selfie with stored Aadhaar image
   - If both pass → selfie uploaded to S3, application updated
6. Frontend shows success → proceeds to next step

### TASK 4: Handle Error States in UI

The Rekognition API returns detailed failure reasons. Improve error handling:

**For liveness failure**, show specific tips based on `data.checks`:
```typescript
// Example: parse checks from response
if (!data.success && data.data?.checks) {
  const { eyesOpen, goodBrightness, goodSharpness, frontalPose } = data.data.checks;
  if (!eyesOpen) showTip("Please keep your eyes open");
  if (!goodBrightness) showTip("Please improve lighting");
  if (!goodSharpness) showTip("Hold camera steady for a clear photo");
  if (!frontalPose) showTip("Look directly at the camera");
}
```

**For Aadhaar match failure**, show:
```
"Your selfie doesn't match your Aadhaar photo. Please try again with a clearer photo."
```

### TASK 5: Verify Quick Apply V2 Flow Too

`/apply/quick-v2/components/PostApprovalSelfie.tsx` is also updated. Test:
1. V2 flow reaches PostApprovalSelfie step
2. Camera captures → sends to Rekognition
3. Success response → `data.success && data.data?.livenessStatus` → moves to next step

---

## How Each Rekognition Check Works

### DetectFaces (Liveness)

| Check | What It Detects | Threshold | Why |
|-------|----------------|-----------|-----|
| `faceConfidence` | Is there definitely a face? | ≥ 90% | Rejects blurry/partial faces |
| `eyesOpen` | Are eyes open? | ≥ 80% confidence | Rejects photos of sleeping/closed-eye photos |
| `goodSharpness` | Is the image sharp? | ≥ 50 | Rejects screenshots, printed photos (tend to be lower quality) |
| `goodBrightness` | Is lighting adequate? | ≥ 50 | Rejects too dark / overexposed photos |
| `frontalPose` | Is face looking at camera? | Yaw < 30°, Pitch < 30° | Rejects side-angle photos |

**Pass criteria**: 4 out of 5 checks must pass. This is lenient enough for real users in varied conditions but catches obvious spoofing attempts.

### CompareFaces (Aadhaar Match)

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Source | Selfie (camera capture) | The photo just taken |
| Target | Aadhaar image (from DB) | Photo from Aadhaar verification |
| SimilarityThreshold | 70% | Minimum match percentage |

**How Aadhaar image is stored**: When user verifies Aadhaar via OTP (SurePass API), the API returns the Aadhaar holder's photo as base64. This is saved in `customer.aadhaarImage` in the database. The Rekognition controller decodes this base64 to a buffer and sends both images to CompareFaces.

---

## Architecture: Old vs New

```
OLD FLOW (SurePass):
  Frontend → POST /api/kyc/face/verification → SurePass API → liveness only (no Aadhaar match)

NEW FLOW (AWS Rekognition):
  Frontend → POST /api/kyc/face/rekognition/verify → AWS Rekognition DetectFaces (liveness)
                                                    → AWS Rekognition CompareFaces (Aadhaar match)
                                                    → S3 upload + DB update
```

Key improvement: **Aadhaar face match is now mandatory**. Previously, SurePass only did liveness (is it a real face?) but did NOT verify if the face matches the Aadhaar photo. Now both happen in one call.

---

## Backend Deployment Blocker

The backend Rekognition code is on `main` but **NOT live on production** yet. New ECS containers crash on startup because of a Razorpay initialization issue (`key_id` or `oauthToken` is mandatory`). ECS rolls back to the old container without Rekognition.

**This needs to be fixed separately** — the old container is still serving the old `/api/kyc/face/verification` endpoint. Once the Razorpay startup issue is resolved and new containers deploy successfully, the Rekognition endpoint will be live.

For testing locally, the backend works fine — `npm run dev` in `quikkred-backend-repo/`.

---

## File Reference

### Backend
```
quikkred-backend-repo/
├── src/
│   ├── services/
│   │   └── rekognitionLivenessService.js    ← NEW: 4 Rekognition functions
│   ├── controller/
│   │   └── kycController.js                 ← MODIFIED: 3 new exports at bottom
│   └── route/
│       └── kycRoute.js                      ← MODIFIED: 3 new routes (lines 47-51)
```

### Frontend
```
quikkred-landing/
├── .env.local                               ← FIX: Change beta → production
├── .env.production                          ← FIX: Change beta → production
├── .env.beta                                ← Keep as-is
├── lib/
│   └── config.ts                            ← FIX: Fallback URL to api.quikkred.in
├── components/
│   └── camera/
│       └── SelfieCapture.tsx                ← DONE: Endpoint updated
├── app/
│   ├── apply/
│   │   ├── quick/
│   │   │   └── page.tsx                     ← Uses SelfieCapture (already updated)
│   │   └── quick-v2/
│   │       └── components/
│   │           └── PostApprovalSelfie.tsx    ← DONE: Endpoint updated
│   └── login/
│       └── page.tsx                         ← DONE: Links fixed to /apply/quick
└── tsconfig.json                            ← DONE: playwright.config.ts excluded
```

---

## Test Credentials

- **Demo OTP**: `123456` (for Aadhaar verification)
- **Test PANs that bypass face check**: `THUIN5424Y`, `UHJNT6542T`, `PLUJH9856J`
- **CRM Login**: `admin@nbfc.com` / `admin123`

---

## Checklist

- [ ] Fix `.env.local` — point to `https://api.quikkred.in`
- [ ] Fix `.env.production` — point to `https://api.quikkred.in`
- [ ] Fix `lib/config.ts` fallback URL
- [ ] Test `/apply/quick` selfie flow end-to-end (local backend)
- [ ] Test `/apply/quick-v2` selfie flow end-to-end (local backend)
- [ ] Verify error messages display correctly for liveness failures
- [ ] Verify error messages display correctly for Aadhaar mismatch
- [ ] Test with good lighting + frontal face → should pass
- [ ] Test with blurry / side angle / dark → should fail with specific reason
- [ ] Build passes: `npm run build` with zero errors
- [ ] Push to `staging` branch for beta deployment

---

*Generated by Claude — 2026-02-11*
