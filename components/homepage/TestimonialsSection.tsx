"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  Play,
  X,
  User,
  Video,
  MessageSquare,
  IndianRupee,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/contexts/LanguageContext";

// Types
interface TextTestimonial {
  type: "text";
  id: string;
  name: string;
  location: string;
  image?: string;
  rating: number;
  loanAmount: string;
  loanType: string;
  date: string;
  content: string;
}

interface VideoTestimonial {
  type: "video";
  id: string;
  name: string;
  location: string;
  image?: string;
  rating: number;
  loanAmount: string;
  loanType: string;
  date: string;
  videoUrl: string;
  thumbnail?: string;
  duration: string;
  title: string;
}

interface ApiReview {
  _id: string;
  customerId?: {
    _id: string;
    fullName?: string;
    state?: string;
  };
  rating: number;
  loanType: string;
  loanAmount: number;
  description: string;
  createdAt: string;
  link?: string;
}

type Testimonial = TextTestimonial | VideoTestimonial;

// Sample Data
const testimonialsData: Testimonial[] = [
  {
    type: "text",
    id: "1",
    name: "Avishek Dutta Roy",
    location: "Mumbai, Maharashtra",
    // image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    loanAmount: "2,50,000",
    loanType: "Personal Loan",
    date: "Dec 2024",
    content:
      "I had a very positive experience with Quikkred. The loan process was quick, smooth, and completely hassle-free. The executives were extremely helpful, responsive, and supportive at every step, patiently guiding me through the process and addressing all my queries. I’m genuinely satisfied with their service and truly appreciate the professionalism and efficiency shown by the entire team.!",
  },
  {
    type: "video",
    id: "2",
    name: "Shrushti Swaroop Rane",
    location: "Delhi NCR",
    // image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    loanAmount: "5,00,000",
    loanType: "Business Loan",
    date: "Nov 2024",
    videoUrl: "/videos/shrushti.mp4",
    // thumbnail: "/videos/thumb.jpg",
    duration: "24sec",
    title: "Service is good and quick , so helpful customer support. ",
  },
  {
    type: "text",
    id: "3",
    name: "Amalraj Anthonymuthu",
    location: "Ahmedabad, Gujarat",
    // image: "https://randomuser.me/api/portraits/men/40.jpg",
    rating: 4,
    loanAmount: "1,00,000",
    loanType: "Emergency Loan",
    date: "Jan 2025",
    content: "Good process and fast and best experience.!",
  },
  {
    type: "video",
    id: "4",
    name: "Shubham khanna ",
    location: "Jaipur, Rajasthan",
    // image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    loanAmount: "3,00,000",
    loanType: "Personal Loan",
    date: "Oct 2024",
    videoUrl: "/videos/shubham khanna.mp4",
    // thumbnail: "/videos/shubham-thumb.jpg",
    duration: "09sec",
    title: "This time I'm getting a higher loan , Quikkred has my trust.",
  },

  {
    type: "video",
    id: "5",
    name: "Amul King",
    location: "Delhi NCR",
    rating: 5,
    loanAmount: "4,50,000",
    loanType: "Business Loan",
    date: "Jan 2025",

    videoUrl: "/videos/Amul King.mp4",
    // thumbnail: "/videos/amul-thumb.jpg", // optional

    duration: "15sec",
    title: "Fast service and very supportive team. Good experience.",
  },

  {
    type: "text",
    id: "6",
    name: "Amrit Singh ",
    location: "Lucknow, UP",
    // image: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
    loanAmount: "4,00,000",
    loanType: "Business Loan",
    date: "Dec 2024",
    content: "Best loan service.",
  },
  // {
  //   type: "text",
  //   id: "6",
  //   name: "Meera Reddy",
  //   location: "Hyderabad, Telangana",
  //   image: "https://randomuser.me/api/portraits/women/33.jpg",
  //   rating: 4,
  //   loanAmount: "1,50,000",
  //   loanType: "Education Loan",
  //   date: "Nov 2024",
  //   content:
  //     "Got loan for daughter's higher education. Minimal documentation and smooth process. Quikkred is truly customer-friendly!",
  // },
];

const getYoutubeEmbedUrl = (url: string): string => {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?\s]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url; // fallback
};

const mapApiReview = (review: ApiReview): Testimonial => {
  const base = {
    id: `api-${review._id}`,
    name: review.customerId?.fullName || "Verified Customer",
    location: review.customerId?.state || "",
    rating: review.rating,
    loanAmount: review.loanAmount.toLocaleString("en-IN"),
    loanType: review.loanType,
    date: new Date(review.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
  };

  if (review.link) {
    return {
      ...base,
      type: "video",
      videoUrl: getYoutubeEmbedUrl(review.link),
      title: review.description,
      duration: "",
    };
  }

  return {
    ...base,
    type: "text",
    content: review.description,
  };
};

const useApiTestimonials = () => {
  const [apiTestimonials, setApiTestimonials] = useState<Testimonial[]>([]);
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/review/getAllTestimonialReviews`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setApiTestimonials(json.data.map(mapApiReview));
        }
      })
      .catch((err) => console.error("❌ Failed to fetch testimonials:", err));
  }, []);

  return apiTestimonials;
};

// Filter type
type FilterType = "all" | "text" | "video";

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, idx) => (
      <Star
        key={idx}
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 ${
          idx < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

// Default Avatar
const DefaultAvatar = ({ name }: { name: string }) => (
  <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#25B181] to-[#1F8F68] flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base">
    {name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)}
  </div>
);

// Text Card
const TextCard = ({ testimonial }: { testimonial: TextTestimonial }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative mb-3 sm:mb-4 flex-grow">
        <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#25B181]/30 absolute -left-1 -top-1 rotate-180" />
        <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed pl-4 sm:pl-5 line-clamp-4">
          {testimonial.content}
        </p>
      </div>
      <div className="flex items-end justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-[10px] sm:text-xs font-medium">
            <IndianRupee size={10} className="sm:w-3 sm:h-3" />
            {testimonial.loanAmount}
          </span>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-medium">
            {testimonial.loanType}
          </span>
        </div>
        <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#25B181]/30 flex-shrink-0" />
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {testimonial.image && !imageError ? (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={48}
              height={48}
              className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-[#D3F1EB] flex-shrink-0"
              onError={() => setImageError(true)}
            />
          ) : (
            <DefaultAvatar name={testimonial.name} />
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              {testimonial.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
              {testimonial.location}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 sm:gap-1 flex-shrink-0">
          <StarRating rating={testimonial.rating} />
          <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
            {testimonial.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// VideoCard component - replace the video thumbnail section
const VideoCard = ({
  testimonial,
  onPlay,
}: {
  testimonial: VideoTestimonial;
  onPlay: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div
        className="relative h-36 sm:h-44 lg:h-48 bg-gray-900 cursor-pointer group"
        onClick={onPlay}
      >
        <img
          src={`https://img.youtube.com/vi/${testimonial.videoUrl.split("/embed/")[1]?.split("?")[0]}/hqdefault.jpg`}
          alt={testimonial.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#25B181] ml-0.5 sm:ml-1" />
          </div>
        </div>
        <span className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/70 text-white text-[10px] sm:text-xs rounded">
          {testimonial.duration}
        </span>
        <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center gap-0.5 sm:gap-1">
          <Video size={10} className="sm:w-3 sm:h-3" />
        </span>
      </div>
      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2">
          {testimonial.title}
        </h4>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-[10px] sm:text-xs font-medium">
            <IndianRupee size={10} className="sm:w-3 sm:h-3" />
            {testimonial.loanAmount}
          </span>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-medium">
            {testimonial.loanType}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {testimonial.image && !imageError ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-[#D3F1EB] flex-shrink-0"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#25B181] to-[#1F8F68] flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <h5 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                {testimonial.name}
              </h5>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                {testimonial.location}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <StarRating rating={testimonial.rating} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Video Modal
const VideoModal = ({
  videoUrl,
  onClose,
}: {
  videoUrl: string;
  onClose: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!mounted) return null;

  return typeof document !== "undefined"
    ? require("react-dom").createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full sm:w-[90vw] md:w-[85vw] lg:w-[80vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-2xl"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={`${videoUrl}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>,
        document.body,
      )
    : null;
};

// Main Component
export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const apiTestimonials = useApiTestimonials();
  const allTestimonials = [...testimonialsData, ...apiTestimonials];
  const filteredTestimonials = allTestimonials.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-[10px] sm:text-xs lg:text-sm font-semibold mb-2 sm:mb-3 lg:mb-4">
            {t?.homepage?.sections?.testimonials?.badge || "Customer Stories"}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-sora mb-2 sm:mb-3 lg:mb-4 px-2">
            {t?.homepage?.sections?.testimonials?.title || "Trusted by"}{" "}
            <span className="text-[#25B181]">
              {t?.homepage?.sections?.testimonials?.titleHighlight ||
                "Thousands"}
            </span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base xl:text-lg max-w-2xl mx-auto px-2">
            {t?.homepage?.sections?.testimonials?.subtitle ||
              "Real stories from real customers who transformed their lives with Quikkred"}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mb-6 sm:mb-8"
        >
          <div className="flex gap-1.5 sm:gap-2 lg:gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                filter === "all"
                  ? "bg-[#25B181] text-white shadow-lg shadow-[#25B181]/30"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t?.homepage?.sections?.testimonials?.filters?.all || "All"}
            </button>
            <button
              onClick={() => setFilter("text")}
              className={`px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-1.5 lg:gap-2 ${
                filter === "text"
                  ? "bg-[#25B181] text-white shadow-lg shadow-[#25B181]/30"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {t?.homepage?.sections?.testimonials?.filters?.text || "Text"}
              </span>
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-1.5 lg:gap-2 ${
                filter === "video"
                  ? "bg-[#25B181] text-white shadow-lg shadow-[#25B181]/30"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Video className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {t?.homepage?.sections?.testimonials?.filters?.video || "Video"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="relative w-screen left-1/2 -translate-x-1/2">
        <div
          className="overflow-x-auto scrollbar-hide px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-fit py-2">
            {filteredTestimonials.map((testimonial) =>
              testimonial.type === "text" ? (
                <div
                  key={testimonial.id}
                  className="w-[260px] sm:w-[300px] md:w-[320px] lg:w-[360px] xl:w-[380px] flex-shrink-0"
                >
                  <TextCard testimonial={testimonial} />
                </div>
              ) : (
                <div
                  key={testimonial.id}
                  className="w-[260px] sm:w-[300px] md:w-[320px] lg:w-[360px] xl:w-[380px] flex-shrink-0"
                >
                  <VideoCard
                    testimonial={testimonial}
                    onPlay={() => setSelectedVideo(testimonial.videoUrl)}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6"
        >
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#25B181] mb-0.5 sm:mb-1">
              50,000+
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
              {t?.homepage?.sections?.testimonials?.stats?.customers ||
                "Happy Customers"}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#25B181] mb-0.5 sm:mb-1">
              4.8/5
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
              {t?.homepage?.sections?.testimonials?.stats?.rating ||
                "Average Rating"}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#25B181] mb-0.5 sm:mb-1">
              500+ Cr
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
              {t?.homepage?.sections?.testimonials?.stats?.disbursed ||
                "Loans Disbursed"}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#25B181] mb-0.5 sm:mb-1">
              98%
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
              {t?.homepage?.sections?.testimonials?.stats?.satisfaction ||
                "Satisfaction Rate"}
            </div>
          </div>
        </motion.div>
      </div> */}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            videoUrl={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
