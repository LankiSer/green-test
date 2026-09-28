import type { ChatMessage } from '@/common/messaging/entities/message';
import type { CSSProperties } from 'react';

export interface MessageBubbleProps {
  message: ChatMessage;
  style?: CSSProperties;
  highlightQuery?: string;
}
