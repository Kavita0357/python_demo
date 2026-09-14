import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setLoading(true);
    authService.getCurrentUser()
      .then((data) => {
        const currentUser = data.user ?? data.data ?? data;
        setUser(currentUser);
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const token = data.access_token ?? data.token ?? data.data?.access_token;
      const loggedInUser = data.user ?? data.data?.user;
      if (token) localStorage.setItem('access_token', token);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      }
      return data;
    } finally { setLoading(false); }
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* clear local auth even if API fails */ }
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, isAuthenticated: !!user || !!localStorage.getItem('access_token'), login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
