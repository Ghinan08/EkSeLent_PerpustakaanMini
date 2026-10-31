import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import dummyData from './data/dummyData.json';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/user/Onboarding';
import Beranda from './pages/user/Beranda';
import Dashboard from './pages/admin/Dashboard';

const { initialUsers } = dummyData;

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);

  function handleLogin(user) {
    setCurrentUser(user);
  }

  function handleRegister(newUser) {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  }

  function handleUpdatePreferences(genres) {
    if (!currentUser) return;
    const updated = { ...currentUser, genres };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  const isAuth = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin';

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
        path="/"
        element={
          !isAuth ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Beranda />
          )
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          !isAuth ? (
            <Navigate to="/login" replace />
          ) : !isAdmin ? (
            <Navigate to="/" replace />
          ) : (
            <Dashboard />
          )
        }
      />
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
