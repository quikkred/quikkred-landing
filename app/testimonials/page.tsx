"use client";

import { motion } from "framer-motion";
import { MessageCircle, Home, ArrowRight, Star, Quote, ThumbsUp, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function TestimonialsPage() {
  const { t } = useLanguage();

  const testimonials = [
    // {
    //   name: "Rajesh Kumar",
    //   location: "Mumbai, Maharashtra",
    //   role: "Small Business Owner",
    //   rating: 5,
    //   comment: "Quikkred helped me expand my business with a quick loan approval. The entire process was seamless and transparent. Highly recommended!",
    //   loanType: "Business Loan",
    //   color: "#006837",
    //   image: "👨‍💼"
    // },
    // {
    //   name: "Priya Sharma",
    //   location: "Delhi, NCR",
    //   role: "Software Engineer",
    //   rating: 5,
    //   comment: "I needed urgent funds for a medical emergency. Quikkred approved my loan in just 30 seconds! Amazing service and support team.",
    //   loanType: "Emergency Loan",
    //   color: "#1976D2",
    //   image: "👩‍💻"
    // },
    // {
    //   name: "Arun Patel",
    //   location: "Bangalore, Karnataka",
    //   role: "Marketing Manager",
    //   rating: 5,
    //   comment: "Best interest rates in the market! The AI-powered system made the application process incredibly fast. No hidden charges at all.",
    //   loanType: "Personal Loan",
    //   color: "#F9A825",
    //   image: "👨‍💼"
    // },
    // {
    //   name: "Sneha Desai",
    //   location: "Pune, Maharashtra",
    //   role: "Teacher",
    //   rating: 5,
    //   comment: "As a woman entrepreneur, I appreciate Quikkred's special programs. The financial literacy workshops were incredibly helpful too!",
    //   loanType: "Women Entrepreneur Loan",
    //   color: "#4A148C",
    //   image: "👩‍🏫"
    // },
    // {
    //   name: "Vikram Singh",
    //   location: "Hyderabad, Telangana",
    //   role: "Freelance Designer",
    //   rating: 5,
    //   comment: "Completely digital process with zero paperwork. Got my salary advance within minutes. Customer support is excellent!",
    //   loanType: "Salary Advance",
    //   color: "#0D47A1",
    //   image: "👨‍🎨"
    // },
    // {
    //   name: "Anjali Reddy",
    //   location: "Chennai, Tamil Nadu",
    //   role: "Doctor",
    //   rating: 5,
    //   comment: "Transparent pricing, no hidden fees, and quick disbursement. Quikkred has set a new standard in the lending industry.",
    //   loanType: "Medical Professional Loan",
    //   color: "#006837",
    //   image: "👩‍⚕️"
    // },
    // {
    //   name: "Karthik Menon",
    //   location: "Kochi, Kerala",
    //   role: "Restaurant Owner",
    //   rating: 5,
    //   comment: "The flexible repayment options helped me manage my cash flow better. Great experience from start to finish!",
    //   loanType: "Business Loan",
    //   color: "#F9A825",
    //   image: "👨‍🍳"
    // },
    // {
    //   name: "Deepika Iyer",
    //   location: "Mumbai, Maharashtra",
    //   role: "CA Student",
    //   rating: 5,
    //   comment: "Needed funds for my CA coaching. Quikkred's education loan was perfect. Very supportive and understanding team.",
    //   loanType: "Education Loan",
    //   color: "#1976D2",
    //   image: "👩‍🎓"
    // },
    {
      name: "USER",
      location: "",
      role: "E-commerce Seller",
      rating: 5,
      comment: "Quick loan approval helped me stock inventory for festival season. The process was smooth and hassle-free!",
      loanType: "Festival Advance",
      color: "#4A148C",
      image: "👨‍💼"
    }
  ];

  const stats = [
    { value: "+", label: "Happy Customers", color: "#006837" },
    { value: "", label: "Average Rating", color: "#FFD600" },
    { value: "%", label: "Satisfaction Rate", color: "#1976D2" },
    { value: "+", label: "5-Star Reviews", color: "#F9A825" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#006837] via-[#145214] to-[#0D47A1] text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>Testimonials</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold font-sora">
                Customer Testimonials
              </h1>
            </div>

            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Real stories from real customers. Discover how Quikkred has helped thousands achieve their financial goals.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>+ Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                <span>% Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Real Feedback</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 shadow-sm text-center"
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative"
              >
                {/* Quote Icon */}
                <div
                  className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-20"
                  style={{ backgroundColor: testimonial.color }}
                >
                  <Quote className="w-5 h-5" style={{ color: testimonial.color }} />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#FFD600' }} />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: testimonial.color + '20' }}
                  >
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                    <span
                      className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: testimonial.color }}
                    >
                      {testimonial.loanType}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div
            className="rounded-2xl p-12 text-white text-center"
            style={{ background: 'linear-gradient(135deg, #145214 0%, #006837 50%, #1976D2 100%)' }}
          >
            <div className="text-6xl mb-4">🎥</div>
            <h2 className="text-3xl font-bold mb-4">Video Testimonials</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Watch our customers share their success stories and experiences with Quikkred
            </p>
            <button
              className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#FFD600', color: '#145214' }}
            >
              Watch Videos
            </button>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-2xl p-8 text-white text-center"
            style={{ background: 'linear-gradient(135deg, #4A148C 0%, #F9A825 100%)' }}
          >
            <h2 className="text-2xl font-bold mb-4">Join Thousands of Happy Customers</h2>
            <p className="mb-6 opacity-90">
              Experience fast, transparent, and reliable loan services. Apply now and see why we're rated 4.9/5!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/apply">
                <button
                  className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#FFD600', color: '#145214' }}
                >
                  Apply for Loan
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
