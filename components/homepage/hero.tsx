"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { Globe, ChevronDown, ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react"

export default function Hero() {
  const router = useRouter()
  const { t, language, setLanguage, availableLanguages } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    loanAmount: "",
    email: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [fieldError, setFieldError] = useState("")
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }
    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageDropdownOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'mobile') {
      if (value && !/^\d*$/.test(value)) {
        setFieldError(t?.hero?.form?.errors?.numbersOnly || "Mobile number can only contain numbers")
        return
      } else if (value && value.length > 0 && value.length !== 10) {
        setFieldError(t?.hero?.form?.errors?.tenDigits || "Mobile number must be exactly 10 digits")
      } else if (value && value.length === 10 && !/^[6-9]\d{9}$/.test(value)) {
        setFieldError(t?.hero?.form?.errors?.validStart || "Mobile number must start with 6, 7, 8, or 9")
      } else {
        setFieldError("")
      }
    }
    if (name === 'name') {
      if (value && /\d/.test(value)) {
        setFieldError(t?.hero?.form?.errors?.nameNoNumbers || "Name cannot contain numbers")
        return
      } else {
        setFieldError("")
      }
    }
    if (name !== 'mobile' && name !== 'name') {
      setFieldError("")
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    const currentField = steps[currentStep - 1].field
    const fieldValue = formData[currentField as keyof typeof formData]
    if (currentField === 'mobile') {
      if (!fieldValue || fieldValue.length !== 10) {
        setFieldError(t?.hero?.form?.errors?.tenDigits || "Mobile number must be exactly 10 digits")
        return
      }
      if (!/^[6-9]\d{9}$/.test(fieldValue)) {
        setFieldError(t?.hero?.form?.errors?.validStart || "Mobile number must start with 6, 7, 8, or 9")
        return
      }
    }
    if (currentField === 'name' && !fieldValue) {
      setFieldError(t?.hero?.form?.errors?.nameRequired || "Name is required")
      return
    }
    if (fieldError) return
    if (fieldValue) {
      if (currentStep === 4) {
        handleSubmit()
      } else {
        setFieldError("")
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleSubmit = () => {
    localStorage.setItem('heroFormData', JSON.stringify({
      name: formData.name,
      mobile: formData.mobile,
      amount: formData.loanAmount,
      email: formData.email
    }))
    router.push('/apply/quick')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  const steps = [
    { number: "01", question: t?.hero?.form?.step1?.question || "Enter your Mobile number", placeholder: t?.hero?.form?.step1?.placeholder || "Enter your mobile number", field: "mobile" },
    { number: "02", question: t?.hero?.form?.step2?.question || "What's your name?", placeholder: t?.hero?.form?.step2?.placeholder || "Enter your name", field: "name" },
    { number: "03", question: t?.hero?.form?.step3?.question || "How much do you need?", placeholder: t?.hero?.form?.step3?.placeholder || "Enter Amount in ₹", field: "loanAmount" },
    { number: "04", question: t?.hero?.form?.step4?.question || "Enter email address", placeholder: t?.hero?.form?.step4?.placeholder || "Enter your email", field: "email" },
  ]

  const currentStepData = steps[currentStep - 1]

  const benefits = [
    { icon: Clock, text: t?.hero?.benefits?.quick || "Quick Approval" },
    { icon: Shield, text: t?.hero?.benefits?.secure || "100% Secure" },
    { icon: CheckCircle2, text: t?.hero?.benefits?.paperless || "Paperless Process" },
  ]

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-[#E8F7F3]/30 min-h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Language Bar - Above Hero */}
      <div className="w-full bg-gradient-to-r from-[#E8F7F3] via-white to-[#E8F7F3] border-b border-slate-200 py-2 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25B181]" />
            <span className="text-[10px] sm:text-xs text-slate-500 mr-1 sm:mr-2 hidden xs:inline">{t?.hero?.languageBar?.availableIn || "Available in:"}</span>
            {availableLanguages.slice(0, 4).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all ${
                  language === lang.code
                    ? "bg-[#25B181] text-white font-semibold shadow-sm"
                    : "text-slate-600 hover:text-[#25B181] hover:bg-[#D3F1EB]"
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
            {/* Show more languages on sm screens */}
            <div className="hidden sm:flex gap-1.5">
              {availableLanguages.slice(4, 8).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    language === lang.code
                      ? "bg-[#25B181] text-white font-semibold shadow-sm"
                      : "text-slate-600 hover:text-[#25B181] hover:bg-[#D3F1EB]"
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
            {availableLanguages.length > 4 && (
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="text-[10px] sm:text-xs text-[#25B181] hover:text-[#1F8F68] flex items-center gap-0.5 sm:gap-1 font-medium"
                >
                  <span className="sm:hidden">+{availableLanguages.length - 4}</span>
                  <span className="hidden sm:inline">+{availableLanguages.length - 8} {t?.hero?.languageBar?.more || "more"}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {languageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto z-50"
                    >
                      <div className="p-1.5 sm:p-2">
                        {availableLanguages.slice(4).map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code)
                              setLanguageDropdownOpen(false)
                            }}
                            className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
                              language === lang.code
                                ? "bg-[#E8F7F3] text-[#1F8F68] font-semibold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {lang.nativeName}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background decorations - smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-[#D3F1EB]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-gradient-to-r from-[#E8F7F3]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 relative z-10 flex-1 flex items-center">
        <div className="max-w-3xl lg:max-w-4xl mx-auto text-center w-full">

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-slate-900 leading-tight mb-2 sm:mb-3 md:mb-4 px-2">
              {t?.hero?.form?.heading || "Get"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25B181] to-[#1F8F68]">
                {t?.hero?.form?.headingHighlight || "Instant Cash"}
              </span>
              <br className="hidden xs:block" />
              <span className="xs:hidden"> </span>
              {t?.hero?.form?.headingLine2 || "When You Need It"}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 mb-4 sm:mb-6 md:mb-8 max-w-xl lg:max-w-2xl mx-auto px-2"
          >
            {t?.hero?.description || "Quick loans up to ₹5 Lakhs with minimal documentation. Get approved in minutes, not days."}
          </motion.p>

          {/* Form Card - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-slate-100 p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8"
          >
            {/* Progress Indicators with Step Number */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs md:text-sm font-bold shadow-lg"
                >
                  {currentStepData.number}
                </motion.div>
              </AnimatePresence>

              {/* Progress bars */}
              <div className="flex gap-1 sm:gap-1.5 md:gap-2 flex-1">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`h-1 sm:h-1.5 md:h-2 flex-1 rounded-full transition-all duration-300 ${
                      currentStep >= index + 1 ? "bg-gradient-to-r from-[#25B181] to-[#1F8F68]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Step counter */}
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-500 font-semibold flex-shrink-0">{currentStep}/4</span>
            </div>

            {/* Form Content with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-slate-900 font-bold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg lg:text-xl">
                  {currentStepData.question}
                </label>
                {currentStepData.field === "mobile" ? (
                  <div className={`flex items-center border-2 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 overflow-hidden transition-all ${
                    fieldError ? 'border-red-400' : 'border-slate-200 focus-within:ring-2 focus-within:ring-[#25B181] focus-within:border-[#25B181]'
                  }`}>
                    <span className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 bg-slate-100 text-slate-700 text-sm sm:text-base md:text-lg font-semibold border-r border-slate-200">+91</span>
                    <input
                      type="tel"
                      name={currentStepData.field}
                      placeholder={currentStepData.placeholder}
                      value={formData[currentStepData.field as keyof typeof formData]}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      maxLength={10}
                      className="flex-1 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium bg-transparent outline-none placeholder-slate-400"
                      autoFocus
                    />
                  </div>
                ) : (
                  <input
                    type={currentStepData.field === "email" ? "email" : "text"}
                    name={currentStepData.field}
                    placeholder={currentStepData.placeholder}
                    value={formData[currentStepData.field as keyof typeof formData]}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium border-2 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 focus:outline-none focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] placeholder-slate-400 transition-all ${
                      fieldError ? 'border-red-400' : 'border-slate-200'
                    }`}
                    autoFocus
                  />
                )}
                {fieldError && (
                  <p className="text-red-500 text-[10px] sm:text-xs md:text-sm mb-2">{fieldError}</p>
                )}
                {!fieldError && <div className="mb-2 sm:mb-3 md:mb-4"></div>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#25B181] to-[#1F8F68] hover:from-[#1F8F68] hover:to-[#1a7a59] text-white py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-bold rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <span>{currentStep === 4 ? (t?.hero?.form?.cta || "Check Eligibility") : (t?.hero?.form?.next || "Next →")}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4 md:mb-6"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-slate-600">
                <benefit.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#25B181]" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col xs:flex-row flex-wrap justify-center items-center gap-1.5 sm:gap-2 md:gap-3"
          >
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-semibold">{t?.hero?.rbiCompliant || "RBI Compliant NBFC"}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 rounded-full">
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#25B181]" />
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium">{t?.hero?.dataProtected || "Data Protected"}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
