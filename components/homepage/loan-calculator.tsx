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
  const [loanPurpose, setLoanPurpose] = useState("Personal")
  const [loanAmount, setLoanAmount] = useState(25000)
  const [tenureDays, setTenureDays] = useState(30)
  const [dailyInterestRate, setDailyInterestRate] = useState(1.5) // 1.5% per day
  const [processingFeePercent, setProcessingFeePercent] = useState(2) // 2% Platform Fee

  // Daily interest calculation for payday bullet loans
  const totalInterest = (loanAmount * (dailyInterestRate / 100) * tenureDays).toFixed(0)
  const processingFee = (loanAmount * (processingFeePercent / 100)).toFixed(0)
  const disbursedAmount = (loanAmount - Number(processingFee)).toFixed(0)
  const totalRepay = (Number(loanAmount) + Number(totalInterest)).toFixed(0)

  return (
    <section className="py-0 px-0">
      <div className="max-w-full mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-xl">
          {/* Payday Loan Calculator Header */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5">{t?.calculator?.title}</h3>
            <p className="text-slate-600 text-[10px] sm:text-xs">{t?.calculator?.subtitle}</p>
          </div>

          {/* <div className="mb-4 sm:mb-5">
            <label className="block text-xs font-semibold text-slate-900 mb-2">{t?.calculator?.loanPurpose}</label>
            <div className="flex flex-wrap gap-1.5">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => setLoanPurpose(purpose)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-colors ${
                    loanPurpose === purpose
                      ? "bg-[#25B181] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t?.calculator?.purposes[purpose as keyof typeof t?.calculator?.purposes]}
                </button>
              ))}
            </div>
          </div> */}

          <div className="mb-2 sm:mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-900">{t?.calculator?.loanAmount}</label>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">₹{loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1 bg-gradient-to-r from-[#51C9AF] to-slate-300 rounded-lg appearance-none cursor-pointer accent-[#25B181]"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>₹5k</span>
              <span>₹25L</span>
            </div>
          </div>

          <div className="mb-2 sm:mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-900">{t?.calculator?.tenure}</label>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">{tenureDays} {t?.calculator?.tenureDays}</span>
            </div>
            <input
              type="range"
              min="7"
              max="45"
              step="1"
              value={tenureDays}
              onChange={(e) => setTenureDays(Number(e.target.value))}
              className="w-full h-1 bg-gradient-to-r from-[#51C9AF] via-[#51C9AF] to-slate-300 rounded-lg appearance-none cursor-pointer accent-[#25B181]"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>7 {t?.calculator?.tenureDays}</span>
              <span>45 {t?.calculator?.tenureDays}</span>
            </div>
          </div>

          <div className="mb-2 sm:mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-900">{t?.calculator?.dailyInterestRate}</label>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">{dailyInterestRate.toFixed(1)}% {t?.calculator?.perDay}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={dailyInterestRate}
              onChange={(e) => setDailyInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-gradient-to-r from-[#51C9AF] to-slate-300 rounded-lg appearance-none cursor-pointer accent-[#25B181]"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0.5%</span>
              <span>3%</span>
            </div>
          </div>

          <div className="mb-2 sm:mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-900">{t?.calculator?.processingFee}</label>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">{processingFeePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={processingFeePercent}
              onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
              className="w-full h-1 bg-gradient-to-r from-[#51C9AF] to-slate-300 rounded-lg appearance-none cursor-pointer accent-[#25B181]"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0%</span>
              <span>10%</span>
            </div>
          </div>

          <div className="space-y-1.5 mb-3 pb-2 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-[10px] sm:text-xs">{t?.calculator?.principalAmount}</span>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">₹{loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-[10px] sm:text-xs">{t?.calculator?.processingFee} ({processingFeePercent}%)</span>
              <span className="text-red-500 font-semibold text-[10px] sm:text-xs">- ₹{processingFee}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 bg-green-50 -mx-4 sm:-mx-5 px-4 sm:px-5 py-1.5">
              <span className="text-green-700 font-bold text-xs sm:text-sm">{t?.calculator?.disbursedAmount || "Amount You'll Receive"}</span>
              <span className="text-green-600 font-bold text-sm sm:text-base">₹{Number(disbursedAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5">
              <span className="text-slate-700 text-[10px] sm:text-xs">{t?.calculator?.interest} ({dailyInterestRate.toFixed(1)}% × {tenureDays} {t?.calculator?.tenureDays})</span>
              <span className="text-slate-900 font-semibold text-[10px] sm:text-xs">₹{totalInterest}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="text-slate-900 font-bold text-xs sm:text-sm">{t?.calculator?.totalRepayment}</span>
              <span className="text-[#25B181] font-bold text-sm sm:text-base">₹{Number(totalRepay).toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={() => router.push('/apply/quick')}
            className="w-full bg-[#25B181] hover:bg-[#1F8F68] text-white font-bold py-2.5 sm:py-3 rounded-xl mb-1.5 transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl"
          >
            {t?.calculator?.applyButton}
          </Button>
          <p className="text-center text-[9px] sm:text-[10px] text-slate-600">{t?.calculator?.footer}</p>
        </div>
      </div>
    </section>
  )
}
