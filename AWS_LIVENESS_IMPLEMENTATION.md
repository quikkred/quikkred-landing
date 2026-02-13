# AWS Rekognition Face Liveness - Session-Based Implementation

## Overview

This implementation uses AWS Amplify's `FaceLivenessDetector` component which:
- ✅ Uploads video frames **directly to AWS** (not through your backend)
- ✅ Provides a better UX with live feedback
- ✅ Handles liveness detection automatically
- ✅ Returns session results via your backend API

---

## Installation

### Step 1: Install Required Packages

```bash
npm install aws-amplify @aws-amplify/ui-react-liveness @aws-amplify/ui-react
```

### Step 2: Configure AWS Credentials

You need to set up **AWS Cognito Identity Pool** for temporary credentials.

#### Option A: Environment Variables (Recommended)

Add to `.env.local`:
```env
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION=ap-south-1
```

#### Option B: Runtime Configuration (Ask Backend)

Your backend can return AWS credentials when creating the session:

```typescript
// Backend response example
{
  "sessionId": "abc-123-xyz",
  "awsConfig": {
    "identityPoolId": "ap-south-1:...",
    "region": "ap-south-1"
  }
}
```

---

## Usage

### Example 1: Replace SelfieVerifyModal

Update `components/camera/SelfieVerifyModal.tsx` or create a new component:

```typescript
"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import FaceLiveness from '@/components/camera/FaceLivenessDetector';
import { configureAmplify } from '@/lib/aws-amplify-config';

interface SelfieVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function SelfieVerifyModal({ isOpen, onClose, onCapture }: SelfieVerifyModalProps) {
  if (!isOpen) return null;

  // Configure AWS Amplify (do this once, ideally in _app.tsx or layout.tsx)
  const identityPoolId = process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID;
  if (identityPoolId) {
    configureAmplify(identityPoolId);
  }

  const handleSuccess = (result: any) => {
    console.log('✅ Liveness verified:', result);

    // If backend returns S3 URL of the uploaded selfie
    if (result.photoUrl) {
      // You can fetch this URL and convert to File if needed
      // Or just pass the URL to parent
      onClose();
    }
  };

  const handleError = (error: string) => {
    console.error('❌ Liveness failed:', error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25B181] to-[#1F8F68] px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Face Verification</h3>
                <p className="text-sm text-white/80">Live liveness detection</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <FaceLiveness
              onSuccess={handleSuccess}
              onError={handleError}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Backend API Requirements

### Endpoint 1: Create Session

**URL:** `POST /api/kyc/face/rekognition/create-session`

**Response:**
```json
{
  "success": true,
  "message": "Face liveness session created successfully",
  "data": {
    "sessionId": "abc-123-xyz-456"
  }
}
```

### Endpoint 2: Get Session Results

**URL:** `GET /api/kyc/face/rekognition/session-result/:sessionId`

**Response (Success):**
```json
{
  "success": true,
  "message": "Face liveness verified successfully",
  "data": {
    "sessionId": "abc-123-xyz-456",
    "status": "SUCCEEDED",
    "confidence": 95.5,
    "photoUrl": "https://s3.amazonaws.com/...",
    "faceMatchSimilarity": 87.3,
    "livenessScore": 100
  }
}
```

**Response (Failed):**
```json
{
  "success": false,
  "message": "Face liveness check failed",
  "data": {
    "sessionId": "abc-123-xyz-456",
    "status": "FAILED",
    "reason": "FACE_NOT_MATCHED",
    "similarity": 45.2,
    "threshold": 70
  }
}
```

---

## Backend Implementation (Pseudocode)

### Create Session

```javascript
// src/controller/kycController.js

export const createFaceLivenessSession = async (req, res) => {
  try {
    const customerId = req.user.id;

    // AWS SDK
    const command = new CreateFaceLivenessSessionCommand({
      // Optional: Add client request token for idempotency
      ClientRequestToken: `${customerId}-${Date.now()}`
    });

    const response = await rekognitionClient.send(command);

    // Optionally store sessionId in DB linked to customerId
    await db.saveSession({
      customerId,
      sessionId: response.SessionId,
      status: 'PENDING'
    });

    res.json({
      success: true,
      data: {
        sessionId: response.SessionId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Get Session Results

```javascript
export const getFaceLivenessSessionResults = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const customerId = req.user.id;

    // Fetch results from AWS
    const command = new GetFaceLivenessSessionResultsCommand({
      SessionId: sessionId
    });

    const results = await rekognitionClient.send(command);

    if (results.Status !== 'SUCCEEDED') {
      return res.json({
        success: false,
        message: 'Liveness check failed',
        data: {
          sessionId,
          status: results.Status
        }
      });
    }

    // Extract reference image from results
    const referenceImageBytes = results.ReferenceImage.Bytes;

    // Compare with Aadhaar photo (existing logic)
    const customer = await db.findCustomer(customerId);
    if (!customer.aadhaarImage) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar photo not found'
      });
    }

    const aadhaarBuffer = Buffer.from(customer.aadhaarImage, 'base64');

    const compareFacesCommand = new CompareFacesCommand({
      SourceImage: { Bytes: referenceImageBytes },
      TargetImage: { Bytes: aadhaarBuffer },
      SimilarityThreshold: 70
    });

    const compareResults = await rekognitionClient.send(compareFacesCommand);

    if (!compareResults.FaceMatches || compareResults.FaceMatches.length === 0) {
      return res.json({
        success: false,
        message: 'Face does not match Aadhaar photo',
        data: {
          reason: 'FACE_NOT_MATCHED',
          similarity: 0,
          threshold: 70
        }
      });
    }

    const similarity = compareResults.FaceMatches[0].Similarity;

    // Upload selfie to S3
    const photoUrl = await uploadToS3(referenceImageBytes, `selfies/${customerId}.jpg`);

    // Update customer record
    await db.updateCustomer(customerId, {
      profile: { s3URL: photoUrl, status: 'VERIFIED' },
      faceMatchScore: similarity
    });

    res.json({
      success: true,
      message: 'Face liveness verified successfully',
      data: {
        sessionId,
        status: 'SUCCEEDED',
        confidence: results.Confidence,
        photoUrl,
        faceMatchSimilarity: similarity,
        livenessScore: 100
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## AWS Cognito Identity Pool Setup

1. Go to AWS Console → Cognito → Identity Pools
2. Create a new identity pool:
   - Name: `QuikkredFaceLiveness`
   - Enable unauthenticated access ✅ (or use authenticated if you have Cognito User Pool)
3. Note the Identity Pool ID (e.g., `ap-south-1:xxx-xxx-xxx`)
4. Update IAM roles to allow Rekognition access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:StartFaceLivenessSession"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Testing

### Local Testing

1. Install packages: `npm install`
2. Set `.env.local`:
   ```env
   NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=ap-south-1:xxx
   NEXT_PUBLIC_AWS_REGION=ap-south-1
   ```
3. Run backend locally (with session endpoints)
4. Open `/apply/quick` → Selfie step
5. Click "Capture Selfie" → FaceLiveness modal opens
6. Complete liveness check → Results fetched → Success!

---

## Files Modified

### New Files
- ✅ `lib/aws-amplify-config.ts` - Amplify configuration
- ✅ `components/camera/FaceLivenessDetector.tsx` - Main component
- ✅ `AWS_LIVENESS_IMPLEMENTATION.md` - This guide

### Files to Modify
- `components/camera/SelfieVerifyModal.tsx` - Use FaceLiveness component
- `app/apply/quick-v2/components/ui/SelfieVerify.tsx` - Update modal import
- Backend: `src/controller/kycController.js` - Implement session endpoints

---

## Next Steps

1. ✅ Install npm packages
2. ✅ Configure AWS Cognito Identity Pool
3. ✅ Uncomment FaceLivenessDetector in `FaceLivenessDetector.tsx` (line 160-177)
4. ✅ Test session creation endpoint
5. ✅ Test session results endpoint
6. ✅ Integrate into existing flow
7. ✅ Handle error states properly

---

**Note:** The current implementation has a placeholder UI. Once you install the packages, uncomment the `FaceLivenessDetector` component (lines 160-177 in `FaceLivenessDetector.tsx`) to enable the actual AWS liveness check.
