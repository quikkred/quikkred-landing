'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Star, MessageSquare, Video, Send,
  CheckCircle, IndianRupee, RefreshCw, Heart,
  Sparkles, Quote, ShieldCheck, ThumbsUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { reviewService } from '@/lib/api/review.service';
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton';

const LOAN_TYPES = [
  'Personal Loan',
  'Business Loan',
  'Emergency Loan',
  'Medical Loan',
  'Salary Advance',
  'Home Loan',
];

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
const RATING_EMOJI = ['', '😞', '😐', '🙂', '😀', '🤩'];

export default function ReviewPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewType, setReviewType] = useState<'text' | 'video'>('text');
  const [reviewText, setReviewText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/user/review');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        variant: "error",
        title: "Rating Required",
        description: "Please select a star rating before submitting."
      });
      return;
    }

    if (reviewType === 'text' && !reviewText.trim()) {
      toast({
        variant: "error",
        title: "Review Required",
        description: "Please write your review before submitting."
      });
      return;
    }

    if (reviewType === 'video' && !videoUrl.trim()) {
      toast({
        variant: "error",
        title: "Video URL Required",
        description: "Please provide a video URL before submitting."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedAmount = parseInt(loanAmount.replace(/,/g, ''), 10) || 0;

      const response = await reviewService.createReview({
        rating,
        loanType: loanType || 'Personal Loan',
        loanAmount: parsedAmount,
        description: reviewType === 'text' ? reviewText : '',
        link: reviewType === 'video' ? videoUrl : undefined,
      });

      if (response.success) {
        setIsSubmitted(true);
        toast({
          variant: "success",
          title: "Review Submitted!",
          description: response.message || "Thank you for sharing your experience."
        });
      } else {
        toast({
          variant: "error",
          title: "Submission Failed",
          description: response.message || "Unable to submit your review. Please try again."
        });
      }
    } catch (error) {
      toast({
        variant: "error",
        title: "Submission Failed",
        description: "Unable to submit your review. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setRating(0);
    setReviewText('');
    setVideoUrl('');
    setLoanType('');
    setLoanAmount('');
  };

  // ===== Skeleton while auth is loading =====
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <SkeletonCircle size={56} />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-16 w-full" rounded="xl" />
              <Skeleton className="h-16 w-full" rounded="xl" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <Skeleton className="h-5 w-60" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10" rounded="full" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-11 w-full" rounded="xl" />
              <Skeleton className="h-11 w-full" rounded="xl" />
            </div>
            <Skeleton className="h-28 w-full" rounded="xl" />
            <Skeleton className="h-12 w-full" rounded="xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ===== Success State =====
  if (isSubmitted) {
    return (
      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#25B181]/5 via-transparent to-yellow-50 pointer-events-none" />
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="relative w-20 h-20 bg-gradient-to-br from-[#25B181] to-[#1F8F68] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="relative text-2xl sm:text-3xl font-bold text-[#1F8F68] mb-3">
            Thank You!
          </h2>
          <p className="relative text-gray-600 mb-2">
            Your review has been submitted successfully.
          </p>
          <p className="relative text-xs text-gray-500 mb-8">
            It will be visible after admin approval.
          </p>
          <div className="relative flex justify-center gap-1 mb-6">
            {Array.from({ length: rating }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
          <button
            onClick={resetForm}
            className="relative w-full px-6 py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Submit Another Review
          </button>
        </motion.div>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 sm:mb-6 flex items-start justify-between gap-3 flex-wrap"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F8F68] flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" />
            Share Your Experience
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Your review helps others make informed decisions
          </p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
        {/* LEFT: Hero / Preview */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-4 lg:self-start space-y-4"
        >
          {/* Preview card */}
          <div className="bg-gradient-to-br from-[#25B181] via-[#2EC28F] to-[#1F8F68] rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
            />
            <div className="relative">
              <Quote className="w-8 h-8 opacity-40 mb-3" />
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= rating ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`}
                  />
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-xs font-semibold">
                    {RATING_LABELS[rating]} {RATING_EMOJI[rating]}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed min-h-[80px] text-white/95">
                {reviewType === 'text'
                  ? (reviewText.trim()
                      ? `"${reviewText.trim().slice(0, 160)}${reviewText.length > 160 ? '…' : ''}"`
                      : 'Your review preview will appear here as you type…')
                  : (videoUrl.trim()
                      ? 'A video review will be attached with this rating.'
                      : 'Share a video link and it will appear here.')}
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.fullName || 'You'}</p>
                  <p className="text-[11px] text-white/80">
                    {loanType ? `${loanType}${loanAmount ? ` · ₹${loanAmount}` : ''}` : 'Quikkred Customer'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust points */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#25B181]/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#25B181]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Honest & verified</p>
                <p className="text-xs text-gray-500 mt-0.5">Every review is reviewed before publishing.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <ThumbsUp className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Helps real people</p>
                <p className="text-xs text-gray-500 mt-0.5">Your words help others choose with confidence.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Takes under a minute</p>
                <p className="text-xs text-gray-500 mt-0.5">Rate, write a line, and you're done.</p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* RIGHT: Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 space-y-6"
        >
          {/* Rating */}
          <section>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <label className="text-sm font-semibold text-gray-800">
                How would you rate your experience?
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <AnimatePresence mode="wait">
                {displayRating > 0 && (
                  <motion.div
                    key={displayRating}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-xs font-semibold text-yellow-700"
                  >
                    <span>{RATING_EMOJI[displayRating]}</span>
                    <span>{RATING_LABELS[displayRating]}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= displayRating;
                return (
                  <motion.button
                    key={star}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${
                        active ? 'text-yellow-400 fill-yellow-400 drop-shadow' : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Review Type */}
          <section>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Review format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReviewType('text')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  reviewType === 'text'
                    ? 'border-[#25B181] bg-[#25B181]/5 text-[#25B181] shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium text-sm">Text Review</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewType('video')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  reviewType === 'video'
                    ? 'border-[#25B181] bg-[#25B181]/5 text-[#25B181] shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="font-medium text-sm">Video Review</span>
              </button>
            </div>
          </section>

          {/* Loan Type chips */}
          <section>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              What kind of loan did you take?
            </label>
            <div className="flex flex-wrap gap-2">
              {LOAN_TYPES.map((lt) => {
                const active = loanType === lt;
                return (
                  <button
                    key={lt}
                    type="button"
                    onClick={() => setLoanType(active ? '' : lt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-[#25B181] border-[#25B181] text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#25B181] hover:text-[#25B181]'
                    }`}
                  >
                    {lt}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Loan Amount */}
          <section>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Loan amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                inputMode="numeric"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder="50,000"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25B181]/30 focus:border-[#25B181] focus:outline-none transition-colors"
              />
            </div>
          </section>

          {/* Content */}
          <section>
            {reviewType === 'text' ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Your review
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500">{reviewText.length}/500</span>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                  placeholder="How did Quikkred help you? What stood out? Be honest — it helps others."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25B181]/30 focus:border-[#25B181] focus:outline-none resize-none transition-colors"
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Video URL (YouTube)
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25B181]/30 focus:border-[#25B181] focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Upload your video to YouTube and paste the link here.
                </p>
              </>
            )}
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold text-base transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>

          <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#25B181]" />
            Your review is visible only after admin approval
          </p>
        </motion.form>
      </div>
    </div>
  );
}
