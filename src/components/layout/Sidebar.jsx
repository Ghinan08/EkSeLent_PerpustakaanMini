import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  BookMarked,
  ArrowLeftRight,
  CalendarDays,
  Users,
  LogOut
} from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/admin/buku',
      label: 'Kelola Buku',
      icon: BookMarked
    },
    {
      to: '/admin/peminjaman',
      label: 'Kelola Peminjaman',
      icon: ArrowLeftRight
    },
    {
      to: '/admin/event',
      label: 'Kelola Event',
      icon: CalendarDays
    },
    {
      to: '/admin/pengguna',
      label: 'Kelola Pengguna',
      icon: Users
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 min-h-screen p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1c5544] flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">Admin</h1>
            <p className="text-xs text-slate-400 font-normal">Perpustakaan Mini</p>
          </div>
        </div>

        <nav aria-label="Sidebar Menu" className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1c5544] text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            if (onLogout) onLogout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
