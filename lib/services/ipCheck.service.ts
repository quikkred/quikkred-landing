/**
 * IP Intelligence Service
 * Handles IP geolocation, VPN detection, and serviceability checks
 */

import { API_BASE_URL } from '../config';

// MOCK MODE - Set to false for production with real APIs
// Set to true only for local testing without backend
const MOCK_MODE = false;

export interface IPCheckResponse {
    success: boolean;
    blocked?: boolean;
    serviceable?: boolean;
    message?: string;
    reasons?: string[];
    data?: {
        ip: string;
        pincode: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        isp?: string;
        vpnDetected: boolean;
        proxyDetected?: boolean;
        torDetected?: boolean;
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        fraudScore?: number;
    };
}

export interface PincodeValidationResponse {
    success: boolean;
    serviceable: boolean;
    message?: string;
    data?: {
        pincode: string;
        city: string;
        state: string;
        district?: string;
    };
}

// Blacklisted states where service is not available
// Source: quikkred-backend-repo/src/controller/kycController.js (lines 67-82)
const BLACKLISTED_STATES = [
    // Andaman & Nicobar
    'andaman & nicobar islands',
    'andaman and nicobar islands',
    'andaman',
    'nicobar',

    // Seven Sister States (Northeast)
    'arunachal pradesh',
    'assam',
    'manipur',
    'meghalaya',
    'mizoram',
    'nagaland',
    'tripura',

    // Other Blocked Regions
    'jammu & kashmir',
    'jammu and kashmir',
    'kashmir',
    'ladakh',
    'lakshadweep',
    'sikkim',
    'daman & diu',
    'daman and diu',
];

class IPCheckService {
    private cachedIPData: IPCheckResponse['data'] | null = null;
    private cacheExpiry: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    /**
     * Check IP and get location data + VPN detection
     * Called automatically when user opens the apply page
     */
    async checkIP(): Promise<IPCheckResponse> {
        // MOCK MODE - Bypass all checks
        if (MOCK_MODE) {

            const mockData = {
                ip: '127.0.0.1',
                pincode: '110001',
                city: 'New Delhi',
                state: 'Delhi',
                country: 'IN',
                isp: 'Mock ISP',
                vpnDetected: false,
                riskLevel: 'LOW' as const,
            };
            this.cachedIPData = mockData;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;
            return {
                success: true,
                serviceable: true,
                data: mockData,
            };
        }

        // Return cached data if still valid
        if (this.cachedIPData && Date.now() < this.cacheExpiry) {
            return {
                success: true,
                data: this.cachedIPData,
                serviceable: this.isStateServiceable(this.cachedIPData.state),
            };
        }

        try {
            // Try backend IP check endpoint first
            const response = await fetch(`${API_BASE_URL}/api/ip/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result: IPCheckResponse = await response.json();

                if (result.success && result.data) {
                    this.cachedIPData = result.data;
                    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
                }

                return result;
            }

            // Fallback to client-side IP detection using free API
            return await this.fallbackIPCheck();
        } catch (error) {
            console.error('[IPCheck] Error:', error);
            // Fallback to client-side check
            return await this.fallbackIPCheck();
        }
    }

    /**
     * Fallback IP check using free ipapi.co service
     */
    private async fallbackIPCheck(): Promise<IPCheckResponse> {
        try {
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('IP API failed');
            }

            const data = await response.json();

            const ipData = {
                ip: data.ip || '',
                pincode: data.postal || null,
                city: data.city || null,
                state: data.region || null,
                country: data.country_code || null,
                isp: data.org || null,
                vpnDetected: false, // Free API doesn't provide VPN detection
                riskLevel: 'LOW' as const,
            };

            // Check serviceability
            const serviceable = this.isStateServiceable(ipData.state);

            // Cache the result
            this.cachedIPData = ipData;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;

            if (!serviceable) {
                return {
                    success: true,
                    blocked: true,
                    serviceable: false,
                    message: 'Service not available in your region',
                    data: ipData,
                };
            }

            return {
                success: true,
                serviceable: true,
                data: ipData,
            };
        } catch (error) {
            console.error('[IPCheck] Fallback error:', error);
            // Don't block user if IP check fails
            return {
                success: true,
                serviceable: true,
                data: {
                    ip: '',
                    pincode: null,
                    city: null,
                    state: null,
                    country: 'IN',
                    vpnDetected: false,
                    riskLevel: 'LOW',
                },
            };
        }
    }

    /**
     * Check if a state is serviceable
     */
    isStateServiceable(state: string | null): boolean {
        if (!state) return true; // Allow if we can't determine state

        const normalizedState = state.toLowerCase().trim();
        return !BLACKLISTED_STATES.some(blocked =>
            normalizedState.includes(blocked) || blocked.includes(normalizedState)
        );
    }

    /**
     * Validate pincode and get location details
     */
    async validatePincode(pincode: string): Promise<PincodeValidationResponse> {
        // Validate format
        if (!/^\d{6}$/.test(pincode)) {
            return {
                success: false,
                serviceable: false,
                message: 'Invalid pincode format. Please enter 6 digits.',
            };
        }

        try {
            // Try backend pincode validation
            const response = await fetch(`${API_BASE_URL}/api/pincode/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pincode }),
            });

            if (response.ok) {
                return await response.json();
            }

            // Fallback to postal API
            return await this.fallbackPincodeCheck(pincode);
        } catch (error) {
            console.error('[Pincode] Error:', error);
            return await this.fallbackPincodeCheck(pincode);
        }
    }

    /**
     * Fallback pincode validation using postal API
     */
    private async fallbackPincodeCheck(pincode: string): Promise<PincodeValidationResponse> {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

            if (!response.ok) {
                throw new Error('Postal API failed');
            }

            const [result] = await response.json();

            if (result.Status !== 'Success' || !result.PostOffice?.length) {
                return {
                    success: false,
                    serviceable: false,
                    message: 'Invalid pincode. Please check and try again.',
                };
            }

            const postOffice = result.PostOffice[0];
            const state = postOffice.State;
            const serviceable = this.isStateServiceable(state);

            return {
                success: true,
                serviceable,
                message: serviceable ? undefined : 'Service not available in your region',
                data: {
                    pincode,
                    city: postOffice.District || postOffice.Name,
                    state: state,
                    district: postOffice.District,
                },
            };
        } catch (error) {
            console.error('[Pincode] Fallback error:', error);
            // Allow user to proceed if pincode check fails
            return {
                success: true,
                serviceable: true,
                data: {
                    pincode,
                    city: '',
                    state: '',
                },
            };
        }
    }

    /**
     * Get cached IP data
     */
    getCachedData(): IPCheckResponse['data'] | null {
        if (this.cachedIPData && Date.now() < this.cacheExpiry) {
            return this.cachedIPData;
        }
        return null;
    }

    /**
     * Clear cached data
     */
    clearCache(): void {
        this.cachedIPData = null;
        this.cacheExpiry = 0;
    }
}

export const ipCheckService = new IPCheckService();
export default ipCheckService;
