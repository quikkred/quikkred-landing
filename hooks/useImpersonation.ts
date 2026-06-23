"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  exitImpersonation,
  getImpersonationMeta,
  ImpersonationMeta,
} from "@/lib/impersonation";

/**
 * Tells UI whether the current session is an admin support (impersonation)
 * session, and exposes the meta + an exit function.
 *
 * Source of truth is `session.impersonatedBy` (survives refresh, set by the
 * NextAuth `otp-tokens` provider). The sessionStorage meta only adds display
 * details (customer label, expiry) and is best-effort.
 *
 * Use `isImpersonating` to hide/disable actions the backend blocks during a
 * support session (disbursement, password/mobile change, account deletion,
 * loan-agreement e-sign) so the user never hits a 403.
 */
export function useImpersonation() {
  const { data: session } = useSession();
  const [meta, setMeta] = useState<ImpersonationMeta | null>(null);

  useEffect(() => {
    setMeta(getImpersonationMeta());
  }, [session]);

  const impersonatedBy = (session as any)?.impersonatedBy || meta?.impersonatedBy || null;
  const isImpersonating = Boolean(impersonatedBy);

  return {
    isImpersonating,
    impersonatedBy,
    meta,
    exit: exitImpersonation,
  };
}

export default useImpersonation;
