import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import AuthLayout from '../components/layouts/AuthLayout';
import AppLayout from '../components/layouts/AppLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return <Routes>
    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}><Route path="/dashboard" element={<DashboardPage />} /></Route>
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
