import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review, userName = 'Anggota Perpustakaan', userInitials = 'AP' }) {
  const rating = Number(review.rating) || 5;

  return (
    <div className="p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors shadow-2xs">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#A5E8D1] text-[#0C3B2E] font-bold text-xs flex items-center justify-center shrink-0">
            {userInitials}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-none">
              {userName}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              {review.tanggal || 'Baru saja'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {review.komentar}
      </p>
    </div>
  );
}

