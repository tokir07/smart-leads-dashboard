import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, Math.min(2, n.length)).toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white bg-gradient-to-tr from-brand-500 to-sky-400 select-none shadow-md ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
