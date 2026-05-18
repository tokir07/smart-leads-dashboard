import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

interface BadgeProps {
  content: LeadStatus | LeadSource | string;
  type?: 'status' | 'source' | 'generic';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ content, type = 'generic', className = '' }) => {
  const getStyles = () => {
    if (type === 'status') {
      switch (content) {
        case LeadStatus.NEW:
          return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
        case LeadStatus.CONTACTED:
          return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30';
        case LeadStatus.QUALIFIED:
          return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
        case LeadStatus.LOST:
          return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
        default:
          return 'bg-slate-50 text-slate-700 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800';
      }
    }

    if (type === 'source') {
      switch (content) {
        case LeadSource.WEBSITE:
          return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/30';
        case LeadSource.INSTAGRAM:
          return 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/30 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-900/30';
        case LeadSource.REFERRAL:
          return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30';
        default:
          return 'bg-slate-50 text-slate-700 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800';
      }
    }

    return 'bg-slate-50 text-slate-700 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${getStyles()} ${className}`}>
      {content}
    </span>
  );
};
