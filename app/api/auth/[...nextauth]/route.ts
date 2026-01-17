import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "@/lib/config";

export const authOptions: AuthOptions = {
  providers: [
    // ✅ Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),

    // ✅ OTP Login (calls verifyOtp API inside NextAuth)
    CredentialsProvider({
      id: "otp",
      name: "OTP Login",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        loginMethod: { label: "loginMethod", type: "text" }, // "email" | "mobile"
      },
      async authorize(credentials) {
        try {
          if (!credentials?.emailOrPhone || !credentials?.otp || !credentials?.loginMethod) {
            return null;
          }

          const payload =
            credentials.loginMethod === "email"
              ? { email: credentials.emailOrPhone, otp: credentials.otp }
              : { mobile: credentials.emailOrPhone, otp: credentials.otp };

          const response = await fetch(`${API_BASE_URL}/api/auth/customer/verifyOtp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => null);

          if (!response.ok || !data?.success || !data?.data) return null;

          const d = data.data;

          // ✅ return "user" object (goes to jwt callback as `user`)
          return {
            id: d.userId, // required
            email: d.email ?? null,
            role: d.role,
            accessToken: d.accessToken,
            refreshToken: d.refreshToken,
            customerUniqueId: d.customerUniqueId,
            verifiedAt: d.verifiedAt ?? null,
          };
        } catch (e) {
          console.error("OTP authorize error:", e);
          return null;
        }
      },
    }),

    // ✅ Truecaller Provider (Internal Retry Logic)
    CredentialsProvider({
      id: "truecaller",
      name: "Truecaller",
      credentials: {
        requestId: { label: "Request ID", type: "text" },
      },
      async authorize(credentials) {
        const requestId = credentials?.requestId;
        if (!requestId) return null;

        const maxRetries = 5; // Total attempts
        const delayMs = 2000; // Wait 2 seconds between each try

        for (let i = 0; i < maxRetries; i++) {
          try {
            const res = await fetch(`${API_BASE_URL}/test2/truecaller/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requestId }),
            });

            const json = await res.json().catch(() => null);

            // If backend says VERIFIED, return the user immediately
            if (res.ok && json?.success && json?.status === "VERIFIED" && json?.data) {
              const d = json.data;
              return {
                id: d.userId,
                email: d.email ?? null,
                role: d.role,
                accessToken: d.accessToken,
                refreshToken: d.refreshToken,
                customerUniqueId: d.customerUniqueId,
                verifiedAt: new Date().toISOString(),
              };
            }

            // If not verified yet (e.g. status is "PENDING" or 404), wait and retry
            // console.log(`Attempt ${i + 1}: Data not ready, retrying...`);
            if (i < maxRetries - 1) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }

          } catch (err) {
            console.error("Truecaller retry error:", err);
          }
        }

        // If we reach here, it means all retries failed
        return null;
      },
    })
  ],

  session: { strategy: "jwt" },
  // debug: true,

  callbacks: {
    async jwt({ token, account, user }) {
      // ✅ 1) Google sign-in: call your backend and store tokens
      if (account?.provider === "google") {
        const payload = {
          id_token: account.id_token ?? null,
          access_token: account.access_token ?? null,
        };

        if (payload.id_token || payload.access_token) {
          try {
            // const res = await fetch(`${API_BASE_URL}/api/test2/google-login`, {
            const res = await fetch(`${API_BASE_URL}/api/auth/customer/Oauth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const result = await res.json();
            // console.log("Backend login result (google):", result);

            if (result?.success) {
              token.accessToken = result.data.accessToken;
              token.refreshToken = result.data.refreshToken;
              token.userId = result.data.userId;
              token.customerUniqueId = result.data.customerUniqueId;
              token.role = result.data.role;
              token.verifiedAt = result.data.verifiedAt;
            }
          } catch (err) {
            console.error("Backend login error (google):", err);
          }
        } else {
          console.warn("No id_token or access_token received from Google account");
        }
      }

      // ✅ 2) OTP sign-in: copy data from `authorize()` to token
      if (account?.provider === "otp" && user) {
        token.userId = (user as any).id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.customerUniqueId = (user as any).customerUniqueId;
        token.role = (user as any).role;
        token.verifiedAt = (user as any).verifiedAt;

        // keep session.user.email in sync
        token.email = (user as any).email;
      }

      if (account?.provider === "truecaller" && user) {
        token.userId = user.id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.customerUniqueId = (user as any).customerUniqueId;
        token.role = (user as any).role;
        token.verifiedAt = (user as any).verifiedAt;
        token.email = (user as any).email ?? token.email;
        token.name = (user as any).name ?? token.name;
        (token as any).phoneNumber = (user as any).phoneNumber;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).userId || token.sub;
        session.user.email = ((token as any).email as string) ?? session.user.email;
      }

      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      (session as any).customerUniqueId = (token as any).customerUniqueId;
      (session as any).role = (token as any).role;
      (session as any).verifiedAt = (token as any).verifiedAt;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
