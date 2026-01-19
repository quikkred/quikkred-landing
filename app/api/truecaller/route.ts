import { API_BASE_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        console.log("Truecaller Bridge Invoked");
        const body = await req.json();
        const { requestId, accessToken, endpoint } = body;
        console.log("Request Body:", body);

        if (!requestId || !accessToken || !endpoint) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("Fetching Truecaller Profile...");
        // 1. Fetch Profile from Truecaller using the provided endpoint and token
        const profileRes = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });

        console.log("Truecaller Profile Response Status:", profileRes.status);

        if (!profileRes.ok) {
            console.log("Failed to fetch Truecaller profile");
            return NextResponse.json({ error: "Failed to fetch Truecaller profile" }, { status: 401 });
        }

        const profileData = await profileRes.json();

        // 2. Forward the Profile Data to your Node.js Backend
        // This allows your backend (alpha.quikkred.in) to register/login the user
        const backendRes = await fetch(`${API_BASE_URL}/test2/truecaller/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestId,
                profile: profileData, // Send the actual user details here
                phone: profileData?.phoneNumber,
                source: 'nextjs_proxy'
            }),
        });

        const backendData = await backendRes.json();
        console.log("Backend Response Status:", backendRes.status);

        if (!backendRes.ok) {
            console.log("Backend processing failed");
            return NextResponse.json({ error: "Backend processing failed", details: backendData }, { status: 502 });
        }

        // 3. Return the backend's response (e.g., your App's JWT) to the frontend
        return NextResponse.json(backendData, { status: backendRes.status });
    } catch (error: any) {
        console.error("Truecaller Bridge Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}