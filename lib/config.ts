// API Configuration - Use environment variable or fallback to default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alpha.quikkred.in';

// WebSocket Configuration
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://alpha.quikkred.in';


export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
if (!RAZORPAY_KEY) {
  console.warn("NEXT_PUBLIC_RAZORPAY_KEY is not set");
}

// quick link
// export const QUICK_FORM_URL = "/apply/quick";
export const QUICK_FORM_URL = "/apply/quick";

// Helper function to build API URLs

export const getApiUrl = (endpoint: string): string => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};
