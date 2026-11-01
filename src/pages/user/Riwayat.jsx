import React, { useState } from 'react';
import { Search, Star, CheckCircle, AlertTriangle, Send, BookOpen } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function Riwayat({
  currentUser,
  loans = [],
  books = [],
  reviews = [],
  onAddReview
}) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const userCompletedLoans = loans.filter(
    (l) => l.user_id === currentUser?.id && l.status === 'Selesai'
  );

  const filteredLoans = userCompletedLoans.filter((loan) => {
    const book = books.find((b) => b.id === loan.book_id) || {};
    const matchesSearch =
      searchQuery.trim() === '' ||
      (book.judul && book.judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.penulis && book.penulis.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (loan.kode_pinjam && loan.kode_pinjam.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesStatus = true;
    if (filterStatus === 'Tepat Waktu') {
      matchesStatus = loan.denda === 0;
    } else if (filterStatus === 'Denda Diselesaikan') {
      matchesStatus = loan.denda > 0;
    }

    return matchesSearch && matchesStatus;
  });

  function handleOpenReviewModal(book) {
    setSelectedBookForReview(book);
    setSelectedRating(5);
    setReviewText('');
    setReviewModalOpen(true);
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    if (!selectedBookForReview || !reviewText.trim()) return;

    if (onAddReview) {
      onAddReview({
        user_id: currentUser.id,
        book_id: selectedBookForReview.id,
        rating: selectedRating,
        komentar: reviewText.trim(),
        tanggal: 'Baru saja'
      });
    }

    setReviewModalOpen(false);
  }

  return (
    <div className="max-w-[1240px] w-full mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Riwayat Peminjaman Buku
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Daftar seluruh buku yang telah selesai Anda pinjam dan kembalikan di Perpustakaan Mini.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setFilterStatus('Semua')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filterStatus === 'Semua'
                ? 'bg-[#134e48] text-white shadow-xs'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('Tepat Waktu')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filterStatus === 'Tepat Waktu'
                ? 'bg-[#134e48] text-white shadow-xs'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            Tepat Waktu
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('Denda Diselesaikan')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filterStatus === 'Denda Diselesaikan'
                ? 'bg-[#134e48] text-white shadow-xs'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            Denda Diselesaikan
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari riwayat buku..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 border-0 focus:ring-2 focus:ring-[#134e48] text-xs text-slate-800 placeholder-slate-400 font-medium outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6 font-bold w-[160px]" scope="col">KODE PINJAM</th>
                <th className="py-4 px-6 font-bold w-[250px]" scope="col">JUDUL BUKU & PENULIS</th>
                <th className="py-4 px-6 font-bold w-[130px]" scope="col">TGL PINJAM</th>
                <th className="py-4 px-6 font-bold w-[130px]" scope="col">TGL KEMBALI</th>
                <th className="py-4 px-6 font-bold w-[240px]" scope="col">STATUS PENGEMBALIAN</th>
                <th className="py-4 px-6 font-bold" scope="col">RATING / ULASAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const book = books.find((b) => b.id === loan.book_id) || {};
                  const existingReview = reviews.find(
                    (r) => r.book_id === loan.book_id && r.user_id === currentUser?.id
                  );

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-6 px-6 align-middle">
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          {loan.kode_pinjam || loan.id}
                        </span>
                      </td>

                      <td className="py-6 px-6 align-middle">
                        <div>
                          <h4 className="font-bold text-slate-800 text-[14px] leading-snug">
                            {book.judul || 'Buku Perpustakaan'}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {book.penulis}
                          </p>
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded bg-emerald-50 text-[#144e43] text-[10px] font-semibold tracking-wide">
                            {book.kategori}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-6 align-middle text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {loan.tgl_pinjam}
                      </td>

                      <td className="py-6 px-6 align-middle text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {loan.tgl_kembali || loan.batas_kembali}
                      </td>

                      <td className="py-6 px-6 align-middle">
                        {loan.denda > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3e2] text-[#b45309] text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Terlambat (Denda Rp {loan.denda.toLocaleString('id-ID')} - {loan.status_denda || 'Lunas'})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f7ee] text-[#168a48] text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Tepat Waktu</span>
                          </span>
                        )}
                      </td>

                      <td className="py-6 px-6 align-middle">
                        {existingReview ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex text-amber-400 gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= existingReview.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-200 fill-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-slate-800">
                                {Number(existingReview.rating).toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs italic text-slate-500 mt-1 line-clamp-2">
                              "{existingReview.komentar}"
                            </p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReviewModal(book)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#134e48] hover:bg-[#0e3b37] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Beri Ulasan</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Belum ada riwayat peminjaman yang selesai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Beri Ulasan Buku"
        maxWidth="max-w-2xl"
      >
        {selectedBookForReview && (
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div
                className={`w-14 h-18 rounded-md ${
                  selectedBookForReview.cover_color || 'bg-[#194c40]'
                } flex flex-col justify-between p-2 shrink-0 text-white shadow-inner`}
              >
                <BookOpen className="w-4 h-4 text-white/70" />
                <span className="text-[7px] uppercase tracking-wide truncate">
                  {selectedBookForReview.kategori}
                </span>
              </div>
              <div>
                <span className="inline-block text-[11px] font-medium bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-1">
                  {selectedBookForReview.kategori}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedBookForReview.judul}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Penulis: <span className="text-slate-700 font-medium">{selectedBookForReview.penulis}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 py-6 px-4 text-center">
              <span className="inline-block bg-[#dbefe8] text-[#144e43] text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-2">
                Penilaian Buku
              </span>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Bagaimana pengalaman membacamu?
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Ketuk bintang untuk memberikan nilai kepuasan pada buku ini
              </p>

              <div className="flex justify-center items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      star <= selectedRating
                        ? 'bg-amber-50 border-2 border-amber-400 text-amber-400 shadow-2xs scale-105'
                        : 'bg-white border border-slate-200 text-slate-300 hover:border-amber-200'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= selectedRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2" htmlFor="review-input">
                Tulis Ulasan Anda <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="review-input"
                rows={4}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Bagikan pendapatmu tentang isi buku, gaya penulisan, atau bab favorit yang paling berkesan..."
                className="w-full rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 p-3.5 focus:border-[#144e43] focus:ring-1 focus:ring-[#144e43] outline-none resize-y"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#144e43] hover:bg-[#0f3c34] rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ulasan Buku</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

