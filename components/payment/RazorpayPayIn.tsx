"use client";

import { useState, useEffect, useRef } from "react";

interface RazorpayPayInProps {
  amount?: number;
  razorpayKey?: string;
  name?: string;
  description?: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export default function RazorpayPayIn({
  amount = 1000, // Amount in paise (1000 = ₹10)
  razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "", // Your Razorpay Key
  name = "Quikkred",
  description = "EMI Payment",
  prefillName = "",
  prefillEmail = "",
  prefillContact = "",
  onSuccess,
  onFailure,
}: RazorpayPayInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const isProcessingRef = useRef(false);

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Handle Pay Button Click - Direct Razorpay, No Backend
  const handlePay = () => {
    if (isProcessingRef.current || isLoading || !razorpayLoaded) return;

    isProcessingRef.current = true;
    setIsLoading(true);

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: "INR",
      name: name,
      description: description,
      prefill: {
        name: prefillName,
        email: prefillEmail,
        contact: prefillContact,
      },
      handler: (response: any) => {
        // Payment successful - Razorpay returns payment details
        alert(`Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
        onSuccess?.(response);
        setIsLoading(false);
        isProcessingRef.current = false;
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          isProcessingRef.current = false;
        },
      },
      theme: { color: "#25B181" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", (response: any) => {
      alert(`Payment Failed: ${response.error.description}`);
      onFailure?.(response.error);
      setIsLoading(false);
      isProcessingRef.current = false;
    });

    rzp.open();
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading || !razorpayLoaded}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isLoading ? "Processing..." : `Pay ₹${amount / 100}`}
    </button>
  );
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
