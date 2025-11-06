"use client"

import { useState } from "react"

interface FinancialCTAProps {
  heading?: string
  description?: string
  inputPlaceholder?: string
  buttonText?: string
  onSubscribe?: (email: string) => void
}

export function FinancialCTA({
  heading = "Ready to Transform Your Financial Future?",
  description = "Get your instant, no-obligation quote in 60 seconds.",
  inputPlaceholder = "Enter Your email",
  buttonText = "Subscribe",
  onSubscribe,
}: FinancialCTAProps) {
  const [email, setEmail] = useState("")

  const handleSubscribe = () => {
    if (email && onSubscribe) {
      onSubscribe(email)
      setEmail("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f6f6] py-16 md:py-24 px-4">
      <div
        className="w-full max-w-4xl rounded-3xl p-12 md:p-20 text-center"
        style={{
          background: "linear-gradient(180deg, #6D9DFF 0%, #415E99 100%)",
        }}
      >
        <h1
          className="text-white mb-4 text-balance"
          style={{
            fontFamily: "'Cabin', sans-serif",
            fontWeight: 600,
            fontSize: "47px",
            lineHeight: "130%",
            letterSpacing: "0.24px",
            textAlign: "center",
          }}
        >
          {heading}
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8 text-balance">{description}</p>

        <div className="flex flex-col md:flex-row gap-3 justify-center items-center w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={inputPlaceholder}
            className="h-12 px-6 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 w-full md:w-80 font-sans border-0"
            onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
          />
          <button
            onClick={handleSubscribe}
            className="h-12 bg-gray-900 hover:bg-gray-800 text-white px-8 rounded-lg font-semibold transition-colors w-full md:w-auto border-0 cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}
