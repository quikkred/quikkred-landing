import { FileText, RotateCcw, Lock, Zap } from "lucide-react"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { motion } from "framer-motion"

export default function FeaturesSection() {
  const { t } = useLanguage()

  const icons = [FileText, RotateCcw, Lock, Zap]
  const features = t?.homepage?.featuresSection?.features?.map((feature: any, idx: number) => ({
    ...feature,
    icon: icons[idx]
  }))

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center bg-white py-12 sm:py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-900 mb-3 sm:mb-4 px-2">
            {t?.homepage?.featuresSection?.heading} <span className="text-teal-500">{t?.homepage?.featuresSection?.headingHighlight}</span>
          </h2>
          <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            {t?.homepage?.featuresSection?.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features?.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="bg-teal-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 text-left">{feature.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm text-left leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
