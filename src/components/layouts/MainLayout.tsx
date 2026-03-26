'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebarStore();

  return (
   <div className="min-h-screen bg-background">
      <Sidebar />
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors md:hidden"
        aria-label="Abrir menú"
      >
        {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
      </button>
      <main className="md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}