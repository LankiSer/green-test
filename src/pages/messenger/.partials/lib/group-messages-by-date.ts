import type { ChatMessage } from '@/common/messaging/entities/message';
import { formatDateDivider } from '@/pages/messenger/.partials/lib/format-date';

export type MessageListItem =
  | { type: 'date'; key: string; label: string }
  | { type: 'message'; key: string; message: ChatMessage };

export function groupMessagesByDate(messages: ChatMessage[]): MessageListItem[] {
  const items: MessageListItem[] = [];
  let lastLabel = '';

  for (const message of messages) {
    const label = formatDateDivider(message.timestamp);
    if (label !== lastLabel) {
      items.push({ type: 'date', key: `date-${label}-${message.timestamp}`, label });
      lastLabel = label;
    }
    items.push({ type: 'message', key: message.id, message });
  }

  return items;
}
