"use client";

import { useState } from "react";
import { Star, X, Loader2, Heart } from "lucide-react";
import { createReviewAction } from "@/app/actions/review";

interface ReviewModalClientProps {
  donorId: string;
  donorName: string;
  onClose: () => void;
}

export default function ReviewModalClient({ donorId, donorName, onClose }: ReviewModalClientProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await createReviewAction(donorId, rating, comment);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      // Auto-close after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
        {!success && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-green-500 fill-green-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-500">Your review helps build trust and highlights heroes like {donorName} in our community.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Star className="w-8 h-8 text-primary-red fill-primary-red" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Rate Your Donor</h2>
              <p className="text-gray-500 text-sm mt-2">How was your experience with <strong>{donorName}</strong>?</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      className={`w-10 h-10 transition-colors ${
                        (hoverRating || rating) >= star 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-gray-200"
                      }`} 
                    />
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave a note of appreciation (optional)
                </label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`Thank ${donorName} for saving a life...`}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors resize-none"
                ></textarea>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-gray-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
