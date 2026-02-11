import { motion } from "framer-motion";

export default function OurPartners() {
  return (
    <section className="py-16 px-4 bg-gray-50/50">
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Our Partners
        </h2>
        <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Powering innovation through strategic fintech partnerships.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* Partner Card: Satsai */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="group flex flex-col bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#25B181]/30 transition-all duration-300"
        >
          <div className="relative w-full h-32 mb-8 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 group-hover:border-[#25B181]/20 transition-all duration-500">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-[#25B181] opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500" />

            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 }
              }}

              className="relative z-10 w-[200px] h-auto max-h-[70%] object-contain drop-shadow-sm group-hover:drop-shadow-md group-hover:scale-105 transition-all duration-300"
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop,q=95/A0xv9Kq15vi4L6j6/chatgpt-image-oct-8-2025-02_25_50-pm-1-YKb8Wjkpvnhg12qJ.png"
              alt="satsai-logo"
            />
          </div>

          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#25B181] transition-colors">
              Satsai Finlease Pvt. Ltd.
            </h3>
            <p className="text-gray-600 text-sm:text-base leading-relaxed mb-4">
              We collaborate with our Partner Lender, Satsai Finlease Private Limited, a Non-Banking Financial Company (NBFC) duly registered with the Reserve Bank of India (RBI), to offer a range of financial products and services. Quikkred operates as a Lending Service Provider (LSP), facilitating the origination and servicing of loan products on behalf of our Partner NBFC.
            </p>
            <p className="text-gray-600 text-sm:text-base leading-relaxed mb-8">
              Satsai Finlease Private Limited continues to act as the Regulated Entity (RE) and remains the primary data controller for all lending operations and associated financial activities.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Official Website</p>
              <a
                className="text-gray-900 font-bold hover:text-[#25B181] inline-flex items-center gap-1"
                href="https://satsaifinlease.com"
                target="_blank"
              >
                satsaifinlease.com
              </a>
            </div>
            <a
              className="text-sm font-medium text-[#25B181] bg-[#E8F7F3] px-4 py-2 rounded-lg hover:bg-[#25B181] hover:text-white transition-all text-center"
              href="https://satsaifinlease.com/general-terms-and-conditions"
              target="_blank"
            >
              Terms & Conditions
            </a>
          </div>
        </motion.div>

        {/* Partner Card: Fluxus Forge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="group flex flex-col bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#25B181]/30 transition-all duration-300"
        >
          <div className="relative w-full h-32 mb-8 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 group-hover:border-[#25B181]/20 transition-all duration-500">
            {/* Soft Background Glow on Hover */}
            <div className="absolute inset-0 bg-[#25B181] opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500" />

            <motion.img
              // Subtle floating animation
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-[180px] h-auto max-h-[80%] object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
              src="https://fluxusforge.in/logo-cyan.png"
              alt="fluxus-forge-logo"
            />
          </div>

          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#25B181] transition-colors">
              Fluxus Forge Pvt. Ltd.
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              Fluxus Forge is a fintech infrastructure partner that enables businesses to launch and scale digital lending platforms with speed and efficiency. Their AI-enhanced lending ecosystem supports rapid deployment, regulatory compliance, and seamless integrations to modernize lending operations and accelerate growth.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
              As our trusted lending partner, Fluxus Forge powers cutting-edge lending technology with a robust, scalable infrastructure. Their modern, AI-driven solutions streamline operations, enhance borrower experiences, and drive innovation across the financial services ecosystem.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Official Website</p>
              <a
                className="text-gray-900 font-bold hover:text-[#25B181] inline-flex items-center gap-1"
                href="https://fluxusforge.in/"
                target="_blank"
              >
                fluxusforge.in
              </a>
            </div>
            <a
              className="text-sm font-medium text-[#25B181] bg-[#E8F7F3] px-4 py-2 rounded-lg hover:bg-[#25B181] hover:text-white transition-all text-center"
              href="https://fluxusforge.in/terms"
              target="_blank"
            >
              Terms & Conditions
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}