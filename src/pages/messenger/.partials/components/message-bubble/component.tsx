import { CheckCheck } from 'lucide-react';
import { formatMessageTime } from '@/pages/messenger/.partials/lib/format-date';
import { highlightText } from '@/pages/messenger/.partials/lib/highlight-text';
import type { MessageBubbleProps } from '@/pages/messenger/.partials/components/message-bubble/interface';
import { cn } from '@/shared/lib/cn';

export function MessageBubble({ message, style, highlightQuery }: MessageBubbleProps) {
  const outgoing = message.direction === 'outgoing';

  return (
    <div
      className={cn('flex animate-max-message-in', outgoing ? 'justify-end' : 'justify-start')}
      style={style}
    >
      <div
        className={cn(
          'relative max-w-[min(420px,85%)] px-3 py-2 shadow-sm',
          outgoing
            ? 'rounded-2xl rounded-br-md bg-max-bubble-out text-max-text'
            : 'rounded-2xl rounded-bl-md bg-max-bubble-in text-max-text',
          message.status === 'failed' && 'ring-1 ring-red-400/80',
        )}
      >
        <p className="pr-14 text-[15px] leading-snug whitespace-pre-wrap break-words">
          {highlightQuery ? highlightText(message.text, highlightQuery) : message.text}
        </p>
        <div className="absolute right-2 bottom-1 flex items-center gap-0.5 text-[11px] text-max-muted">
          {message.status === 'pending' && <span>…</span>}
          <span>{formatMessageTime(message.timestamp)}</span>
          {outgoing && message.status !== 'failed' && (
            <CheckCheck className="h-3.5 w-3.5 text-max-accent" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
