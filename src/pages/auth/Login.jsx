import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function Login({ users = [], onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser) {
      setError('Email tidak terdaftar dalam sistem perpustakaan.');
      return;
    }

    if (matchedUser.password !== password) {
      setError('Kata sandi yang Anda masukkan salah.');
      return;
    }

    if (onLogin) {
      onLogin(matchedUser);
    }

    if (matchedUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-[#ebf2ef] flex flex-col items-center justify-center font-sans antialiased text-gray-800 p-4">
      <main className="w-full max-w-[420px] flex flex-col items-center">
        <header className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-[#115340] rounded-2xl flex items-center justify-center shadow-sm mb-4 text-white">
            <BookOpen className="w-7 h-7 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-bold text-[#115340] tracking-tight mb-1">
            Perpustakaan Mini
          </h1>
          <p className="text-[13.5px] text-[#698177] font-normal leading-relaxed">
            Masuk untuk mengakses layanan peminjaman buku komunitas
          </p>
        </header>

        <section className="w-full bg-white rounded-3xl p-7 sm:p-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c2924]" htmlFor="email">
                Email Pengguna
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-[#1e2925] placeholder-[#95a89f] bg-[#ebf3f0] border border-transparent focus:bg-white focus:border-[#115340] focus:ring-1 focus:ring-[#115340] outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#1c2924]" htmlFor="password">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-4 pr-11 py-3 rounded-xl text-sm text-[#1e2925] placeholder-[#95a89f] bg-[#ebf3f0] border border-transparent focus:bg-white focus:border-[#115340] focus:ring-1 focus:ring-[#115340] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#738a80] hover:text-[#115340] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#115340] hover:bg-[#0c3d2f] text-white font-medium py-3 px-4 rounded-xl text-sm transition-colors duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-8 text-center text-xs sm:text-[13px] text-[#698177]">
          Belum memiliki akun?{' '}
          <Link
            to="/register"
            className="font-bold text-[#115340] hover:underline ml-0.5"
          >
            Daftar Anggota Baru
          </Link>
        </footer>
      </main>
    </div>
  );
}
