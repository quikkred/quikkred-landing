"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, CheckCircle, Users, Star, Clock, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/LanguageContext"

export default function Hero() {
  const router = useRouter()
  const { t } = useLanguage()

  const steps = [
    {
      number: t.homepage.hero.steps[0].number,
      title: t.homepage.hero.steps[0].title,
      description: t.homepage.hero.steps[0].description,
      icon: CheckCircle,
    },
    {
      number: t.homepage.hero.steps[1].number,
      title: t.homepage.hero.steps[1].title,
      description: t.homepage.hero.steps[1].description,
      icon: Shield,
    },
    {
      number: t.homepage.hero.steps[2].number,
      title: t.homepage.hero.steps[2].title,
      description: t.homepage.hero.steps[2].description,
      icon: Zap,
    }
  ]

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center bg-white py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Trust Badge - matching steps section style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="inline-block px-4 py-2 bg-teal-100 text-teal-600 rounded-full text-xs sm:text-sm font-semibold">
                {t.homepage.hero.trustBadge}
              </span>
            </motion.div>

            {/* Main Heading - matching site typography scale */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
              >
                {t.homepage.hero.heading} <span className="text-teal-500">{t.homepage.hero.headingHighlight1}</span>
                <br />
                {t.homepage.hero.headingLine2} <span className="text-teal-500">{t.homepage.hero.headingHighlight2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-lg leading-relaxed"
              >
                {t.homepage.hero.description}
              </motion.p>
            </div>

            {/* Key Features - matching card style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span className="font-medium text-slate-700 text-sm">{t.homepage.hero.features.instantApproval}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <Shield className="w-5 h-5 text-teal-500" />
                <span className="font-medium text-slate-700 text-sm">{t.homepage.hero.features.secure}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <Zap className="w-5 h-5 text-teal-500" />
                <span className="font-medium text-slate-700 text-sm">{t.homepage.hero.features.sameDayDisbursal}</span>
              </div>
            </motion.div>

            {/* CTA Button - Inside Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/apply/quick')}
                className="group px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              >
                {t.homepage.hero.buttons.applyNow}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/contact')}
                className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {t.homepage.hero.buttons.talkToExpert}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - 3 Steps Visual - matching steps section exactly */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="relative"
                  >
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        {/* Icon - matching site icon style */}
                        <div className="flex-shrink-0">
                          <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-teal-500" />
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                        </div>

                        {/* Number badge - matching steps section */}
                        <div className="absolute -top-3 -right-3">
                          <div className="w-8 h-8 bg-teal-500 text-white rounded-full font-bold text-sm flex items-center justify-center shadow-sm">
                            {step.number}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
