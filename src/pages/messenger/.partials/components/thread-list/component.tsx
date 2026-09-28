import { MessageSquarePlus } from 'lucide-react';
import { ThreadItem } from '@/pages/messenger/.partials/components/thread-item/component';
import type { ThreadListProps } from '@/pages/messenger/.partials/components/thread-list/interface';

export function ThreadList({
  threads,
  activeChatId,
  onSelect,
  emptyTitle = 'Пока пусто',
  emptyDescription = 'Создайте чат по номеру телефона',
}: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center animate-max-fade-in">
        <MessageSquarePlus className="h-10 w-10 text-max-muted/60" />
        <p className="text-sm font-medium">{emptyTitle}</p>
        <p className="text-sm text-max-text-secondary">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-auto pb-2">
      {threads.map((thread, index) => (
        <ThreadItem
          key={thread.chatId}
          thread={thread}
          active={activeChatId === thread.chatId}
          onSelect={() => onSelect(thread.chatId)}
          style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
        />
      ))}
    </ul>
  );
}
