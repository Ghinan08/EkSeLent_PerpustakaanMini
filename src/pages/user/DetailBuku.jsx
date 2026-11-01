import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, BookOpen, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import ReviewCard from '../../components/book/ReviewCard';

export default function DetailBuku({
  books = [],
  loans = [],
  reviews = [],
  users = [],
  currentUser,
  borrowedBookIds = [],
  onBorrowBook
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = books.find((b) => String(b.id) === String(id) || b.kode === id);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Buku Tidak Ditemukan</h2>
        <Link to="/katalog" className="text-[#114B3E] font-semibold mt-4 inline-block hover:underline">
          &larr; Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const bookReviews = reviews.filter((r) => String(r.book_id) === String(book.id));
  const averageRating =
    bookReviews.length > 0
      ? (
        bookReviews.reduce((acc, curr) => acc + Number(curr.rating), 0) /
        bookReviews.length
      ).toFixed(1)
      : (book.rating || 4.8).toFixed(1);

  const isCurrentlyBorrowedByUser = borrowedBookIds.some((bid) => String(bid) === String(book.id));
  const isOutOfStock = Number(book.stok_tersedia) <= 0 || book.status === 'Habis';
  const isBorrowDisabled = isOutOfStock || isCurrentlyBorrowedByUser;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#114B3E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Buku</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-4 flex flex-col gap-6" data-purpose="left-column">
          <div
            className={`w-full aspect-[1/1.48] ${book.cover_color || 'bg-[#0E3D32]'
              } rounded-2xl relative p-8 flex flex-col justify-end shadow-md overflow-hidden text-white border border-black/10`}
          >
            <div className="absolute left-6 top-0 bottom-0 w-[1.5px] bg-white/20 shadow-[1px_0_0_rgba(255,255,255,0.07)]" />
            <div className="relative z-10 pl-6">
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold block mb-2">
                {book.kategori}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2 text-white">
                {book.judul}
              </h1>
              <p className="text-emerald-100/80 text-sm font-medium tracking-wide">
                {book.penulis}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" data-purpose="action-card">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Tersedia di {book.rak}
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 mb-4">
              Dapat dipinjam langsung di lokasi atau pesan melalui akun keanggotaan Anda.
            </p>

            <div className="mb-4">
              {book.stok_tersedia > 0 ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Stok Tersedia: <strong>{book.stok_tersedia}</strong> dari {book.stok_total} buku
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2 text-amber-800 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Stok sedang kosong (seluruh buku sedang dipinjam)</span>
                </div>
              )}
            </div>

            {isBorrowDisabled ? (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-400 font-semibold py-3.5 px-4 rounded-xl text-sm cursor-not-allowed text-center transition-all"
                >
                  {isCurrentlyBorrowedByUser
                    ? 'Judul Ini Sedang Kamu Pinjam'
                    : 'Stok Buku Sedang Habis'}
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  {isCurrentlyBorrowedByUser
                    ? 'Maksimal 1 eksemplar untuk judul buku yang sama.'
                    : 'Buku ini sedang habis dipinjam oleh anggota lain.'}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onBorrowBook && onBorrowBook(book)}
                className="w-full bg-[#114B3E] hover:bg-[#0c382e] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm active:scale-[0.99] text-center"
              >
                Pinjam Buku Sekarang
              </button>
            )}
          </div>
        </section>

        <section className="lg:col-span-8 flex flex-col gap-8" data-purpose="right-column">
          <article className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" data-purpose="book-specs">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-[#D3EFE3] text-[#114B3E] text-xs font-semibold px-3 py-1.5 rounded-full">
                {book.kategori}
              </span>
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{averageRating}</span>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {book.judul}
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Ditulis oleh {book.penulis} • Diterbitkan tahun {book.tahun}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/60">
                <span className="block text-xs font-medium text-slate-400 mb-1">Stok Total</span>
                <span className="block text-sm font-bold text-slate-900">{book.stok_total} Buku</span>
              </div>
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/60">
                <span className="block text-xs font-medium text-slate-400 mb-1">Kategori</span>
                <span className="block text-sm font-bold text-slate-900">{book.kategori}</span>
              </div>
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/60">
                <span className="block text-xs font-medium text-slate-400 mb-1">Halaman</span>
                <span className="block text-sm font-bold text-slate-900">{book.halaman || '350'} Hal</span>
              </div>
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/60">
                <span className="block text-xs font-medium text-slate-400 mb-1">Bahasa</span>
                <span className="block text-sm font-bold text-slate-900">{book.bahasa || 'Indonesia'}</span>
              </div>
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/60">
                <span className="block text-xs font-medium text-slate-400 mb-1">Lokasi Rak</span>
                <span className="block text-sm font-bold text-[#114B3E]">{book.rak}</span>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" data-purpose="book-synopsis">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Sinopsis Buku</h3>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>{book.sinopsis}</p>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" data-purpose="book-reviews">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Ulasan & Komentar Pengguna ({bookReviews.length})
              </h3>
            </div>

            <div className="bg-slate-50/70 rounded-xl p-5 mb-6 flex items-center gap-4 border border-slate-100/60">
              <span className="text-3xl font-extrabold text-slate-900">{averageRating}</span>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 fill-slate-200'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Berdasarkan ulasan pembaca terverifikasi</p>
              </div>
            </div>

            {bookReviews.length > 0 ? (
              <div className="space-y-4">
                {bookReviews.map((rev) => {
                  const reviewer = users.find((u) => u.id === rev.user_id);
                  return (
                    <ReviewCard
                      key={rev.id}
                      review={rev}
                      userName={reviewer?.nama || 'Anggota Perpustakaan'}
                      userInitials={reviewer?.avatarInitials || 'AP'}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Belum ada ulasan untuk buku ini. Pinjam dan jadilah yang pertama memberikan ulasan!
              </p>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
