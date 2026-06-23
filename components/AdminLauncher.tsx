"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserCog } from "lucide-react";
import { ADMIN_ROLES } from "@/lib/impersonation";
import { useImpersonation } from "@/hooks/useImpersonation";

/**
 * Small floating entry point to the support-login (impersonation) tool.
 * Renders only for admin/CEO accounts that are NOT already in a support session,
 * so the owner never has to type the (obscured) admin URL by hand. Hidden for
 * normal customers and while impersonating (the ImpersonationBanner takes over).
 */
export default function AdminLauncher() {
  const { data: session } = useSession();
  const { isImpersonating } = useImpersonation();
  const pathname = usePathname();

  const role = (session as any)?.role as string | undefined;
  const isAdmin = !!role && (ADMIN_ROLES as readonly string[]).includes(role);

  // Hide for non-admins, during a support session, and on the tool's own page.
  if (!isAdmin || isImpersonating || pathname?.startsWith("/latur-ka-fraud-customer/impersonate")) {
    return null;
  }

  return (
    <Link
      href="/latur-ka-fraud-customer/impersonate"
      title="Open customer support login"
      className="fixed bottom-4 right-4 z-[9997] inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-white transition-colors hover:bg-emerald-700"
    >
      <UserCog className="h-4 w-4" />
      <span className="hidden sm:inline">Support login</span>
    </Link>
  );
}
