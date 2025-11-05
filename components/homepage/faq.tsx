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
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
          Got Questions? <span className="text-teal-500">We've Got Answers.</span>
        </h2>
        <p className="text-center text-slate-600 mb-12">
          Find answers to common questions about our loan products and process
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="font-semibold text-slate-900 text-left">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform ${
                    openIndex === idx ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && <div className="px-6 pb-6 text-slate-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
