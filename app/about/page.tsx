"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award, Target, Users, TrendingUp, Shield, Heart,
  CheckCircle, Globe, Briefcase, Clock, Star, Building
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import SalaryAdvance from "@/components/SalaryAdvance";
import { useTranslation } from "react-i18next";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";

const stats = [
  { label: "Years of Excellence", value: "Since ", icon: Clock },
  { label: "Licensed by RBI", value: "", icon: Shield },
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
  const { t: tLang } = useLanguage();
    const { t } = useTranslation();
  return (
    <div className="min-h-screen">

      <section className="py-12 sm:py-16 lg:py-20">
        <SalaryAdvance
          title="About QuikKred"
          // {t('products.pages.personalLoan.hero.title')}
          // highlightWord="Kred"
          // {t('products.pages.personalLoan.hero.highlightWord')}
          // title1={t('products.pages.personalLoan.hero.title1')}
          subtitle="We are India's most trusted AI-powered NBFC, committed to making credit accessible, affordable, and transparent for every Indian. Our mission is to empower dreams and enable financial inclusion through technology and trust."
          // {t('products.pages.personalLoan.hero.subtitle')}
          buttonPrimaryText="Contact Us"
          // {t('products.pages.personalLoan.hero.buttonPrimary')}
          buttonSecondaryText="Call Us Now"
          // {t('products.pages.personalLoan.hero.buttonSecondary')}
          imageSrc="/Peronalloan_hero_image.jpg"
          // features={[
          //   t('products.pages.personalLoan.hero.features.loansUpTo'),
          //   t('products.pages.personalLoan.hero.features.instant'),
          //   t('products.pages.personalLoan.hero.features.disbursal'),
          // ]}
          primaryColor="emerald"
        />
      </section>
      <section className="py-12 sm:py-16 lg:py-20">
        <SalaryAdvance
          title="Our Story"
          // {t('products.pages.personalLoan.hero.title')}
          // highlightWord="Kred"
          // {t('products.pages.personalLoan.hero.highlightWord')}
          // title1={t('products.pages.personalLoan.hero.title1')}
          subtitle="QuikKred began in 2018 as a leading RBI-registered NBFC with a clear goal: to build a seamless lending experience for the underserved population of India. We recognized that millions of individuals and small businesses were excluded from traditional financial systems, facing complex processes and limited access to credit.

We saw the challenges many faced with traditional financing and knew that by leveraging cutting-edge technology, we could offer accessible and fair loan products. Our digital-first approach removes barriers, simplifies the lending process, and empowers individuals to achieve their financial goals with dignity and ease."
          imageSrc="/Peronalloan_hero_image.jpg"
          // features={[
          //   t('products.pages.personalLoan.hero.features.loansUpTo'),
          //   t('products.pages.personalLoan.hero.features.instant'),
          //   t('products.pages.personalLoan.hero.features.disbursal'),
          // ]}
          primaryColor="emerald"
          reverse
        />
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <SalaryAdvance
          title="Our Vision"
          // {t('products.pages.personalLoan.hero.title')}
          // highlightWord="Kred"
          // {t('products.pages.personalLoan.hero.highlightWord')}
          // title1={t('products.pages.personalLoan.hero.title1')}
          subtitle="We are India's most trusted AI-powered NBFC, committed to making credit accessible, affordable, and transparent for every Indian. Our mission is to empower dreams and enable financial inclusion through technology and trust."
          // {t('products.pages.personalLoan.hero.subtitle')}
          buttonPrimaryText="Contact Us"
          // {t('products.pages.personalLoan.hero.buttonPrimary')}
          buttonSecondaryText="Call Us Now"
          // {t('products.pages.personalLoan.hero.buttonSecondary')}
          imageSrc="/Peronalloan_hero_image.jpg"
          // features={[
          //   t('products.pages.personalLoan.hero.features.loansUpTo'),
          //   t('products.pages.personalLoan.hero.features.instant'),
          //   t('products.pages.personalLoan.hero.features.disbursal'),
          // ]}
          primaryColor="emerald"
        />
      </section>

         <FinancialFeatureSection
        image="/Salaryadvance_sub_image.jpg"
        imageAlt="Man in green sweater looking at phone"
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

      {/* Leadership Section */}
      <section id="leadership" className="py-12 sm:py-16 lg:py-20 bg-[rgb(var(--bg-primary))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-[rgb(var(--text-primary))]">Leadership Team</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))]">
              Experienced professionals driving our vision
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-[rgb(var(--text-primary))]">{leader.name}</h3>
                <p className="text-[#4A66FF] font-medium mb-3">{leader.role}</p>
                <p className="text-sm text-[rgb(var(--text-tertiary))] mb-4">{leader.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {leader.expertise.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}