import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function Peminjaman({
  currentUser,
  loans = [],
  books = [],
  onRequestReturn,
  onExtendLoan
}) {
  const [confirmReturnModal, setConfirmReturnModal] = useState({ open: false, loan: null });
  const [returnSuccessModal, setReturnSuccessModal] = useState(false);

  const userActiveLoans = loans.filter(
    (l) =>
      l.user_id === currentUser?.id &&
      ['Menunggu Persetujuan', 'Sedang Dipinjam', 'Terlambat', 'Menunggu Pengembalian'].includes(l.status)
  );

  function handleReturnClick(loan) {
    setConfirmReturnModal({ open: true, loan });
  }

  function handleConfirmReturn() {
    if (confirmReturnModal.loan && onRequestReturn) {
      onRequestReturn(confirmReturnModal.loan.id);
      setConfirmReturnModal({ open: false, loan: null });
      setReturnSuccessModal(true);
    }
  }

  function handleExtendClick(loan) {
    if (loan.status === 'Terlambat') {
      alert('Peminjaman yang sudah terlambat tidak dapat diperpanjang. Harap segera kembalikan buku.');
      return;
    }
    if (loan.sudahDiperpanjang) {
      alert('Buku ini sudah pernah diperpanjang sekali dan tidak bisa diperpanjang lagi.');
      return;
    }
    if (onExtendLoan) {
      onExtendLoan(loan.id);
      alert('Batas waktu peminjaman berhasil diperpanjang 7 hari!');
    }
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-10 pt-10 pb-16">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#164e3f] tracking-tight mb-2">
            Peminjaman Saya
          </h1>
          <p className="text-gray-500 text-base">
            Daftar buku yang sedang kamu pinjam dan batas waktu pengembaliannya.
          </p>
        </div>

        <div className="self-start md:self-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-xs">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span>{userActiveLoans.length} Buku Aktif</span>
          </div>
        </div>
      </section>

      {userActiveLoans.length > 0 ? (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#fcfdfd] border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase w-[32%]" scope="col">
                    Cover & Judul Buku
                  </th>
                  <th className="py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase" scope="col">
                    Tanggal Pinjam
                  </th>
                  <th className="py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase" scope="col">
                    Batas Pengembalian
                  </th>
                  <th className="py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase text-center" scope="col">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase" scope="col">
                    Denda
                  </th>
                  <th className="py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase text-right" scope="col">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userActiveLoans.map((loan) => {
                  const book = books.find((b) => b.id === loan.book_id) || {};
                  const isPending = loan.status === 'Menunggu Persetujuan';
                  const isActive = loan.status === 'Sedang Dipinjam';
                  const isOverdue = loan.status === 'Terlambat';
                  const isReturning = loan.status === 'Menunggu Pengembalian';
                  const canAct = isActive || isOverdue;

                  return (
                    <tr key={loan.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-14 ${book.cover_color || 'bg-[#1d4d3d]'
                              } rounded-md shadow-xs shrink-0 flex items-center justify-center border border-black/5`}
                          >
                            <BookOpen className="w-5 h-5 text-white/80" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">
                              {book.judul || 'Buku Perpustakaan'}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">{book.penulis}</p>
                            <p className="text-[11px] font-mono text-slate-400 mt-1">
                              ID: {loan.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6 text-sm text-gray-600 font-medium">
                        {loan.tgl_pinjam || '-'}
                      </td>

                      <td className="py-5 px-6 text-sm font-bold text-gray-900">
                        {loan.batas_kembali || '-'}
                      </td>

                      <td className="py-5 px-6 text-center">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Menunggu Persetujuan
                          </span>
                        ) : isReturning ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <RotateCcw className="w-3.5 h-3.5" />
                            Menunggu Konfirmasi Admin
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Terlambat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e6f7ec] text-[#1e7e48]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1e7e48]"></span>
                            Aktif Dipinjam
                          </span>
                        )}
                      </td>

                      <td className="py-5 px-6 text-sm font-medium">
                        {loan.denda > 0 ? (
                          <span className="text-rose-600 font-bold">
                            Rp {loan.denda.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-gray-500">Rp 0</span>
                        )}
                      </td>

                      <td className="py-5 px-6 text-right">
                        <div className="inline-flex items-center justify-end gap-2.5">
                          {canAct && !loan.sudahDiperpanjang && (
                            <button
                              type="button"
                              onClick={() => handleExtendClick(loan)}
                              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                            >
                              Perpanjang
                            </button>
                          )}
                          {canAct && (
                            <button
                              type="button"
                              onClick={() => handleReturnClick(loan)}
                              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:border-gray-300 text-[#164e3f] bg-white transition hover:bg-gray-50"
                            >
                              Ajukan Pengembalian
                            </button>
                          )}
                          {(isPending || isReturning) && (
                            <span className="text-xs text-slate-400 italic">
                              {isPending ? 'Menunggu admin...' : 'Kembalikan buku ke perpus'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#164e3f] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Tidak Ada Peminjaman Aktif</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Anda sedang tidak meminjam buku apa pun. Silakan jelajahi katalog untuk meminjam buku.
          </p>
          <Link
            to="/katalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#164e3f] hover:bg-[#113d31] text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Buka Katalog Buku</span>
          </Link>
        </section>
      )}

      <Modal
        isOpen={confirmReturnModal.open}
        onClose={() => setConfirmReturnModal({ open: false, loan: null })}
        title="Ajukan Pengembalian Buku"
      >
        <div className="py-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <p className="text-sm text-center text-slate-700 font-semibold mb-1">
            {books.find((b) => b.id === confirmReturnModal.loan?.book_id)?.judul}
          </p>
          <p className="text-xs text-center text-slate-500 mb-5 leading-relaxed">
            Setelah mengajukan pengembalian, bawa buku ke perpustakaan dan tunggu konfirmasi dari petugas. Buku baru dianggap dikembalikan setelah petugas mengonfirmasi.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmReturnModal({ open: false, loan: null })}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmReturn}
              className="px-5 py-2.5 bg-[#164e3f] hover:bg-[#113d31] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Ya, Ajukan Pengembalian
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={returnSuccessModal}
        onClose={() => setReturnSuccessModal(false)}
        title="Pengajuan Pengembalian Berhasil"
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">Pengajuan Dikirim!</h4>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Silakan bawa buku ke perpustakaan dan serahkan ke petugas. Status akan berubah menjadi <strong>Selesai</strong> setelah petugas mengonfirmasi pengembalian.
          </p>
          <button
            type="button"
            onClick={() => setReturnSuccessModal(false)}
            className="px-5 py-2.5 bg-[#164e3f] hover:bg-[#113d31] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Mengerti
          </button>
        </div>
      </Modal>
    </div>
  );
}
