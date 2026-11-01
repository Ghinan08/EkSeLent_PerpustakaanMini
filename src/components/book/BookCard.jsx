import React from 'react';
import { BookOpen } from 'lucide-react';

export default function BookCard({
  book,
  isBorrowed = false,
  onBorrow,
  onViewDetail
}) {
  const isOutOfStock = book.stok_tersedia <= 0 || book.status === 'Habis';
  
  const isBorrowDisabled = isOutOfStock || isBorrowed;
  let disabledReason = '';
  if (isBorrowed) {
    disabledReason = 'Judul ini sedang kamu pinjam';
  } else if (isOutOfStock) {
    disabledReason = 'Stok Buku Sedang Habis';
  }

  const coverBg = book.cover_color || 'bg-[#165B4C]';

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div>
        <div
          onClick={() => onViewDetail && onViewDetail(book.id)}
          className={`w-full aspect-[3/4] ${coverBg} rounded-xl mb-4 relative p-4 flex flex-col justify-between text-white cursor-pointer shadow-sm overflow-hidden group`}
        >
          <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-white/20" />
          <div className="pl-2">
            <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold block">
              {book.kategori}
            </span>
          </div>
          <div className="pl-2 relative z-10">
            <h4 className="font-bold text-base leading-snug line-clamp-2 text-white">
              {book.judul}
            </h4>
            <p className="text-xs text-white/80 font-medium mt-1 line-clamp-1">
              {book.penulis}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          {book.kategori}
        </span>

        <h3
          onClick={() => onViewDetail && onViewDetail(book.id)}
          className="font-bold text-base text-slate-900 leading-snug line-clamp-1 hover:text-[#114B3E] cursor-pointer transition-colors"
        >
          {book.judul}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-1 mb-3">
          <span className="line-clamp-1">{book.penulis}</span>
          <span className="shrink-0 font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {book.rak}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              Dipinjam (0 Stok)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Tersedia ({book.stok_tersedia} Stok)
            </span>
          )}
          <span className="text-[11px] text-slate-400 font-medium">
            Thn {book.tahun}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-50">
        {isBorrowDisabled ? (
          <div className="relative group">
            <button
              disabled
              type="button"
              className="w-full bg-slate-100 text-slate-400 cursor-not-allowed text-xs font-semibold py-2.5 px-2 rounded-lg text-center border border-slate-200 transition-colors"
            >
              Pinjam Buku
            </button>
            <div className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-30 hidden group-hover:block whitespace-nowrap rounded bg-slate-900 text-white text-[10px] font-medium px-2 py-1 shadow-lg">
              {disabledReason}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onBorrow && onBorrow(book)}
            className="bg-[#114B3E] hover:bg-[#0c382e] text-white text-xs font-semibold py-2.5 px-2 rounded-lg transition-colors text-center shadow-xs"
          >
            Pinjam Buku
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewDetail && onViewDetail(book.id)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-2 rounded-lg transition-colors text-center"
        >
          Detail
        </button>
      </div>
    </article>
  );
}
