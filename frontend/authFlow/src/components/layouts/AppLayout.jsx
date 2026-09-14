import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
export default function AppLayout() { return <div className="app-layout"><Header /><main className="content"><Outlet /></main></div>; }
