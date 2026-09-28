import type { ChatThread } from '@/common/messaging/entities/message';
import type { NavSection } from '@/pages/messenger/.partials/constants/nav-items';

function isGroupChat(chatId: string): boolean {
  return chatId.includes('@g.us') || /^-\d/.test(chatId);
}

export function filterThreadsBySection(threads: ChatThread[], section: NavSection): ChatThread[] {
  switch (section) {
    case 'all':
      return threads;
    case 'new':
      return threads.filter((t) => !t.lastMessagePreview);
    case 'contacts':
      return threads.filter((t) => Boolean(t.phone) || t.chatId.includes('@c.us'));
    case 'groups':
      return threads.filter((t) => isGroupChat(t.chatId));
    case 'calls':
    case 'settings':
      return [];
    default:
      return threads;
  }
}
