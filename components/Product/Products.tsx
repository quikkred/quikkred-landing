"use client";
import Image from "next/image";

interface SalaryAdvanceProps {
  title?: string;
  highlightWord?: string;
  subtitle?: string;
  buttonPrimaryText?: string;
  buttonSecondaryText?: string;
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
  quickAccessAmount,
  timeText,
  imageSrc = "/salary-advance.jpg",
  features,
  primaryColor = "teal",
}: SalaryAdvanceProps) {
  const primary = `text-${primaryColor}-600`;
  const primaryBg = `bg-${primaryColor}-600`;
  const primaryBgHover = `hover:bg-${primaryColor}-700`;
  const borderPrimary = `border-${primaryColor}-600`;
  const bgHover = `hover:bg-${primaryColor}-50`;

  return (
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
  );
}
