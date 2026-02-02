"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ✅ change path if different
import { API_BASE_URL } from "@/lib/config";
import type { User } from "@/contexts/AuthContext";

export default async function getUserDetails(): Promise<User | null> {
  // 1) Get NextAuth session (server-side)
  const session = await getServerSession(authOptions);

  if (!session) return null;

  // 2) Build base user data from session
  const baseUser: User = {
    // @ts-ignore (add next-auth.d.ts to avoid this)
    id: (session.user?.id as string) || "",
    name: session.user?.name || "User",
    email: session.user?.email || "",
    mobile: undefined,
  };

  // 3) Get backend access token from session (you set this in callbacks)
  // @ts-ignore
  const accessToken: string | undefined = session.accessToken;

  if (!accessToken) return baseUser; // logged in but no backend token

  // 4) Fetch profile from your API using backend token
  try {
    // console.log("🔵 Fetching user profile from API...");
    const response = await fetch(`${API_BASE_URL}/api/customer/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await response.json();
    // console.log("🔵 User profile API response:", result);

    if (!response.ok || !result?.success || !result?.data) {
      return baseUser;
    }

    const apiData = result.data;
    const fullName = apiData.fullName || baseUser.name;

    console.log("api Data", apiData)

    const updatedUser: User = {
      ...baseUser,
      firstName: apiData.firstName || "",
      lastName: apiData.lastName || "",
      name: fullName,
      fullName,
      email: apiData.email || baseUser.email,
      mobile: apiData.mobile || baseUser.mobile,
      dateOfBirth: apiData.dateOfBirth,
      address: apiData.currentAddress?.line1,
      city: apiData.currentAddress?.city,
      state: apiData.currentAddress?.state,
      pincode: apiData.currentAddress?.pincode,
      kycStatus: apiData.kyc?.kycStatus || "PENDING",
      status: apiData.status,
      createdAt: apiData.createdAt,
      profile: apiData.profile ? {
        documentType: apiData.profile.documentType || "",
        status: apiData.profile.status || "",
        s3Key: apiData.profile.s3Key || "",
        s3URL: apiData.profile.s3URL || "",
      } : null,

      // verified
      isEmailVerified: apiData.isEmailVerified || false,
      isMobileVerified: apiData.isMobileVerified || false,
      isPanVerify: apiData.isPanVerify || false,
      isAadhaarVerify: apiData.isAadhaarVerify || false,
      brePulled: apiData.brePulled || false,

      // dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
      pan: apiData.panCard || null,
      aadhaar: apiData.aadhaarNumber || null,
      employmentType: apiData.employmentType || null,
      monthlyIncome: apiData.monthlyIncome?.toString() || null,
      companyName: apiData.companyName || null,
      loanAmount: apiData.requestedLoanAmount?.toString() || null, // Loan amount from API

      // bank
      bankName: apiData.banks?.[0]?.bankName || null,
      accountHolderName: apiData.banks?.[0]?.accountHolderName || null,
      accountNumber: apiData.banks?.[0]?.accountNumber || null,
      ifsc: apiData.banks?.[0]?.ifscCode || null,
      pennyDropStatus: apiData.banks?.[0]?.pennyDropStatus || null,
      bankVerified: apiData.banks?.[0]?.pennyDropStatus === "VERIFIED",
      upiAutoPayStatus: apiData?.upiAutoPayStatus || false,
    };

    return updatedUser;
  } catch (err) {
    console.error("getUserDetails error:", err);
    return baseUser;
  }
}
