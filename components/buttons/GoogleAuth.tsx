"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

interface GoogleSignInButtonProps {
  callbackUrl?: string;
  text?: string;
  className?: string;
}

export default function GoogleAuth({ 
  callbackUrl = "/user", 
  text = "Continue with Google",
  className = ""
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className={`
        flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 
        text-sm font-medium text-gray-700 shadow-sm transition-all 
        hover:bg-gray-50 hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 
        active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        // Simple loading spinner
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      ) : (
        <FcGoogle className="text-xl" />
      )}
      <span>{isLoading ? "Connecting..." : text}</span>
    </button>
  );
}