// API Configuration - Use environment variable or fallback to default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alpha.quikkred.in';

// WebSocket Configuration
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://alpha.quikkred.in';
