import { Plus } from 'lucide-react';
import { SIDEBAR_TITLES } from '@/pages/messenger/.partials/constants/nav-items';
import type { ChatSidebarHeaderProps } from '@/pages/messenger/.partials/components/chat-sidebar-header/interface';
import { Button } from '@/shared/components/ui/Button';

export function ChatSidebarHeader({ section, onNewChat, hideNewButton }: ChatSidebarHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      <h1 className="text-xl font-bold tracking-tight">{SIDEBAR_TITLES[section]}</h1>
      {!hideNewButton && (
        <Button
          variant="primary"
          size="icon"
          className="h-9 w-9 shadow-md shadow-max-accent/25"
          onClick={onNewChat}
          aria-label="Новый чат"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      )}
    </header>
  );
}
