import { API_BASE_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { tcStorage } from "@/lib/tc-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: Receives data from Truecaller app
export async function POST(req: NextRequest) {
  try {
    const { requestId, accessToken, endpoint } = await req.json();

    // 1. Fetch profile from Truecaller
    const profileRes = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!profileRes.ok) return NextResponse.json({ error: "Truecaller fetch failed" }, { status: 401 });
    const profileData = await profileRes.json();

    // 2. FORWARD TO MAIN BACKEND (Crucial Step)
    // const backendRes = await fetch(`${API_BASE_URL}/api/test2/truecaller/callback`, {
    const backendRes = await fetch(`${API_BASE_URL}/api/auth/customer/truecaller/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, profile: profileData }),
    });

    if (!backendRes.ok) {
      console.error("Main backend failed to save. Polling will stay PENDING.");
      return NextResponse.json({ error: "Backend sync failed" }, { status: 500 });
    }

    // 3. ONLY ON BACKEND SUCCESS: Update local "waiting room"
    tcStorage.set(requestId, {
      status: 'VERIFIED',
      data: profileData,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// GET: Frontend polls this to see if backendRes was successful
export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) return NextResponse.json({ error: "No ID" }, { status: 400 });

  const record = tcStorage.get(requestId);
  
  if (record?.status === 'VERIFIED') {
    return NextResponse.json({ status: "VERIFIED" });
  }
  return NextResponse.json({ status: "PENDING" }, { status: 404 });
}