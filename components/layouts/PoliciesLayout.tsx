"use client"

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion";

const PoliciesLayout = ({
  effectiveDateText,
  effectiveDate,
  children
}: {
  effectiveDateText?: string;
  effectiveDate?: string;
  children: React.ReactNode;
}) => {
  const { t } = useLanguage();

  return (
    <>
      <section className="py-16 font-sans">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#25B181] hover:text-[#1a936f] font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t?.common?.back || "Back to Home"}
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none border border-solid border-gray-300 shadow-sm bg-white rounded-xl p-4 sm:p-8"
            style={{ lineHeight: '1.7' }}
          >
            {/* Effective Date */}
            <p className="text-[#2b2b2b] leading-[1.7]">
              <span className="font-semibold">{effectiveDateText || "Effective Date"}:</span> {effectiveDate || "January 1, 2026"}
            </p>

            <div className="my-3 sm:my-6 bg-gray-300 h-[1px]" />

            {children}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default PoliciesLayout