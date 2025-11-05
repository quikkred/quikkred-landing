import { FileText, RotateCcw, Lock, Zap } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      title: "Apply Online",
      description: "The price shown is the total price you'll pay, with no hidden fees",
      icon: FileText,
    },
    {
      title: "Flexible Repayments",
      description: "Choose a repayment schedule that fits your lifestyle and budget.",
      icon: RotateCcw,
    },
    {
      title: "100% Secure",
      description: "Bank-level encryption keeps your personal and financial data safe.",
      icon: Lock,
    },
    {
      title: "Lightning Fast",
      description: "Get approved in minutes and receive funds within 24 hours.",
      icon: Zap,
    },
  ]

  return (
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
          A Better, Smarter Way to <span className="text-teal-500">Borrow</span>
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Experience the future of lending with our innovative approach
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 text-left">{feature.title}</h3>
                <p className="text-slate-600 text-sm text-left">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
