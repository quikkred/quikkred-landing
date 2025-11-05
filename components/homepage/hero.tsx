"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, CheckCircle, Users, Star, Clock, Phone } from "lucide-react"

export default function Hero() {
  const steps = [
    {
      number: "1",
      title: "Fill Details",
      description: "Basic info in 60 seconds",
      icon: CheckCircle,
    },
    {
      number: "2",
      title: "Get Approved",
      description: "Instant decision on screen",
      icon: Shield,
    },
    {
      number: "3",
      title: "Receive Money",
      description: "Direct to your account",
      icon: Zap,
    }
  ]

  return (
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
                RBI Registered NBFC • 100% Secure
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
                Get Loan <span className="text-teal-500">Approval</span>
                <br />
                in <span className="text-teal-500">3 Simple Steps</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-lg leading-relaxed"
              >
                No paperwork. No waiting. Just instant approval and quick disbursal. Your financial emergency solved in minutes.
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
                <span className="font-medium text-slate-700 text-sm">Instant Approval</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <Shield className="w-5 h-5 text-teal-500" />
                <span className="font-medium text-slate-700 text-sm">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <Zap className="w-5 h-5 text-teal-500" />
                <span className="font-medium text-slate-700 text-sm">Same Day Disbursal</span>
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
                onClick={() => window.location.href = '/apply/quick'}
                className="group px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Talk to Expert
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - 3 Steps Visual - matching steps section exactly */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
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
