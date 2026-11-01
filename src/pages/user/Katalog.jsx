import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, BookOpen, ArrowUpDown } from 'lucide-react';
import BookCard from '../../components/book/BookCard';

export default function Katalog({
  books = [],
  borrowedBookIds = [],
  onBorrowBook
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
    const cat = searchParams.get('cat');
    if (cat !== null) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    'Semua',
    'Teknologi & IT',
    'Sastra & Novel',
    'Sastra & Fiksi',
    'Sains & Alam',
    'Bisnis & Manajemen',
    'Non-Fiksi',
    'Biografi & Sastra'
  ];

  const statuses = [
    { label: 'Semua Status', value: 'Semua' },
    { label: 'Hanya Tersedia', value: 'Tersedia' },
    { label: 'Sedang Dipinjam / Habis', value: 'Habis' }
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      book.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.rak.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ||
      book.kategori.toLowerCase().includes(selectedCategory.toLowerCase());

    let matchesStatus = true;
    if (selectedStatus === 'Tersedia') {
      matchesStatus = book.stok_tersedia > 0 && book.status === 'Tersedia';
    } else if (selectedStatus === 'Habis') {
      matchesStatus = book.stok_tersedia <= 0 || book.status === 'Habis';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'terbaru') return b.tahun - a.tahun;
    if (sortBy === 'judul') return a.judul.localeCompare(b.judul);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'stok') return b.stok_tersedia - a.stok_tersedia;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 mb-8" data-purpose="hero-search-card">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wider uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Koleksi Komunitas</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3">
            Katalog Perpustakaan
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Temukan lebih dari 1.200 koleksi buku fisik dan literatur umum yang siap dipinjam.
          </p>

          <div className="relative flex items-center max-w-xl mx-auto mb-7 border border-slate-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-[#114B3E] focus-within:border-transparent transition-all shadow-sm">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, penulis, atau rak..."
              className="w-full text-sm border-0 focus:ring-0 text-slate-700 placeholder:text-slate-400 bg-transparent py-1.5 px-0 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              className="bg-[#174e43] hover:bg-[#103d34] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
            >
              Cari buku
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-xs font-medium">
            <span className="text-slate-700 font-bold uppercase tracking-wider text-[11px] mr-1">
              KATEGORI:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#174e43] text-white shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                {cat === 'Semua' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
            <span className="text-slate-700 font-bold uppercase tracking-wider text-[11px] mr-1">
              STATUS:
            </span>
            {statuses.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSelectedStatus(s.value)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  selectedStatus === s.value
                    ? 'bg-[#174e43] text-white shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section data-purpose="book-catalog">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Daftar Buku</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#144f44]">
              {sortedBooks.length} Buku Ditampilkan
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-semibold text-slate-800 bg-transparent border-0 focus:ring-0 p-0 text-xs cursor-pointer outline-none"
            >
              <option value="terbaru">Terbaru Ditambahkan</option>
              <option value="judul">Judul (A-Z)</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="stok">Stok Terbanyak</option>
            </select>
          </div>
        </div>

        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isBorrowed={borrowedBookIds.some((bid) => String(bid) === String(book.id))}
                onBorrow={() => onBorrowBook && onBorrowBook(book)}
                onViewDetail={(id) => navigate(`/buku/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Tidak Ada Buku yang Cocok
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Coba gunakan kata kunci lain atau ubah filter kategori dan status di atas.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setSelectedStatus('Semua');
              }}
              className="text-xs font-semibold text-[#174e43] hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
