import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, ChevronDown, Settings } from 'lucide-react';

export default function Navbar({
  currentUser,
  onLogout,
  activeLoanCount = 0
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/katalog', label: 'Katalog' },
    {
      to: '/peminjaman',
      label: 'Peminjaman Saya',
      badge: activeLoanCount > 0 ? activeLoanCount : null
    },
    { to: '/riwayat', label: 'Riwayat' },
    { to: '/event', label: 'Event' }
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#114B3E] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-[#114B3E] block leading-tight">
              Perpustakaan Mini
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
              Perpustakaan Umum
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all text-sm font-semibold flex items-center gap-1.5 ${isActive
                  ? 'bg-[#114B3E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-slate-50 transition-all focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#114B3E] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.avatarInitials || currentUser.nama?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {currentUser.nama}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Anggota Perpustakaan
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.nama}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      to="/preferensi"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Ganti Preferensi</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (onLogout) onLogout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#114B3E] transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-[#114B3E] hover:bg-[#0c382e] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
