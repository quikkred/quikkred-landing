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

    // ✅ OTP Login
    CredentialsProvider({
      id: "otp",
      name: "OTP Login",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        loginMethod: { label: "loginMethod", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.emailOrPhone) {
            throw new Error("Mobile number or Email is required");
          }
          if (!credentials?.otp) {
            throw new Error("Please enter the 6-digit OTP");
          }
          if (!credentials?.loginMethod) {
            throw new Error("Invalid login method detected");
          }

          const isEmailLogin = credentials.loginMethod === "email";

          const payload =
            isEmailLogin
              ? { email: credentials.emailOrPhone, otp: credentials.otp }
              : { mobile: credentials.emailOrPhone, otp: credentials.otp };

          const response = await fetch(`${API_BASE_URL}/api/auth/customer/verifyOtp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => null);

          // ✅ Updated to throw backend message
          if (!response.ok || !data?.success || !data?.data) {
            throw new Error(data?.message || "Invalid code");
          }

          const d = data.data;
          return {
            id: d.userId,
            email: d.email ?? null,
            mobile: d.mobile ?? null,
            role: d.role,
            accessToken: d.accessToken,
            refreshToken: d.refreshToken,
            customerUniqueId: d.customerUniqueId,
            verifiedAt: d.verifiedAt ?? null,
          };
        } catch (e: any) {
          // Re-throw the error so NextAuth passes the message to the frontend
          throw new Error(e.message || "OTP Verification failed");
        }
      },
    }),

    // ✅ DigiLocker Provider
    CredentialsProvider({
      id: "digilocker",
      name: "DigiLocker",
      credentials: {
        requestId: { label: "Request ID", type: "text" },
      },
      async authorize(credentials) {
        const requestId = credentials?.requestId;
        if (!requestId) return null;

        try {
          const res = await fetch(
            `${API_BASE_URL}/api/auth/customer/digilocker/status?requestId=${encodeURIComponent(requestId)}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          const json = await res.json().catch(() => null);

          if (res.ok && json?.success && json?.data) {
            const d = json.data;
            return {
              id: d.userId,
              email: d.email ?? null,
              mobile: d.mobile ?? null,
              role: d.role,
              accessToken: d.accessToken,
              refreshToken: d.refreshToken,
              customerUniqueId: d.customerUniqueId,
              verifiedAt: d.verifiedAt ?? new Date().toISOString(),
            };
          }

          throw new Error(json?.message || "DigiLocker verification failed");
        } catch (err: any) {
          throw new Error(err.message || "DigiLocker verification failed");
        }
      },
    }),

    // ✅ Truecaller Provider
    CredentialsProvider({
      id: "truecaller",
      name: "Truecaller",
      credentials: {
        requestId: { label: "Request ID", type: "text" },
      },
      async authorize(credentials) {
        const requestId = credentials?.requestId;
        if (!requestId) return null;

        const maxRetries = 10;
        const delayMs = 2000;

        for (let i = 0; i < maxRetries; i++) {
          try {
            // const res = await fetch(`${API_BASE_URL}/api/test2/truecaller/verify`, {
            const res = await fetch(`${API_BASE_URL}/api/auth/customer/truecaller/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requestId }),
            });

            const json = await res.json().catch(() => null);

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

            // ✅ If specifically rejected by backend on final attempt
            if (i === maxRetries - 1 && (!json?.success || json?.status === "REJECTED")) {
              throw new Error(json?.message || "Truecaller verification failed");
            }

            if (i < maxRetries - 1) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
          } catch (err: any) {
            if (i === maxRetries - 1) throw new Error(err.message || "Truecaller timeout");
          }
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    // maxAge: 30, // seconds
    // updateAge: 0,
  },

  // jwt: {
  //   maxAge: 30,
  // },

  callbacks: {
    async jwt({ token, account, user }) {
      // ✅ 1) Google sign-in
      if (account?.provider === "google") {
        const payload = {
          id_token: account.id_token ?? null,
          access_token: account.access_token ?? null,
        };

        if (payload.id_token || payload.access_token) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/customer/Oauth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result?.success) {
              token.accessToken = result.data.accessToken;
              token.refreshToken = result.data.refreshToken;
              token.userId = result.data.userId;
              token.customerUniqueId = result.data.customerUniqueId;
              token.role = result.data.role;
              token.verifiedAt = result.data.verifiedAt;
            } else {
              // Passing error to be caught if necessary
              throw new Error(result?.message || "Google backend login failed");
            }
          } catch (err: any) {
            console.error("Backend login error (google):", err);
          }
        }
      }

      // ✅ 2) OTP/Truecaller/DigiLocker sign-in
      if ((account?.provider === "otp" || account?.provider === "truecaller" || account?.provider === "digilocker") && user) {
        token.userId = (user as any).id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.customerUniqueId = (user as any).customerUniqueId;
        token.role = (user as any).role;
        token.verifiedAt = (user as any).verifiedAt;
        token.email = (user as any).email;
        (token as any).mobile = (user as any).mobile;
        if ((user as any).phoneNumber) (token as any).phoneNumber = (user as any).phoneNumber;
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
      (session as any).mobile = (token as any).mobile;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };