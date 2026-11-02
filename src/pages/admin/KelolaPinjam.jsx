import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  DollarSign,
  XCircle
} from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function KelolaPinjam({
  loans = [],
  books = [],
  users = [],
  onApproveLoan,
  onRejectLoan,
  onConfirmReturn,
  onPayFine
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const [actionModal, setActionModal] = useState({ open: false, title: '', message: '', icon: 'success' });

  const [rejectModal, setRejectModal] = useState({ open: false, loanId: null });

  const filteredLoans = loans.filter((loan) => {
    const borrower = users.find((u) => u.id === loan.user_id) || {};
    const book = books.find((b) => b.id === loan.book_id) || {};

    const matchesSearch =
      searchQuery.trim() === '' ||
      (borrower.nama && borrower.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (borrower.email && borrower.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.judul && book.judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Semua' || loan.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    semua: loans.length,
    menunggu: loans.filter((l) => l.status === 'Menunggu Persetujuan').length,
    aktif: loans.filter((l) => l.status === 'Sedang Dipinjam').length,
    terlambat: loans.filter((l) => l.status === 'Terlambat').length,
    menungguKembali: loans.filter((l) => l.status === 'Menunggu Pengembalian').length,
    selesai: loans.filter((l) => l.status === 'Selesai').length
  };

  const statusTabs = [
    { label: 'Semua', value: 'Semua', count: statusCounts.semua },
    { label: 'Menunggu Persetujuan', value: 'Menunggu Persetujuan', count: statusCounts.menunggu },
    { label: 'Sedang Dipinjam', value: 'Sedang Dipinjam', count: statusCounts.aktif },
    { label: 'Terlambat', value: 'Terlambat', count: statusCounts.terlambat },
    { label: 'Menunggu Pengembalian', value: 'Menunggu Pengembalian', count: statusCounts.menungguKembali },
    { label: 'Selesai', value: 'Selesai', count: statusCounts.selesai }
  ];

  function handleApprove(loanId) {
    if (onApproveLoan) {
      onApproveLoan(loanId);
      setActionModal({
        open: true,
        icon: 'success',
        title: 'Peminjaman Disetujui',
        message: 'Permohonan peminjaman disetujui. Anggota dapat mengambil buku di perpustakaan. Status diperbarui ke "Sedang Dipinjam".'
      });
    }
  }

  function handleRejectConfirm() {
    if (rejectModal.loanId && onRejectLoan) {
      onRejectLoan(rejectModal.loanId);
      setRejectModal({ open: false, loanId: null });
      setActionModal({
        open: true,
        icon: 'warning',
        title: 'Peminjaman Ditolak',
        message: 'Permohonan peminjaman ditolak dan stok buku dikembalikan ke inventaris.'
      });
    }
  }

  function handleConfirmReturn(loanId) {
    if (onConfirmReturn) {
      onConfirmReturn(loanId);
      setActionModal({
        open: true,
        icon: 'success',
        title: 'Pengembalian Buku Terkonfirmasi',
        message: 'Buku telah diterima kembali oleh perpustakaan. Stok buku otomatis bertambah dan status peminjaman menjadi "Selesai".'
      });
    }
  }

  function handleSettleFine(loanId) {
    if (onPayFine) {
      onPayFine(loanId);
      setActionModal({
        open: true,
        icon: 'success',
        title: 'Denda Keterlambatan Lunas',
        message: 'Denda peminjaman berhasil dicatat sebagai lunas.'
      });
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'Menunggu Persetujuan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Menunggu Persetujuan
          </span>
        );
      case 'Terlambat':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Terlambat
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <CheckCircle className="w-3 h-3" />
            Selesai
          </span>
        );
      case 'Menunggu Pengembalian':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <RotateCcw className="w-3 h-3" />
            Menunggu Pengembalian
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-400 border border-rose-100">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Sedang Dipinjam
          </span>
        );
    }
  }

  return (
    <main className="p-8 lg:p-10 max-w-7xl w-full">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase mb-1">
            Sirkulasi & Transaksi
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kelola Peminjaman Buku
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Persetujuan peminjaman baru → konfirmasi pengembalian fisik → selesai.
          </p>
        </div>
      </header>

      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedStatus === tab.value
                  ? 'bg-[#1c5544] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama anggota, email, judul buku, atau ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1c5544] focus:border-[#1c5544] text-slate-700 bg-slate-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/70">
                <th className="py-3.5 px-6" scope="col">ID & ANGGOTA</th>
                <th className="py-3.5 px-6" scope="col">BUKU YANG DIPINJAM</th>
                <th className="py-3.5 px-4" scope="col">TGL PINJAM</th>
                <th className="py-3.5 px-4" scope="col">BATAS KEMBALI</th>
                <th className="py-3.5 px-4 text-center" scope="col">STATUS</th>
                <th className="py-3.5 px-4" scope="col">DENDA</th>
                <th className="py-3.5 px-6 text-right" scope="col">AKSI PETUGAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const borrower = users.find((u) => u.id === loan.user_id) || {};
                  const book = books.find((b) => b.id === loan.book_id) || {};

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {borrower.avatarInitials || '?'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {borrower.nama || 'Anggota'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {borrower.email || loan.user_id}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {loan.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 block leading-snug">
                          {book.judul || 'Buku Perpustakaan'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {book.penulis} • {book.rak}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {loan.tgl_pinjam}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {loan.batas_kembali}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(loan.status)}
                      </td>

                      <td className="py-4 px-4 font-medium">
                        {loan.denda > 0 ? (
                          <span className="text-rose-600 font-bold">
                            Rp {loan.denda.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">Rp 0</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {loan.status === 'Menunggu Persetujuan' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(loan.id)}
                                className="px-3 py-1.5 bg-[#1c5544] hover:bg-[#154336] text-white font-semibold rounded-lg text-xs transition"
                              >
                                Setujui
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectModal({ open: true, loanId: loan.id })}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {['Sedang Dipinjam', 'Terlambat'].includes(loan.status) && (
                            <>
                              {loan.denda > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSettleFine(loan.id)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg text-xs transition flex items-center gap-1"
                                  title="Lunaskan Denda"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  <span>Lunaskan</span>
                                </button>
                              )}
                              <span className="text-slate-400 text-xs italic">
                                Menunggu anggota ajukan kembali
                              </span>
                            </>
                          )}

                          {loan.status === 'Menunggu Pengembalian' && (
                            <>
                              {loan.denda > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSettleFine(loan.id)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg text-xs transition flex items-center gap-1"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  <span>Lunaskan</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleConfirmReturn(loan.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Konfirmasi Kembali</span>
                              </button>
                            </>
                          )}

                          {loan.status === 'Selesai' && (
                            <span className="text-slate-400 text-xs italic">Arsip Selesai</span>
                          )}

                          {loan.status === 'Ditolak' && (
                            <span className="text-rose-400 text-xs italic">Ditolak</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada data peminjaman yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, loanId: null })}
        title="Tolak Permohonan Peminjaman"
      >
        <div className="py-2">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6" />
          </div>
          <p className="text-xs text-center text-slate-600 mb-6">
            Apakah Anda yakin ingin menolak permohonan peminjaman ini? Stok buku akan otomatis dikembalikan.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setRejectModal({ open: false, loanId: null })}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleRejectConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
            >
              Ya, Tolak Permohonan
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ ...actionModal, open: false })}
        title={actionModal.title}
      >
        <div className="text-center py-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            actionModal.icon === 'success'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-600 mb-6">{actionModal.message}</p>
          <button
            type="button"
            onClick={() => setActionModal({ ...actionModal, open: false })}
            className="px-5 py-2 bg-[#1c5544] text-white text-xs font-semibold rounded-lg"
          >
            Tutup
          </button>
        </div>
      </Modal>
    </main>
  );
}
