"use client"

import { useState } from "react"
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
  const [loanPurpose, setLoanPurpose] = useState("Personal")
  const [loanAmount, setLoanAmount] = useState(25000)
  const [tenureDays, setTenureDays] = useState(30)
  const [dailyInterestRate, setDailyInterestRate] = useState(1.5) // 1.5% per day
  const [processingFeePercent, setProcessingFeePercent] = useState(2) // 2% processing fee

  // Daily interest calculation for payday bullet loans
  const totalInterest = (loanAmount * (dailyInterestRate / 100) * tenureDays).toFixed(0)
  const processingFee = (loanAmount * (processingFeePercent / 100)).toFixed(0)
  const totalRepay = (Number(loanAmount) + Number(totalInterest) + Number(processingFee)).toFixed(0)

  const purposes = ["Personal", "Medical", "Education", "Business", "Travel", "Wedding"]

  return (
    <section className="py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
          {/* Payday Loan Calculator Header */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Loan Calculator</h3>
            <p className="text-slate-600 text-xs sm:text-sm">Calculate Your Total Repayment Amount</p>
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4">Select Loan Purpose</label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => setLoanPurpose(purpose)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    loanPurpose === purpose
                      ? "bg-teal-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-900">Loan Amount</label>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">₹{loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-teal-400 to-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹5k</span>
              <span>₹50k</span>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-900">Loan Tenure</label>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">{tenureDays} days</span>
            </div>
            <input
              type="range"
              min="7"
              max="45"
              step="1"
              value={tenureDays}
              onChange={(e) => setTenureDays(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-teal-400 via-teal-400 to-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>7 days</span>
              <span>45 days</span>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-900">Daily Interest Rate</label>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">{dailyInterestRate.toFixed(1)}% per day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={dailyInterestRate}
              onChange={(e) => setDailyInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-teal-400 to-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0.5%</span>
              <span>3%</span>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-900">Processing Fee</label>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">{processingFeePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={processingFeePercent}
              onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-teal-400 to-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>10%</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-xs sm:text-sm">Principal Amount</span>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">₹{loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-xs sm:text-sm">Interest ({dailyInterestRate.toFixed(1)}% × {tenureDays} days)</span>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">₹{totalInterest}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-xs sm:text-sm">Processing Fee ({processingFeePercent}%)</span>
              <span className="text-slate-900 font-semibold text-sm sm:text-base">₹{processingFee}</span>
            </div>
            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-slate-200">
              <span className="text-slate-900 font-bold text-base sm:text-lg">Total Repayment</span>
              <span className="text-teal-500 font-bold text-xl sm:text-2xl">₹{totalRepay}</span>
            </div>
          </div>

          <Button
            onClick={() => window.location.href = '/apply/quick'}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 sm:py-3 rounded-md mb-2 sm:mb-3 transition-all duration-300 text-sm sm:text-base"
          >
            Apply for This Loan
          </Button>
          <p className="text-center text-xs sm:text-sm text-slate-600">Get Instant Approval • Money in Bank Within Minutes</p>
        </div>
      </div>
    </section>
  )
}
