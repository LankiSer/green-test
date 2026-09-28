import type { ChatThread } from '@/common/messaging/entities/message';
import type { NavSection } from '@/pages/messenger/.partials/constants/nav-items';

export interface ChatSidebarProps {
  section: NavSection;
  threads: ChatThread[];
  activeChatId: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  showNewChat: boolean;
  onToggleNewChat: () => void;
  newPhone: string;
  onNewPhoneChange: (value: string) => void;
  onStartChat: (e: React.FormEvent) => void;
  onSelectChat: (chatId: string) => void;
  formError?: string | null;
  mobileHidden?: boolean;
  idInstance: string;
  apiUrl: string;
  onLogout: () => void;
  syncing?: boolean;
  syncError?: string | null;
  onSync?: () => void;
}
