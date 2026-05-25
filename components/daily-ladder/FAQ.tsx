"use client";

// Inline FAQ specific to the daily-ladder product. Pure CSS disclosure.

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const Q = [
  {
    q: "What if I miss a daily payment?",
    a: "We grace you for the first 24 hours and a reminder goes out. Two consecutive misses move the loan to AT_RISK and our risk desk reaches out. Seven misses in a row triggers the EJECTED state — at that point we treat it as a recovery case. We do not auto-debit or auto-block your other services; you remain in control.",
  },
  {
    q: "Can I prepay or close early?",
    a: "Yes — any day, any amount above the daily floor. The extra payment reduces principal immediately, interest drops accordingly (reducing balance), and your tenure shortens. There is zero prepayment penalty.",
  },
  {
    q: "How is the interest calculated?",
    a: "1% per day on the outstanding principal, charged with the daily floor. Because the principal reduces as you pay, the absolute interest also reduces each day. We never charge interest on principal you've already repaid.",
  },
  {
    q: "Is the daily ladder more expensive than a regular EMI loan?",
    a: "For the same effective annualized rate, the daily ladder gives you something a monthly EMI can't: you actually save money by over-paying any day. Most ladder borrowers finish in 18–22 days, not 30 — that means your total interest cost is meaningfully lower than an equivalent 30-day bullet or EMI.",
  },
  {
    q: "How do I make payments?",
    a: "You get a unique UPI VA and QR for each loan. Pay via any UPI app — GPay, PhonePe, Paytm, BHIM, your bank app — by scanning the QR or sending money to the VA. Auto-debit is opt-in via UPI Autopay; we never auto-deduct without explicit consent.",
  },
  {
    q: "What's the maximum loan amount?",
    a: "₹50,000 for first-time borrowers. Repeat borrowers with a clean ladder graduate to ₹1,00,000 and beyond. Eligibility depends on your bureau profile, AA-verified income, and our affordability model — typically requiring an affordability ratio ≥ 0.7×.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#0F766E] font-semibold">
            Questions
          </div>
          <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
            Everything else.
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3">
          {Q.map((item, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group rounded-xl border border-slate-200 bg-white hover:border-[#25B181]/40 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 cursor-pointer list-none">
                <span className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">{item.q}</span>
                <span className="h-7 w-7 rounded-full border border-slate-200 grid place-items-center shrink-0 group-open:rotate-45 group-open:bg-[#25B181] group-open:border-[#25B181] transition-all">
                  <Plus className="w-3.5 h-3.5 text-slate-700 group-open:text-white" />
                </span>
              </summary>
              <div className="px-5 sm:px-6 pb-5 -mt-1 text-sm text-slate-600 leading-relaxed">
                {item.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
