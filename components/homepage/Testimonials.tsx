import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = t.homepage.testimonials.items.map((item: any, idx: number) => ({
    ...item,
    color: idx === 1 ? "from-blue-500 to-indigo-500 text-white" : "white",
    gradient: idx === 1
  }));
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 sm:mb-10 md:mb-12 px-2">
          {t.homepage.testimonials.heading} <span className="text-teal-500">{t.homepage.testimonials.headingHighlight}</span> {t.homepage.testimonials.subheading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all ${
                t.gradient
                  ? `bg-gradient-to-br ${t.color}`
                  : "bg-white text-slate-700"
              }`}
            >
              <Quote
                className={`w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 ${
                  t.gradient ? "text-white" : "text-teal-500"
                }`}
              />
              <p
                className={`text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed ${
                  t.gradient ? "text-white/90" : "text-slate-600"
                }`}
              >
                {t.text}
              </p>

              <div className="flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                />
                <div className="text-left">
                  <div
                    className={`flex gap-0.5 sm:gap-1 mb-1 ${
                      t.gradient ? "text-white" : "text-teal-500"
                    }`}
                  >
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        className={`sm:w-3.5 sm:h-3.5 ${idx < 4 ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`font-semibold text-xs sm:text-sm ${
                      t.gradient ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {t.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* optional pagination dots */}
        <div className="flex justify-center mt-6 sm:mt-8 gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span className="w-2 h-2 rounded-full bg-teal-200"></span>
          <span className="w-2 h-2 rounded-full bg-teal-200"></span>
        </div>
      </div>
    </section>
  );
}
