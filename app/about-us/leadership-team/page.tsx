"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LeadershipTeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Leadership Team</h1>
            <p className="text-xl text-blue-100">
              Meet the visionaries driving Quikkred&apos;s mission to transform lending in India
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-8">
              <Users className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Coming Soon</h2>
            <p className="text-slate-600 mb-8">
              We&apos;re preparing to introduce you to the talented individuals leading Quikkred&apos;s
              mission to democratize credit access across India. Check back soon to meet our leadership team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about-us/our-story"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Read Our Story
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals who share our passion for
            financial inclusion. Explore career opportunities at Quikkred.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            View Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
}
