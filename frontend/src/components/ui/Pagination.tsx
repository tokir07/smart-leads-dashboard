import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-slate-500 dark:text-zinc-400">
        Page <span className="font-semibold text-slate-700 dark:text-zinc-200">{page}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-zinc-200">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 !p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            if (totalPages > 5 && Math.abs(page - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return <span key={pageNum} className="px-1.5 text-slate-400">...</span>;
              }
              return null;
            }
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="h-8 w-8 !p-0 text-xs font-semibold"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 !p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
