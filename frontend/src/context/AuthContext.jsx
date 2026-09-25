import React, { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const token = data.access_token ?? data.token ?? data.data?.access_token;
      const loggedInUser = data.user ?? data.data?.user;
      if (!token) throw new Error('Login succeeded but no access token was returned.');
      localStorage.setItem('access_token', token);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      }
      return data;
    } finally { setLoading(false); }
  };

  const logout = async () => {
    try { if (localStorage.getItem('access_token')) await authService.logout(); } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user && !!localStorage.getItem('access_token'), login, logout }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
