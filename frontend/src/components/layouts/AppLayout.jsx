import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../common/Header";
import { useAuth } from "../../context/AuthContext";
export default function AppLayout() {
  const { user } = useAuth();
  const isAdmin =
    (user?.role?.name || user?.role_name || "").toLowerCase() === "admin";
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span>LF</span>
            <strong>LeaveFlow</strong>
          </div>
          <nav>
            <NavLink to="/dashboard">Overview</NavLink>
            {/* <NavLink to="/leaves">My requests</NavLink> */}
            {/* <NavLink to="/balances">Leave balance</NavLink> */}
            <NavLink to="/dossiers">Dossiers</NavLink>
            {isAdmin && <NavLink to="/admin">Admin panel</NavLink>}
          </nav>
          <div className="sidebar-note">
            <strong>Connected API</strong>
            <span>FastAPI backend</span>
          </div>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
