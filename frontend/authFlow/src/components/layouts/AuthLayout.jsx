import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const copy = {
  '/login': { eyebrow: 'Welcome back', title: 'Sign in to your account', description: 'Access your workspace and continue where you left off.' },
  '/register': { eyebrow: 'Get started', title: 'Create your account', description: 'Set up your account in a few simple steps.' },
  '/forgot-password': { eyebrow: 'Account recovery', title: 'Forgot your password?', description: 'Enter your email and we’ll send you a secure reset link.' },
  '/reset-password': { eyebrow: 'Secure your account', title: 'Set a new password', description: 'Choose a strong password you haven’t used before.' },
};

export default function AuthLayout() {
  const location = useLocation();
  const content = copy[location.pathname] || copy['/login'];

  return (
    <main className="auth-shell">
      <section className="auth-brand-panel">
        <div className="brand-logo"><span>R</span> ReactFlow</div>
        <div className="brand-copy">
          <p className="brand-kicker">AUTHENTICATION</p>
          <h2>Everything you need to manage your account.</h2>
          <p>Clean, secure and API-ready authentication screens built for your React application.</p>
        </div>
        <div className="brand-footer">© {new Date().getFullYear()} ReactFlow</div>
      </section>

      <section className="auth-content">
        <div className="auth-content-inner">
          <div className="mobile-logo"><div className="brand-logo"><span>R</span> ReactFlow</div></div>
          <div className="auth-heading">
            <p>{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <span>{content.description}</span>
          </div>
          <Outlet />
        </div>
      </section>
    </main>
  );
}
