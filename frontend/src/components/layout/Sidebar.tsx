import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import { Avatar } from '../ui/Avatar';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/leads', label: 'Leads Workspace', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800 transition-colors duration-300">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-2.5 border-b border-slate-100 dark:border-zinc-800">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-2 rounded-xl text-white shadow-md shadow-brand-500/10">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-slate-800 dark:text-zinc-50 font-sans text-base tracking-tight block">
            Smart Leads
          </span>
          <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest block -mt-1">
            Sales Hub
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10'
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-800 dark:hover:text-zinc-200'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User profile bubble at bottom */}
      <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 truncate leading-none mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        {/* Role badge and Logout */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
            user.role === 'admin'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
          }`}>
            {user.role}
          </span>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
