import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import BookCard from '../../components/book/BookCard';
import dummyData from '../../data/dummyData.json';

export default function Beranda({
  currentUser,
  books = [],
  loans = [],
  events = [],
  borrowedBookIds = [],
  onBorrowBook
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const navigate = useNavigate();

  const userActiveLoans = loans.filter(
    (l) =>
      l.user_id === currentUser?.id &&
      ['Menunggu Persetujuan', 'Sedang Dipinjam', 'Terlambat', 'Menunggu Pengembalian'].includes(l.status)
  );

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];

  const userGenreIds = currentUser?.genres || [];
  const genreIdToName = {};
  (dummyData.availableGenres || []).forEach((g) => {
    genreIdToName[g.id] = g.nama;
  });
  const userGenreNames = userGenreIds.map((gid) => genreIdToName[gid] || gid);
  const hasGenrePrefs = userGenreNames.length > 0;
  const recommendedBooks = hasGenrePrefs
    ? books.filter((b) => userGenreNames.includes(b.kategori)).slice(0, 4)
    : books.slice(0, 4);
  const latestBooks = [...books].sort((a, b) => b.tahun - a.tahun).slice(0, 4);
  const popularBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const categories = ['Semua', 'Novel', 'Teknologi', 'Sains', 'Sejarah', 'Anak'];

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/katalog');
    }
  }

  function handleCategoryClick(cat) {
    setSelectedCategory(cat);
    if (cat === 'Semua') {
      navigate('/katalog');
    } else {
      navigate(`/katalog?cat=${encodeURIComponent(cat)}`);
    }
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 py-8 space-y-10">
      <section className="bg-[#EDF5F2] rounded-2xl p-8 lg:p-10 shadow-xs" data-purpose="hero-search">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Halo, {currentUser?.nama || 'Pengguna'}!<br />
          Mau baca apa hari ini?
        </h1>
        <p className="text-gray-500 text-sm mt-3 mb-6">
          Telusuri koleksi perpustakaan, pinjam dari rumah, dan ambil bukunya kapan saja.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative max-w-4xl bg-white rounded-xl shadow-xs border border-gray-200 flex items-center p-1.5 focus-within:ring-2 focus-within:ring-[#114B3E] focus-within:border-[#114B3E] transition-all">
          <div className="pl-3.5 pr-2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm border-0 focus:ring-0 text-gray-700 placeholder-gray-400 py-2.5 px-1 bg-transparent outline-none"
            placeholder="Cari judul, penulis, atau kategori..."
          />
          <button
            type="submit"
            className="bg-[#114B3E] hover:bg-[#0c382e] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap ml-2"
          >
            Cari buku
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2.5 mt-5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#114B3E] text-white font-semibold shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {featuredEvent && (
        <section
          className="bg-[#114B3E] text-white rounded-2xl p-8 lg:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          data-purpose="event-promo-banner"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 text-amber-200 text-xs font-semibold uppercase tracking-wider">
              <span>Agenda Unggulan</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {featuredEvent.judul}
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              {featuredEvent.deskripsi}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-emerald-200/90 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{featuredEvent.tanggal}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{featuredEvent.waktu}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{featuredEvent.lokasi}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{featuredEvent.terdaftar || 0} dari {featuredEvent.kuota} kursi terisi</span>
              </div>
            </div>
          </div>

          <div>
            <Link
              to="/event"
              className="inline-block bg-[#E67E22] hover:bg-amber-600 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap text-center"
            >
              Daftar event
            </Link>
          </div>
        </section>
      )}

      <section data-purpose="borrowed-books">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Sedang kamu pinjam</h3>
          <Link
            to="/peminjaman"
            className="text-xs font-semibold text-[#114B3E] hover:underline"
          >
            {userActiveLoans.length} Buku Aktif
          </Link>
        </div>

        {userActiveLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userActiveLoans.map((loan) => {
              const book = books.find((b) => b.id === loan.book_id) || {};
              const isOverdue = loan.status === 'Terlambat';
              return (
                <div
                  key={loan.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-12 h-14 ${
                        book.cover_color || 'bg-[#165B4C]'
                      } rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold`}
                    >
                      <BookOpen className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {book.judul || 'Buku Perpustakaan'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Batas: {loan.batas_kembali} •{' '}
                        <span
                          className={`font-semibold ${
                            isOverdue ? 'text-red-500' : 'text-emerald-700'
                          }`}
                        >
                          {loan.status}
                          {loan.denda > 0 && ` (Denda: Rp ${loan.denda.toLocaleString('id-ID')})`}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/peminjaman"
                    className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Detail Status
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-2xs">
            <p className="text-sm text-slate-500">
              Kamu sedang tidak meminjam buku saat ini.
            </p>
            <Link
              to="/katalog"
              className="inline-block mt-2 text-xs font-semibold text-[#114B3E] hover:underline"
            >
              Jelajahi Katalog Buku &rarr;
            </Link>
          </div>
        )}
      </section>

      <section data-purpose="recommended-books">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">
            {hasGenrePrefs ? 'Rekomendasi berdasarkan preferensimu' : 'Rekomendasi Untukmu'}
          </h3>
          <Link to="/katalog" className="text-xs font-semibold text-[#114B3E] hover:underline">
            Lihat semua
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isBorrowed={borrowedBookIds.some((bid) => String(bid) === String(book.id))}
              onBorrow={() => onBorrowBook && onBorrowBook(book)}
              onViewDetail={(id) => navigate(`/buku/${id}`)}
            />
          ))}
        </div>
      </section>

      <section data-purpose="latest-books">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">Buku terbaru</h3>
          <Link to="/katalog" className="text-xs font-semibold text-[#114B3E] hover:underline">
            Lihat semua buku
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isBorrowed={borrowedBookIds.some((bid) => String(bid) === String(book.id))}
              onBorrow={() => onBorrowBook && onBorrowBook(book)}
              onViewDetail={(id) => navigate(`/buku/${id}`)}
            />
          ))}
        </div>
      </section>

      <section data-purpose="most-borrowed-books">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">Paling sering dipinjam</h3>
          <Link to="/katalog" className="text-xs font-semibold text-[#114B3E] hover:underline">
            Lihat peringkat
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isBorrowed={borrowedBookIds.some((bid) => String(bid) === String(book.id))}
              onBorrow={() => onBorrowBook && onBorrowBook(book)}
              onViewDetail={(id) => navigate(`/buku/${id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
