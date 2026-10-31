import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    termsAgreed: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!formData.nama.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!formData.termsAgreed) {
      setError('Anda harus menyetujui Syarat & Ketentuan layanan perpustakaan.');
      return;
    }

    const initials = formData.nama
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'UB';

    const newUser = {
      id: 'U' + Date.now().toString().slice(-4),
      nama: formData.nama.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'user',
      genres: [],
      avatarInitials: initials
    };

    if (onRegister) {
      onRegister(newUser);
    }

    navigate('/onboarding');
  }

  return (
    <div className="min-h-screen bg-[#F2F7F4] flex flex-col items-center justify-center p-6 text-slate-800 antialiased">
      <main className="w-full max-w-[460px] flex flex-col items-center my-auto py-8">
        <header className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-[#0F5B46] rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm">
            <BookOpen className="w-7 h-7 stroke-[2]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F5B46] mb-1">
            Perpustakaan Mini
          </h1>
          <p className="text-sm leading-relaxed text-slate-500 max-w-[340px]">
            Daftar untuk mulai meminjam buku & mengakses layanan perpustakaan umum
          </p>
        </header>

        <div className="w-full bg-white rounded-2xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 p-8 sm:p-10 mb-6">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="nama">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0F5B46] focus:ring-1 focus:ring-[#0F5B46] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="email">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0F5B46] focus:ring-1 focus:ring-[#0F5B46] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="password">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 karakter"
                  className="w-full rounded-xl border border-slate-300 pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0F5B46] focus:ring-1 focus:ring-[#0F5B46] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="passwordConfirmation">
                Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  className="w-full rounded-xl border border-slate-300 pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0F5B46] focus:ring-1 focus:ring-[#0F5B46] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start pt-2">
              <input
                id="terms"
                name="termsAgreed"
                type="checkbox"
                checked={formData.termsAgreed}
                onChange={handleChange}
                className="h-4 w-4 mt-0.5 rounded border-slate-300 text-[#0F5B46] focus:ring-[#0F5B46] cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2.5 text-xs text-slate-600 select-none">
                Saya menyetujui Ketentuan Keanggotaan Perpustakaan Mini (Maksimal 1 peminjaman per judul buku).
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0F5B46] hover:bg-[#0b4736] transition-colors shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Anggota Baru</span>
              </button>
            </div>
          </form>
        </div>

        <footer className="text-center text-sm text-slate-600">
          Sudah memiliki akun?{' '}
          <Link
            to="/login"
            className="font-bold text-[#0F5B46] hover:text-[#0b4736] ml-1 transition-colors"
          >
            Masuk ke Akun
          </Link>
        </footer>
      </main>
    </div>
  );
}
