"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { CheckCircle, X, AlertCircle } from "lucide-react"
import { API_BASE_URL } from '@/lib/config'

interface FinancialCTAProps {
  heading?: string
  description?: string
  inputPlaceholder?: string
  buttonText?: string
  onSubscribe?: (email: string) => void
}

export function FinancialCTA({
  heading,
  description,
  inputPlaceholder,
  buttonText,
  onSubscribe,
}: FinancialCTAProps) {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [error, setError] = useState("")

  const handleSubscribe = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setError(t?.newsletter?.errors?.required || "Please enter your email address")
      return
    }
    if (!emailRegex.test(email)) {
      setError(t?.newsletter?.errors?.invalid || "Please enter a valid email address")
      return
    }

    setIsSubscribing(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscribe/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccessPopup(true)
        setEmail("")
        if (onSubscribe) {
          onSubscribe(email)
        }
        setTimeout(() => {
          setShowSuccessPopup(false)
        }, 3000)
      } else {
        setError(data.message || t?.newsletter?.errors?.failed || 'Failed to subscribe. Please try again.')
      }
    } catch (err) {
      console.error('Error subscribing:', err)
      setError(t?.newsletter?.errors?.failed || 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className=" xl:min-h-[calc(100vh-80px)]  flex items-center justify-center bg-[#f6f6f6] md:py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
       className="
  w-full max-w-4xl 
  rounded-none        
  sm:rounded-none      
  md:rounded-2xl        
  p-8 sm:p-12 md:p-16 lg:p-20 
  text-center
"
        style={{
          background: "linear-gradient(180deg, #6D9DFF 0%, #415E99 100%)",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white mb-3 sm:mb-4 text-balance px-2"
          style={{
            fontFamily: "'Cabin', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(24px, 5vw, 47px)",
            lineHeight: "130%",
            letterSpacing: "0.24px",
            textAlign: "center",
          }}
        >
          {heading || t?.homepage?.financialCta?.heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 text-balance px-2"
        >
          {description || t?.homepage?.financialCta?.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center w-full max-w-md mx-auto"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError("")
            }}
            placeholder={inputPlaceholder || t?.homepage?.financialCta?.placeholder}
            className={`py-4 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-base sm:text-lg font-sans border-0 ${error ? 'ring-2 ring-red-400' : ''}`}
            onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
          />
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="py-4 sm:py-4 bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold transition-all w-full sm:w-auto border-0 cursor-pointer text-base sm:text-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubscribing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t?.newsletter?.subscribing || "Subscribing..."}
              </>
            ) : (
              buttonText || t?.homepage?.financialCta?.buttonText
            )}
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-200 text-sm mt-3 flex items-center justify-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-white rounded-lg shadow-2xl p-6 max-w-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{t?.newsletter?.successTitle || "Subscribed Successfully!"}</h4>
                <p className="text-sm text-gray-600">{t?.newsletter?.successMessage || "Thank you for subscribing. You'll receive our latest updates."}</p>
              </div>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
