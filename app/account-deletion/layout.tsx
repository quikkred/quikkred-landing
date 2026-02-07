import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Deletion Request | Quikkred - Delete Your Account",
  description: "Request permanent deletion of your Quikkred account and personal data. RBI compliant data deletion process.",
  keywords: "account deletion, delete account, remove data, Quikkred, privacy",
  openGraph: {
    title: "Account Deletion Request | Quikkred",
    description: "Request permanent deletion of your Quikkred account and personal data.",
    type: "website",
  },
};

export default function AccountDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
