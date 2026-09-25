import React from 'react';
import { useAuth } from '../../context/AuthContext';
export default function Header(){const{user,logout}=useAuth();return <header className="header"><div className="mobile-brand"><span>LF</span> LeaveFlow</div><div className="header-user"><div className="avatar">{(user?.first_name?.[0]||user?.email?.[0]||'U').toUpperCase()}</div><div><strong>{[user?.first_name,user?.last_name].filter(Boolean).join(' ')||'User'}</strong><small>{user?.email}</small></div><button className="logout-btn" onClick={logout}>Log out</button></div></header>}
