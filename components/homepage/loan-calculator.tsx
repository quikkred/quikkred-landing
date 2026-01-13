"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/LanguageContext"

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={[
      "inline-flex items-center justify-center",
      className ?? "",
    ].filter(Boolean).join(" ")}
  >
    {children}
  </button>
)

export default function LoanCalculatorAll() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loanAmount, setLoanAmount] = useState(50000)
  const [tenureDays, setTenureDays] = useState(30)

  // Quikkred Fee Structure:
  // - Platform Fee: 10% of loan amount
  // - GST: 18% on platform fee
  // - Interest: 1% flat on loan amount
  const platformFeePercent = 10
  const gstPercent = 18
  const interestPercent = 1

  // Calculations
  const platformFee = Math.round(loanAmount * (platformFeePercent / 100))
  const gstOnPlatformFee = Math.round(platformFee * (gstPercent / 100))
  const interest = Math.round(loanAmount * (interestPercent / 100))
  const totalDeductions = platformFee + gstOnPlatformFee + interest
  const disbursedAmount = loanAmount - totalDeductions
  const totalRepayment = loanAmount // You repay the principal only

  // Tenure options for button selection
  const tenureOptions = [7, 15, 30, 60, 90]

  return (
    <section className="py-0 px-0">
      <div className="max-w-full mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-xl">
          {/* Payday Loan Calculator Header */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5">{t?.calculator?.title || "Payday Loan Calculator"}</h3>
            <p className="text-slate-600 text-[10px] sm:text-xs">{t?.calculator?.subtitle || "Calculate Your Loan Amount & Fees"}</p>
          </div>

          {/* Loan Amount Slider */}
          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-900">{t?.calculator?.loanAmount || "Loan Amount"}</label>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-gradient-to-r from-[#51C9AF] to-slate-300 rounded-lg appearance-none cursor-pointer accent-[#25B181]"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>₹10,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          {/* Tenure Selection Buttons */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-[10px] sm:text-xs font-semibold text-slate-900 mb-2">{t?.calculator?.tenure || "Loan Tenure"}</label>
            <div className="flex flex-wrap gap-2">
              {tenureOptions.map((days) => (
                <button
                  key={days}
                  onClick={() => setTenureDays(days)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    tenureDays === days
                      ? "bg-[#25B181] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="space-y-2 mb-3 pb-3 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-[10px] sm:text-xs">{t?.calculator?.principalAmount || "Loan Amount"}</span>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-[10px] sm:text-xs">Platform Fee ({platformFeePercent}%)</span>
              <span className="text-red-500 font-semibold text-[10px] sm:text-xs">- ₹{platformFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-[10px] sm:text-xs">GST ({gstPercent}% on fee)</span>
              <span className="text-red-500 font-semibold text-[10px] sm:text-xs">- ₹{gstOnPlatformFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-[10px] sm:text-xs">Interest ({interestPercent}% flat)</span>
              <span className="text-red-500 font-semibold text-[10px] sm:text-xs">- ₹{interest.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-700 text-[10px] sm:text-xs font-medium">Total Deductions</span>
              <span className="text-red-600 font-bold text-[10px] sm:text-xs">- ₹{totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Amount You'll Receive */}
          <div className="bg-green-50 -mx-4 sm:-mx-5 px-4 sm:px-5 py-3 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-bold text-xs sm:text-sm">{t?.calculator?.disbursedAmount || "Amount You'll Receive"}</span>
              <span className="text-green-600 font-bold text-lg sm:text-xl">₹{disbursedAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Total Repayment */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-900 font-bold text-xs sm:text-sm block">{t?.calculator?.totalRepayment || "Amount to Repay"}</span>
              <span className="text-slate-500 text-[9px] sm:text-[10px]">After {tenureDays} days</span>
            </div>
            <span className="text-[#25B181] font-bold text-lg sm:text-xl">₹{totalRepayment.toLocaleString('en-IN')}</span>
          </div>

          {/* Apply Button */}
          <Button
            onClick={() => router.push('/apply/quick')}
            className="w-full bg-[#25B181] hover:bg-[#1F8F68] text-white font-bold py-2.5 sm:py-3 rounded-xl mb-2 transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl"
          >
            {t?.calculator?.applyButton || "Apply for This Loan"}
          </Button>

          {/* Footer Info */}
          <p className="text-center text-[9px] sm:text-[10px] text-slate-600">
            {t?.calculator?.footer || "Get Instant Approval • Money in Bank Within 30 Minutes"}
          </p>

          {/* Trust Message */}
          <p className="text-center text-[8px] sm:text-[9px] text-slate-500 mt-2">
            Platform Fee 10% + GST 18% + Interest 1% flat • No hidden charges • RBI registered NBFC
          </p>
        </div>
      </div>
    </section>
  )
}
