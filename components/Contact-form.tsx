"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion";
import { User, Mail, Phone, Send, MessageSquare, CheckCircle, MapPin, RotateCcw, ArrowRight } from "lucide-react"
import { API_BASE_URL } from '@/lib/config'

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

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
    contact: "1008, 13th floor, Vikrant Tower, Rajendra Place, New Delhi - 110008",
    link: "https://maps.google.com/?q=Vikrant+Tower+Rajendra+Place+New+Delhi"
  }
];

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (!nameRegex.test(formData.name.trim())) {
      errors.name = "Name should contain only alphabets";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (digitsOnly.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    } else if (digitsOnly.length > 12) {
      errors.phone = "Phone number must not exceed 12 digits";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    let processedValue = value;

    // For name field - allow only alphabets and spaces
    if (name === 'name') {
      processedValue = value.replace(/[^A-Za-z\s]/g, '');
    }

    // For phone field - allow only numbers, max 12 digits
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 12);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }))

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const subjectMap: { [key: string]: string } = {
        "loan-inquiry": "LOAN_INQUIRY",
        "application-status": "APPLICATION_STATUS",
        "technical-support": "TECHNICAL_SUPPORT",
        "general-inquiry": "GENERAL_INQUIRY",
        "complaint": "COMPLAINT"
      };

      const apiSubject = formData.subject ? subjectMap[formData.subject] : "GENERAL_INQUIRY";

      // api not added
      const response = await fetch(`${API_BASE_URL}/api/contactUs/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          subject: apiSubject,
          message: formData.message.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        handleReset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-white p-8">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Message Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. Our team will get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white py-3.5 px-8 min-h-[48px] rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div >
      {/* Form Section */}
      <div className="w-full bg-slate-50/50 py-16 md:py-24">
        <div className="w-full md:container md:mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-5 sm:mb-10">
              <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                Contact Us
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                Let’s start a <span className="text-[#25B181]">conversation</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Have questions about our loan services? We're here to help you find the perfect financial solution.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
              {/* LEFT SIDE - Info Hub (5 Columns) */}
              <div className="lg:col-span-5">
                <div className="space-y-4 mt-1">
                  {/* <p className="text-slate-500 text-lg max-w-md">
                    Have questions about our loan services? We're here to help you find the perfect financial solution.
                  </p> */}
                </div>

                <div className="grid grid-cols-1 gap-10 mb-12">
                  {contactCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                      <motion.a
                        key={index}
                        href={card.link}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#25B181]/30 transition-all"
                      >
                        <div className="w-12 h-12 bg-[#D3F1EB] rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#25B181] transition-colors">
                          <IconComponent className="w-6 h-6 text-[#25B181] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900">{card.title}</h4>
                          <p className="text-[#25B181] text-sm font-medium">{card.contact}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#25B181] group-hover:translate-x-1 transition-all" />
                      </motion.a>
                    );
                  })}
                </div>
                <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4097591754347!2d77.1807!3d28.6419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029e2b6b2f6f%3A0x5c4a5f8a3a2b1c0d!2sVikrant%20Tower%2C%20Rajendra%20Place%2C%20New%20Delhi%2C%20Delhi%20110008!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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

              {/* RIGHT SIDE - Form Hub (7 Columns) */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formErrors.name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#25B181]'}`} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all ${formErrors.name
                            ? 'border-red-100 focus:border-red-500'
                            : 'border-transparent focus:border-[#25B181] focus:bg-white'}`}
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      {formErrors.name && <p className="text-xs text-red-500 ml-1">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
                      <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formErrors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#25B181]'}`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all ${formErrors.email
                            ? 'border-red-100 focus:border-red-500'
                            : 'border-transparent focus:border-[#25B181] focus:bg-white'}`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {formErrors.email && <p className="text-xs text-red-500 ml-1">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number *</label>
                      <div className="relative group">
                        <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formErrors.phone ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#25B181]'}`} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all ${formErrors.phone
                            ? 'border-red-100 focus:border-red-500'
                            : 'border-transparent focus:border-[#25B181] focus:bg-white'}`}
                          placeholder="+91 00000 00000"
                        />
                      </div>
                      {formErrors.phone && <p className="text-xs text-red-500 ml-1">{formErrors.phone}</p>}
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#25B181] focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Choose a reason</option>
                        <option value="loan-inquiry">Loan Inquiry</option>
                        <option value="technical-support">Technical Support</option>
                        <option value="general-inquiry">General Enquiry</option>
                        <option value="application-status">Application Status</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between ml-1">
                        <label className="text-sm font-bold text-slate-700">Message *</label>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{formData.message.length}/500</span>
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        maxLength={500}
                        className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all resize-none ${formErrors.message
                          ? 'border-red-100 focus:border-red-500'
                          : 'border-transparent focus:border-[#25B181] focus:bg-white'}`}
                        placeholder="Tell us how we can help..."
                      />
                      {formErrors.message && <p className="text-xs text-red-500 ml-1">{formErrors.message}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#25B181] text-white py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1e966d] active:scale-[0.98] transition-all shadow-lg shadow-[#25B181]/30 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit Message</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
