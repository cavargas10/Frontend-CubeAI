import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-1">
        <Outlet />
      </main>
    </div>
  );
};