import { Plus, RefreshCw } from 'lucide-react';
import { SIDEBAR_TITLES } from '@/pages/messenger/.partials/constants/nav-items';
import type { ChatSidebarHeaderProps } from '@/pages/messenger/.partials/components/chat-sidebar-header/interface';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/cn';

export function ChatSidebarHeader({
  section,
  onNewChat,
  hideNewButton,
  syncing,
  onSync,
}: ChatSidebarHeaderProps) {
  return (
    <header className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{SIDEBAR_TITLES[section]}</h1>
          {syncing && (
            <p className="text-xs text-max-text-secondary animate-max-fade-in">Синхронизация с MAX…</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onSync && section !== 'settings' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onSync}
              disabled={syncing}
              aria-label="Обновить чаты"
            >
              <RefreshCw className={cn('h-5 w-5', syncing && 'animate-spin')} />
            </Button>
          )}
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
        </div>
      </div>
    </header>
  );
}
