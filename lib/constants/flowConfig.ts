/**
 * Application Flow Configuration
 * --------------------------------
 * The Quick Apply journey can run in two distinct eligibility flows that share
 * the same UI shell but diverge at a single decision point in
 * `FinFactorVerify.handleContinue` (right after the loan application is created):
 *
 *  • DIRECT_TO_BANK  (current/legacy) → skips the rules engine and sends the
 *    applicant straight to bank-statement analysis (FinFactor AA consent).
 *
 *  • BRE_DECISION    (new) → calls `GET /api/v2/bre/initialize`, which returns a
 *    decision of "Approve" | "Reject" | "Proceed to Bank", and surfaces it via
 *    the existing KYC status modal (ResultView).
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  ⚙️  ONE CHANGE: flip `DEFAULT_BRE_FLOW` below to switch the default flow  │
 * │      for every applicant. The Flow Switcher control (when enabled) lets   │
 * │      you override this at runtime, persisted per-browser.                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export type BreFlowMode = 'DIRECT_TO_BANK' | 'BRE_DECISION';

/** The single source of truth for the default flow. Change this one line. */
export const DEFAULT_BRE_FLOW: BreFlowMode = 'BRE_DECISION';

/**
 * When true, the e-mandate (UPI AutoPay) step is skipped everywhere — both in
 * the apply flow (BankVerification) and on the dashboard (no authorize/cancel
 * UI, no mandate fetch). Flip to false to bring the e-mandate step back.
 */
export const SKIP_EMANDATE = true;

/** localStorage key for the per-browser runtime override. */
export const FLOW_MODE_STORAGE_KEY = 'quikkred:breFlowMode';

/** Custom event broadcast when the flow changes, so all listeners stay in sync. */
export const FLOW_MODE_EVENT = 'quikkred:breFlowMode:change';

export interface FlowModeMeta {
    mode: BreFlowMode;
    label: string;
    tag: string;
    description: string;
}

export const FLOW_MODE_META: Record<BreFlowMode, FlowModeMeta> = {
    DIRECT_TO_BANK: {
        mode: 'DIRECT_TO_BANK',
        label: 'Direct to Bank',
        tag: 'Current',
        description:
            'Skips the rules engine — goes straight to bank-statement analysis after the application is created.',
    },
    BRE_DECISION: {
        mode: 'BRE_DECISION',
        label: 'BRE Decision',
        tag: 'New',
        description:
            'Runs v2/bre/initialize first and routes on the decision: Approve, Reject, or Proceed to Bank.',
    },
};

export const isBreFlowMode = (value: unknown): value is BreFlowMode =>
    value === 'DIRECT_TO_BANK' || value === 'BRE_DECISION';

/**
 * Normalize a raw BRE/finFactor status string ("Approve" | "Reject" |
 * "Proceed to Bank" and their casing variants) into the modal status type
 * understood by KycStatusContext / ResultView.
 */
export const normalizeBreStatus = (
    status?: string
): 'approved' | 'rejected' | 'proceed-to-bank' => {
    const s = (status || '').toLowerCase();
    if (s.includes('proceed')) return 'proceed-to-bank';
    if (s.includes('approve')) return 'approved';
    return 'rejected';
};
