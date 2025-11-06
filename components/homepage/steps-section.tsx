import { useLanguage } from "@/lib/contexts/LanguageContext";
import { FileText, CheckCircle, DollarSign } from "lucide-react"

export default function StepsSection() {
  const { t } = useLanguage();
  const steps = [
    {
      number: "1",
      title: "Apply Online",
      description: "Fill a simple form with employment details and upload salary slips",
      icon: FileText,
    },
    {
      number: "2",
      title: "Instant Verification",
      description: "Our AI verifies your details and approves within seconds",
      icon: CheckCircle,
    },
    {
      number: "3",
      title: "Get Money",
      description: "Money transferred to your bank account in 5 minutes",
      icon: DollarSign,
    },
  ]

  return (
    <section className="bg-[#f6f6f6] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
         <div
              className="text-center mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#14b8a642] text-teal-500 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                {t.homepage.sections.howItWorks.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-3">
          Get Your Loan in <span className="text-teal-500">Simple Steps</span>
        </h2>
              <p className="text-center text-slate-700 text-lg mb-16 max-w-2xl mx-auto">
          Experience the fastest and most transparent loan process
        </p>
            </div>

        <div className="grid md:grid-cols-3 gap-8">
  {steps.map((step, idx) => {
    const IconComponent = step.icon
    return (
      <div
        key={idx}
        className="bg-white rounded-xl p-8 text-left shadow-sm hover:shadow-md transition-shadow relative"
      >
        {/* Number badge */}
        <div className="absolute -top-4 -right-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500 text-white rounded-full font-bold text-lg shadow-lg">
            {step.number}
          </div>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex p-3 bg-teal-100 rounded-lg">
            <IconComponent className="w-6 h-6 text-teal-500" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          {step.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
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
