import { CheckCheck } from 'lucide-react';
import { Avatar } from '@/pages/messenger/.partials/components/avatar/component';
import { formatThreadTime } from '@/pages/messenger/.partials/lib/format-date';
import type { ThreadItemProps } from '@/pages/messenger/.partials/components/thread-item/interface';
import { cn } from '@/shared/lib/cn';

export function ThreadItem({ thread, active, onSelect, style }: ThreadItemProps) {
  return (
    <li className="animate-max-slide-up" style={style}>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200',
          active ? 'bg-max-active' : 'hover:bg-max-hover',
        )}
      >
        <Avatar name={thread.title} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate font-semibold">{thread.title}</p>
            <span className="shrink-0 text-xs text-max-muted">{formatThreadTime(thread.lastMessageAt)}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <CheckCheck className="h-3.5 w-3.5 shrink-0 text-max-accent" aria-hidden />
            <p className="truncate text-sm text-max-text-secondary">
              {thread.lastMessagePreview ?? 'Нет сообщений'}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
}
