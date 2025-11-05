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
  const [loanAmount, setLoanAmount] = useState(50000)
  const [tenure, setTenure] = useState(3)

  const interestRate = 0.12 // 12% annual rate
  const monthlyRate = interestRate / 12
  const totalInterest = (loanAmount * monthlyRate * tenure).toFixed(0)
  const totalRepay = (Number(loanAmount) + Number(totalInterest)).toFixed(0)

  const purposes = ["Personal", "Medical", "Education", "Business", "Travel", "Wedding"]

  return (
    <section className="bg-slate-50 py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">
          See Your <span className="text-teal-500">Loan</span>, Your Way.
        </h2>

        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-sm">
          {/* EMI Calculator Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">EMI Calculator</h3>
            <p className="text-slate-600 text-sm">See Your Monthly Payment Instantly</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">Select Loan Purpose</label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => setLoanPurpose(purpose)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-900">Loan Amount</label>
              <span className="text-slate-900 font-semibold">₹{loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-400 to-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹10k</span>
              <span>₹5L</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-900">Tenure</label>
              <span className="text-slate-900 font-semibold">{tenure} months</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-400 via-teal-400 to-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 month</span>
              <span>12 months</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 pb-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Total Interest Due</span>
              <span className="text-slate-900 font-semibold">₹{totalInterest}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Total to Repay at End</span>
              <span className="text-slate-900 font-bold text-lg">₹{totalRepay}</span>
            </div>
          </div>

          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-md mb-3">
            Apply for This Loan
          </Button>
          <p className="text-center text-xs text-slate-600">Get Approval in 30 Seconds Money in Bank Within Minutes</p>
        </div>
      </div>
    </section>
  )
}
