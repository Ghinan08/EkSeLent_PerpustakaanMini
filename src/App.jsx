import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import dummyData from './data/dummyData.json';

const {
  initialUsers,
  initialBooks,
  initialLoans,
  initialReviews,
  initialEvents
} = dummyData;

import UserLayout from './pages/user/UserLayout';
import Beranda from './pages/user/Beranda';
import Katalog from './pages/user/Katalog';
import DetailBuku from './pages/user/DetailBuku';
import Peminjaman from './pages/user/Peminjaman';
import Riwayat from './pages/user/Riwayat';
import Event from './pages/user/Event';
import Onboarding from './pages/user/Onboarding';
import GantiPreferensi from './pages/user/GantiPreferensi';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import KelolaBuku from './pages/admin/KelolaBuku';
import FormBuku from './pages/admin/FormBuku';
import KelolaPinjam from './pages/admin/KelolaPinjam';
import KelolaEvent from './pages/admin/KelolaEvent';
import KelolaUser from './pages/admin/KelolaUser';

export default function App() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);

  const [books, setBooks] = useState(initialBooks);
  const [loans, setLoans] = useState(initialLoans);
  const [reviews, setReviews] = useState(initialReviews);
  const [events, setEvents] = useState(initialEvents);

  const activeLoanStatuses = [
    'Menunggu Persetujuan',
    'Sedang Dipinjam',
    'Terlambat',
    'Menunggu Pengembalian'
  ];

  const borrowedBookIds = currentUser
    ? loans
        .filter(
          (l) =>
            l.user_id === currentUser.id && activeLoanStatuses.includes(l.status)
        )
        .map((l) => l.book_id)
    : [];

  const activeLoanCount = borrowedBookIds.length;

  function handleLogin(user) {
    setCurrentUser(user);
  }

  function handleRegister(newUser) {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  }

  function handleLogout() {
    setCurrentUser(null);
  }

  function handleUpdatePreferences(genres) {
    if (!currentUser) return;
    const updated = { ...currentUser, genres };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  function handleChangeUserRole(userId, newRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
  }

  function handleBorrowBook(book) {
    if (!currentUser) {
      alert('Silakan masuk ke akun terlebih dahulu untuk meminjam buku.');
      navigate('/login');
      return;
    }

    if (borrowedBookIds.some((bid) => String(bid) === String(book.id))) {
      alert(
        `Anda sedang meminjam buku "${book.judul}". Maksimal 1 peminjaman untuk judul buku yang sama. Anda tetap dapat meminjam judul buku lain yang tersedia!`
      );
      return;
    }

    if (book.stok_tersedia <= 0) {
      alert('Maaf, stok buku ini sedang habis dipinjam anggota lain.');
      return;
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 7);

    const padZero = (n) => String(n).padStart(2, '0');
    const formatTanggal = (d) => {
      const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
    };

    const newLoan = {
      id: 'PJ-' + (1000 + Math.floor(Math.random() * 9000)),
      user_id: currentUser.id,
      book_id: book.id,
      tgl_pinjam: formatTanggal(today),
      batas_kembali: formatTanggal(dueDate),
      tgl_kembali: '',
      status: 'Menunggu Persetujuan',
      denda: 0,
      sudahDiperpanjang: false
    };

    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? {
              ...b,
              stok_tersedia: Math.max(0, b.stok_tersedia - 1),
              status: b.stok_tersedia - 1 <= 0 ? 'Habis' : 'Tersedia'
            }
          : b
      )
    );

    setLoans((prev) => [newLoan, ...prev]);

    alert(
      `Permohonan peminjaman "${book.judul}" berhasil diajukan! Silakan datang ke perpustakaan setelah admin menyetujui permohonan Anda.`
    );
    navigate('/peminjaman');
  }

  function handleRequestReturn(loanId) {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? { ...l, status: 'Menunggu Pengembalian' } : l
      )
    );
  }

  function handleExtendLoan(loanId) {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
          const today = new Date();
          const extended = new Date();
          extended.setDate(today.getDate() + 7);
          const newDueDate = `${extended.getDate()} ${bulan[extended.getMonth()]} ${extended.getFullYear()}`;
          return { ...l, batas_kembali: newDueDate, sudahDiperpanjang: true };
        }
        return l;
      })
    );
  }

  function handleAddReview(newReview) {
    const reviewWithId = {
      ...newReview,
      id: 'R' + Date.now().toString().slice(-4)
    };
    setReviews((prev) => [reviewWithId, ...prev]);
    alert('Terima kasih! Ulasan buku Anda telah berhasil disimpan.');
  }

  function handleApproveLoan(loanId) {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'Sedang Dipinjam' } : l))
    );
  }

  function handleRejectLoan(loanId) {
    const loanToReject = loans.find((l) => l.id === loanId);
    if (!loanToReject) return;

    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'Ditolak' } : l))
    );

    setBooks((prev) =>
      prev.map((b) =>
        b.id === loanToReject.book_id
          ? {
              ...b,
              stok_tersedia: Math.min(b.stok_total, b.stok_tersedia + 1),
              status: 'Tersedia'
            }
          : b
      )
    );
  }

  function handleConfirmReturn(loanId) {
    const loanToReturn = loans.find((l) => l.id === loanId);
    if (!loanToReturn) return;

    const today = new Date();
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const returnDateStr = `${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}`;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? { ...l, status: 'Selesai', tgl_kembali: returnDateStr }
          : l
      )
    );

    setBooks((prev) =>
      prev.map((b) =>
        b.id === loanToReturn.book_id
          ? {
              ...b,
              stok_tersedia: Math.min(b.stok_total, b.stok_tersedia + 1),
              status: 'Tersedia'
            }
          : b
      )
    );
  }

  function handlePayFine(loanId) {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? { ...l, denda: 0 } : l
      )
    );
  }

  function handleSaveBook(bookData, isEdit) {
    if (isEdit) {
      setBooks((prev) => prev.map((b) => (b.id === bookData.id ? bookData : b)));
    } else {
      setBooks((prev) => [bookData, ...prev]);
    }
  }

  function handleDeleteBook(bookId) {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  function handleSaveEvent(eventData, isEdit) {
    if (isEdit) {
      setEvents((prev) => prev.map((e) => (e.id === eventData.id ? eventData : e)));
    } else {
      setEvents((prev) => [eventData, ...prev]);
    }
  }

  function handleDeleteEvent(eventId) {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }

  function handleRegisterEvent(eventId, userId) {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return false;

    let success = false;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const currentPeserta = e.peserta || [];
          if (currentPeserta.includes(targetUserId)) {
            return e;
          }
          if (currentPeserta.length >= e.kuota) {
            return e;
          }
          success = true;
          const updatedPeserta = [...currentPeserta, targetUserId];
          return {
            ...e,
            peserta: updatedPeserta,
            terdaftar: updatedPeserta.length
          };
        }
        return e;
      })
    );
    return success;
  }

  const isAuth = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin';
  const isUser = currentUser?.role === 'user';

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuth ? (
            <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />
          ) : (
            <Login users={users} onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuth ? (
            <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />
          ) : (
            <Register onRegister={handleRegister} />
          )
        }
      />

      <Route
        path="/onboarding"
        element={
          !isAuth ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Onboarding
              currentUser={currentUser}
              onUpdatePreferences={handleUpdatePreferences}
            />
          )
        }
      />

      <Route
        element={
          !isAuth ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <UserLayout
              currentUser={currentUser}
              onLogout={handleLogout}
              activeLoanCount={activeLoanCount}
            />
          )
        }
      >
        <Route
          path="/"
          element={
            <Beranda
              currentUser={currentUser}
              books={books}
              loans={loans}
              events={events}
              borrowedBookIds={borrowedBookIds}
              onBorrowBook={handleBorrowBook}
            />
          }
        />
        <Route
          path="/katalog"
          element={
            <Katalog
              books={books}
              borrowedBookIds={borrowedBookIds}
              onBorrowBook={handleBorrowBook}
            />
          }
        />
        <Route
          path="/buku/:id"
          element={
            <DetailBuku
              books={books}
              loans={loans}
              reviews={reviews}
              users={users}
              currentUser={currentUser}
              borrowedBookIds={borrowedBookIds}
              onBorrowBook={handleBorrowBook}
            />
          }
        />
        <Route
          path="/peminjaman"
          element={
            <Peminjaman
              currentUser={currentUser}
              loans={loans}
              books={books}
              onRequestReturn={handleRequestReturn}
              onExtendLoan={handleExtendLoan}
            />
          }
        />
        <Route
          path="/riwayat"
          element={
            <Riwayat
              currentUser={currentUser}
              loans={loans}
              books={books}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          }
        />
        <Route
          path="/event"
          element={
            <Event
              events={events}
              onRegisterEvent={handleRegisterEvent}
              currentUser={currentUser}
            />
          }
        />
        <Route
          path="/preferensi"
          element={
            <GantiPreferensi
              currentUser={currentUser}
              onUpdatePreferences={handleUpdatePreferences}
            />
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          !isAuth ? (
            <Navigate to="/login" replace />
          ) : !isAdmin ? (
            <Navigate to="/" replace />
          ) : (
            <AdminLayout
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Dashboard
              books={books}
              loans={loans}
              users={users}
              events={events}
            />
          }
        />
        <Route
          path="buku"
          element={
            <KelolaBuku
              books={books}
              onDeleteBook={handleDeleteBook}
            />
          }
        />
        <Route
          path="buku/tambah"
          element={
            <FormBuku
              books={books}
              onSaveBook={handleSaveBook}
            />
          }
        />
        <Route
          path="buku/edit/:id"
          element={
            <FormBuku
              books={books}
              onSaveBook={handleSaveBook}
            />
          }
        />
        <Route
          path="peminjaman"
          element={
            <KelolaPinjam
              loans={loans}
              books={books}
              users={users}
              onApproveLoan={handleApproveLoan}
              onRejectLoan={handleRejectLoan}
              onConfirmReturn={handleConfirmReturn}
              onPayFine={handlePayFine}
            />
          }
        />
        <Route
          path="event"
          element={
            <KelolaEvent
              events={events}
              users={users}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          }
        />
        <Route
          path="pengguna"
          element={
            <KelolaUser
              users={users}
              onChangeRole={handleChangeUserRole}
            />
          }
        />
      </Route>

      <Route
        path="*"
        element={
          !isAuth ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
