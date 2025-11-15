import { useLanguage } from "@/lib/contexts/LanguageContext";
import { FileText, CheckCircle, DollarSign } from "lucide-react"

export default function StepsSection() {
  const { t } = useLanguage();

  const icons = [FileText, CheckCircle, DollarSign]
  const steps = t.homepage.stepsSection.steps.map((step: any, idx: number) => ({
    ...step,
    icon: icons[idx]
  }))

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center bg-[#f6f6f6] py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto w-full">
         <div
              className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#14b8a642] text-teal-500 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                {t.homepage.sections.howItWorks.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-900 mb-3 px-2">
          {t.homepage.stepsSection.heading} <span className="text-teal-500">{t.homepage.stepsSection.headingHighlight}</span>
        </h2>
              <p className="text-center text-slate-700 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4">
          {t.homepage.stepsSection.subtitle}
        </p>
            </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
  {steps.map((step, idx) => {
    const IconComponent = step.icon
    return (
      <div
        key={idx}
        className="bg-white rounded-xl p-6 sm:p-8 text-left shadow-sm hover:shadow-md transition-shadow relative"
      >
        {/* Number badge */}
        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 text-white rounded-full font-bold text-base sm:text-lg shadow-lg">
            {step.number}
          </div>
        </div>

        {/* Icon */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex p-2.5 sm:p-3 bg-teal-100 rounded-lg">
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3">
          {step.title}
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          {step.description}
        </p>
      </div>
    )
  })}
</div>

      </div>
    </section>
  )
}
