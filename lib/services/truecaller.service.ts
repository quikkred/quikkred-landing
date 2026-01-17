/**
 * Truecaller Verification Service
 * Handles instant phone verification via Truecaller SDK
 *
 * TODO: Team to implement with actual Truecaller SDK
 *
 * Documentation: https://docs.truecaller.com/truecaller-sdk/web/integration-steps
 */

export interface TruecallerProfile {
    phoneNumber: string;
    countryCode: string;
    firstName: string;
    lastName: string;
    gender?: string;
    email?: string;
    city?: string;
    avatarUrl?: string;
    isVerified: boolean;
    isAmbassador?: boolean;
}

export interface TruecallerResponse {
    success: boolean;
    profile?: TruecallerProfile;
    requestId?: string;
    error?: string;
    errorCode?: string;
}

export interface TruecallerConfig {
    appKey: string;
    appName: string;
    partnerKey?: string;
}

class TruecallerService {
    private config: TruecallerConfig | null = null;
    private initialized: boolean = false;
    private sdkLoaded: boolean = false;

    /**
     * Initialize Truecaller SDK
     * Call this once when app loads
     */
    async init(config: TruecallerConfig): Promise<void> {
        this.config = config;

        // TODO: Load Truecaller SDK
        // Add to index.html:
        // <script type="text/javascript" src="https://sdk.truecaller.com/web/v0.1/sdk.js"></script>

        // Example initialization:
        // window.tcSdk = window.tcSdk || [];
        // window.tcSdk.push({
        //   appKey: config.appKey,
        //   appName: config.appName,
        // });

        this.initialized = true;
        console.log('[Truecaller] Initialized with app:', config.appName);
    }

    /**
     * Check if Truecaller SDK is available
     */
    isAvailable(): boolean {
        // TODO: Check if Truecaller SDK is loaded and available
        // return typeof window !== 'undefined' && !!window.tcSdk;
        return this.initialized;
    }

    /**
     * Trigger Truecaller verification
     * This opens the Truecaller verification flow
     */
    async verify(): Promise<TruecallerResponse> {
        if (!this.initialized) {
            return {
                success: false,
                error: 'Truecaller SDK not initialized. Call init() first.',
                errorCode: 'NOT_INITIALIZED',
            };
        }

        // TODO: Implement actual Truecaller verification
        // return new Promise((resolve) => {
        //   window.tcSdk.getProfile({
        //     requestNonce: generateNonce(),
        //     customerId: 'user_' + Date.now(),
        //     ctaText: 'Continue with Truecaller',
        //     buttonColor: '#25B181',
        //     buttonTextColor: '#ffffff',
        //     skipOption: 'Skip',
        //     ctaTextPrefix: 'Use ',
        //     partnerLogo: '/logo.svg',
        //     partnerName: 'QuikKred',
        //     lang: 'en',
        //     onSuccess: (profile) => {
        //       resolve({
        //         success: true,
        //         profile: {
        //           phoneNumber: profile.phoneNumber,
        //           countryCode: profile.countryCode,
        //           firstName: profile.firstName,
        //           lastName: profile.lastName,
        //           gender: profile.gender,
        //           email: profile.email,
        //           city: profile.city,
        //           avatarUrl: profile.avatarUrl,
        //           isVerified: true,
        //         },
        //       });
        //     },
        //     onFailure: (error) => {
        //       resolve({
        //         success: false,
        //         error: error.message || 'Verification failed',
        //         errorCode: error.code,
        //       });
        //     },
        //   });
        // });

        console.log('[Truecaller] Verification triggered - implement with actual Truecaller SDK');

        return {
            success: false,
            error: 'Truecaller SDK not implemented yet',
            errorCode: 'NOT_IMPLEMENTED',
        };
    }

    /**
     * Verify the response on backend (recommended for security)
     */
    async verifyOnBackend(requestId: string, accessToken: string): Promise<TruecallerResponse> {
        // TODO: Send to your backend for verification
        // const response = await fetch('/api/auth/truecaller/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ requestId, accessToken }),
        // });
        // return response.json();

        return {
            success: false,
            error: 'Backend verification not implemented',
            errorCode: 'NOT_IMPLEMENTED',
        };
    }

    /**
     * Check if user has Truecaller installed (Android only)
     * Web SDK always uses OAuth flow
     */
    isTruecallerInstalled(): boolean {
        // Web SDK uses OAuth, no app detection needed
        return true;
    }

    /**
     * Get error message for error code
     */
    getErrorMessage(errorCode: string): string {
        const errorMessages: Record<string, string> = {
            NOT_INITIALIZED: 'Truecaller SDK not initialized',
            NOT_IMPLEMENTED: 'Feature not yet implemented',
            USER_CANCELLED: 'User cancelled verification',
            NETWORK_ERROR: 'Network connection error',
            TIMEOUT: 'Verification timed out',
            INVALID_APP_KEY: 'Invalid Truecaller app key',
            QUOTA_EXCEEDED: 'API quota exceeded',
        };

        return errorMessages[errorCode] || 'Unknown error occurred';
    }
}

export const truecallerService = new TruecallerService();
export default truecallerService;