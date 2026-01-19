import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import RequireAdmin from './components/RequireAdmin';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AdminResetPasswordPage from './pages/AdminResetPasswordPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agendar" element={<BookingPage />} />
      </Route>

      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/reset" element={<AdminResetPasswordPage />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;