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

    const updatedUser: User = {
      ...baseUser,
      name: fullName,
      fullName,
      email: apiData.email || baseUser.email,
      mobile: apiData.mobile || baseUser.mobile,
      dateOfBirth: apiData.dateOfBirth,
      address: apiData.currentAddress?.line1,
      city: apiData.currentAddress?.city,
      state: apiData.currentAddress?.state,
      pincode: apiData.currentAddress?.pincode,
      isEmailVerified: apiData.isEmailVerified,
      isMobileVerified: apiData.isMobileVerified,
      kycStatus: apiData.kyc?.kycStatus || "PENDING",
      status: apiData.status,
      createdAt: apiData.createdAt,
    };

    return updatedUser;
  } catch (err) {
    console.error("getUserDetails error:", err);
    return baseUser;
  }
}
