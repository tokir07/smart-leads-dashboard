import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../context/authStore';
import { Avatar } from '../ui/Avatar';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { theme, toggle } = useTheme();
  const { user } = useAuthStore();

  return (
    <header className="h-16 px-8 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 transition-colors duration-300">
      <h2 className="text-xl font-extrabold text-slate-850 dark:text-zinc-50 tracking-tight">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        {/* Persisted Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800/50 transition-all duration-200"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
        </button>

        {/* User Info & Avatar */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-100 dark:border-zinc-800 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                {user.name}
              </p>
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                {user.role} workspace
              </span>
            </div>
            <Avatar name={user.name} size="sm" />
          </div>
        )}
      </div>
    </header>
  );
};
