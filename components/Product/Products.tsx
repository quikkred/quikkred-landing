"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Clock, Sparkles } from "lucide-react";

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
  buttonSecondaryLink = "/apply/quick",
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
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af'
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
              padding: '12px 24px',
              background: 'linear-gradient(to right, #25B181, #1F8F68)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
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

      <div className="w-full bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Section */}
        <div className="md:w-1/2 space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-snug">
            {title}{" "}
            {highlightWord && <span className={primary}>{highlightWord}</span>}{" "}
          </h1>

          {/* Subtitle (optional) */}
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}

          {/* Buttons (only render if at least one exists) */}
          {(buttonPrimaryText || buttonSecondaryText) && (
            <div className="flex flex-wrap gap-4 pt-2">
              {buttonPrimaryText && (
                <button
                  onClick={() => setShowComingSoon(true)}
                  className={`${primaryBg} ${primaryBgHover} text-white font-semibold px-6 py-3 rounded-md transition`}
                >
                  {buttonPrimaryText}
                </button>
              )}
              {buttonSecondaryText && (
                <Link href={buttonSecondaryLink}>
                  <button
                    className={`${borderPrimary} ${primary} border font-semibold px-6 py-3 rounded-md ${bgHover} transition`}
                  >
                    {buttonSecondaryText}
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* Features (optional) */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-6 text-gray-600 text-sm pt-4">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={primary}>✓</span> {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative rounded-2xl overflow-hidden w-full max-w-[420px] md:max-w-[460px]">
            <Image
              src={imageSrc}
              alt="product-main"
              width={460}
              height={320}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}
