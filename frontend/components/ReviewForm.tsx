import React, { useState } from 'react';
import { Send, Star, Loader2 } from 'lucide-react';
import { ReviewRequest } from '../types';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (review: ReviewRequest) => Promise<void>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onSubmit }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        movieId,
        userName,
        rating,
        comment,
      });
      setSuccess(true);
      // Reset form
      setUserName('');
      setComment('');
      setRating(5);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-xl font-semibold text-white">Write a Review</h3>
      
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="mb-2 rounded-full bg-green-500/20 p-3 text-green-400">
            <Send className="h-6 w-6" />
          </div>
          <p className="text-lg font-medium text-green-400">Review Submitted!</p>
          <p className="text-slate-400">Thank you for your feedback.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-300">
              Your Name
            </label>
            <input
              id="username"
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Rating (1-10)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-indigo-500"
              />
              <div className="flex min-w-[3rem] items-center justify-center gap-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-sm font-bold text-indigo-400">
                <span>{rating}</span>
                <Star className="h-3 w-3 fill-indigo-400 text-indigo-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="mb-1 block text-sm font-medium text-slate-300">
              Comment
            </label>
            <textarea
              id="comment"
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Tell us what you thought about the movie..."
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      )}
    </div>
  );
};