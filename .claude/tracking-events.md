# Tracking Events Reference

## Event Types (from lib/tracking.ts)

### Application Flow
| Event | Description |
|-------|-------------|
| `APPLICATION_STARTED` | User begins application |
| `STEP_VIEWED` | User views a step |
| `STEP_COMPLETED` | User completes a step |
| `STEP_ABANDONED` | User leaves without completing |
| `APPLICATION_SUBMITTED` | Application submitted |
| `APPLICATION_APPROVED` | BRE approved |
| `APPLICATION_REJECTED` | BRE rejected |

### KYC Verification
| Event | Description |
|-------|-------------|
| `PAN_VERIFICATION_ATTEMPT` | PAN check started |
| `PAN_VERIFICATION_SUCCESS` | PAN verified |
| `PAN_VERIFICATION_FAILED` | PAN failed |
| `AADHAAR_OTP_SENT` | Aadhaar OTP sent |
| `AADHAAR_VERIFICATION_SUCCESS` | Aadhaar verified |
| `AADHAAR_VERIFICATION_FAILED` | Aadhaar failed |
| `SELFIE_CAPTURE_STARTED` | Selfie capture began |
| `SELFIE_CAPTURE_SUCCESS` | Selfie captured |
| `SELFIE_CAPTURE_FAILED` | Selfie failed |

### Bank Verification
| Event | Description |
|-------|-------------|
| `BANK_VERIFICATION_ATTEMPT` | Bank check started |
| `BANK_VERIFICATION_SUCCESS` | Bank verified |
| `BANK_VERIFICATION_FAILED` | Bank failed |
| `AA_CONSENT_INITIATED` | Account Aggregator started |
| `AA_CONSENT_SUCCESS` | AA consent given |
| `AA_CONSENT_FAILED` | AA consent failed |

### E-Sign
| Event | Description |
|-------|-------------|
| `ESIGN_INITIATED` | E-sign process started |
| `ESIGN_SUCCESS` | Document signed |
| `ESIGN_FAILED` | E-sign failed |

### User Behavior
| Event | Description |
|-------|-------------|
| `FIELD_INTERACTION` | User interacts with form field |
| `BUTTON_CLICK` | Button clicked |
| `FORM_ERROR` | Validation error shown |
| `PAGE_VISIBLE` | Tab became visible |
| `PAGE_HIDDEN` | Tab hidden |

### Errors
| Event | Description |
|-------|-------------|
| `API_ERROR` | API call failed |
| `CLIENT_ERROR` | Client-side error |

### Custom Events (via CUSTOM_EVENT)
- `QUICK_APPLY_V2_LOADED`
- `IP_CHECK_STARTED/PASSED/BLOCKED`
- `VPN_DETECTED`
- `TRUECALLER_VERIFY_STARTED/SUCCESS/FAILED`
- `GOOGLE_AUTH_STARTED/SUCCESS/FAILED`
- `OTP_REQUESTED/VERIFIED/FAILED/RESEND`
- `LOAN_AMOUNT_CHANGE`
- `TENURE_CHANGE`
- `LOAN_SELECTION_FINALIZED`
- `EMPLOYMENT_TYPE_SELECTED`
- `INCOME_ENTERED`
- `SALARY_DATE_SELECTED`
- `BRE_PROCESSING_STARTED`
- `BRE_STEP_COMPLETED`
- `DISBURSEMENT_INITIATED`
- `APPLICATION_COMPLETED`
- `FIELD_HESITATION`
- `VERIFICATION_FRICTION`

## Usage Example

```typescript
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';

function MyComponent() {
  const {
    trackStepViewed,
    trackStepCompleted,
    trackPANVerifyStarted,
    trackPANVerifySuccess,
    trackAPIError,
  } = useQuickApplyTracking();

  // Track step view
  useEffect(() => {
    trackStepViewed(1, 'Basic Details');
  }, []);

  // Track verification
  const handleVerify = async () => {
    trackPANVerifyStarted();
    try {
      const result = await verifyPAN(pan);
      trackPANVerifySuccess({ fullName: result.name });
      trackStepCompleted(2, 'PAN Verification');
    } catch (error) {
      trackAPIError('/api/verify/pan', error.message);
    }
  };
}
```

## Verification Friction Tracking

```typescript
import { useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';

function PANVerification() {
  const panFriction = useVerificationFrictionTracking('pan');

  useEffect(() => {
    panFriction.startTracking();
  }, []);

  const handleVerify = async () => {
    panFriction.recordAttempt();
    try {
      await verify();
      panFriction.completeTracking(true);
    } catch {
      // Will track attempts on next try
    }
  };
}
```
