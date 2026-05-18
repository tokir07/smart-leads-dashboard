import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  message = 'Try modifying your filters or check back later.',
  icon = <FolderOpen className="w-12 h-12 text-slate-300 dark:text-zinc-700" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
      <div className="p-4 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm">
        {message}
      </p>
    </div>
  );
};
