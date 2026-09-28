import { cn } from '@/shared/lib/cn';
import type { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full min-w-0 rounded-xl border-0 bg-max-panel px-4 py-2.5 text-sm text-max-text transition-shadow duration-200 placeholder:text-max-muted focus:bg-white focus:ring-2 focus:ring-max-accent/30 focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}
