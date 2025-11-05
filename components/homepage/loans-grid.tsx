import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function LoansGrid() {

  const { t } = useLanguage();
  const loans = [
    {
      title: "Salary Advance",
      amount: "₹5,000 - ₹5,00,000",
      description: "Get advance up to 2x your monthly salary instantly",
      color: "bg-teal-500",
    },
    {
      title: "Personal Loan",
      amount: "₹10,000 - ₹50,00,000",
      description: "Quick cash for all your personal needs",
      color: "bg-blue-600",
    },
    {
      title: "Emergency Fund",
      amount: "₹10,000 - ₹2,00,000",
      description: "24-hour support for medical and urgent needs",
      color: "bg-teal-600",
    },
    {
      title: "Festival Advance",
      amount: "₹5,000 - ₹1,00,000",
      description: "Celebrate every festival without financial worry",
      color: "bg-blue-600",
    },
    {
      title: "Medical Loan",
      amount: "₹25,000 - ₹10,00,000",
      description: "Healthcare financing for planned treatments",
      color: "bg-teal-600",
    },
    {
      title: "Travel Now Pay Later",
      amount: "₹25,000 - ₹3,00,000",
      description: "Book your dream vacation today, pay next month",
      color: "bg-blue-600",
    },
  ]

  return (
    <section className="bg-slate-50 py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
       <div
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                {t.homepage.sections.products.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 px-4">
                {t.homepage.sections.products.title} <span className="text-[#25B181]">{t.homepage.sections.products.titleHighlight}</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                {t.homepage.sections.products.subtitle}
              </p>
            </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loans.map((loan, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className={`${loan.color} p-6 text-white flex items-center justify-between`}>
                <div>
                  <h3 className="text-xl font-bold mb-1">{loan.title}</h3>
                  <p className="text-sm opacity-90">{loan.amount}</p>
                </div>
                <div className="bg-white/30 rounded-lg p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-6">{loan.description}</p>
                <button className="w-full py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
