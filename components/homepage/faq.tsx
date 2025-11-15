"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
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
      answer: "Maximum loan amounts vary based on loan type and your qualifications. Personal loans go up to $50,000.",
    },
  ]

  return (
    <section className="bg-white py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-900 mb-3 sm:mb-4 px-2">
          Got Questions? <span className="text-teal-500">We've Got Answers.</span>
        </h2>
        <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-10 md:mb-12 px-4">
          Find answers to common questions about our loan products and process
        </p>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform flex-shrink-0 ${
                    openIndex === idx ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
