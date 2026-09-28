import type { ChatThread } from '@/common/messaging/entities/message';
import type { CSSProperties } from 'react';

export interface ThreadItemProps {
  thread: ChatThread;
  active: boolean;
  onSelect: () => void;
  style?: CSSProperties;
}
