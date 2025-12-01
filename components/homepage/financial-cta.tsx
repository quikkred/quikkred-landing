"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/contexts/LanguageContext"

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

  const handleSubscribe = () => {
    if (email && onSubscribe) {
      onSubscribe(email)
      setEmail("")
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
          {heading || t.homepage.financialCta.heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 text-balance px-2"
        >
          {description || t.homepage.financialCta.description}
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder={inputPlaceholder || t.homepage.financialCta.placeholder}
            className="h-11 sm:h-12 px-4 sm:px-6 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-sm sm:text-base font-sans border-0"
            onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubscribe}
            className="h-11 sm:h-12 bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 rounded-lg font-semibold transition-colors w-full sm:w-auto border-0 cursor-pointer text-sm sm:text-base whitespace-nowrap"
          >
            {buttonText || t.homepage.financialCta.buttonText}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
