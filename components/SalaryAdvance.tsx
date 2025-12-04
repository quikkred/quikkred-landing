"use client";
import Image from "next/image";

interface SalaryAdvanceProps {
  title?: string;
  highlightWord?: string;
  title1?: string;
  subtitle?: string;
  buttonPrimaryText?: string;
  buttonSecondaryText?: string;
  quickAccessAmount?: string;
  timeText?: string;
  imageSrc?: string;
  features?: string[];
  primaryColor?: string; // Tailwind color name e.g. "teal"
  reverse?: boolean;
}

export default function SalaryAdvance({
  title,
  highlightWord,
  title1,
  subtitle,
  buttonPrimaryText,
  buttonSecondaryText,
  quickAccessAmount,
  timeText,
  imageSrc = "/salary-advance.jpg",
  features,
  primaryColor = "teal",
  reverse= false,
}: SalaryAdvanceProps) {
  const primary = `text-${primaryColor}-600`;
  const primaryBg = `bg-${primaryColor}-600`;
  const primaryBgHover = `hover:bg-${primaryColor}-700`;
  const borderPrimary = `border-${primaryColor}-600`;
  const bgHover = `hover:bg-${primaryColor}-50`;

  return (
    <div
  className={`w-full bg-white py-12 px-6 md:px-16 flex flex-col items-center justify-between gap-10
    ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
>
      {/* Left Section */}
      <div className="md:w-1/2 space-y-6">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          {title}{" "}
          {highlightWord && <span className={primary}>{highlightWord}</span>}{" "}
          {title1}{" "}
        </h1>

        {/* Subtitle (optional) */}
        {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}

        {/* Buttons (only render if at least one exists) */}
        {(buttonPrimaryText || buttonSecondaryText) && (
          <div className="flex flex-wrap gap-4 pt-2">
            {buttonPrimaryText && (
              <button
                className={`${primaryBg} ${primaryBgHover} text-white font-semibold px-6 py-3 rounded-md transition`}
              >
                {buttonPrimaryText}
              </button>
            )}
            {buttonSecondaryText && (
              <button
                className={`${borderPrimary} ${primary} border font-semibold px-6 py-3 rounded-md ${bgHover} transition`}
              >
                {buttonSecondaryText}
              </button>
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
        <div className="relative rounded-2xl overflow-hidden shadow-md w-full max-w-[420px] md:max-w-[460px]">
          <Image
            src={imageSrc}
            alt="Salary Advance"
            width={460}
            height={320}
            className="object-cover w-full h-auto"
          />

          {/* Overlay Card (optional if quickAccessAmount or timeText provided) */}
          {(quickAccessAmount || timeText) && (
            <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-4 py-2.5 flex justify-between items-center">
              {quickAccessAmount && (
                <div>
                  <p className="text-gray-600 text-sm">Quick Access to</p>
                  <p className={`${primary} font-semibold text-lg`}>
                    {quickAccessAmount}
                  </p>
                </div>
              )}
              {timeText && (
                <div className="text-right">
                  <p className="text-gray-600 text-sm">In as little as</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {timeText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
