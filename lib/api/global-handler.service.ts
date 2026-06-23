import { apiClient, ApiResponse } from './api-client';

// A GlobalHandler is a server-side feature flag for an event type
// (e.g. DISBURSEMENT, MANDATE). When `isActive` is false, the related
// feature is temporarily disabled and the UI should block the action.
export interface GlobalHandler {
  _id: string;
  isActive: boolean;
  eventType: string;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

class GlobalHandlerService {
  // GET {{prod}}/api/global-handler/get — returns all handler flags.
  async getAll(): Promise<ApiResponse<GlobalHandler[]>> {
    return apiClient.get<GlobalHandler[]>('/api/global-handler/get', true);
  }

  /**
   * Whether the handler for a given event type is currently active.
   *
   * Fails OPEN (returns true) when the record is missing or the request errors,
   * so a flaky status check never locks users out — only an explicit
   * `isActive: false` record blocks the action.
   */
  async isEventActive(eventType: string): Promise<boolean> {
    try {
      const res = await this.getAll();
      const handlers = res.data || [];
      const match = handlers.find((h) => h.eventType === eventType);
      if (!match) return true; // no flag configured → not gated
      return match.isActive !== false;
    } catch (error) {
      console.error('GlobalHandler status check failed:', error);
      return true; // fail open
    }
  }
}

export const globalHandlerService = new GlobalHandlerService();
