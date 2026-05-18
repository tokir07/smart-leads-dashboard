import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-zinc-950 overflow-hidden text-slate-800 dark:text-zinc-150 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main page content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
