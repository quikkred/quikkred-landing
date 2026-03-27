"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { Globe, ChevronDown, ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react"
import { API_BASE_URL } from '@/lib/config'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

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

    // Mobile validation - only numbers allowed
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

    // Name validation - only alphabets and spaces allowed
    if (name === 'name') {
      if (value && !/^[a-zA-Z\s]*$/.test(value)) {
        setFieldError(t?.hero?.form?.errors?.nameAlphabetsOnly || "Name can only contain alphabets")
        return
      } else if (value && value.trim().length < 3) {
        setFieldError(t?.hero?.form?.errors?.nameMinLength || "Name must be at least 3 characters")
      } else {
        setFieldError("")
      }
    }

    // Loan Amount validation - only numbers allowed
    if (name === 'loanAmount') {
      // Remove commas for validation, allow only digits and commas
      const cleanValue = value.replace(/,/g, '')
      if (value && !/^[\d,]*$/.test(value)) {
        setFieldError(t?.hero?.form?.errors?.amountNumbersOnly || "Amount can only contain numbers")
        return
      } else if (cleanValue && parseInt(cleanValue) < 5000) {
        setFieldError(t?.hero?.form?.errors?.amountMin || "Minimum loan amount is ₹5,000")
      } else if (cleanValue && parseInt(cleanValue) > 100000) {
        setFieldError(t?.hero?.form?.errors?.amountMax || "Maximum loan amount is ₹1,00,000")
      } else {
        setFieldError("")
      }
    }

    // Email validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (value && !emailRegex.test(value)) {
        setFieldError(t?.hero?.form?.errors?.invalidEmail || "Please enter a valid email address")
      } else {
        setFieldError("")
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    const currentField = steps[currentStep - 1].field
    const fieldValue = formData[currentField as keyof typeof formData]

    // Mobile validation
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

    // Name validation
    if (currentField === 'name') {
      if (!fieldValue || fieldValue.trim().length < 3) {
        setFieldError(t?.hero?.form?.errors?.nameRequired || "Name must be at least 3 characters")
        return
      }
      if (!/^[a-zA-Z\s]+$/.test(fieldValue)) {
        setFieldError(t?.hero?.form?.errors?.nameAlphabetsOnly || "Name can only contain alphabets")
        return
      }
    }

    // Loan Amount validation
    if (currentField === 'loanAmount') {
      const cleanValue = fieldValue.replace(/,/g, '')
      if (!cleanValue) {
        setFieldError(t?.hero?.form?.errors?.amountRequired || "Loan amount is required")
        return
      }
      if (parseInt(cleanValue) < 5000) {
        setFieldError(t?.hero?.form?.errors?.amountMin || "Minimum loan amount is ₹5,000")
        return
      }
      if (parseInt(cleanValue) > 100000) {
        setFieldError(t?.hero?.form?.errors?.amountMax || "Maximum loan amount is ₹1,00,000")
        return
      }
    }

    // Email validation
    if (currentField === 'email') {
      if (!fieldValue) {
        setFieldError(t?.hero?.form?.errors?.emailRequired || "Email is required")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailRegex.test(fieldValue)) {
        setFieldError(t?.hero?.form?.errors?.invalidEmail || "Please enter a valid email address")
        return
      }
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

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Remove commas from amount for API (e.g., "12,000" -> "12000")
    const sanitizedAmount = formData.loanAmount.replace(/,/g, '')

    const formPayload = {
      name: formData.name,
      mobile: formData.mobile,
      amount: sanitizedAmount,
      email: formData.email
    }

    try {
      // Call API to store instant form data
      await fetch(`${API_BASE_URL}/api/instantForm/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formPayload),
      })
    } catch (error) {
      // Continue with flow even if API fails
      console.error('Error saving instant form data:', error)
    }

    // Save to localStorage and navigate (regardless of API success)
    localStorage.setItem('heroFormData', JSON.stringify(formPayload))
    router.push("/apply/quick")
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  }

  // Removed floating animation for better mobile performance

  return (
    <section ref={heroRef} className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50/30 min-h-fit md:min-h-[calc(100dvh-120px)] lg:min-h-[calc(100dvh-90px)] flex flex-col overflow-x-hidden overflow-y-auto">
      {/* Language Bar - Above Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-teal-50 via-white to-teal-50 border-b border-slate-200 py-2 sm:py-2.5 px-3 sm:px-4"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Globe className="w-4 h-4 text-teal-600" />
            <span className="text-xs text-slate-500 mr-2">{t?.hero?.languageBar?.availableIn || "Available in:"}</span>
            {availableLanguages.slice(0, 8).map((lang, index) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(lang.code)}
                className={`text-xs px-2.5 py-1.5 min-h-[32px] rounded-full transition-all ${
                  language === lang.code
                    ? "bg-[#25B181] text-white font-semibold shadow-sm"
                    : "text-slate-600 hover:text-[#25B181] hover:bg-[#D3F1EB]"
                }`}
              >
                {lang.nativeName}
              </motion.button>
            ))}
            {/* Show more languages on sm screens */}
            {/* <div className="hidden sm:flex gap-1.5">
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
            </div> */}
            {availableLanguages.length > 4 && (
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="text-xs text-[#25B181] hover:text-[#1F8F68] flex items-center gap-1 font-medium min-h-[32px] px-2"
                >
                  {/* <span className="sm:hidden">+{availableLanguages.length - 4}</span>
                  <span className="hidden sm:inline">+{availableLanguages.length - 8} {t?.hero?.languageBar?.more || "more"}</span> */}
                  <span className="inline">+{availableLanguages.length - 8} {t?.hero?.languageBar?.more || "more"}</span>
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
      </motion.div>

      {/* Animated Background Elements - Hidden on mobile for performance */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-20 left-10 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-50/20 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-400/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity }}
        className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-12 lg:py-16 relative z-10 flex-1 flex items-start md:items-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center w-full"
        >
          {/* Main Heading with gradient animation */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl xs:text-[26px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6 md:mb-8">
              {t?.hero?.form?.heading || "Get"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
                {t?.hero?.form?.headingHighlight || "Instant Cash"}
              </span>
              <br />
              {t?.hero?.form?.headingLine2 || "When You Need It"}
            </h1>
          </motion.div>

          {/* Form Card - Centered */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-xl mx-auto bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-slate-100 p-3 xs:p-4 sm:p-6 md:p-8 mb-5 sm:mb-8 md:mb-10 relative"
          >
            {/* Decorative glow - hidden on mobile for performance */}
            <div className="hidden sm:block absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-50" />

            <div className="relative">
              {/* Progress Indicators with Step Number */}
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    className="flex-shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] xs:text-xs sm:text-sm font-bold shadow-lg"
                  >
                    {currentStepData.number}
                  </motion.div>
                </AnimatePresence>

                {/* Progress bars */}
                <div className="flex gap-1 xs:gap-1.5 sm:gap-2 flex-1">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={index + 1 >= currentStep}
                      onClick={() => {
                        if (index + 1 < currentStep) {
                          setCurrentStep(index + 1);
                        }
                      }}
                      className={`flex-1 ${index + 1 < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className={`h-1.5 sm:h-2 w-full rounded-full transition-all duration-500 ${
                          currentStep >= index + 1 ? "bg-gradient-to-r from-teal-500 to-emerald-500" : "bg-slate-200"
                        } ${index + 1 < currentStep ? 'hover:from-teal-600 hover:to-emerald-600' : ''}`}
                      />
                    </button>
                  ))}
                </div>

                {/* Step counter */}
                <span className="text-sm text-slate-500 font-semibold flex-shrink-0">{currentStep}/4</span>
              </div>

              {/* Form Content with Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <label className="block text-slate-900 font-bold mb-2 xs:mb-3 sm:mb-4 text-sm xs:text-base sm:text-lg md:text-xl">
                    {currentStepData.question}
                  </label>
                  {currentStepData.field === "mobile" ? (
                    <div className={`flex items-center border-2 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 overflow-hidden transition-all ${
                      fieldError ? 'border-red-400' : 'border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500'
                    }`}>
                      <span className="px-2 xs:px-2.5 sm:px-4 py-2.5 xs:py-3 sm:py-4 bg-slate-100 text-slate-700 text-sm xs:text-base sm:text-lg md:text-xl font-semibold border-r border-slate-200">+91</span>
                      <input
                        type="tel"
                        name={currentStepData.field}
                        placeholder="Mobile number"
                        value={formData[currentStepData.field as keyof typeof formData]}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        maxLength={10}
                        className="flex-1 px-2 xs:px-2.5 sm:px-4 py-2.5 xs:py-3 sm:py-4 text-base sm:text-lg md:text-xl font-medium bg-transparent outline-none placeholder-slate-400 min-w-0"
                        style={{ fontSize: '16px' }}
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
                      className={`w-full px-2.5 xs:px-3 sm:px-5 py-2.5 xs:py-3 sm:py-4 text-base sm:text-lg md:text-xl font-medium border-2 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 transition-all ${
                        fieldError ? 'border-red-400' : 'border-slate-200'
                      }`}
                      style={{ fontSize: '16px' }}
                      autoFocus
                    />
                  )}
                  {fieldError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mb-3"
                    >
                      {fieldError}
                    </motion.p>
                  )}
                  {!fieldError && <div className="mb-2 xs:mb-3 sm:mb-4"></div>}
                  <motion.button
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px -15px rgba(20, 184, 166, 0.4)" } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-bold rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <>
                        <span>{currentStep === 4 ? (t?.hero?.form?.cta || "Check Eligibility") : "Next"}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Benefits with stagger animation */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 mb-6 sm:mb-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-slate-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, color: "#0d9488" }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                </motion.div>
                <span className="text-xs sm:text-sm md:text-base font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators with entrance animation */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-2 sm:gap-4"
          >
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-100 rounded-full"
              whileHover={{ scale: 1.05, backgroundColor: "#f0fdfa" }}
            >
              <motion.div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-semibold">{t?.hero?.rbiCompliant || "RBI Compliant NBFC Partnered"}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-100 rounded-full"
              whileHover={{ scale: 1.05, backgroundColor: "#f0fdfa" }}
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium">{t?.hero?.dataProtected || "Data Protected"}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
