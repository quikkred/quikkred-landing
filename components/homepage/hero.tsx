// "use client"

// import type React from "react"
// import { motion } from "framer-motion"
// import { ArrowRight, Shield, Zap, CheckCircle, Users, Star, Clock, Phone } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useLanguage } from "@/lib/contexts/LanguageContext"

// export default function Hero() {
//   const router = useRouter()
//   const { t } = useLanguage()

//   const steps = [
//     {
//       number: t.homepage.hero.steps[0].number,
//       title: t.homepage.hero.steps[0].title,
//       description: t.homepage.hero.steps[0].description,
//       icon: CheckCircle,
//     },
//     {
//       number: t.homepage.hero.steps[1].number,
//       title: t.homepage.hero.steps[1].title,
//       description: t.homepage.hero.steps[1].description,
//       icon: Shield,
//     },
//     {
//       number: t.homepage.hero.steps[2].number,
//       title: t.homepage.hero.steps[2].title,
//       description: t.homepage.hero.steps[2].description,
//       icon: Zap,
//     }
//   ]

//   return (
//     <section className="min-h-[calc(100vh-80px)] flex items-center bg-white py-16 md:py-24 px-4 overflow-hidden">
//       <div className="max-w-7xl mx-auto w-full">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="space-y-6"
//           >
//             {/* Trust Badge - matching steps section style */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2 }}
//               className="inline-block"
//             >
//               <span className="inline-block px-4 py-2 bg-teal-100 text-teal-600 rounded-full text-xs sm:text-sm font-semibold">
//                 {t.homepage.hero.trustBadge}
//               </span>
//             </motion.div>

//             {/* Main Heading - matching site typography scale */}
//             <div className="space-y-4">
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
//               >
//                 {t.homepage.hero.heading} <span className="text-teal-500">{t.homepage.hero.headingHighlight1}</span>
//                 <br />
//                 {t.homepage.hero.headingLine2} <span className="text-teal-500">{t.homepage.hero.headingHighlight2}</span>
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="text-slate-600 text-lg leading-relaxed"
//               >
//                 {t.homepage.hero.description}
//               </motion.p>
//             </div>

//             {/* Key Features - matching card style */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="flex flex-wrap gap-4"
//             >
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
//                 <CheckCircle className="w-5 h-5 text-teal-500" />
//                 <span className="font-medium text-slate-700 text-sm">{t.homepage.hero.features.instantApproval}</span>
//               </div>
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
//                 <Shield className="w-5 h-5 text-teal-500" />
//                 <span className="font-medium text-slate-700 text-sm">{t.homepage.hero.features.secure}</span>
//               </div>
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
//                 <Zap className="w-5 h-5 text-teal-500" />
//                 <span className="font-medium text-slate-700 text-sm">{t.homepage.hero.features.sameDayDisbursal}</span>
//               </div>
//             </motion.div>

//             {/* CTA Button - Inside Hero */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="flex flex-col sm:flex-row gap-4 pt-2"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => router.push('/apply/quick')}
//                 className="group px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
//               >
//                 {t.homepage.hero.buttons.applyNow}
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => router.push('/contact')}
//                 className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-500 transition-all duration-300 flex items-center justify-center gap-2"
//               >
//                 <Phone className="w-5 h-5" />
//                 {t.homepage.hero.buttons.talkToExpert}
//               </motion.button>
//             </motion.div>
//           </motion.div>

//           {/* Right - 3 Steps Visual - matching steps section exactly */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
//             className="relative"
//           >
//             <div className="space-y-6">
//               {steps.map((step, index) => {
//                 const Icon = step.icon
//                 return (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.6 + index * 0.15, duration: 0.6 }}
//                     whileHover={{ scale: 1.03, y: -5 }}
//                     className="relative"
//                   >
//                     <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
//                       <div className="flex items-start gap-4">
//                         {/* Icon - matching site icon style */}
//                         <div className="flex-shrink-0">
//                           <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center">
//                             <Icon className="w-6 h-6 text-teal-500" />
//                           </div>
//                         </div>

//                         {/* Step Content */}
//                         <div className="flex-1">
//                           <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
//                           <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
//                         </div>

//                         {/* Number badge - matching steps section */}
//                         <div className="absolute -top-3 -right-3">
//                           <div className="w-8 h-8 bg-teal-500 text-white rounded-full font-bold text-sm flex items-center justify-center shadow-sm">
//                             {step.number}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )
//               })}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }



"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { Globe, ChevronDown, Check } from "lucide-react"

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

export default function Hero() {
  const { t, language, setLanguage, availableLanguages } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    loanAmount: "",
    email: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNext = () => {
    // Get the current field from the steps array instead of formData keys
    const currentField = steps[currentStep - 1].field
    if (formData[currentField as keyof typeof formData]) {
      if (currentStep === 4) {
        // Submit on last step
        handleSubmit()
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    // Store data in localStorage for pre-filling the quick application
    localStorage.setItem('heroFormData', JSON.stringify({
      name: formData.name,
      mobile: formData.mobile,
      amount: formData.loanAmount,
      email: formData.email
    }));
    // Redirect to quick application
    window.location.href = '/apply/quick';
  }

  const steps = [
    { number: "01", question: t.hero.form.step1.question, placeholder: t.hero.form.step1.placeholder, field: "mobile" },
    { number: "02", question: t.hero.form.step2.question, placeholder: t.hero.form.step2.placeholder, field: "name" },
    { number: "03", question: t.hero.form.step3.question, placeholder: t.hero.form.step3.placeholder, field: "loanAmount" },
    { number: "04", question: t.hero.form.step4.question, placeholder: t.hero.form.step4.placeholder, field: "email" },
  ]

  const currentStepData = steps[currentStep - 1]

  if (submitted) {
    return (
      <section className="bg-white min-h-[calc(100vh-90px)] flex items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative">
        {/* Language Selector - Top Right Corner */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <div className="relative" ref={languageDropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-teal-500 text-teal-600 rounded-lg shadow-md hover:bg-teal-50 transition-all"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">
                {availableLanguages.find((l) => l.code === language)?.nativeName || "English"}
              </span>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Language Dropdown */}
            <AnimatePresence>
              {languageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-2xl border border-slate-200 max-h-80 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    {availableLanguages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ backgroundColor: "#f0fdfa" }}
                        onClick={() => {
                          setLanguage(lang.code)
                          setLanguageDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                          language === lang.code
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-700 hover:bg-teal-50"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{lang.nativeName}</span>
                          <span className="text-xs text-slate-500">{lang.name}</span>
                        </div>
                        {language === lang.code && (
                          <Check className="w-4 h-4 text-teal-600" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center w-full">
          <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              {t.hero.form.heading} <span className="text-teal-500">{t.hero.form.headingHighlight}</span>
              <br />
              {t.hero.form.headingLine2}
            </h1>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-md">
              {t.hero.description}
            </p>
            <Button
              onClick={() => window.location.href = '/apply/quick'}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded w-full sm:w-auto"
            >
              {t.hero.form.getInstantLoan}
            </Button>
          </div>

          <div className="relative flex justify-center items-start pt-8 md:pt-0 order-1 md:order-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden sm:flex absolute -top-8 -right-12 w-12 h-12 sm:w-16 sm:h-16 bg-teal-500 rounded-full items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg"
            >
              $
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-7 md:p-8"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="text-4xl sm:text-5xl"
                >
                  ✓
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl font-bold text-slate-900"
                >
                  {t.hero.form.thankYou}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base text-slate-600"
                >
                  {t.hero.form.successMessage}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentStep(1)
                    setSubmitted(false)
                    setFormData({ name: "", mobile: "", loanAmount: "", email: "" })
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 sm:py-2.5 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all"
                >
                  {t.hero.form.submitAnother}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden sm:flex absolute bottom-32 -left-8 w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-full items-center justify-center text-white text-lg sm:text-xl"
            >
              ⏱
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="hidden sm:flex absolute bottom-12 -right-8 w-12 h-12 sm:w-14 sm:h-14 bg-teal-500 rounded-full items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg"
            >
              $
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white min-h-[calc(100vh-90px)] flex items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative">
      {/* Language Selector - Top Right Corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <div className="relative" ref={languageDropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-teal-500 text-teal-600 rounded-lg shadow-md hover:bg-teal-50 transition-all"
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold">
              {availableLanguages.find((l) => l.code === language)?.nativeName || "English"}
            </span>
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`} />
          </motion.button>

          {/* Language Dropdown */}
          <AnimatePresence>
            {languageDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-2xl border border-slate-200 max-h-80 overflow-y-auto z-50"
              >
                <div className="p-2">
                  {availableLanguages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ backgroundColor: "#f0fdfa" }}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLanguageDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                        language === lang.code
                          ? "bg-teal-50 text-teal-700"
                          : "text-slate-700 hover:bg-teal-50"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{lang.nativeName}</span>
                        <span className="text-xs text-slate-500">{lang.name}</span>
                      </div>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-teal-600" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center w-full">
        {/* Left Content */}
        <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            {t.hero.form.heading} <span className="text-teal-500">{t.hero.form.headingHighlight}</span>
            <br />
            {t.hero.form.headingLine2}
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-md">
            {t.hero.description}
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded w-full sm:w-auto">
            {t.hero.form.getStarted}
          </Button>
        </div>

        {/* Right - Form Card with Decorative Elements */}
        <div className="relative flex justify-center items-start pt-8 md:pt-0 order-1 md:order-2">
          {/* Decorative elements - hidden on mobile */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden sm:flex absolute -top-8 -right-12 w-12 h-12 sm:w-16 sm:h-16 bg-teal-500 rounded-full items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg"
          >
            $
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-7 md:p-8"
          >
            {/* Progress Indicators with Step Number */}
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              {/* Animated Step Number */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  {currentStepData.number}
                </motion.div>
              </AnimatePresence>

              {/* Progress bars */}
              <div className="flex gap-1.5 flex-1">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      currentStep >= index + 1 ? "bg-teal-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Step counter */}
              <span className="text-xs text-slate-500 font-medium flex-shrink-0">{currentStep}/4</span>
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
                <label className="block text-slate-900 font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                  {currentStepData.question}
                </label>
                <input
                  type={currentStepData.field === "email" ? "email" : "text"}
                  name={currentStepData.field}
                  placeholder={currentStepData.placeholder}
                  value={formData[currentStepData.field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 border-slate-300 rounded-xl mb-4 sm:mb-5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 transition-all"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3.5 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {currentStep === 4 ? t.hero.form.submit : t.hero.form.next}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Decorative elements - Spread out for better visual balance */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="hidden sm:flex absolute bottom-10 -left-20 w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-full items-center justify-center text-white text-lg sm:text-xl shadow-lg"
          >
            ⏱
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="hidden sm:flex absolute -bottom-8 -right-16 w-12 h-12 sm:w-14 sm:h-14 bg-teal-500 rounded-full items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg"
          >
            $
          </motion.div>

          {/* Additional decorative circles - More spread out */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="hidden sm:flex absolute -top-12 -left-16 w-10 h-10 bg-orange-500 rounded-full items-center justify-center text-white text-lg shadow-lg"
          >
            💰
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="hidden sm:flex absolute top-16 -right-20 w-12 h-12 bg-blue-500 rounded-full items-center justify-center text-white text-xl shadow-lg"
          >
            ✓
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="hidden sm:flex absolute top-1/3 -right-24 w-8 h-8 bg-green-500 rounded-full items-center justify-center text-white text-sm shadow-lg"
          >
            ⚡
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="hidden sm:flex absolute top-2/3 -left-24 w-10 h-10 bg-purple-500 rounded-full items-center justify-center text-white text-lg shadow-lg"
          >
            🎯
          </motion.div>
        </div>
      </div>
    </section>
  )
}
