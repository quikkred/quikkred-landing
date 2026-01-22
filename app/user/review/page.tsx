'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Star, MessageSquare, Video, Send,
  CheckCircle, IndianRupee, RefreshCw, Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';

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
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      toast({
        variant: "success",
        title: "Review Submitted!",
        description: "Thank you for sharing your experience with us."
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#25B181] border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Success State
  if (isSubmitted) {
    return (
      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-8 sm:p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F8F68] mb-3">
            Thank You!
          </h2>
          <p className="text-gray-600 mb-8">
            Your review has been submitted successfully. It will be visible after approval.
          </p>
          <button
            onClick={resetForm}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Submit Another Review
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F8F68] flex items-center gap-2 sm:gap-3">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              Write a Review
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Share your experience and help others make informed decisions</p>
          </div>

          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </motion.div>

      {/* Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4 sm:p-6 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How would you rate your experience? *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Review Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setReviewType('text')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  reviewType === 'text'
                    ? 'border-[#25B181] bg-[#25B181]/5 text-[#25B181]'
                    : 'border-[#E0E0E0] text-gray-600 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Text Review</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewType('video')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  reviewType === 'video'
                    ? 'border-[#25B181] bg-[#25B181]/5 text-[#25B181]'
                    : 'border-[#E0E0E0] text-gray-600 hover:border-gray-300'
                }`}
              >
                <Video className="w-5 h-5" />
                <span className="font-medium">Video Review</span>
              </button>
            </div>
          </div>

          {/* Loan Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Type
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none bg-white"
              >
                <option value="">Select loan type</option>
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
                <option value="emergency">Emergency Loan</option>
                <option value="medical">Medical Loan</option>
                <option value="salary">Salary Advance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Amount
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="50,000"
                  className="w-full pl-10 pr-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Review Content */}
          {reviewType === 'text' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with Quikkred. How did we help you?"
                rows={5}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewText.length}/500 characters
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video URL (YouTube) *
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your video to YouTube and paste the link here
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg font-semibold text-base transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Review</span>
              </>
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-red-400" />
            Your review will be visible after admin approval
          </p>
        </form>
      </motion.div>
    </div>
  );
}
