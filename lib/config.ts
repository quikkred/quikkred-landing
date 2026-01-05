// API Configuration - Use environment variable or fallback to default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alpha.quikkred.in';

// WebSocket Configuration
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://alpha.quikkred.in';


// Helper function to build API URLs



export const getApiUrl = (endpoint: string): string => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};