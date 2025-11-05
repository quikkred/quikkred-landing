// WebSocket Events Constants
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Authentication
  AUTH: 'auth',
  AUTH_SUCCESS: 'auth:success',
  AUTH_ERROR: 'auth:error',

  // Notifications
  NOTIFICATION: 'notification',

  // Dashboard Updates
  DASHBOARD_UPDATE: 'dashboard:update',
  METRICS_UPDATE: 'metrics:update',
  PERFORMANCE_UPDATE: 'performance:update',

  // Application Events
  APPLICATION_RECEIVED: 'application:received',
  APPLICATION_UPDATED: 'application:updated',

  // Loan Events
  LOAN_STATUS_CHANGE: 'loan:status:change',
  LOAN_APPROVED: 'loan:approved',
  LOAN_REJECTED: 'loan:rejected',

  // Collection Events
  COLLECTION_ALERT: 'collection:alert',
  PAYMENT_RECEIVED: 'payment:received',

  // Compliance & Risk
  COMPLIANCE_ALERT: 'compliance:alert',
  RISK_ALERT: 'risk:alert',

  // Support
  TICKET_ASSIGNED: 'ticket:assigned',
  TICKET_UPDATED: 'ticket:updated',
} as const;

// WebSocket Message Interface
export interface WSMessage {
  event: string;
  data: any;
  timestamp?: number;
  userId?: string;
}

// Default WebSocket Options
export const DEFAULT_WS_OPTIONS = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 10000,
  transports: ['websocket', 'polling'],
};
