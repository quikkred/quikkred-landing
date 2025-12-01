"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HeadphonesIcon,
  Home,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Shield,
  Award
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import ContactForm from "@/components/Contact-form";

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "1800-123-4567",
      secondary: "+91-98765-43210",
      description: "Speak to our loan experts",
      available: "24/7 Support"
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "support@quikkred.com",
      secondary: "loans@Quikkred.com",
      description: "Get email support",
      available: "Response within 2 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "New Delhi Head Office",
      secondary: "Mumbai & Bangalore Branches",
      description: "Meet us in person",
      available: "Mon-Sat: 9 AM - 6 PM"
    }
  ];

  const offices = [
    {
      city: "New Delhi",
      type: "Head Office",
      address: "1008, 10th floor, Vikrant tower, Rajendra Place, New Delhi, Delhi, Pin Code 110005",
      phone: "+91-11-4567-8900",
      email: "delhi@Quikkred.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    {
      city: "Mumbai",
      type: "Branch Office",
      address: "Level 15, One World Center, Tower 2A, Jupiter Mill Compound, Senapati Bapat Marg, Lower Parel, Mumbai - 400013",
      phone: "+91-22-4567-8900",
      email: "mumbai@Quikkred.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    {
      city: "Bangalore",
      type: "Branch Office",
      address: "4th Floor, Prestige Meridian, No. 29, MG Road, Bangalore - 560001",
      phone: "+91-80-4567-8900",
      email: "bangalore@Quikkred.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    }
  ];

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 z-[9999]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lucky max-w-md w-full"
        >
          <div className="w-16 h-16 bg-[#E7F4EB] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#3AC6A0]" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for contacting us. Our team will get back to you within 2 hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Send Another Message
            </button>
            <Link href="/">
              <button className="w-full bg-white border-2 border-[#4A66FF] text-[#4A66FF] py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumbs */}
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <Link href="/" className="hover:text-[#4A66FF] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[#4A66FF] font-medium">Contact Us</span>
        </motion.nav>
      </div> */}

      {/* Header Section */}


      {/* <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
         }
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#27875a] to-[#1e98a6] rounded-full mb-6">
            <HeadphonesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora mb-4">
            <span className="text-[#25B181]">{t.contact.title}</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl p-6 shadow-lucky hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center mr-4">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{info.title}</h3>
              </div>
              <div className="space-y-2">
                {info.title === "Call Us" ? (
                  <>
                    <a href={`tel:${info.primary.replace(/\D/g, '')}`} className="text-lg font-semibold text-[#4A66FF] hover:underline block">
                      {info.primary}
                    </a>
                    <a href={`tel:${info.secondary.replace(/\D/g, '')}`} className="text-sm text-gray-600 hover:underline block">
                      {info.secondary}
                    </a>
                  </>
                ) : info.title === "Email Us" ? (
                  <>
                    <a href={`mailto:${info.primary}`} className="text-lg font-semibold text-[#4A66FF] hover:underline block">
                      {info.primary}
                    </a>
                    <a href={`mailto:${info.secondary}`} className="text-sm text-gray-600 hover:underline block">
                      {info.secondary}
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-[#4A66FF]">{info.primary}</p>
                    <p className="text-sm text-gray-600">{info.secondary}</p>
                  </>
                )}
                <p className="text-sm text-gray-500">{info.description}</p>
                <div className="inline-flex items-center text-xs bg-[#E7F4EB] text-[#26907F] px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1" />
                  {info.available}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
         
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lucky"
          >
            <ContactForm onSuccess={handleFormSuccess} />
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lucky">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-[#25B181]" />
                Our Offices
              </h2>

              <div className="space-y-6">
                {offices.map((office, index) => (
                  <motion.div
                    key={office.city}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-l-4 border-[#4A66FF] pl-4 pb-6"
                  >
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-bold">{office.city}</h3>
                      <span className="ml-2 text-xs bg-[#FF9C70] text-white px-2 py-1 rounded-full">
                        {office.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                    <div className="space-y-1 text-sm">
                      <a
                        href={`tel:${office.phone.replace(/\D/g, '')}`}
                        className="flex items-center hover:text-[#4A66FF] transition-colors group"
                      >
                        <Phone className="w-4 h-4 mr-2 text-[#4A66FF]" />
                        <span className="group-hover:underline">{office.phone}</span>
                      </a>
                      <a
                        href={`mailto:${office.email}`}
                        className="flex items-center hover:text-[#25B181] transition-colors group"
                      >
                        <Mail className="w-4 h-4 mr-2 text-[#25B181]" />
                        <span className="group-hover:underline">{office.email}</span>
                      </a>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-[#FF9C70]" />
                        {office.hours}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

           
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lucky">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#25B181]" />
                Find Us on Map
              </h3>
              <div className="rounded-lg overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4097591754347!2d77.1807!3d28.6419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029e2b6b2f6f%3A0x5c4a5f8a3a2b1c0d!2sVikrant%20Tower%2C%20Rajendra%20Place%2C%20New%20Delhi%2C%20Delhi%20110005!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Quikkred Head Office Location"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/Vikrant+Tower+Rajendra+Place+New+Delhi+110005"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-[#4A66FF] hover:underline flex items-center justify-center text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in Google Maps
              </a>
            </div>
          </motion.div>
        </div>

       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-br from-[#25B181] to-[#1F8F68] rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center mb-4">
              <Clock className="w-8 h-8 mr-3" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Support Hours</h3>
            </div>
            <div className="space-y-2">
              <p className="flex justify-between"><span>Phone Support:</span> <span className="font-semibold">24/7</span></p>
              <p className="flex justify-between"><span>Email Support:</span> <span className="font-semibold">24/7</span></p>
              <p className="flex justify-between"><span>Office Visits:</span> <span className="font-semibold">9 AM - 6 PM</span></p>
              <p className="flex justify-between"><span>Weekend Support:</span> <span className="font-semibold">10 AM - 4 PM</span></p>
            </div>
            <div className="mt-6 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span className="text-sm opacity-90">SSL Secured Communications</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#4A66FF] to-[#3B52CC] rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 mr-3" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quick Help</h3>
            </div>
            <p className="mb-6 opacity-90">
              Need instant answers? Check our comprehensive FAQ section for common questions and solutions.
            </p>
            <Link href="/resources/faqs">
              <button className="w-full bg-white text-[#4A66FF] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                Browse FAQs
              </button>
            </Link>
          </div>
        </motion.div>
      </section> */}
<ContactForm/>

    </div>
  );
}