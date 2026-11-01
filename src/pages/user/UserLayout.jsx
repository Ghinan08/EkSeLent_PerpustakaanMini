import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function UserLayout({
  currentUser,
  onLogout,
  activeLoanCount
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-gray-800 antialiased font-sans">
      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        activeLoanCount={activeLoanCount}
      />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
