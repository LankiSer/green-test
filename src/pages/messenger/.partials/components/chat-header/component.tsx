import { ChevronLeft, Search, X } from 'lucide-react';
import { Avatar } from '@/pages/messenger/.partials/components/avatar/component';
import type { ChatHeaderProps } from '@/pages/messenger/.partials/components/chat-header/interface';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { cn } from '@/shared/lib/cn';

export function ChatHeader({
  thread,
  chatId,
  onBack,
  searchOpen,
  searchQuery,
  onSearchQueryChange,
  onToggleSearch,
  searchMatchCount,
  totalMessages,
}: ChatHeaderProps) {
  const title = thread?.title ?? chatId;

  if (searchOpen) {
    return (
      <header className="flex items-center gap-2 border-b border-max-border bg-max-sidebar px-3 py-2 md:px-4 animate-max-slide-down">
        {onBack && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack} aria-label="Назад">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-max-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="py-2 pl-9"
            placeholder="Поиск по сообщениям"
            autoFocus
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleSearch} aria-label="Закрыть поиск">
          <X className="h-5 w-5" />
        </Button>
        {searchQuery.trim() && (
          <span className="hidden shrink-0 text-xs text-max-text-secondary sm:inline">
            {searchMatchCount} / {totalMessages}
          </span>
        )}
      </header>
    );
  }

  return (
    <header className="flex items-center gap-3 border-b border-max-border bg-max-sidebar/95 px-3 py-2 backdrop-blur-md md:px-4">
      {onBack && (
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack} aria-label="Назад">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      <Avatar name={title} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{title}</p>
        <p className="truncate text-xs text-max-text-secondary">личный чат</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Поиск в чате"
        onClick={onToggleSearch}
        className={cn(searchOpen && 'bg-max-active text-max-accent')}
      >
        <Search className="h-5 w-5 text-max-text-secondary" />
      </Button>
    </header>
  );
}
