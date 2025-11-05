"use client";

import { motion } from "framer-motion";
import {
  Briefcase, MapPin, Clock, Users, TrendingUp, Heart,
  Award, Sparkles, ChevronRight, ArrowRight, Globe,
  Rocket, Target, Zap, Shield, Coffee, Wifi
} from "lucide-react";
import Link from "next/link";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Mumbai, India",
    type: "Full-time",
    experience: "4-6 years",
    description: "Build scalable fintech solutions using modern web technologies.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"]
  },
  {
    id: 2,
    title: "Credit Risk Analyst",
    department: "Risk Management",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "3-5 years",
    description: "Analyze credit risk and develop robust risk assessment models.",
    skills: ["Data Analysis", "Python", "Risk Modeling", "SQL"]
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "Mumbai, India",
    type: "Full-time",
    experience: "5-7 years",
    description: "Lead product strategy and delivery for our lending platform.",
    skills: ["Product Strategy", "Agile", "User Research", "Analytics"]
  },
  {
    id: 4,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "2-4 years",
    description: "Create delightful user experiences for our customers.",
    skills: ["Figma", "User Research", "Design Systems", "Prototyping"]
  },
  {
    id: 5,
    title: "Business Development Manager",
    department: "Sales",
    location: "Delhi, India",
    type: "Full-time",
    experience: "3-5 years",
    description: "Drive business growth and build strategic partnerships.",
    skills: ["Sales", "Partnerships", "Negotiation", "Strategy"]
  },
  {
    id: 6,
    title: "Customer Support Lead",
    department: "Support",
    location: "Pune, India",
    type: "Full-time",
    experience: "2-4 years",
    description: "Lead our customer support team and enhance customer satisfaction.",
    skills: ["Customer Service", "Team Management", "CRM", "Communication"]
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health Insurance",
    description: "Comprehensive medical coverage for you and your family"
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Clear progression paths and learning opportunities"
  },
  {
    icon: Coffee,
    title: "Work-Life Balance",
    description: "Flexible working hours and remote work options"
  },
  {
    icon: Award,
    title: "Performance Bonus",
    description: "Rewarding excellence with competitive bonuses"
  },
  {
    icon: Rocket,
    title: "Learning Budget",
    description: "Annual budget for courses, conferences, and books"
  },
  {
    icon: Users,
    title: "Great Team",
    description: "Work with talented and passionate professionals"
  }
];

const values = [
  {
    icon: Target,
    title: "Customer First",
    description: "We put our customers at the heart of everything we do"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We embrace new ideas and cutting-edge technology"
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We operate with transparency and ethical standards"
  },
  {
    icon: Globe,
    title: "Inclusivity",
    description: "We celebrate diversity and foster an inclusive culture"
  }
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#006837] via-[#1976D2] to-[#006837] pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
            >
              <Briefcase className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Join Our Team</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Build the Future of
              <span className="block mt-2">Financial Inclusion</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join Quikkred and help millions access financial services.
              Work with cutting-edge technology and make a real impact.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#openings"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0ea5e9] rounded-full font-semibold hover:shadow-glow transition-all"
              >
                View Open Positions
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-slate-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-glow transition-all"
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Join Quikkred?
            </h2>
            <p className="text-xl text-slate-600">
              Perks and benefits that make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-slate-600">
              Find your perfect role and grow with us
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-5xl mx-auto">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-slate-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-slate-600">
                          {job.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3 ml-16">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.experience}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 ml-16">
                      {job.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.a
                    href={`mailto:careers@Quikkred.com?subject=Application for ${job.title}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-glow transition-all whitespace-nowrap"
                  >
                    Apply Now
                    <ChevronRight className="w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-16 h-16 text-[#34d399] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              We're always looking for talented individuals. Send us your resume
              and we'll keep you in mind for future opportunities.
            </p>
            <motion.a
              href="mailto:careers@Quikkred.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-full font-semibold hover:shadow-glow transition-all"
            >
              Send Your Resume
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
