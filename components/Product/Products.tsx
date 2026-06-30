"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Clock, Sparkles, Calculator, ArrowRight, ShieldCheck, Zap, Lock, Headphones, Star } from "lucide-react";
import { QUICK_FORM_URL } from "@/lib/config";

interface SalaryAdvanceProps {
  title?: string;
  highlightWord?: string;
  subtitle?: string;
  buttonPrimaryText?: string;
  buttonSecondaryText?: string;
  buttonPrimaryLink?: string;
  buttonSecondaryLink?: string;
  quickAccessAmount?: string;
  timeText?: string;
  imageSrc?: string;
  features?: string[];
  primaryColor?: string; // Tailwind color name e.g. "teal"
}

export default function Products({
  title,
  highlightWord,
  subtitle,
  buttonPrimaryText,
  buttonSecondaryText,
  buttonPrimaryLink = "/emi-calculator",
  buttonSecondaryLink = QUICK_FORM_URL as string,
  quickAccessAmount,
  timeText,
  imageSrc = "/salary-advance.jpg",
  features,
  primaryColor = "teal",
}: SalaryAdvanceProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primary = `text-${primaryColor}-600`;
  const primaryBg = `bg-${primaryColor}-600`;
  const primaryBgHover = `hover:bg-${primaryColor}-700`;
  const borderPrimary = `border-${primaryColor}-600`;
  const bgHover = `hover:bg-${primaryColor}-50`;

  // Popup component to be rendered via portal
  const ComingSoonPopup = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setShowComingSoon(false)}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '400px',
          width: '100%',
          padding: '24px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowComingSoon(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(to right, #25B181, #1F8F68)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Coming Soon!
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#25B181', marginBottom: '16px' }}>
            <Clock className="w-4 h-4" />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Under Development</span>
          </div>

          <p style={{ color: '#4b5563', marginBottom: '24px' }}>
            Our EMI Calculator is being crafted to help you plan your finances better. Stay tuned for an amazing experience!
          </p>

          <div style={{
            background: 'linear-gradient(to right, #E6F7F2, #D1F0E6)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#1F8F68', fontSize: '14px', fontStyle: 'italic' }}>
              "Good things take time. We're building something special for you!"
            </p>
          </div>

          <Link href={buttonSecondaryLink} onClick={() => setShowComingSoon(false)}>
            <button style={{
              width: '100%',
              padding: '14px 24px',
              minHeight: '48px',
              background: 'linear-gradient(to right, #25B181, #1F8F68)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Apply for Loan Instead
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Coming Soon Popup - Rendered via Portal to body */}
      {mounted && showComingSoon && createPortal(<ComingSoonPopup />, document.body)}

      {/* Background matches the image's own near-white backdrop so the mascot
          scene camouflages into the page — no visible box or seam. The faint
          cool tint at the bottom mirrors the image's lower edge (#f9fbfc). */}
      <section
        className="relative overflow-x-hidden !px-0"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #ffffff 50%, #f3faf7 100%)" }}
      >
        {/* Hero viewport — navbar + this block fill the first screen exactly.
            The feature cards below sit just past the fold, so they're revealed
            on scroll instead of squeezing the hero. */}
        <div className="relative flex items-center overflow-hidden min-h-[calc(100svh-64px)] lg:min-h-[calc(100svh-80px)]">
          {/* Desktop mascot scene — bleeds to the real viewport edge, big and
              free-floating, camouflaged on the white background. */}
          <Image
            src={imageSrc}
            alt="Quikkred mascot showing a loan approved for up to ₹50,000, surrounded by loan use-cases: travel, medical emergency, education, home improvement and daily expenses"
            width={1536}
            height={1024}
            priority
            unoptimized
            sizes="62vw"
            className="hidden lg:block pointer-events-none select-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-[8%] w-[62vw] max-w-[1180px] h-auto object-contain z-0"
          />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 w-full -translate-y-4 lg:-translate-y-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center w-full">
            {/* Left Section */}
            <div className="order-2 lg:order-1 space-y-5 sm:space-y-6 text-center lg:text-left">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                100% Digital <span className="text-emerald-300">•</span> Fast <span className="text-emerald-300">•</span> Secure
              </span>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
                {title}{" "}
                {highlightWord && <span className={primary}>{highlightWord}</span>}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Buttons */}
              {(buttonPrimaryText || buttonSecondaryText) && (
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-1 justify-center lg:justify-start">
                  {buttonPrimaryText && (
                    <button
                      onClick={() => setShowComingSoon(true)}
                      className={`group inline-flex items-center justify-center gap-2 ${primaryBg} ${primaryBgHover} text-white font-semibold px-7 py-3.5 min-h-[48px] rounded-xl shadow-lg shadow-emerald-500/25 transition text-sm sm:text-base`}
                    >
                      <Calculator className="w-5 h-5" />
                      {buttonPrimaryText}
                    </button>
                  )}
                  {buttonSecondaryText && (
                    <Link href={buttonSecondaryLink} className="w-full sm:w-auto">
                      <button
                        className={`group inline-flex items-center justify-center gap-2 w-full ${borderPrimary} ${primary} border-2 font-semibold px-7 py-3.5 min-h-[48px] rounded-xl ${bgHover} transition text-sm sm:text-base`}
                      >
                        {buttonSecondaryText}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  )}
                </div>
              )}

              {/* Trust row */}
              <div className="flex items-center gap-4 pt-2 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[
                    "from-emerald-400 to-teal-500",
                    "from-sky-400 to-blue-500",
                    "from-amber-400 to-orange-500",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} ring-2 ring-white shadow-sm`}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-700">
                    Trusted by <span className="font-bold text-slate-900">5,000+</span> customers
                  </p>
                  {/* Rating temporarily hidden
                  <div className="flex items-center gap-1.5">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">4.8/5 Rating</span>
                  </div>
                  */}
                </div>
              </div>
            </div>

            {/* Mobile mascot scene — in-flow above the text. On desktop the
                scene is rendered as the bleeding absolute image above, so this
                grid cell is just a spacer to reserve the right half. */}
            <div className="order-1 lg:order-2">
              <Image
                src={imageSrc}
                alt="Quikkred mascot showing a loan approved for up to ₹50,000, surrounded by loan use-cases: travel, medical emergency, education, home improvement and daily expenses"
                width={1536}
                height={1024}
                priority
                unoptimized
                sizes="100vw"
                className="lg:hidden w-full h-auto object-contain select-none"
              />
            </div>
          </div>
        </div>
        </div>
        {/* /Hero viewport */}

        {/* Feature cards — sit just below the fold; scroll to reveal. */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 pt-2 pb-10 sm:pb-12">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.15)] grid grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-gray-100 lg:divide-y-0 overflow-hidden">
            {HERO_FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3 p-5 sm:p-6">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight">{f.title}</p>
                  <p className="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const HERO_FEATURES = [
  { icon: ShieldCheck, title: "100% Secure", subtitle: "Your data is safe with us" },
  { icon: Zap, title: "Super Fast", subtitle: "Approval in just a few seconds" },
  { icon: Lock, title: "No Hidden Charges", subtitle: "Transparent process, zero surprises" },
  { icon: Headphones, title: "24x7 Support", subtitle: "We're here to help you anytime" },
] as const;
