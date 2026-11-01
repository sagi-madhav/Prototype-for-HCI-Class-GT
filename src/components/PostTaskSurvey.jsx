import React, { useState } from 'react';
import { Star, CheckCircle, ArrowRight, ThumbsUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function PostTaskSurvey({ prototypeId, telemetry, onCompleteSurvey }) {
  const [seqRating, setSeqRating] = useState(6);
  const [confidenceRating, setConfidenceRating] = useState(6);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCompleteSurvey({
      prototypeId,
      seqRating,
      confidenceRating,
      comment,
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-700/80">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-white text-[15px]">
            Prototype {prototypeId} Test Completed!
          </h3>
          <p className="text-[12px] text-slate-400">
            Recorded in {telemetry.completionTimeSeconds?.toFixed(1) || '0.0'}s with {telemetry.errorCount || 0} errors
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Q1: Single Ease Question (SEQ) */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-200 mb-1.5 leading-snug">
            1. Single Ease Question (SEQ)
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            Overall, how easy or difficult was it to configure your trip parameters and transfer cushion?
          </p>

          <div className="grid grid-cols-7 gap-1 text-center">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSeqRating(num)}
                className={`py-2 rounded-lg text-[13px] font-bold transition-all ${
                  seqRating === num
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 ring-2 ring-blue-400'
                    : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
            <span>1 (Very Difficult)</span>
            <span>4 (Neutral)</span>
            <span>7 (Very Easy)</span>
          </div>
        </div>

        {/* Q2: Transfer Confidence Score */}
        <div className="pt-2 border-t border-slate-700/60">
          <label className="block text-[13px] font-semibold text-slate-200 mb-1.5 leading-snug">
            2. Transfer Confidence Score
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            How confident are you that the route you selected will not result in a missed connection?
          </p>

          <div className="grid grid-cols-7 gap-1 text-center">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setConfidenceRating(num)}
                className={`py-2 rounded-lg text-[13px] font-bold transition-all ${
                  confidenceRating === num
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400'
                    : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
            <span>1 (Not Confident)</span>
            <span>4 (Moderate)</span>
            <span>7 (Extremely Confident)</span>
          </div>
        </div>

        {/* Q3: Qualitative Feedback */}
        <div className="pt-2 border-t border-slate-700/60">
          <label className="block text-[13px] font-semibold text-slate-200 mb-1 leading-snug">
            3. Qualitative Feedback (Optional)
          </label>
          <p className="text-[11px] text-slate-400 mb-1.5">
            What was most helpful or confusing about Prototype {prototypeId}?
          </p>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. Loved the Gantt timeline visualization / Found cushion button very direct..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[12px] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Save Ratings & Advance</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
