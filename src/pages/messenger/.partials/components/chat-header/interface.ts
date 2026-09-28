import type { ChatThread } from '@/common/messaging/entities/message';

export interface ChatHeaderProps {
  thread: ChatThread | undefined;
  chatId: string;
  onBack?: () => void;
  searchOpen: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onToggleSearch: () => void;
  searchMatchCount?: number;
  totalMessages?: number;
}
