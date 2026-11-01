import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  currentUser,
  onLogout
}) {
  return (
    <div className="bg-[#fbfcfc] text-slate-800 font-sans antialiased min-h-screen flex">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1c5544]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c5544]">
              Panel Administrator Perpustakaan
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {currentUser?.nama || 'Admin Perpus'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Petugas Perpustakaan</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1c5544] flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {currentUser?.avatarInitials || 'AP'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
