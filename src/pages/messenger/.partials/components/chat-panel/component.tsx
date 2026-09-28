import { ChatComposer } from '@/pages/messenger/.partials/components/chat-composer/component';
import { ChatEmpty } from '@/pages/messenger/.partials/components/chat-empty/component';
import { ChatHeader } from '@/pages/messenger/.partials/components/chat-header/component';
import { MessageList } from '@/pages/messenger/.partials/components/message-list/component';
import type { ChatPanelProps } from '@/pages/messenger/.partials/components/chat-panel/interface';
import { cn } from '@/shared/lib/cn';

export function ChatPanel({
  activeChatId,
  thread,
  messages,
  allMessagesCount,
  listRef,
  draft,
  onDraftChange,
  onSubmit,
  sending,
  sendError,
  onBack,
  visible,
  chatSearchOpen,
  chatSearchQuery,
  onChatSearchQueryChange,
  onToggleChatSearch,
  historyLoading,
}: ChatPanelProps) {
  return (
    <main
      className={cn(
        'min-w-0 flex-1 flex-col bg-max-bg',
        visible ? 'flex animate-max-fade-in' : 'hidden md:flex',
      )}
    >
      {!activeChatId ? (
        <ChatEmpty />
      ) : (
        <div key={activeChatId} className="flex min-h-0 flex-1 flex-col animate-max-scale-in">
          <ChatHeader
            thread={thread}
            chatId={activeChatId}
            onBack={onBack}
            searchOpen={chatSearchOpen}
            searchQuery={chatSearchQuery}
            onSearchQueryChange={onChatSearchQueryChange}
            onToggleSearch={onToggleChatSearch}
            searchMatchCount={messages.length}
            totalMessages={allMessagesCount}
          />
          {historyLoading && (
            <p className="bg-max-panel px-4 py-1.5 text-center text-xs text-max-text-secondary">
              Загрузка истории…
            </p>
          )}
          {chatSearchOpen && chatSearchQuery.trim() && messages.length === 0 && (
            <p className="bg-max-panel px-4 py-2 text-center text-xs text-max-text-secondary">
              Сообщений не найдено
            </p>
          )}
          <MessageList messages={messages} listRef={listRef} highlight={chatSearchQuery.trim()} />
          <ChatComposer
            draft={draft}
            onDraftChange={onDraftChange}
            onSubmit={onSubmit}
            sending={sending}
            error={sendError}
          />
        </div>
      )}
    </main>
  );
}
