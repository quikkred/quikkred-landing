"use client";

import { Star, Quote, User, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// Static data for ratings and images (not translated)
const testimonialStaticData = [
  { rating: 3, image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { rating: 4, image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { rating: 5, image: "https://randomuser.me/api/portraits/men/40.jpg" }
];

// Default avatar component for fallback
const DefaultAvatar = ({ name, isActive }: { name: string; isActive: boolean }) => (
  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
    isActive ? "bg-white/20" : "bg-teal-100"
  }`}>
    <User className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "text-white" : "text-teal-600"}`} />
  </div>
);

// Testimonial item interface
interface TestimonialItem {
  name: string;
  text: string;
  image: string;
  rating: number;
}

// Card component
const TestimonialCard = ({
  item,
  isActive,
  position,
  onClick,
  imageError,
  onImageError
}: {
  item: TestimonialItem;
  isActive: boolean;
  position: 'left' | 'center' | 'right';
  onClick: () => void;
  imageError: boolean;
  onImageError: () => void;
}) => {
  return (
    <motion.div
      className={`
        absolute top-0 w-[280px] sm:w-[320px] rounded-2xl p-5 sm:p-7 cursor-pointer
        ${isActive
          ? "bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white shadow-2xl z-20"
          : "bg-white text-slate-700 shadow-lg z-10"
        }
      `}
      initial={false}
      animate={{
        x: position === 'left' ? '-105%' : position === 'right' ? '105%' : '0%',
        scale: isActive ? 1.05 : 0.9,
        opacity: isActive ? 1 : 0.6,
        rotateY: position === 'left' ? 15 : position === 'right' ? -15 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        duration: 0.6
      }}
      onClick={onClick}
      whileHover={!isActive ? { scale: 0.95, opacity: 0.8 } : {}}
      style={{
        left: '50%',
        marginLeft: '-140px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect for active card */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#25B181] to-[#1F8F68] blur-xl opacity-40 -z-10 scale-110" />
      )}

      <Quote
        className={`w-7 h-7 sm:w-9 sm:h-9 mb-3 ${
          isActive ? "text-white/80" : "text-teal-500"
        }`}
      />

      <p
        className={`text-sm sm:text-base mb-5 leading-relaxed min-h-[70px] ${
          isActive ? "text-white/90" : "text-slate-600"
        }`}
      >
        "{item.text}"
      </p>

      <div className="flex items-center gap-3">
        {imageError ? (
          <DefaultAvatar name={item.name} isActive={isActive} />
        ) : (
          <div className={`rounded-full overflow-hidden ${
            isActive ? "ring-2 ring-white/50" : "ring-2 ring-teal-100"
          }`}>
            <Image
              src={item.image}
              alt={item.name}
              width={44}
              height={44}
              className="w-10 h-10 sm:w-11 sm:h-11 object-cover"
              onError={onImageError}
            />
          </div>
        )}
        <div className="text-left">
          <div
            className={`flex gap-0.5 mb-1 ${
              isActive ? "text-yellow-300" : "text-yellow-500"
            }`}
          >
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={13}
                className={idx < item.rating ? "fill-current" : "opacity-30"}
              />
            ))}
          </div>
          <p
            className={`font-semibold text-sm ${
              isActive ? "text-white" : "text-slate-900"
            }`}
          >
            {item.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.4 });

  // Default fallback data in case language data is not available
  const defaultTestimonials: TestimonialItem[] = [
    {
      name: "Rajesh Kumar",
      text: "The bullet loan let me stock up for the festival season. I paid it back easily after my sales. A total game-changer.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 3
    },
    {
      name: "Priya Sharma",
      text: "Finally, a loan that understands freelancers! No monthly EMI pressure, just one payment when my project invoice clears.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4
    },
    {
      name: "Amit Patel",
      text: "Emergency medical loan saved my father's life. The quick disbursal and hassle-free process was a blessing.",
      image: "https://randomuser.me/api/portraits/men/40.jpg",
      rating: 5
    }
  ];

  // Merge language data with static data (ratings and images)
  const languageItems = t?.homepage?.testimonials?.items;
  const testimonialData: TestimonialItem[] = languageItems && languageItems.length > 0
    ? languageItems.map((item: any, index: number) => ({
        name: item?.name || '',
        text: item?.text || '',
        image: item?.image || testimonialStaticData[index % testimonialStaticData.length]?.image || '',
        rating: testimonialStaticData[index % testimonialStaticData.length]?.rating || 5
      }))
    : defaultTestimonials;

  const totalItems = testimonialData.length;

  // Get circular indices
  const getCircularIndex = (offset: number) => {
    return (activeIndex + offset + totalItems) % totalItems;
  };

  const leftIndex = getCircularIndex(-1);
  const centerIndex = activeIndex;
  const rightIndex = getCircularIndex(1);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Auto-scroll when section is in view
  useEffect(() => {
    if (!isInView || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isInView, isPaused, handleNext]);

  return (
    <section
      ref={sectionRef}
      className="bg-gray-100 py-14 sm:py-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#14b8a642] text-teal-500 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            {t?.homepage?.sections?.testimonials?.badge || "Customer Stories"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 px-2">
            {t?.homepage?.testimonials?.heading} <span className="text-teal-500">{t?.homepage?.testimonials?.headingHighlight}</span> {t?.homepage?.testimonials?.subheading}
          </h2>
          <p className="text-slate-700 text-sm sm:text-base md:text-lg mt-3 max-w-2xl mx-auto px-4">
            {t?.homepage?.sections?.testimonials?.subtitle || "Real stories from real customers who transformed their lives with Quikkred"}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative h-[320px] sm:h-[300px] mx-auto"
          style={{ perspective: '1000px' }}
        >
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 group"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 group-hover:text-teal-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 group"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 group-hover:text-teal-700" />
          </button>

          {/* Cards - Only 3 visible at a time */}
          <div className="relative h-full flex items-center justify-center">
            {/* Left Card */}
            <TestimonialCard
              key={`left-${leftIndex}`}
              item={testimonialData[leftIndex]}
              isActive={false}
              position="left"
              onClick={handlePrev}
              imageError={imageErrors[leftIndex] || false}
              onImageError={() => handleImageError(leftIndex)}
            />

            {/* Center Card (Active) */}
            <TestimonialCard
              key={`center-${centerIndex}`}
              item={testimonialData[centerIndex]}
              isActive={true}
              position="center"
              onClick={() => {}}
              imageError={imageErrors[centerIndex] || false}
              onImageError={() => handleImageError(centerIndex)}
            />

            {/* Right Card */}
            <TestimonialCard
              key={`right-${rightIndex}`}
              item={testimonialData[rightIndex]}
              isActive={false}
              position="right"
              onClick={handleNext}
              imageError={imageErrors[rightIndex] || false}
              onImageError={() => handleImageError(rightIndex)}
            />
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonialData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-400 ease-out ${
                activeIndex === idx
                  ? "bg-teal-500 w-8"
                  : "bg-teal-200 hover:bg-teal-300 w-2.5"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Progress indicator */}
        {isInView && !isPaused && (
          <motion.div
            className="mt-5 flex justify-center items-center gap-2 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Auto-playing</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
