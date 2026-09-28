import { Phone, Users } from 'lucide-react';
import { ChatSearch } from '@/pages/messenger/.partials/components/chat-search/component';
import { ChatSidebarHeader } from '@/pages/messenger/.partials/components/chat-sidebar-header/component';
import { NewChatForm } from '@/pages/messenger/.partials/components/new-chat-form/component';
import { SidebarPlaceholder } from '@/pages/messenger/.partials/components/sidebar-placeholder/component';
import { SidebarSettings } from '@/pages/messenger/.partials/components/sidebar-settings/component';
import { ThreadList } from '@/pages/messenger/.partials/components/thread-list/component';
import type { ChatSidebarProps } from '@/pages/messenger/.partials/components/chat-sidebar/interface';
import { cn } from '@/shared/lib/cn';

export function ChatSidebar({
  section,
  threads,
  activeChatId,
  query,
  onQueryChange,
  showNewChat,
  onToggleNewChat,
  newPhone,
  onNewPhoneChange,
  onStartChat,
  onSelectChat,
  formError,
  mobileHidden,
  idInstance,
  apiUrl,
  onLogout,
}: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        'animate-max-fade-in flex w-full max-w-[380px] flex-col border-r border-max-border bg-max-sidebar md:w-[380px]',
        mobileHidden && 'hidden md:flex',
      )}
    >
      <ChatSidebarHeader
        section={section}
        onNewChat={onToggleNewChat}
        hideNewButton={section === 'settings' || section === 'calls'}
      />

      {section === 'settings' ? (
        <SidebarSettings idInstance={idInstance} apiUrl={apiUrl} onLogout={onLogout} />
      ) : section === 'groups' ? (
        <SidebarPlaceholder
          icon={Users}
          title="Групповых чатов нет"
          description="В этом задании поддерживаются только личные текстовые диалоги по номеру телефона."
          actionLabel="Новый личный чат"
          onAction={onToggleNewChat}
        />
      ) : section === 'calls' ? (
        <SidebarPlaceholder
          icon={Phone}
          title="История звонков пуста"
          description="Звонки через GREEN-API в этом интерфейсе не реализованы — только сообщения."
        />
      ) : (
        <>
          <ChatSearch value={query} onChange={onQueryChange} />
          {showNewChat && (
            <NewChatForm
              phone={newPhone}
              onPhoneChange={onNewPhoneChange}
              onSubmit={onStartChat}
              onClose={onToggleNewChat}
              error={formError}
            />
          )}
          <ThreadList
            threads={threads}
            activeChatId={activeChatId}
            onSelect={onSelectChat}
            emptyTitle={section === 'new' ? 'Нет новых чатов' : 'Ничего не найдено'}
            emptyDescription={
              section === 'new'
                ? 'Создайте чат — он появится здесь до первого сообщения'
                : 'Измените запрос или создайте новый чат'
            }
          />
        </>
      )}
    </aside>
  );
}
