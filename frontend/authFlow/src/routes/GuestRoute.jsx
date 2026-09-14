import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
