import { apiClient, ApiResponse } from './api-client';

// PayU (India) hosted-checkout collection service.
// SECURITY: the PayU salt NEVER touches the frontend. The backend signs the
// params (computes `hash`) and returns them; the frontend only POSTs them to PayU.

/** Payment method enabled on MID 13683759 today. */
export type PayuMethod = 'NB' | 'DC';

export interface PayuInitiateRequest {
  loanId: string;
  /** Amount in rupees (PayU expects a string/number rupee amount, not paise). */
  amount: number;
  method: PayuMethod;
  /** PayU netbanking code (e.g. "AUSFNB") for NB; omitted/"" for DC. */
  bankcode?: string;
}

/** Server-signed params object — exactly the fields PayU's _payment form expects. */
export interface PayuFormParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  pg: string;
  bankcode: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  // Allow forward-compatible extra fields without breaking the form builder.
  [key: string]: string;
}

export interface PayuInitiateResponse {
  /** PayU hosted-checkout endpoint, e.g. "https://secure.payu.in/_payment". */
  action: string;
  params: PayuFormParams;
}

export interface PayuPaymentLinkResponse {
  /** Shareable hosted-checkout link: <frontend>/pay/<txnid>. */
  paymentLink: string;
  txnid: string;
  amount: string;
}

/** Resolved hosted-checkout form for a shared payment link (/pay/<txnid>). */
export interface PayuCheckoutResponse {
  action: string;
  params: PayuFormParams;
  amount: string;
  productinfo: string;
  loanNumber: string;
  txnid: string;
  /** Set when the link's transaction was already booked. */
  alreadyPaid?: boolean;
}

export type PayuVerifyStatus = 'success' | 'failure' | 'pending';

export interface PayuVerifyResponse {
  status: PayuVerifyStatus;
  amount: number;
  mihpayid: string;
}

class PayuService {
  /**
   * Initiate a hosted-checkout collection. Returns the PayU form action + the
   * server-signed params object. The frontend builds an auto-submitting
   * <form method="POST" action={action}> with a hidden input per param key.
   */
  async initiate(
    data: PayuInitiateRequest
  ): Promise<ApiResponse<PayuInitiateResponse>> {
    return apiClient.post<PayuInitiateResponse>(
      '/api/payu/collect/initiate',
      data,
      true
    );
  }

  /** Fallback: generate a PayU payment link (open in new tab / redirect). */
  async createPaymentLink(
    data: { loanId: string; amount: number }
  ): Promise<ApiResponse<PayuPaymentLinkResponse>> {
    return apiClient.post<PayuPaymentLinkResponse>(
      '/api/payu/collect/payment-link',
      data,
      true
    );
  }

  /** Verify a transaction by txnid (used by the surl/furl return page). */
  async verify(txnid: string): Promise<ApiResponse<PayuVerifyResponse>> {
    return apiClient.get<PayuVerifyResponse>(
      `/api/payu/collect/verify/${encodeURIComponent(txnid)}`,
      true
    );
  }

  /**
   * PUBLIC: resolve a shared payment-link txnid into hosted-checkout form params.
   * The customer opening /pay/<txnid> is not authenticated — the backend route is public.
   */
  async getCheckout(txnid: string): Promise<ApiResponse<PayuCheckoutResponse>> {
    return apiClient.get<PayuCheckoutResponse>(
      `/api/payu/checkout/${encodeURIComponent(txnid)}`,
      true
    );
  }
}

export const payuService = new PayuService();
