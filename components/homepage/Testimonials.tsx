import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Rajesh Kumar",
    text: "The bullet loan let me stock up for the festival season. I paid it back easily after my sales. A total game-changer.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "white",
  },
  {
    name: "Priya Sharma",
    text: "Finally, a loan that understands freelancers! No monthly EMI pressure, just one payment when my project invoice clears.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "from-blue-500 to-indigo-500 text-white",
    gradient: true,
  },
  {
    name: "Amit Patel",
    text: "Emergency medical loan saved my father's life. The quick disbursal and hassle-free process was a blessing.",
    image: "https://randomuser.me/api/portraits/men/40.jpg",
    color: "white",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
          Don’t Just Take Our <span className="text-teal-500">Word</span> For It
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
