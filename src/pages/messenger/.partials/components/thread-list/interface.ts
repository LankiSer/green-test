import type { ChatThread } from '@/common/messaging/entities/message';

export interface ThreadListProps {
  threads: ChatThread[];
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}
