import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AuthLayout from "../components/layouts/AuthLayout";
import AppLayout from "../components/layouts/AppLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardPage from "../pages/DashboardPage";
import LeavesPage from "../pages/LeavesPage";
import NewLeavePage from "../pages/NewLeavePage";
import LeaveDetailPage from "../pages/LeaveDetailPage";
import BalancesPage from "../pages/BalancesPage";
import AdminPage from "../pages/AdminPage";
import DossiersPage from "../pages/DossiersPage";
import DossierDetailsPage from "../pages/DossierDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaves" element={<LeavesPage />} />
          <Route path="/leaves/new" element={<NewLeavePage />} />
          <Route path="/leaves/:id" element={<LeaveDetailPage />} />
          <Route path="/balances" element={<BalancesPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Dossier Management */}
          <Route path="/dossiers" element={<DossiersPage />} />
          <Route path="/dossiers/:id" element={<DossierDetailsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
