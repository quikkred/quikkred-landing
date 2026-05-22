"use client";
import Image from "next/image";

interface SalaryAdvanceProps {
  title?: string;
  highlightWord?: string;
  title1?: string;
  subtitle?: string;
  buttonPrimaryText?: string;
  buttonSecondaryText?: string;
  buttonPrimaryScrollTo?: string;
  buttonSecondaryScrollTo?: string;
  quickAccessAmount?: string;
  timeText?: string;
  imageSrc?: string;
  imageAlt?: string; // Added for accessibility
  features?: string[];
  primaryColor?: "emerald" | "teal" | "blue"; // Defined specific colors
  reverse?: boolean;
}

export default function SalaryAdvance({
  title,
  highlightWord,
  title1,
  subtitle,
  buttonPrimaryText,
  buttonSecondaryText,
  buttonPrimaryScrollTo,
  buttonSecondaryScrollTo,
  quickAccessAmount,
  timeText,
  imageSrc = "/salary-advance.jpg",
  imageAlt,
  features,
  primaryColor = "teal",
  reverse = false,
}: SalaryAdvanceProps) {
  
  // LOOKUP MAP: This ensures Tailwind "sees" the full class names during build.
  // Note: globals.css overrides `text-emerald-600`/`bg-emerald-600` to the
  // light `--success` token (#3AC6A0) which fails WCAG AA on white. We bump
  // every shade up one step so the native Tailwind colors apply and clear
  // 4.5:1 contrast: emerald-700 = #047857 ≈ 5.4:1 with white text.
  const colorMap = {
    emerald: {
      text: "text-emerald-700",
      bg: "bg-emerald-700",
      hoverBg: "hover:bg-emerald-800",
      border: "border-emerald-700",
      lightHover: "hover:bg-emerald-50",
    },
    teal: {
      text: "text-teal-700",
      bg: "bg-teal-700",
      hoverBg: "hover:bg-teal-800",
      border: "border-teal-700",
      lightHover: "hover:bg-teal-50",
    },
    blue: {
      text: "text-blue-700",
      bg: "bg-blue-700",
      hoverBg: "hover:bg-blue-800",
      border: "border-blue-700",
      lightHover: "hover:bg-blue-50",
    },
  };

  const selectedColor = colorMap[primaryColor] || colorMap.teal;

  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined") return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`w-full bg-white sm:px-6 md:px-16 flex flex-col items-center justify-between gap-10 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
      
      {/* Left Section */}
      <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          {title} {highlightWord && <span className={selectedColor.text}>{highlightWord}</span>} {title1}
        </h1>

        {subtitle && <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{subtitle}</p>}

        {(buttonPrimaryText || buttonSecondaryText) && (
          <div className="flex flex-wrap gap-4 w-full sm:w-auto pt-2">
            {buttonPrimaryText && (
              <button
                onClick={() => buttonPrimaryScrollTo && scrollToSection(buttonPrimaryScrollTo)}
                className={`${selectedColor.bg} ${selectedColor.hoverBg} text-white font-semibold px-6 py-3 rounded-md transition-all shadow-sm w-full sm:w-auto`}
              >
                {buttonPrimaryText}
              </button>
            )}
            {buttonSecondaryText && (
              <button
                onClick={() => buttonSecondaryScrollTo && scrollToSection(buttonSecondaryScrollTo)}
                className={`${selectedColor.border} ${selectedColor.text} border font-semibold px-6 py-3 rounded-md ${selectedColor.lightHover} transition-all w-full sm:w-auto`}
              >
                {buttonSecondaryText}
              </button>
            )}
          </div>
        )}

        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-600 text-sm pt-4">
            {features.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`${selectedColor.text} font-bold`}>✓</span> {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 flex justify-center">
        <div className="relative rounded-2xl overflow-hidden shadow-lg w-full max-w-[420px] md:max-w-[460px]">
          <Image
            src={imageSrc}
            alt={imageAlt || title || "Section Image"}
            width={460}
            height={320}
            className="object-cover w-full h-auto transition-transform duration-500 hover:scale-105"
            priority // Suggest adding this if it's a Hero section
          />

          {(quickAccessAmount || timeText) && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 flex justify-between items-center">
              {quickAccessAmount && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Quick Access</p>
                  <p className={`${selectedColor.text} font-bold text-lg`}>{quickAccessAmount}</p>
                </div>
              )}
              {timeText && (
                <div className="text-right">
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Timeline</p>
                  <p className="font-bold text-gray-900 text-base">{timeText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}