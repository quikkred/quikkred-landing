"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Twitter, Mail } from "lucide-react";

const leaders = [
  {
    name: "Leadership Member",
    role: "Chief Executive Officer",
    image: "/team/ceo.jpg",
    bio: "With over 20 years of experience in financial services, leading Quikkred's vision to democratize credit access across India.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Leadership Member",
    role: "Chief Financial Officer",
    image: "/team/cfo.jpg",
    bio: "A seasoned finance professional with expertise in scaling fintech operations and maintaining regulatory compliance.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Leadership Member",
    role: "Chief Technology Officer",
    image: "/team/cto.jpg",
    bio: "Technology veteran driving Quikkred's AI-powered lending platform and digital transformation initiatives.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Leadership Member",
    role: "Chief Risk Officer",
    image: "/team/cro.jpg",
    bio: "Expert in credit risk management with extensive experience in building robust underwriting frameworks.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Leadership Member",
    role: "Chief Operating Officer",
    image: "/team/coo.jpg",
    bio: "Operations specialist focused on delivering seamless customer experiences and operational excellence.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Leadership Member",
    role: "Chief Marketing Officer",
    image: "/team/cmo.jpg",
    bio: "Brand strategist with a passion for building customer-centric marketing initiatives.",
    linkedin: "#",
    twitter: "#",
  },
];

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

      {/* Leadership Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {leader.role.split(' ').map(w => w[0]).join('')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{leader.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{leader.role}</p>
                  <p className="text-slate-600 text-sm mb-4">{leader.bio}</p>
                  <div className="flex gap-3">
                    <a
                      href={leader.linkedin}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={leader.twitter}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-400 hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${leader.role.toLowerCase().replace(/ /g, '.')}@quikkred.in`}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
          <a
            href="/careers"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}
