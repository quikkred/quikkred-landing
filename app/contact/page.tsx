"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Send,
  RotateCcw,
  CheckCircle,
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  COMPANY_ADDRESS_LINES,
  COMPANY_EMAIL_SUPPORT,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  COMPANY_MAPS_URL,
} from "@/lib/constants/companyInfo";
import { API_BASE_URL } from "@/lib/config";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const SUBJECT_MAP: Record<string, string> = {
  "loan-inquiry": "LOAN_INQUIRY",
  "application-status": "APPLICATION_STATUS",
  "technical-support": "TECHNICAL_SUPPORT",
  "general-inquiry": "GENERAL_INQUIRY",
  complaint: "COMPLAINT",
};

const channels = [
  {
    index: "01",
    label: "By telephone",
    value: COMPANY_PHONE_DISPLAY,
    href: `tel:${COMPANY_PHONE_TEL}`,
    note: "Mon — Sat · 9:00 to 18:00 IST",
    cta: "Place a call",
  },
  {
    index: "02",
    label: "By correspondence",
    value: COMPANY_EMAIL_SUPPORT,
    href: `mailto:${COMPANY_EMAIL_SUPPORT}`,
    note: "Replies usually within two hours",
    cta: "Compose a note",
  },
  {
    index: "03",
    label: "In person",
    value: `${COMPANY_ADDRESS_LINES.line1} ${COMPANY_ADDRESS_LINES.line2}`,
    href: COMPANY_MAPS_URL,
    note: "Vikrant Tower · 13th Floor",
    cta: "Open in Maps",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      setNow(fmt.format(new Date()));

      const istNow = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const day = istNow.getDay();
      const hr = istNow.getHours();
      setIsOpen(day !== 0 && hr >= 9 && hr < 18);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const validate = (): boolean => {
    const errors: FormErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const digits = formData.phone.replace(/\D/g, "");

    if (!formData.name.trim()) errors.name = "Please tell us your name";
    else if (formData.name.trim().length < 2) errors.name = "Name is too short";
    else if (!nameRegex.test(formData.name.trim()))
      errors.name = "Letters and spaces only";

    if (!formData.email.trim()) errors.email = "An email so we can reach you";
    else if (!emailRegex.test(formData.email))
      errors.email = "That doesn't look quite right";

    if (!formData.phone.trim()) errors.phone = "Phone number, please";
    else if (digits.length < 10) errors.phone = "At least ten digits";
    else if (digits.length > 12) errors.phone = "No more than twelve digits";

    if (!formData.message.trim()) errors.message = "A few words will do";
    else if (formData.message.trim().length < 10)
      errors.message = "Tell us a little more";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "name") v = value.replace(/[^A-Za-z\s]/g, "");
    if (name === "phone") v = value.replace(/\D/g, "").slice(0, 12);
    setFormData((p) => ({ ...p, [name]: v }));
    if (formErrors[name as keyof FormErrors])
      setFormErrors((p) => ({ ...p, [name]: undefined }));
  };

  const onReset = () => {
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setFormErrors({});
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const apiSubject = formData.subject
        ? SUBJECT_MAP[formData.subject]
        : "GENERAL_INQUIRY";
      const res = await fetch(`${API_BASE_URL}/api/contactUs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          subject: apiSubject,
          message: formData.message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onReset();
      } else {
        alert("Could not send. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="contact-paper relative overflow-hidden"
      style={{
        backgroundColor: "#F7F2E8",
        color: "#1B221C",
      }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Soft warm gradient bleed in corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,177,129,0.18), transparent 70%)",
        }}
      />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-20">
        {/* Top meta strip */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.22em] font-medium">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Quikkred</span>
            <span className="hidden sm:inline opacity-30">/</span>
            <span className="opacity-60">Vol. III</span>
            <span className="opacity-30">·</span>
            <span className="opacity-60">No. 04 — Contact</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`relative flex h-1.5 w-1.5 rounded-full ${
                isOpen ? "bg-[#25B181]" : "bg-[#C97A3E]"
              }`}
            >
              {isOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25B181] opacity-60" />
              )}
            </span>
            <span className="opacity-70">
              {isOpen ? "The desk is open" : "Outside office hours"}
            </span>
            <span className="opacity-30">·</span>
            <span className="tabular-nums opacity-70">{now} IST</span>
          </div>
        </div>

        {/* Hairline */}
        <div
          className="mt-6 mb-12 md:mb-16 h-px w-full"
          style={{ backgroundColor: "rgba(27,34,28,0.18)" }}
        />

        {/* Editorial display */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-baseline gap-4 mb-6">
              <span
                className="text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-60"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                ▸ A letter to the desk
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-normal leading-[0.92] tracking-[-0.02em] text-[2.75rem] sm:text-[3.75rem] md:text-[5.25rem] lg:text-[7rem] xl:text-[8.25rem]"
              style={{ fontFamily: "var(--font-instrument), 'Cormorant Garamond', serif" }}
            >
              Tell us, in your{" "}
              <span className="italic" style={{ color: "#0E3A2A" }}>
                own
              </span>
              <span className="relative inline-block">
                <span className="italic relative z-10 pl-3" style={{ color: "#0E3A2A" }}>
                  words.
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 220 16"
                  className="absolute left-2 -bottom-1 sm:-bottom-2 w-[88%] h-[14px] sm:h-[18px]"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.4, delay: 0.7, ease: "easeOut" }}
                    d="M2 9 C 40 2, 90 14, 140 6 S 210 12, 218 7"
                    stroke="#25B181"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-8 md:mt-10 max-w-xl text-base md:text-lg leading-relaxed opacity-80"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Loan questions, paperwork, second opinions, or a quiet hello — every
              message reaches a real person at our Delhi desk. We answer in the
              order we receive them, with care.
            </motion.p>
          </div>

          {/* Right rail — folded letter card */}
          <motion.aside
            initial={{ opacity: 0, x: 16, rotate: 1.5 }}
            animate={{ opacity: 1, x: 0, rotate: 1.5 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="hidden lg:flex col-span-3 flex-col p-6 relative"
            style={{
              backgroundColor: "#FFFCF6",
              boxShadow:
                "0 1px 0 rgba(27,34,28,0.06), 0 18px 40px -28px rgba(27,34,28,0.35)",
              border: "1px solid rgba(27,34,28,0.08)",
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.28em] opacity-60"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Recipient
            </span>
            <p
              className="mt-2 text-2xl leading-tight"
              style={{
                fontFamily: "var(--font-instrument), serif",
              }}
            >
              The Quikkred Desk
            </p>
            <div
              className="mt-3 h-px"
              style={{ backgroundColor: "rgba(27,34,28,0.15)" }}
            />
            <p
              className="mt-3 text-sm leading-relaxed opacity-75"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {COMPANY_ADDRESS_LINES.line1}
              <br />
              {COMPANY_ADDRESS_LINES.line2}
            </p>
            <div className="mt-5 flex items-center gap-1 text-[11px] uppercase tracking-[0.25em] opacity-60">
              <span>To be read carefully</span>
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
            <span
              aria-hidden
              className="absolute -top-2 left-6 text-[10px] uppercase tracking-[0.3em] px-2 py-0.5"
              style={{
                fontFamily: "var(--font-sora)",
                backgroundColor: "#C97A3E",
                color: "#FFFCF6",
              }}
            >
              Postmark · NDL
            </span>
          </motion.aside>
        </div>
      </section>

      {/* ── DIRECTORY ───────────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
        <div className="flex items-center gap-6 mb-8 md:mb-12">
          <span
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-60"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Three ways to reach us
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(27,34,28,0.18)" }}
          />
          <span
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-40"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            §
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
          style={{ backgroundColor: "rgba(27,34,28,0.18)" }}
        >
          {channels.map((c, i) => (
            <motion.a
              key={c.index}
              href={c.href}
              target={c.index === "03" ? "_blank" : undefined}
              rel={c.index === "03" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="group relative p-6 md:p-8 lg:p-10 transition-colors duration-300"
              style={{ backgroundColor: "#F7F2E8" }}
            >
              <div className="flex items-start justify-between mb-8 md:mb-12">
                <span
                  className="text-[10px] uppercase tracking-[0.3em] opacity-50"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {c.index} · {c.label}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <p
                className="text-2xl md:text-[1.65rem] lg:text-[2rem] leading-[1.1] tracking-tight"
                style={{ fontFamily: "var(--font-instrument), serif" }}
              >
                {c.value}
              </p>
              <div
                className="mt-8 h-px w-8 group-hover:w-24 transition-all duration-500"
                style={{ backgroundColor: "#25B181" }}
              />
              <p
                className="mt-4 text-xs opacity-60"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {c.note}
              </p>
              <span
                className="mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                style={{ fontFamily: "var(--font-sora)", color: "#0E3A2A" }}
              >
                {c.cta}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── FORM + MAP ──────────────────────────────────────────── */}
      <section
        id="write"
        className="relative px-6 md:px-12 lg:px-20 pb-20 md:pb-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-4 mb-2">
              <span
                className="text-[10px] uppercase tracking-[0.3em] opacity-60"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                ▸ Write to us
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl leading-[1] tracking-tight mb-10 md:mb-14"
              style={{ fontFamily: "var(--font-instrument), serif" }}
            >
              A short note <span className="italic">will do.</span>
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="border p-8 md:p-12"
                style={{
                  borderColor: "rgba(27,34,28,0.15)",
                  backgroundColor: "#FFFCF6",
                }}
              >
                <CheckCircle
                  className="w-7 h-7 mb-4"
                  style={{ color: "#25B181" }}
                />
                <p
                  className="text-3xl md:text-4xl leading-tight mb-3"
                  style={{ fontFamily: "var(--font-instrument), serif" }}
                >
                  Your letter is on our desk.
                </p>
                <p
                  className="text-sm opacity-70 mb-6"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  Someone from our team will reply within two hours. Thank you for
                  writing.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs uppercase tracking-[0.25em] inline-flex items-center gap-2 pb-1 border-b transition-colors hover:opacity-60"
                  style={{
                    fontFamily: "var(--font-sora)",
                    borderColor: "currentColor",
                  }}
                >
                  Send another <ArrowUpRight className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-10">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FieldUnderline
                    label="Name"
                    name="name"
                    value={formData.name}
                    placeholder="Aanya Sharma"
                    error={formErrors.name}
                    onChange={onChange}
                  />
                  <FieldUnderline
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="aanya@domain.com"
                    error={formErrors.email}
                    onChange={onChange}
                  />
                </div>

                {/* Phone + Subject row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FieldUnderline
                    label="Telephone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    placeholder="+91 00000 00000"
                    error={formErrors.phone}
                    onChange={onChange}
                  />
                  <div className="flex flex-col">
                    <label
                      className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-3"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      Regarding
                    </label>
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={onChange}
                        className="w-full appearance-none bg-transparent pb-3 pr-8 text-lg outline-none cursor-pointer"
                        style={{
                          fontFamily: "var(--font-instrument), serif",
                          borderBottom: "1px solid rgba(27,34,28,0.35)",
                          color: formData.subject ? "#1B221C" : "rgba(27,34,28,0.45)",
                        }}
                      >
                        <option value="">Choose a subject…</option>
                        <option value="loan-inquiry">A loan inquiry</option>
                        <option value="application-status">Application status</option>
                        <option value="technical-support">Technical support</option>
                        <option value="general-inquiry">General enquiry</option>
                        <option value="complaint">A complaint</option>
                      </select>
                      <span
                        aria-hidden
                        className="absolute right-1 top-1/2 -translate-y-3 pointer-events-none opacity-60"
                      >
                        ↓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <label
                      className="text-[10px] uppercase tracking-[0.3em] opacity-60"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      Your message
                    </label>
                    <span
                      className="text-[10px] tabular-nums opacity-40"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      {formData.message.length} / 500
                    </span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    rows={4}
                    maxLength={500}
                    placeholder="Dear Quikkred — "
                    className="w-full resize-none bg-transparent pb-3 text-lg md:text-xl leading-relaxed outline-none"
                    style={{
                      fontFamily: "var(--font-instrument), serif",
                      borderBottom: formErrors.message
                        ? "1px solid #C97A3E"
                        : "1px solid rgba(27,34,28,0.35)",
                    }}
                  />
                  {formErrors.message && (
                    <span
                      className="mt-2 text-xs"
                      style={{
                        fontFamily: "var(--font-sora)",
                        color: "#C97A3E",
                      }}
                    >
                      {formErrors.message}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-4">
                  <p
                    className="text-xs opacity-50 max-w-xs"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    By writing to us you agree to be contacted regarding your
                    request. We do not share your details.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onReset}
                      className="px-5 py-3 text-[11px] uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:opacity-60 transition-opacity"
                      style={{ fontFamily: "var(--font-sora)" }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative px-7 py-4 text-[11px] uppercase tracking-[0.28em] inline-flex items-center gap-3 overflow-hidden transition-colors disabled:opacity-60"
                      style={{
                        fontFamily: "var(--font-sora)",
                        backgroundColor: "#1B221C",
                        color: "#F7F2E8",
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                        style={{ backgroundColor: "#0E3A2A" }}
                      />
                      <span className="relative inline-flex items-center gap-3">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Sending
                          </>
                        ) : (
                          <>
                            Seal &amp; send
                            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Map column */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex items-baseline gap-4 mb-2">
              <span
                className="text-[10px] uppercase tracking-[0.3em] opacity-60"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                ▸ The address
              </span>
            </div>
            <h3
              className="text-3xl md:text-4xl leading-[1] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-instrument), serif" }}
            >
              Vikrant Tower, <span className="italic">Delhi.</span>
            </h3>
            <div
              className="relative overflow-hidden"
              style={{
                border: "1px solid rgba(27,34,28,0.18)",
                backgroundColor: "#FFFCF6",
              }}
            >
              <div className="aspect-[4/5] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=Vikrant%20Tower%20Rajendra%20Place%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: "grayscale(35%) sepia(8%) contrast(0.96)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Quikkred Head Office Location"
                  className="w-full h-full"
                />
              </div>
              <div
                className="absolute top-4 left-4 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em]"
                style={{
                  fontFamily: "var(--font-sora)",
                  backgroundColor: "#1B221C",
                  color: "#F7F2E8",
                }}
              >
                28.6419° N · 77.1807° E
              </div>
            </div>
            <a
              href={COMPANY_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] pb-0.5 border-b transition-colors hover:opacity-60"
              style={{
                fontFamily: "var(--font-sora)",
                borderColor: "currentColor",
              }}
            >
              Get directions <ArrowUpRight className="w-3 h-3" />
            </a>
          </aside>
        </div>
      </section>

      {/* ── SIGNED FOOTER ───────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
        <div
          className="h-px w-full mb-12 md:mb-16"
          style={{ backgroundColor: "rgba(27,34,28,0.18)" }}
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-8">
            <p
              className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-instrument), serif" }}
            >
              We read every word.{" "}
              <span className="italic opacity-70">Always have.</span>
            </p>
          </div>
          <div
            className="md:col-span-4 text-right"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            <p
              className="text-3xl md:text-4xl mb-1 italic"
              style={{
                fontFamily: "var(--font-instrument), serif",
                color: "#0E3A2A",
              }}
            >
              — The Quikkred desk
            </p>
            <p className="text-xs uppercase tracking-[0.28em] opacity-60">
              Rajendra Place, New Delhi
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Underline input field ─────────────────────────────────────── */

function FieldUnderline({
  label,
  name,
  value,
  type = "text",
  placeholder,
  error,
  onChange,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  type?: string;
  placeholder?: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col">
      <label
        className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-3"
        style={{ fontFamily: "var(--font-sora)" }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent pb-3 text-lg md:text-xl outline-none placeholder:opacity-30 focus:placeholder:opacity-10 transition-all"
        style={{
          fontFamily: "var(--font-instrument), serif",
          borderBottom: error
            ? "1px solid #C97A3E"
            : "1px solid rgba(27,34,28,0.35)",
        }}
      />
      {error && (
        <span
          className="mt-2 text-xs"
          style={{ fontFamily: "var(--font-sora)", color: "#C97A3E" }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
