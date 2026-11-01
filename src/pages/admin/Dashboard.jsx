import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  Plus,
  Calendar,
  Clock
} from 'lucide-react';

export default function Dashboard({
  books = [],
  loans = [],
  users = []
}) {
  const totalJudul = books.length;
  const categoriesCount = new Set(books.map((b) => b.kategori)).size;

  const totalDipinjam = loans.filter((l) =>
    ['Sedang Dipinjam', 'Menunggu Persetujuan', 'Menunggu Pengembalian'].includes(l.status)
  ).length;

  const totalTerlambat = loans.filter((l) => l.status === 'Terlambat').length;
  const totalAnggota = users.filter((u) => u.role === 'user').length;

  const recentLoans = [...loans].slice(0, 5);

  return (
    <main className="p-8 lg:p-10 space-y-7 max-w-7xl w-full">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dashboard Ringkasan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Selamat datang di Panel Administrasi Perpustakaan Mini Umum.
        </p>
      </div>

      <section aria-label="Statistik Perpustakaan" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            TOTAL JUDUL BUKU
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalJudul}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{categoriesCount} kategori aktif</span>
          </div>
        </article>

        <article className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            SEDANG DIPINJAM
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalDipinjam}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Buku di tangan anggota</span>
          </div>
        </article>

        <article className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            PEMINJAMAN TERLAMBAT
          </p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{totalTerlambat}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Perlu konfirmasi denda/pengembalian</span>
          </div>
        </article>

        <article className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            TOTAL ANGGOTA TERDAFTAR
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalAnggota}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
            <span>Pengguna perpustakaan aktif</span>
          </div>
        </article>
      </section>

      <section aria-label="Aksi Cepat" className="flex flex-wrap items-center gap-4 pt-1">
        <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          AKSI CEPAT:
        </span>
        <Link
          to="/admin/buku/tambah"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1c5544] hover:bg-[#154336] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Buku Baru</span>
        </Link>
        <Link
          to="/admin/event"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Kelola Event</span>
        </Link>
        <Link
          to="/admin/peminjaman"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4 text-slate-500" />
          <span>Kelola Peminjaman & Denda</span>
        </Link>
      </section>

      <section className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="w-4 h-4 text-[#1c5544]" />
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">
              Peminjaman Terkini Hari Ini
            </h3>
          </div>
          <Link
            to="/admin/peminjaman"
            className="text-xs font-semibold text-[#1c5544] hover:underline"
          >
            Lihat Semua Peminjaman &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-400 tracking-wider bg-slate-50/50">
                <th className="py-3 px-6 font-semibold" scope="col">NAMA ANGGOTA</th>
                <th className="py-3 px-6 font-semibold" scope="col">JUDUL BUKU</th>
                <th className="py-3 px-6 font-semibold" scope="col">TGL PINJAM</th>
                <th className="py-3 px-6 font-semibold text-center" scope="col">STATUS</th>
                <th className="py-3 px-6 font-semibold text-right" scope="col">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {recentLoans.map((loan) => {
                const borrower = users.find((u) => u.id === loan.user_id) || {};
                const book = books.find((b) => b.id === loan.book_id) || {};

                return (
                  <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {borrower.avatarInitials || 'AG'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {borrower.nama || 'Anggota'}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {borrower.email || loan.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      {book.judul || 'Buku Perpustakaan'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-normal">
                      {loan.tgl_pinjam}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {loan.status === 'Terlambat' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Terlambat
                        </span>
                      ) : loan.status === 'Selesai' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Selesai
                        </span>
                      ) : loan.status === 'Menunggu Persetujuan' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Menunggu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to="/admin/peminjaman"
                        className="text-xs font-normal text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-md transition-colors"
                      >
                        Kelola
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
