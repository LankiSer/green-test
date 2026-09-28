import { DateDivider } from '@/pages/messenger/.partials/components/date-divider/component';
import { MessageBubble } from '@/pages/messenger/.partials/components/message-bubble/component';
import { groupMessagesByDate } from '@/pages/messenger/.partials/lib/group-messages-by-date';
import type { MessageListProps } from '@/pages/messenger/.partials/components/message-list/interface';

export function MessageList({ messages, listRef, highlight }: MessageListProps) {
  const items = groupMessagesByDate(messages);

  return (
    <div ref={listRef} className="flex-1 overflow-auto chat-wallpaper px-4 py-2 md:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-1">
        {items.map((item, index) =>
          item.type === 'date' ? (
            <DateDivider key={item.key} label={item.label} />
          ) : (
            <MessageBubble
              key={item.key}
              message={item.message}
              highlightQuery={highlight}
              style={{ animationDelay: `${Math.min(index, 20) * 20}ms` }}
            />
          ),
        )}
      </div>
    </div>
  );
}
