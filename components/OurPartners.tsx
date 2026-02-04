import { Building2, Handshake, Link, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";


export default function OurPartners() {
  return (
    <>
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Our Partners
        </h2>
        <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Powering innovation through strategic fintech partnerships.
        </p>
      </div>
      <div className="gap-6 sm:gap-8 flex">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all border border-gray-100"
        >
          <div className="w-16 h-16 bg-[#E8F7F3] rounded-2xl flex items-center justify-center mb-6">
            {/* company icon/image */}
            <Building2 className="w-8 h-8 text-[#25B181]" />
            <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop,q=95/A0xv9Kq15vi4L6j6/chatgpt-image-oct-8-2025-02_25_50-pm-1-YKb8Wjkpvnhg12qJ.png" alt="satsai-logo" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Satsai Finlease Pvt. Ltd.
          </h3>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            We collaborate with our Partner Lender, Satsai Finlease Private Limited, a Non-Banking Financial Company (NBFC) duly registered with the Reserve Bank of India (RBI), to offer a range of financial products and services. Quikkred operates as a Lending Service Provider (LSP), facilitating the origination and servicing of loan products on behalf of our Partner NBFC.
          </p>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Satsai Finlease Private Limited continues to act as the Regulated Entity (RE) and remains the primary data controller for all lending operations and associated financial activities.
          </p>
          <div>
            <div className="mb-2">
              <span className="font-bold">Website: </span><a className="font-bold hover:text-[#25B181]" href="https://satsaifinlease.com" target="_blank">https://satsaifinlease.com</a>
            </div>
            <div>
              <a className="font-bold hover:text-[#25B181]" href="https://satsaifinlease.com/general-terms-and-conditions" target="_blank">Terms & Conditions</a>
            </div>
          </div>
        </motion.div>

        {/* Add more partners from below */}

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all border border-gray-100"
        >
          <div className="w-16 h-16 bg-[#E8F7F3] rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-[#25B181]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Fluxusforge Technologies
          </h3>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            A fintech technology partner enabling secure, scalable and compliant digital lending infrastructure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all border border-gray-100"
        >
          <div className="w-16 h-16 bg-[#E8F7F3] rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-[#25B181]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            PaySecure Systems
          </h3>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Payment and collections partner offering reliable payment gateways, EMI collections, and reconciliation services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all border border-gray-100"
        >
          <div className="w-16 h-16 bg-[#E8F7F3] rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-[#25B181]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            CredCheck Bureau
          </h3>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Credit verification and risk assessment partner providing real-time credit insights and customer profiling.
          </p>
        </motion.div> */}
      </div>
    </>
  )
}