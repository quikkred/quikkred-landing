"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const CATEGORIES = [
  "All",
  "Amounts & Fees",
  "Process",
  "Eligibility",
  "Tenure & Repayment",
  "Documents",
  "Compliance",
  "Security",
] as const;

const FAQS: FAQItem[] = [
  {
    id: "1",
    category: "Amounts & Fees",
    question: "What is the loan amount range at Quikkred?",
    answer:
      "Quikkred offers loans from ₹10,000 to ₹5,00,000. The exact amount you're eligible for depends on your income, credit profile, and our AI-based assessment. Higher income and stronger credit history unlock larger amounts.",
  },
  {
    id: "2",
    category: "Amounts & Fees",
    question: "What are the fees and interest rates?",
    answer:
      "Interest rate is 1% per day on the loan amount. Platform fee is 10% of the loan (deducted upfront), plus 18% GST on that platform fee. Example: For a ₹50,000 loan — Platform Fee ₹5,000 + GST ₹900 = ₹5,900 deducted. You receive ₹44,100. Interest accrues at ₹500/day. Repay ₹50,000 + interest at end of tenure.",
  },
  {
    id: "3",
    category: "Process",
    question: "How quickly can I get approved and funded?",
    answer:
      "Our AI approves applications in 30 seconds. Once approved, money is transferred to your bank via NEFT/IMPS within 30 minutes during banking hours — often faster. Outside banking hours, funds land first thing next morning.",
  },
  {
    id: "4",
    category: "Eligibility",
    question: "What are the eligibility criteria?",
    answer:
      "You must be an Indian citizen aged 21–60, with minimum monthly income of ₹15,000, employed (salaried or self-employed), and have a valid PAN, Aadhaar, and active bank account. CIBIL score of 650+ preferred — but we also use alternative data for new-to-credit customers.",
  },
  {
    id: "5",
    category: "Tenure & Repayment",
    question: "What loan tenures are available?",
    answer:
      "Flexible tenures of 7, 15, 30, 60, or 90 days depending on the product. You can repay anytime without prepayment penalty — you only pay interest for the days you actually hold the loan.",
  },
  {
    id: "6",
    category: "Documents",
    question: "What documents do I need?",
    answer:
      "Just three things: your PAN card, your Aadhaar card, and a selfie. Everything is verified digitally via DigiLocker, Aadhaar eKYC, and liveness check. No physical documents, no branch visits, no notary stamps.",
  },
  {
    id: "8",
    category: "Security",
    question: "How is my data protected?",
    answer:
      "256-bit SSL encryption on every byte. Data is hosted in India per RBI data localization requirements. We're ISO 27001 aligned and follow PCI DSS for any payment flows. Read our Privacy Policy and KYC/AML Policy for full details.",
  },
  {
    id: "10",
    category: "Eligibility",
    question: "Can new-to-credit applicants get a loan?",
    answer:
      "Yes. Our AI evaluates 500+ data points beyond just CIBIL — transaction patterns, employment signals, device data, and alternative credit signals. First-time borrowers often get approved at slightly conservative amounts that grow with good repayment history.",
  },
  {
    id: "11",
    category: "Tenure & Repayment",
    question: "What happens if I'm late on repayment?",
    answer:
      "Contact our support before your due date — we offer tenure extensions per RBI Fair Practice Code. If you default, a late fee of 2% per month applies on the overdue portion, and it's reported to credit bureaus (CIBIL, CRIF, Experian). Always better to talk to us early.",
  },
  {
    id: "13",
    category: "Compliance",
    question: "Is Quikkred RBI registered?",
    answer:
      "Quikkred is a digital lending platform powered by Satsai Finlease Private Limited — an RBI registered NBFC (Registration No. B-14.01646). All loans are governed by RBI Digital Lending Guidelines and Fair Practice Code.",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [expandedId, setExpandedId] = useState<string | null>(FAQS[0]?.id ?? null);

  const filteredFaqs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        !search ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search) ||
        faq.category.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2FBF7] via-white to-white">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#25B181]/30 bg-white text-[#25B181] text-xs sm:text-sm font-medium">
            Frequently Asked
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold font-sora text-gray-900">
            Questions? <span className="text-[#25B181]">Answered.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            Search our full knowledge base — {FAQS.length}+ questions across fees, process,
            eligibility, and compliance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-3xl mx-auto mt-10"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search the FAQ..."
              className="w-full pl-14 pr-5 py-4 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25B181]/30 focus:border-[#25B181] transition text-sm sm:text-base"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="max-w-5xl mx-auto mt-6"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                    isActive
                      ? "bg-[#25B181] text-white border-[#25B181] shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#25B181]/40 hover:text-[#25B181]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-10"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {filteredFaqs.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-gray-500 text-sm">No questions match your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                  className="mt-3 text-[#25B181] text-sm font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <div key={faq.id} className={isOpen ? "bg-[#F6FCF9]" : "bg-white"}>
                    <button
                      onClick={() => toggle(faq.id)}
                      className="w-full flex items-start justify-between gap-4 px-5 sm:px-6 py-5 text-left focus:outline-none"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#25B181] uppercase">
                          {faq.category}
                        </p>
                        <h3 className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 mt-1 w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                          isOpen
                            ? "bg-[#25B181] border-[#25B181] text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-5 -mt-1">
                            <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
