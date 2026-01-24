"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Target, Heart, TrendingUp, Award, Globe } from "lucide-react";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="">
              The journey of Quikkred - From a vision to India&apos;s trusted lending partner
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How It All Began</h2>
              <p className="text-slate-600 mb-4">
                Quikkred was founded with a simple yet powerful mission: to make credit accessible
                to every Indian. We recognized that millions of hardworking individuals were being
                underserved by traditional financial institutions due to lack of credit history or
                documentation.
              </p>
              <p className="text-slate-600 mb-4">
                Our founders, with decades of experience in fintech and banking, came together to
                build a platform that leverages technology to assess creditworthiness beyond
                traditional metrics.
              </p>
              <p className="text-slate-600">
                Today, we&apos;re proud to be a trusted digital lending platform, partnered with
                Satsai Finlease Private Limited (an RBI-registered NBFC), serving customers across
                all 28 states of India, helping them achieve their financial goals with quick,
                transparent, and affordable credit solutions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/about_story_img.jpg"
                alt="Quikkred Story"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-12">Our Journey</h3>
            <div className="space-y-8">
              {[
                { year: "2026", title: "Foundation", desc: "Quikkred was established as a digital lending platform" },
                { year: "2026", title: "Growth", desc: "Expanding operations across India" },
                { year: "2026", title: "Innovation", desc: "AI-powered instant loan approval launched" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 sm:w-20 text-right">
                    <span className="text-black font-bold">{item.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 mt-1 rounded-full bg-[var(--brand-green)] relative">
                    {idx !== 3 && <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-blue-200" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Customer First", desc: "Every decision starts with customers" },
              { icon: Target, title: "Mission Driven", desc: "Financial inclusion for all Indians" },
              { icon: Award, title: "Excellence", desc: "Highest standards in service delivery" },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-solid border-neutral-200 hover:border-[var(--brand-green-light)] transition-all duration-300 text-center"
              >
                <value.icon className="w-12 h-12 text-[var(--brand-green)] mx-auto mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">{value.title}</h4>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
