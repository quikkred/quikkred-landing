"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { motion } from "framer-motion"

export default function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Use language data for FAQs with fallback
  const faqs = t?.homepage?.faq?.faqs || [
    {
      question: "How long does the approval process take?",
      answer: "Our approval process typically takes 5-15 minutes. Most applicants receive a decision instantly.",
    },
    {
      question: "What credit score do I need?",
      answer: "We work with a wide range of credit profiles. You can get a pre-qualification with no credit check.",
    },
    {
      question: "Can I pay off my loan early?",
      answer: "Yes! There are no prepayment penalties. You can pay off your loan at any time without fees.",
    },
    {
      question: "What's the maximum loan amount?",
      answer: "Maximum loan amounts vary based on loan type and your qualifications. Personal loans go up to ₹50,00,000.",
    },
  ]

  return (
    <section className="bg-white py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#14b8a642] text-[#25B181] rounded-full rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            {t?.homepage?.faq?.badge || "FAQ"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-900 mb-3 sm:mb-4 px-2">
            {t?.homepage?.faq?.heading} <span className="text-[#25B181]">{t?.homepage?.faq?.headingHighlight}</span>
          </h2>
          <p className="text-center text-slate-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            {t?.homepage?.faq?.subtitle}
          </p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-[#25B181] transition-transform flex-shrink-0 ${
                    openIndex === idx ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
