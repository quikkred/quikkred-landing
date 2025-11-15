import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function LoansGrid() {
  const { t } = useLanguage();
  const loans = t.homepage.loansGrid.loans.map((loan: any, idx: number) => ({
    ...loan,
    color: idx % 3 === 0 ? "bg-teal-500" : idx % 3 === 1 ? "bg-blue-600" : "bg-teal-600"
  }));

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            {t.homepage.sections.products.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 px-4">
            {t.homepage.sections.products.title}{" "}
            <span className="text-[#25B181]">
              {t.homepage.sections.products.titleHighlight}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {t.homepage.sections.products.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {loans.map((loan, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div
                className={`${loan.color} p-4 sm:p-6 text-white flex flex-col items-start text-left`}
              >
                <div className="bg-white/30 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{loan.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{loan.amount}</p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3">
                  {loan.description}
                </p>
                <button className="w-full py-2 sm:py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium">
                  {t.homepage.loansGrid.button}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
