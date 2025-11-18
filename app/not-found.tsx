"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, HelpCircle, Phone } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function NotFound() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FDF4] to-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#25B181]/20 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.h1
                className="text-[150px] sm:text-[200px] md:text-[250px] font-bold bg-gradient-to-br from-[#25B181] via-[#38bdf8] to-[#25B181] bg-clip-text text-transparent leading-none"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                404
              </motion.h1>

              {/* Decorative circles around 404 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
              >
                😕
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: -360 }}
                transition={{ delay: 0.7, duration: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
              >
                🔍
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.error404?.title || "Page Not Found"}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              {t.error404?.description || "Oops! The page you're looking for doesn't exist or has been moved."}
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              {t.error404?.suggestion || "Don't worry, you can find your way back home or explore our services."}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              {t.error404?.backHome || "Back to Home"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-[#25B181] text-[#25B181] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.error404?.goBack || "Go Back"}
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {t.error404?.quickLinks || "Quick Links"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/products")}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-[#25B181]/10 to-[#38bdf8]/10 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#1F8F68] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-900">
                  {t.error404?.exploreProducts || "Explore Products"}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/faqs")}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-900">
                  {t.error404?.helpCenter || "Help Center"}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/contact")}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-900">
                  {t.error404?.contactUs || "Contact Us"}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 text-sm text-gray-500 italic"
          >
            💡 {t.error404?.funFact || "Fun Fact: 404 errors got their name from room 404 at CERN where the first web server was located!"}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
