import type { ChatMessage, ChatThread } from '@/common/messaging/entities/message';
import type { RefObject } from 'react';

export interface ChatPanelProps {
  activeChatId: string | null;
  thread: ChatThread | undefined;
  messages: ChatMessage[];
  allMessagesCount: number;
  listRef: RefObject<HTMLDivElement | null>;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  sendError: string | null;
  onBack?: () => void;
  visible: boolean;
  chatSearchOpen: boolean;
  chatSearchQuery: string;
  onChatSearchQueryChange: (value: string) => void;
  onToggleChatSearch: () => void;
}
