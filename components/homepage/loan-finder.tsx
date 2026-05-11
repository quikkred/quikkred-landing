"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  AlertCircle,
  Wallet,
  Plane,
  Sparkles,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

type UseCase = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  recommendation: {
    name: string;
    amount: string;
    tenure: string;
    note: string;
    cta: string;
    href: string;
  };
};

const useCases: UseCase[] = [
  {
    id: "medical",
    label: "Medical",
    icon: Stethoscope,
    badge: "Medical use case",
    title: "Hospital bill or surgery — you need cash now.",
    description:
      "Whether it's a planned surgery, a sudden accident, or a family member in the ER, Quikkred can get funds into your bank in 30 minutes flat. No waiting for insurance reimbursements.",
    recommendation: {
      name: "Medical Loan",
      amount: "₹25,000 – ₹5 L",
      tenure: "30 – 90 days",
      note: "Longer tenure, larger amount, direct hospital payment option",
      cta: "See Medical Loan",
      href: "/products",
    },
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: AlertCircle,
    badge: "Emergency use case",
    title: "Something broke. It can’t wait until payday.",
    description:
      "Car repair. Home plumbing. Mobile replacement for work. Family travel for an emergency. Our 24×7 AI approves even at 3 AM — no questions about what it’s for.",
    recommendation: {
      name: "Emergency Fund",
      amount: "₹10,000 – ₹2 L",
      tenure: "7 – 90 days",
      note: "24×7 availability, fastest disbursal, no usage questions",
      cta: "See Emergency Loan",
      href: "/products",
    },
  },
  {
    id: "month-end",
    label: "Month-end",
    icon: Wallet,
    badge: "Month-end use case",
    title: "Salary is 8 days away. Rent is due tomorrow.",
    description:
      "The classic month-end gap. Rent, utilities, school fees, groceries — all landing before your paycheck. Get an advance now, repay when your salary arrives. Automatic.",
    recommendation: {
      name: "Salary Advance",
      amount: "₹10,000 – ₹2 L",
      tenure: "7 – 30 days",
      note: "Tenure matches your pay cycle; repay in one shot when salary lands",
      cta: "See Salary Advance",
      href: "/products",
    },
  },
  {
    id: "travel",
    label: "Travel",
    icon: Plane,
    badge: "Travel use case",
    title: "The flight deal is today. Your EMI budget is next month.",
    description:
      "Spotted a ₹12k return flight to Bali? A wedding out of state? A weekend reset in the hills? Book the trip now, repay over 30-90 days without touching savings.",
    recommendation: {
      name: "Travel Now, Pay Later",
      amount: "₹25,000 – ₹3 L",
      tenure: "30 – 90 days",
      note: "Flexible tenure for trip planning; no prepayment penalty",
      cta: "See Travel Loan",
      href: "/products",
    },
  },
  {
    id: "festival",
    label: "Festival",
    icon: Sparkles,
    badge: "Festival Advance",
    title: "Diwali, Eid, Christmas — celebrate without holding back.",
    description:
      "Gold, gifts, decor, family dinners, new clothes, fireworks. Festival season shouldn’t be the month you skip celebrating because payday is late.",
    recommendation: {
      name: "Festival Loan",
      amount: "₹10,000 – ₹1 L",
      tenure: "15 – 60 days",
      note: "Special festival pricing and occasional top-up bonuses",
      cta: "See Festival Advance",
      href: "/products",
    },
  },
  {
    id: "wedding",
    label: "Wedding",
    icon: HeartHandshake,
    badge: "Wedding use case",
    title: "Cousin’s wedding next month. Your wallet says no.",
    description:
      "Gift money, new outfit, travel, catering contribution. Family weddings shouldn’t put you under financial stress. Borrow what you need, repay comfortably.",
    recommendation: {
      name: "Personal Loan",
      amount: "₹10,000 – ₹5 L",
      tenure: "7 – 90 days",
      note: "Flexible amount and tenure for family events",
      cta: "See Personal Loan",
      href: "/products",
    },
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    badge: "Business use case",
    title: "Stock for the festival rush. Vendor payment next week.",
    description:
      "Small business working capital — inventory buildup before a sale spike, vendor payment before customer receivables, emergency cash for operations.",
    recommendation: {
      name: "Personal Loan",
      amount: "₹10,000 – ₹5 L",
      tenure: "7 – 90 days",
      note: "Fast access to working capital without collateral",
      cta: "See Personal Loan",
      href: "/products",
    },
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    badge: "Education use case",
    title: "Last fee instalment. Certificate won’t be released without it.",
    description:
      "Final semester fees, course completion, coaching, certification exam fees. Education costs that can’t wait for the next scholarship cycle or loan disbursal.",
    recommendation: {
      name: "Personal Loan",
      amount: "₹10,000 – ₹5 L",
      tenure: "30 – 90 days",
      note: "Longer tenure option for larger education expenses",
      cta: "See Personal Loan",
      href: "/products",
    },
  },
];

export default function LoanFinder() {
  const [activeId, setActiveId] = useState<string>(useCases[0].id);
  const active = useCases.find((u) => u.id === activeId) ?? useCases[0];
  const ActiveIcon = active.icon;

  return (
    <section className="flex items-center py-10 sm:py-14 lg:py-20 bg-white px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-4">
            Find your loan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sora text-slate-900 mb-3">
            What do you need <span className="text-[#25B181]">money for?</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Pick your situation — we'll recommend the right product, terms, and tenure in one click.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {useCases.map((u) => {
            const Icon = u.icon;
            const isActive = u.id === activeId;
            return (
              <button
                key={u.id}
                onClick={() => setActiveId(u.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-[#25B181] text-white border-[#25B181] shadow-md"
                    : "bg-white text-slate-700 border-gray-200 hover:border-[#25B181] hover:text-[#25B181]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {u.label}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[#25B181]/20 bg-gradient-to-br from-[#EAFBF4] via-white to-[#EAFBF4] p-5 sm:p-8 lg:p-10 shadow-sm"
          >
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* Left content */}
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#25B181]/30 text-[#25B181] rounded-full text-xs font-semibold mb-4">
                  <ActiveIcon className="w-3.5 h-3.5" />
                  {active.badge}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sora text-slate-900 mb-3 sm:mb-4 leading-tight">
                  {active.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {active.description}
                </p>
              </div>

              {/* Right recommendation card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                <p className="text-[10px] sm:text-xs font-bold tracking-wider text-[#25B181] uppercase mb-1.5">
                  Our recommendation
                </p>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                  {active.recommendation.name}
                </h4>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold text-slate-900">
                      {active.recommendation.amount}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-semibold text-slate-900">
                      {active.recommendation.tenure}
                    </span>
                  </div>
                </div>
                <div className="border-l-2 border-[#25B181] pl-3 mb-5">
                  <p className="text-xs sm:text-sm text-gray-600 italic">
                    {active.recommendation.note}
                  </p>
                </div>
                <Link
                  href={active.recommendation.href}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#25B181] hover:bg-[#1F8F68] text-white font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-full transition-colors shadow-md"
                >
                  {active.recommendation.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
