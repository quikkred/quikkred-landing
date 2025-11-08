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
    <section className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
          {t.homepage.testimonials.heading} <span className="text-teal-500">{t.homepage.testimonials.headingHighlight}</span> {t.homepage.testimonials.subheading}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 shadow-sm hover:shadow-md transition-all ${
                t.gradient
                  ? `bg-gradient-to-br ${t.color}`
                  : "bg-white text-slate-700"
              }`}
            >
              <Quote
                className={`w-8 h-8 mb-4 ${
                  t.gradient ? "text-white" : "text-teal-500"
                }`}
              />
              <p
                className={`text-sm mb-6 ${
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
                  className="rounded-full"
                />
                <div className="text-left">
                  <div
                    className={`flex gap-1 mb-1 ${
                      t.gradient ? "text-white" : "text-teal-500"
                    }`}
                  >
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={idx < 4 ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                  <p
                    className={`font-semibold text-sm ${
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
        <div className="flex justify-center mt-8 gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span className="w-2 h-2 rounded-full bg-teal-200"></span>
          <span className="w-2 h-2 rounded-full bg-teal-200"></span>
        </div>
      </div>
    </section>
  );
}
