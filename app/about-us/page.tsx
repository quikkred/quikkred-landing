"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award, Target, Users, TrendingUp, Shield, Heart,
  CheckCircle, Globe, Briefcase, Clock, Star, Building,
  Phone, Mail, MapPin
} from "lucide-react";
import SalaryAdvance from "@/components/SalaryAdvance";
import { useTranslation } from "react-i18next";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";
import ContactForm from "@/components/Contact-form";

const stats = [
  { label: "Years of Excellence", value: "Since 2026", icon: Clock },
  { label: "RBI-Registered Partner", value: "", icon: Shield },
  { label: "Pan India Presence", value: "28 States", icon: Globe },
  { label: "Customer Satisfaction", value: "%", icon: Star },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make starts and ends with our customers' best interests at heart."
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Complete transparency in our dealings with no hidden charges or surprise fees."
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Leveraging cutting-edge AI technology to make lending faster and fairer."
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Making credit accessible to every Indian, regardless of their background."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering the highest standards of service in everything we do."
  },
  {
    icon: Globe,
    title: "Social Impact",
    description: "Empowering communities and contributing to India's economic growth."
  }
];

const contactCards = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our support team",
    contact: "+91 9311913854",
    link: "tel:+919311913854"
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us your queries anytime",
    contact: "support@quikkred.in",
    link: "mailto:support@quikkred.in"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our head office location",
    contact: "1008, 10th floor, Vikrant Tower, Rajendra Place, New Delhi - 110005",
    link: "https://maps.google.com/?q=Vikrant+Tower+Rajendra+Place+New+Delhi"
  }
];

const leadership: any[] = [
  // {
  //   name: "Rajesh Kumar",
  //   role: "Chief Executive Officer",
  //   bio: "Former RBI official with 20+ years in financial services",
  //   expertise: ["Strategic Planning", "Regulatory Compliance", "Digital Transformation"]
  // },
  // {
  //   name: "Priya Sharma",
  //   role: "Chief Technology Officer",
  //   bio: "AI expert from IIT Delhi, previously at Google",
  //   expertise: ["Artificial Intelligence", "Machine Learning", "System Architecture"]
  // },
  // {
  //   name: "Amit Patel",
  //   role: "Chief Risk Officer",
  //   bio: "Risk management specialist with experience at major banks",
  //   expertise: ["Risk Management", "Credit Analysis", "Portfolio Management"]
  // },
  // {
  //   name: "Sneha Reddy",
  //   role: "Chief Operating Officer",
  //   bio: "Operations expert with background in fintech scaling",
  //   expertise: ["Operations", "Process Optimization", "Customer Experience"]
  // }
];

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <SalaryAdvance
          title="About QuikKred"
          // {t('products.pages.personalLoan.hero.title')}
          // highlightWord="Kred"
          // {t('products.pages.personalLoan.hero.highlightWord')}
          // title1={t('products.pages.personalLoan.hero.title1')}
          subtitle="We are India's most trusted AI-powered digital lending platform, committed to making credit accessible, affordable, and transparent for every Indian. Our mission is to empower dreams and enable financial inclusion through technology and trust."
          // {t('products.pages.personalLoan.hero.subtitle')}
          buttonPrimaryText="Contact Us"
          // {t('products.pages.personalLoan.hero.buttonPrimary')}
          buttonSecondaryText="Call Us Now"
          // {t('products.pages.personalLoan.hero.buttonSecondary')}
          imageSrc="/Aboutus_hero_image.jpg"
          // features={[
          //   t('products.pages.personalLoan.hero.features.loansUpTo'),
          //   t('products.pages.personalLoan.hero.features.instant'),
          //   t('products.pages.personalLoan.hero.features.disbursal'),
          // ]}
          primaryColor="emerald"
        />
      </section>
      <section className="py-8 sm:py-10 lg:py-12 bg-[#F6F6F6]">
        <div
          className={`w-full sm:px-6 md:px-16 flex flex-col items-center justify-between gap-10 md:flex-row-reverse`}
        >
          {/* Left Section */}
          <div className="md:w-1/2 space-y-4">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-snug">
              Our Story{" "}
            </h1>

            {/* Subtitle (optional) */}
            <p className="text-gray-600 text-sm sm:text-base">QuikKred began in 2018 as a digital lending platform with a clear goal: to build a seamless lending experience for the underserved population of India. In partnership with Satsai Finlease Private Limited (an RBI-registered NBFC), we recognized that millions of individuals and small businesses were excluded from traditional financial systems, facing complex processes and limited access to credit.</p>
            <p className="text-gray-600 text-sm sm:text-base">We saw the challenges many faced with traditional financing and knew that by leveraging cutting-edge technology, we could offer accessible and fair loan products. Our digital-first approach removes barriers, simplifies the lending process, and empowers individuals to achieve their financial goals with dignity and ease.</p>
            <p className="text-[#2b2b2b] font-bold text-sm sm:text-base">Today, we continue to innovate and expand, staying true to our mission of making financial services accessible to everyone who needs them.</p>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-md w-full max-w-[420px] md:max-w-[460px]">
              <Image
                src="/about_story_img.jpg"
                alt="Our Story"
                width={460}
                height={320}
                className="object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div
          className={`w-full sm:px-6 md:px-16 flex flex-col items-center justify-between gap-10 md:flex-row`}
        >
          {/* Left Section */}
          <div className="md:w-1/2 space-y-4 sm:space-y-6">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-snug">
              Our Vision{" "}
            </h1>

            {/* Subtitle (optional) */}
            <p className="text-gray-600 text-sm sm:text-base">We see a future where everyone has the financial tools they need to build a secure and prosperous life.</p>
            <p className="text-gray-600 text-sm sm:text-base">To be India's most trusted and preferred digital lending platform, empowering millions to achieve their financial aspirations.</p>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-md w-full max-w-[420px] md:max-w-[460px]">
              <Image
                src="/about_vision_img.jpg"
                alt="Our Vision"
                width={460}
                height={320}
                className="object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <FinancialFeatureSection
        image="/Aboutus_mission_image.jpg"
        imageAlt="Our Mission"
        heading="Our Mission"
        description="To make our vision a reality, we are on a mission to:"
        features={[
          {
            icon: <DocumentIcon />,
            title: "",
            description: "Provide innovative, accessible, and responsible lending solutions.",
          },
          {
            icon: <DocumentIcon />,
            title: "",
            description: "Leverage technology for a seamless customer experience.",
          },
          {
            icon: <DocumentIcon />,
            title: "",
            description: "Foster financial inclusion across all of India.",
          },
        ]}
      />

      {/* Core Values Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-5 sm:mb-10">
              <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                What We Stand For
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                Our Core <span className="text-[#25B181]">Values</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and define who we are as a company.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="w-14 h-14 bg-[#D3F1EB] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#25B181] transition-colors">
                      <IconComponent className="w-7 h-7 text-[#25B181] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get In Touch Cards Section */}
      <section className="bg-[#F6F6F6] py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-5 sm:mb-10">
              <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                Reach Out To Us
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                Let&apos;s <span className="text-[#25B181]">Connect</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions? We&apos;re here to help. Reach out to us through any of these channels.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {contactCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <motion.a
                    key={index}
                    href={card.link}
                    target={card.icon === MapPin ? "_blank" : undefined}
                    rel={card.icon === MapPin ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-[#D3F1EB] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#25B181] transition-colors">
                      <IconComponent className="w-7 h-7 text-[#25B181] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{card.description}</p>
                    <p className="text-[#25B181] font-semibold leading-relaxed">{card.contact}</p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              Send A Message
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4">
              Write To <span className="text-[#25B181]">Us</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Have questions? We&apos;re here to help. Reach out to us and our team will get back to you shortly.
            </p>
          </motion.div>
          <ContactForm />
        </div>
      </section>

      {/* Map Section - Full Width */}
      <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4097591754347!2d77.1807!3d28.6419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029e2b6b2f6f%3A0x5c4a5f8a3a2b1c0d!2sVikrant%20Tower%2C%20Rajendra%20Place%2C%20New%20Delhi%2C%20Delhi%20110005!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Quikkred Head Office Location"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}