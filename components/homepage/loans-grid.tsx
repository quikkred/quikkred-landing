import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap,
  Banknote,
  PartyPopper,
  AlertCircle,
  Heart,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

const loanIcons: LucideIcon[] = [Zap, Banknote, PartyPopper, AlertCircle, Heart, TrendingUp];

export default function LoansGrid() {
  const { t } = useLanguage();
  const router = useRouter();

  const loansData = t?.homepage?.loansGrid?.loans as Array<{ title: string; amount: string; description: string }> | undefined;

  const loans = loansData?.map((loan, idx) => ({
    ...loan,
    id: `loan-${idx}`,
    icon: loanIcons[idx] || Zap,
    route: "/products",
    color:
      idx % 3 === 0
        ? "bg-[#25B181]"
        : idx % 3 === 1
        ? "bg-[#1F8F68]"
        : "bg-[#25B181]",
  })) || [];

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center py-12 sm:py-16 md:py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            {t?.homepage?.loansGrid?.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 px-4">
            {t?.homepage?.loansGrid?.title}{" "}
            <span className="text-[#25B181]">
              {t?.homepage?.loansGrid?.titleHighlight}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {t?.homepage?.loansGrid?.subtitle}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {loans?.map((loan, idx) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 50, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -12, scale: 1.03, rotate: 1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all"
            >
              <div
                className={`${loan.color} p-4 sm:p-6 text-white flex flex-col items-start text-left`}
              >
                <div className="bg-white/30 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <loan.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">
                    {loan.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">{loan.amount}</p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3">
                  {loan.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(loan.route)}
                  className="w-full py-2 sm:py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
                >
                  {t?.homepage?.loansGrid?.button}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
