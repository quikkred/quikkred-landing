"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Send,
  CheckCircle,
  MapPin,
  RotateCcw,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import {
  COMPANY_ADDRESS_LINES,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  COMPANY_EMAIL_SUPPORT,
  COMPANY_MAPS_URL,
} from "@/lib/constants/companyInfo"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

interface ContactFormProps {
  onSuccess?: () => void
}

type CardTone = {
  /** brand chip tint (bg) */
  chipBg: string
  /** chip text color */
  chipText: string
  /** edge tape color on top-left */
  tape: string
  /** rotation in deg for resting card */
  rotate: string
}

const contactCards: {
  icon: typeof Phone
  index: string
  title: string
  lede: string
  contact: string
  link: string
  external?: boolean
  tone: CardTone
}[] = [
  {
    icon: Phone,
    index: "01",
    title: "Call the desk",
    lede: "Speak directly with an advisor",
    contact: COMPANY_PHONE_DISPLAY,
    link: `tel:${COMPANY_PHONE_TEL}`,
    tone: {
      chipBg: "#D3F1EB",
      chipText: "#0F7A5A",
      tape: "#25B181",
      rotate: "-2.5deg",
    },
  },
  {
    icon: Mail,
    index: "02",
    title: "Drop a line",
    lede: "Email us — we read every one",
    contact: COMPANY_EMAIL_SUPPORT,
    link: `mailto:${COMPANY_EMAIL_SUPPORT}`,
    tone: {
      chipBg: "#FFE6D6",
      chipText: "#B05121",
      tape: "#FF9C70",
      rotate: "1.6deg",
    },
  },
  {
    icon: MapPin,
    index: "03",
    title: "Pay us a visit",
    lede: `${COMPANY_ADDRESS_LINES.line1} ${COMPANY_ADDRESS_LINES.line2}`,
    contact: "Vikrant Tower, Delhi",
    link: COMPANY_MAPS_URL,
    external: true,
    tone: {
      chipBg: "#DCE3FF",
      chipText: "#2E4AC9",
      tape: "#4A66FF",
      rotate: "-1.2deg",
    },
  },
]

const SUBJECT_MAP: Record<string, string> = {
  "loan-inquiry": "LOAN_INQUIRY",
  "application-status": "APPLICATION_STATUS",
  "technical-support": "TECHNICAL_SUPPORT",
  "general-inquiry": "GENERAL_INQUIRY",
  complaint: "COMPLAINT",
}

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
  const [focused, setFocused] = useState<string | null>(null)
  const [advisorsOnline, setAdvisorsOnline] = useState(3)
  const formRef = useRef<HTMLDivElement>(null)

  // Subtle live advisor count flutter, 2–4 advisors
  useEffect(() => {
    const id = setInterval(() => {
      setAdvisorsOnline(2 + Math.floor(Math.random() * 3))
    }, 9000)
    return () => clearInterval(id)
  }, [])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    const nameRegex = /^[A-Za-z\s]+$/

    if (!formData.name.trim()) errors.name = "Name is required"
    else if (formData.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters"
    else if (!nameRegex.test(formData.name.trim()))
      errors.name = "Name should contain only alphabets"

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!emailRegex.test(formData.email))
      errors.email = "Please enter a valid email address"

    const digitsOnly = formData.phone.replace(/\D/g, "")
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    else if (digitsOnly.length < 10)
      errors.phone = "Phone number must be at least 10 digits"
    else if (digitsOnly.length > 12)
      errors.phone = "Phone number must not exceed 12 digits"

    if (!formData.message.trim()) errors.message = "Message is required"
    else if (formData.message.trim().length < 10)
      errors.message = "Message must be at least 10 characters"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    let processedValue = value
    if (name === "name") processedValue = value.replace(/[^A-Za-z\s]/g, "")
    if (name === "phone")
      processedValue = value.replace(/\D/g, "").slice(0, 12)
    setFormData((prev) => ({ ...prev, [name]: processedValue }))
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleReset = () => {
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const apiSubject = formData.subject
        ? SUBJECT_MAP[formData.subject]
        : "GENERAL_INQUIRY"
      const response = await fetch(`${API_BASE_URL}/api/contactUs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          subject: apiSubject,
          message: formData.message.trim(),
        }),
      })
      const data = await response.json()
      if (data.success) {
        setSubmitted(true)
        handleReset()
        if (onSuccess) onSuccess()
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-b from-white to-[#F4FBF7] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0.6, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 14 }}
            className="relative w-24 h-24 mx-auto mb-8"
          >
            <span className="absolute inset-0 rounded-full bg-[#25B181] opacity-20 animate-ping" />
            <span className="absolute inset-2 rounded-full bg-[#25B181] opacity-30" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#25B181] to-[#51C9AF] flex items-center justify-center shadow-lg shadow-[#25B181]/40">
              <CheckCircle className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3 text-slate-900"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Message on its way.
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for reaching out. An advisor will reply within 24 hours —
            usually sooner.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="group inline-flex items-center gap-2 bg-[#25B181] text-white py-3.5 px-7 rounded-full font-semibold hover:bg-[#1F9C72] transition-all shadow-lg shadow-[#25B181]/30"
          >
            Send another
            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 12% 5%, rgba(37,177,129,0.10), transparent 65%), radial-gradient(800px 500px at 95% 90%, rgba(74,102,255,0.08), transparent 60%), linear-gradient(180deg, #FBFEFC 0%, #F4FBF7 100%)",
          }}
        />
        {/* dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(15,61,46,0.16) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* ── HEADER ──────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D3F1EB] shadow-sm shadow-[#25B181]/5 mb-5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25B181] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25B181]" />
              </span>
              <span
                className="text-xs font-semibold tracking-wide text-[#0F7A5A]"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {advisorsOnline} advisors online · replying now
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-slate-900 max-w-3xl tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Let&rsquo;s start a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#25B181]">
                  conversation
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 320 14"
                  className="absolute left-0 right-0 -bottom-1 sm:-bottom-2 w-full h-2 sm:h-3"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.45 }}
                    d="M2 9 C 60 2, 130 13, 200 5 S 300 12, 318 6"
                    stroke="#25B181"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 mt-5 max-w-2xl text-base md:text-lg"
            >
              Loan questions, paperwork, or something else on your mind? Pick a
              channel below or send us a note — we&rsquo;ll be right with you.
            </motion.p>
          </div>

          {/* ── BODY ────────────────────────────────────────────── */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* ─ LEFT: Postcard tickets + map ─────────────────── */}
            <div className="lg:col-span-5 space-y-8">
              {/* Stacked postcards */}
              <div className="relative">
                <div className="absolute -top-3 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#FF9C70]" />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-700"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    Three channels
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  {contactCards.map((card, i) => {
                    const Icon = card.icon
                    return (
                      <motion.a
                        key={card.index}
                        href={card.link}
                        target={card.external ? "_blank" : undefined}
                        rel={card.external ? "noopener noreferrer" : undefined}
                        initial={{
                          opacity: 0,
                          y: 24,
                          rotate: card.tone.rotate,
                        }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.08,
                          duration: 0.55,
                          ease: [0.2, 0.8, 0.2, 1],
                        }}
                        whileHover={{
                          rotate: 0,
                          y: -4,
                          transition: { type: "spring", stiffness: 280, damping: 18 },
                        }}
                        style={{
                          transform: `rotate(${card.tone.rotate})`,
                        }}
                        className="group relative block bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,42,30,0.04),0_18px_40px_-22px_rgba(15,42,30,0.18)] hover:shadow-[0_1px_2px_rgba(15,42,30,0.06),0_30px_60px_-22px_rgba(15,42,30,0.28)] transition-shadow"
                      >
                        {/* Top-left tape */}
                        <span
                          aria-hidden
                          className="absolute -top-2 left-6 w-10 h-4 opacity-90 rounded-[2px]"
                          style={{
                            backgroundColor: card.tone.tape,
                            transform: "rotate(-3deg)",
                          }}
                        />
                        {/* Right notch / index */}
                        <span
                          className="absolute top-4 right-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
                          style={{ fontFamily: "var(--font-sora)" }}
                        >
                          № {card.index}
                        </span>

                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6 group-hover:scale-105"
                            style={{ backgroundColor: card.tone.chipBg }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: card.tone.chipText }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-base font-bold text-slate-900"
                              style={{ fontFamily: "var(--font-sora)" }}
                            >
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {card.lede}
                            </p>
                            <p
                              className="mt-3 text-sm font-semibold truncate"
                              style={{ color: card.tone.chipText }}
                              title={card.contact}
                            >
                              {card.contact}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Map card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_18px_40px_-24px_rgba(15,42,30,0.2)]"
              >
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9C70] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF9C70]" />
                    </span>
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      Head office · live pin
                    </span>
                  </div>
                  <a
                    href={COMPANY_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-[#25B181] hover:text-[#0F7A5A] inline-flex items-center gap-1"
                  >
                    Directions <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative w-full h-[230px] sm:h-[260px]">
                  <iframe
                    src="https://maps.google.com/maps?q=Vikrant%20Tower%20Rajendra%20Place%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Quikkred Head Office Location"
                    className="w-full h-full"
                  />
                  {/* Floating pin label */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-3 left-3 max-w-[78%] bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-100"
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      You&rsquo;ll find us at
                    </p>
                    <p className="text-xs font-semibold text-slate-900 leading-tight mt-0.5">
                      {COMPANY_ADDRESS_LINES.line1}
                      <br />
                      {COMPANY_ADDRESS_LINES.line2}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* ─ RIGHT: Form ──────────────────────────────────── */}
            <div className="lg:col-span-7" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_30px_80px_-40px_rgba(15,42,30,0.25)] border border-slate-100"
              >
                {/* Corner ribbon */}
                <div className="absolute -top-3 right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#25B181] to-[#1F9C72] text-white shadow-md shadow-[#25B181]/30">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    Send a note
                  </span>
                </div>

                {/* Form header line */}
                <div className="flex items-end justify-between mb-8 pb-5 border-b border-dashed border-slate-200">
                  <div>
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      Form №4 · Contact
                    </p>
                    <h3
                      className="text-2xl md:text-3xl font-bold text-slate-900"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      Hello, who&rsquo;s writing?
                    </h3>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                      Avg reply
                    </span>
                    <span
                      className="text-lg font-bold text-[#25B181]"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      &lt; 2 hrs
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                  <FloatingField
                    icon={User}
                    name="name"
                    label="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    focused={focused === "name"}
                    error={formErrors.name}
                    placeholder="e.g. Aanya Sharma"
                  />

                  <div className="grid sm:grid-cols-2 gap-7">
                    <FloatingField
                      icon={Mail}
                      name="email"
                      label="Email address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      focused={focused === "email"}
                      error={formErrors.email}
                      placeholder="aanya@example.com"
                    />
                    <FloatingField
                      icon={Phone}
                      name="phone"
                      label="Phone number"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      focused={focused === "phone"}
                      error={formErrors.phone}
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  {/* Subject as pill chooser */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      What&rsquo;s it about?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { v: "loan-inquiry", l: "Loan inquiry" },
                        { v: "application-status", l: "Application status" },
                        { v: "technical-support", l: "Tech support" },
                        { v: "general-inquiry", l: "General" },
                        { v: "complaint", l: "Complaint" },
                      ].map((opt) => {
                        const isActive = formData.subject === opt.v
                        return (
                          <button
                            key={opt.v}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                subject: isActive ? "" : opt.v,
                              }))
                            }
                            className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                              isActive
                                ? "bg-[#25B181] text-white border-[#25B181] shadow-md shadow-[#25B181]/25"
                                : "bg-white text-slate-600 border-slate-200 hover:border-[#25B181] hover:text-[#25B181]"
                            }`}
                            style={{ fontFamily: "var(--font-sora)" }}
                          >
                            {opt.l}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        Your message
                      </label>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tabular-nums tracking-[0.2em]">
                        {formData.message.length} / 500
                      </span>
                    </div>
                    <div
                      className={`relative rounded-2xl border-2 transition-all ${
                        focused === "message"
                          ? "border-[#25B181] bg-white shadow-[0_0_0_4px_rgba(37,177,129,0.10)]"
                          : formErrors.message
                          ? "border-red-200 bg-red-50/30"
                          : "border-slate-100 bg-slate-50/60 hover:bg-white"
                      }`}
                    >
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        rows={4}
                        maxLength={500}
                        placeholder="Hi Quikkred — I'd like to know more about…"
                        className="w-full bg-transparent px-5 py-4 outline-none resize-none placeholder:text-slate-400"
                      />
                      {/* Bottom progress underline */}
                      <div className="absolute left-5 right-5 bottom-1 h-0.5 rounded-full bg-slate-200/60 overflow-hidden">
                        <motion.div
                          animate={{
                            width: `${Math.min(
                              (formData.message.length / 500) * 100,
                              100
                            )}%`,
                          }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                          className="h-full bg-gradient-to-r from-[#25B181] to-[#51C9AF]"
                        />
                      </div>
                    </div>
                    <AnimatePresence>
                      {formErrors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-500 mt-2 ml-1"
                        >
                          {formErrors.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF9C70]" />
                      <span>We&rsquo;ll never share your info — promise.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-800 inline-flex items-center gap-2 transition-colors"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative overflow-hidden inline-flex items-center gap-3 px-7 py-4 rounded-full bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-[#25B181]/30 transition-all disabled:opacity-60"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[#25B181] to-[#1F9C72] transition-transform duration-500"
                        />
                        <span className="relative inline-flex items-center gap-3">
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send the note
                              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Signature flourish */}
                <div className="mt-8 pt-6 border-t border-dashed border-slate-200 flex items-center justify-between">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    — Sealed with care
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 140 32"
                    className="h-7 w-auto text-[#25B181]"
                  >
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.4 }}
                      d="M4 22 C 14 6, 22 28, 32 14 S 48 28, 56 12 C 64 0, 72 26, 80 14 S 100 28, 112 12 C 120 4, 128 18, 138 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Floating-label field ──────────────────────────────────────── */

function FloatingField({
  icon: Icon,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  error,
  placeholder,
  type = "text",
}: {
  icon: typeof User
  name: keyof FormData
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  focused: boolean
  error?: string
  placeholder?: string
  type?: string
}) {
  const hasValue = value.length > 0
  const lifted = focused || hasValue

  return (
    <div>
      <div
        className={`relative rounded-2xl border-2 transition-all ${
          focused
            ? "border-[#25B181] bg-white shadow-[0_0_0_4px_rgba(37,177,129,0.10)]"
            : error
            ? "border-red-200 bg-red-50/30"
            : "border-slate-100 bg-slate-50/60 hover:bg-white"
        }`}
      >
        <Icon
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
            error
              ? "text-red-400"
              : focused
              ? "text-[#25B181]"
              : "text-slate-400"
          }`}
        />
        <label
          htmlFor={name}
          className={`absolute left-12 pointer-events-none transition-all duration-200 ${
            lifted
              ? "top-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#25B181]"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          }`}
          style={{ fontFamily: "var(--font-sora)" }}
        >
          {label}
        </label>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={lifted ? placeholder : ""}
          className="w-full bg-transparent pl-12 pr-4 pt-7 pb-3 text-sm outline-none placeholder:text-slate-300"
        />
        {/* Underline reveal */}
        <span
          aria-hidden
          className={`absolute left-4 right-4 bottom-0 h-px transition-all duration-500 ${
            focused
              ? "bg-gradient-to-r from-[#25B181] to-[#51C9AF] opacity-100"
              : "bg-slate-200 opacity-0"
          }`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500 mt-2 ml-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
