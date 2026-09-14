import React from 'react';
import { useAuth } from '../../context/AuthContext';
export default function Header() {
  const { user, logout } = useAuth();
  return <header className="header"><strong>React App</strong><div>{user?.name || user?.email || 'User'} <button onClick={logout}>Logout</button></div></header>;
}
