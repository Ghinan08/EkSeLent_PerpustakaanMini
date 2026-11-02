import React, { useState } from 'react';
import { Search, Shield, User, Eye, Users, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function KelolaUser({ users = [], onChangeRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('Semua');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  const totalPengguna = users.length;
  const totalUser = users.filter((u) => u.role === 'user').length;
  const totalAdmin = users.filter((u) => u.role === 'admin').length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === 'Semua' ||
      (filterRole === 'Pengguna' && u.role === 'user') ||
      (filterRole === 'Admin' && u.role === 'admin');

    return matchesSearch && matchesRole;
  });

  function handleOpenDetail(user) {
    setSelectedUserDetail(user);
    setDetailModalOpen(true);
  }

  function handleOpenEditRole(user) {
    setUserToEditRole(user);
    setNewRole(user.role);
    setRoleModalOpen(true);
  }

  function handleSaveRole() {
    if (userToEditRole && onChangeRole) {
      onChangeRole(userToEditRole.id, newRole);
    }
    setRoleModalOpen(false);
    setUserToEditRole(null);
  }

  return (
    <main className="flex-1 overflow-x-hidden p-8 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" data-purpose="header-section">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase mb-1">
            Manajemen Akun
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lihat daftar akun terdaftar dan kelola hak akses peran pengguna perpustakaan.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8" data-purpose="metrics-summary">
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Total Pengguna Terdaftar</span>
          <div className="text-2xl font-bold text-slate-900 mt-2 flex items-center justify-between">
            <span>{totalPengguna}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Pengguna (User Publik)</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2 flex items-center justify-between">
            <span>{totalUser}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Administrator</span>
          <div className="text-2xl font-bold text-amber-600 mt-2 flex items-center justify-between">
            <span>{totalAdmin}</span>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID, nama, atau email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4D44] focus:border-[#1A4D44]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['Semua', 'Pengguna', 'Admin'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                filterRole === role
                  ? 'bg-[#1A4D44] text-white border-[#1A4D44] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">ID Akun</th>
                <th className="py-3.5 px-4">Nama Pengguna</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Peran (Role)</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isAdminRole = u.role === 'admin';
                  const initials = u.avatarInitials || u.avatar || u.nama?.charAt(0) || 'U';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                        {u.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#114B3E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <span>{u.nama}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {isAdminRole ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Shield className="w-3 h-3 text-amber-600" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <User className="w-3 h-3 text-emerald-600" />
                            User
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(u)}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditRole(u)}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[#1A4D44] hover:bg-[#133D36] text-white font-medium transition-colors shadow-xs"
                          >
                            Ganti Role
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                    Tidak ada akun pengguna yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Detail Informasi Akun Pengguna"
        maxWidth="max-w-md"
      >
        {selectedUserDetail && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#114B3E] text-white flex items-center justify-center text-xl font-bold shadow-xs shrink-0">
                {selectedUserDetail.avatarInitials || selectedUserDetail.avatar || selectedUserDetail.nama?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedUserDetail.nama}
                </h3>
                <p className="text-slate-500 mt-0.5">{selectedUserDetail.email}</p>
                <div className="mt-1">
                  {selectedUserDetail.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                      <Shield className="w-3 h-3" />
                      Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      <User className="w-3 h-3" />
                      Anggota Perpustakaan
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">ID Pengguna</span>
                <span className="font-mono font-bold text-slate-800">{selectedUserDetail.id}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Nama Lengkap</span>
                <span className="font-semibold text-slate-800">{selectedUserDetail.nama}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Alamat Email</span>
                <span className="text-slate-800">{selectedUserDetail.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Peran Akses</span>
                <span className="font-bold capitalize text-slate-800">{selectedUserDetail.role}</span>
              </div>
              <div className="py-1.5">
                <span className="text-slate-400 font-medium block mb-1.5">Preferensi Minat Baca:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUserDetail.genres && selectedUserDetail.genres.length > 0 ? (
                    selectedUserDetail.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Belum ada preferensi yang dipilih</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title="Ubah Peran (Role) Pengguna"
        maxWidth="max-w-md"
      >
        {userToEditRole && (
          <div className="space-y-4 text-xs text-slate-700">
            <p className="text-slate-600">
              Pilih peran baru untuk akun <strong>{userToEditRole.nama}</strong> ({userToEditRole.email}):
            </p>

            <div className="space-y-2.5">
              <div
                onClick={() => setNewRole('user')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  newRole === 'user'
                    ? 'border-[#1A4D44] bg-[#1A4D44]/5 ring-1 ring-[#1A4D44]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">User (Pengguna Biasa)</h4>
                    <p className="text-[11px] text-slate-500">Bisa meminjam buku, melihat riwayat, dan mendaftar event.</p>
                  </div>
                </div>
                {newRole === 'user' && (
                  <CheckCircle2 className="w-5 h-5 text-[#1A4D44]" />
                )}
              </div>

              <div
                onClick={() => setNewRole('admin')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  newRole === 'admin'
                    ? 'border-[#1A4D44] bg-[#1A4D44]/5 ring-1 ring-[#1A4D44]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">Admin (Administrator)</h4>
                    <p className="text-[11px] text-slate-500">Memiliki akses penuh mengelola buku, peminjaman, event, dan pengguna.</p>
                  </div>
                </div>
                {newRole === 'admin' && (
                  <CheckCircle2 className="w-5 h-5 text-[#1A4D44]" />
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-4 py-2 bg-[#1A4D44] hover:bg-[#133D36] text-white font-semibold rounded-lg transition-colors shadow-xs"
              >
                Simpan Perubahan Role
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
