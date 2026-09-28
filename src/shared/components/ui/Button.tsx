import { cn } from '@/shared/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'icon';
  size?: 'md' | 'sm' | 'icon';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'icon' && 'h-10 w-10 p-0',
        variant === 'primary' &&
          'bg-max-accent text-white shadow-sm hover:bg-max-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-max-accent',
        variant === 'ghost' &&
          'text-max-text-secondary hover:bg-max-hover hover:text-max-text',
        variant === 'outline' &&
          'border border-max-border bg-white text-max-text hover:bg-max-hover',
        variant === 'icon' &&
          'text-max-accent hover:bg-max-accent-soft',
        className,
      )}
      {...props}
    />
  );
}
