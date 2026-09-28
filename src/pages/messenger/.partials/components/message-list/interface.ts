import type { ChatMessage } from '@/common/messaging/entities/message';
import type { RefObject } from 'react';

export interface MessageListProps {
  messages: ChatMessage[];
  listRef: RefObject<HTMLDivElement | null>;
  highlight?: string;
}
