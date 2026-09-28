import { avatarColorFromName } from '@/pages/messenger/.partials/lib/avatar-color';
import type { AvatarProps } from '@/pages/messenger/.partials/components/avatar/interface';
import { cn } from '@/shared/lib/cn';

const SIZE = { sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-14 w-14 text-base' };

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const letter = (name.trim()[0] ?? '?').toUpperCase();
  const bg = avatarColorFromName(name);

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-sm',
        SIZE[size],
        className,
      )}
      style={{ backgroundColor: bg }}
      aria-hidden
    >
      {letter}
    </div>
  );
}
