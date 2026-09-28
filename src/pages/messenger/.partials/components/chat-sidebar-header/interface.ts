import type { NavSection } from '@/pages/messenger/.partials/constants/nav-items';

export interface ChatSidebarHeaderProps {
  section: NavSection;
  onNewChat: () => void;
  hideNewButton?: boolean;
  syncing?: boolean;
  onSync?: () => void;
}
