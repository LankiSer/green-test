export type MessageDirection = 'incoming' | 'outgoing';

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
  status?: 'pending' | 'sent' | 'failed';
}

export interface ChatThread {
  chatId: string;
  title: string;
  phone?: string;
  lastMessageAt: number;
  lastMessagePreview?: string;
}
