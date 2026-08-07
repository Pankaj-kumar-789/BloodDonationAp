"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { submitReviewAction } from "@/app/actions/reviews";

interface ReviewModalProps {
  reviewedUserId: string;
  reviewedUserName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ reviewedUserId, reviewedUserName, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const res = await submitReviewAction(reviewedUserId, rating, comment);
    
    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || "Failed to submit review");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Rate {reviewedUserName}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm">Your feedback helps build trust on our platform.</p>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-primary-red p-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-200 dark:text-gray-700"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Comment (Optional)
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all resize-none h-28"
              placeholder="How was your experience?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-primary-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-red-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-primary-red"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
