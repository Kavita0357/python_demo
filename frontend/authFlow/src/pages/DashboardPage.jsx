import React from 'react';
import { useAuth } from '../context/AuthContext';
export default function DashboardPage() { const { user } = useAuth(); return <section><h1>Dashboard</h1><p>You are authenticated{user?.name ? `, ${user.name}` : ''}.</p></section>; }
