import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Eye, BookOpen, AlertCircle } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function KelolaBuku({ books = [], onDeleteBook }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState(null);

  const navigate = useNavigate();

  const totalJudul = books.length;
  const bukuTersedia = books.filter((b) => b.stok_tersedia > 0).length;
  const sedangDipinjam = books.reduce((acc, b) => acc + (b.stok_total - b.stok_tersedia), 0);
  const perluRestok = books.filter((b) => b.stok_tersedia === 0).length;

  const categories = [
    'Semua Kategori',
    'Sastra & Novel',
    'Sastra & Fiksi',
    'Teknologi & IT',
    'Sains & Alam',
    'Non-Fiksi',
    'Biografi & Sastra',
    'Bisnis & Manajemen'
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      book.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.rak.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua Kategori' ||
      book.kategori.toLowerCase().includes(selectedCategory.toLowerCase());

    let matchesStatus = true;
    if (selectedStatus === 'Tersedia') {
      matchesStatus = book.stok_tersedia > 0;
    } else if (selectedStatus === 'Habis Dipinjam') {
      matchesStatus = book.stok_tersedia === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function handleDeleteConfirm() {
    if (bookToDelete && onDeleteBook) {
      onDeleteBook(bookToDelete.id);
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  }

  function handleOpenDetail(book) {
    setSelectedBookDetail(book);
    setDetailModalOpen(true);
  }

  return (
    <main className="flex-1 overflow-x-hidden p-8 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" data-purpose="header-section">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase mb-1">
            Katalog & Inventaris
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kelola Katalog Buku
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tambah, edit, dan perbarui data ketersediaan buku perpustakaan.
          </p>
        </div>

        <div>
          <Link
            to="/admin/buku/tambah"
            className="inline-flex items-center space-x-2 bg-[#1A4D44] hover:bg-[#133D36] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Buku Baru</span>
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-purpose="metrics-summary">
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Total Judul Buku</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalJudul}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Buku Tersedia</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{bukuTersedia}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Eksemplar Dipinjam</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">{sedangDipinjam}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Perlu Restok (Habis)</span>
          <div className="text-2xl font-bold text-rose-500 mt-2">{perluRestok}</div>
        </div>
      </section>

      <section className="bg-white p-3.5 rounded-xl border border-slate-200 mb-6 shadow-2xs" data-purpose="filter-bar">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari buku berdasarkan judul, kategori, atau penulis"
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1A4D44] focus:border-[#1A4D44] text-slate-700 bg-slate-50/50"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-100/70 border-0 text-slate-700 text-xs font-medium py-2 pl-3.5 pr-8 rounded-lg cursor-pointer hover:bg-slate-200/60 focus:ring-0"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-100/70 border-0 text-slate-700 text-xs font-medium py-2 pl-3.5 pr-8 rounded-lg cursor-pointer hover:bg-slate-200/60 focus:ring-0"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Habis Dipinjam">Habis Dipinjam</option>
          </select>

          <div className="hidden xl:flex items-center space-x-2 pl-2 border-l border-slate-200 text-xs text-slate-400">
            <span className="font-normal text-slate-400">Filter cepat:</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('Sastra & Novel')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium text-xs transition-colors"
            >
              Novel
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('Teknologi & IT')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium text-xs transition-colors"
            >
              Teknologi
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('Sains & Alam')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium text-xs transition-colors"
            >
              Sains
            </button>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden" data-purpose="book-inventory-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/70">
                <th className="py-3.5 px-4 text-center w-12" scope="col">NO</th>
                <th className="py-3.5 px-4 text-center" scope="col">KODE BUKU</th>
                <th className="py-3.5 px-6" scope="col">JUDUL BUKU & PENULIS</th>
                <th className="py-3.5 px-4 text-center" scope="col">KATEGORI</th>
                <th className="py-3.5 px-4" scope="col">LOKASI RAK</th>
                <th className="py-3.5 px-4 text-center" scope="col">STOK (TOTAL / TERSEDIA)</th>
                <th className="py-3.5 px-4 text-center" scope="col">STATUS</th>
                <th className="py-3.5 px-6 text-center" scope="col">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, idx) => {
                  const isOutOfStock = book.stok_tersedia === 0;

                  return (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 text-center font-medium text-slate-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                          {book.kode || `BK - ${idx + 1}`}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 leading-snug">
                          {book.judul}
                        </div>
                        <div className="text-xs text-slate-400 font-normal">
                          {book.penulis} • {book.tahun}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium leading-tight">
                          {book.kategori}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-normal text-xs">
                        {book.rak}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-md px-2.5 py-1 text-xs">
                          <span className="text-slate-500">
                            Total: <strong className="text-slate-700">{book.stok_total}</strong>
                          </span>
                          <span className="mx-1.5 text-slate-300">|</span>
                          <span className={isOutOfStock ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
                            Ada: {book.stok_tersedia}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                            Habis Dipinjam
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
                            Tersedia
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-3 text-xs">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(book)}
                            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            Detail
                          </button>
                          <Link
                            to={`/admin/buku/edit/${book.id}`}
                            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setBookToDelete(book);
                              setDeleteModalOpen(true);
                            }}
                            className="flex items-center text-rose-500 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-500" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    Tidak ada buku yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus Buku"
      >
        <div className="py-2">
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs mb-4">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>
              Tindakan ini akan menghapus buku <strong>"{bookToDelete?.judul}"</strong> dari katalog perpustakaan.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Hapus Buku Sekarang
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Detail Buku Katalog"
        maxWidth="max-w-xl"
      >
        {selectedBookDetail && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4">
              <div className={`w-14 h-20 ${selectedBookDetail.cover_color || 'bg-[#165B4C]'} rounded-lg shrink-0 flex items-center justify-center text-white`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedBookDetail.kategori}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedBookDetail.judul}</h3>
                <p className="text-slate-500 mt-0.5">{selectedBookDetail.penulis} • Tahun {selectedBookDetail.tahun}</p>
                <p className="text-slate-500 font-mono mt-0.5">Kode: {selectedBookDetail.kode || selectedBookDetail.id} | Rak: {selectedBookDetail.rak}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Stok Total</span>
                <span className="font-bold text-sm text-slate-900">{selectedBookDetail.stok_total} Buku</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Stok Tersedia</span>
                <span className="font-bold text-sm text-emerald-700">{selectedBookDetail.stok_tersedia} Buku</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Jumlah Halaman</span>
                <span className="font-bold text-sm text-slate-900">{selectedBookDetail.halaman || '350'} Hal</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Sinopsis:</h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedBookDetail.sinopsis}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

