import { ChatPanel } from '@/pages/messenger/.partials/components/chat-panel/component';
import { ChatSidebar } from '@/pages/messenger/.partials/components/chat-sidebar/component';
import { NavRail } from '@/pages/messenger/.partials/components/nav-rail/component';
import { useMessengerPage } from '@/pages/messenger/.partials/hooks/useMessengerPage';

export function MessengerView() {
  const m = useMessengerPage();

  return (
    <div className="flex h-full min-h-[100dvh] bg-max-bg">
      <NavRail activeSection={m.navSection} onSectionChange={m.changeNavSection} />
      <ChatSidebar
        section={m.navSection}
        threads={m.threads}
        activeChatId={m.activeChatId}
        query={m.query}
        onQueryChange={m.setQuery}
        showNewChat={m.showNewChat}
        onToggleNewChat={() => m.setShowNewChat((v) => !v)}
        newPhone={m.newPhone}
        onNewPhoneChange={m.setNewPhone}
        onStartChat={m.startChat}
        onSelectChat={m.selectChat}
        formError={m.showNewChat ? m.sendError : null}
        mobileHidden={Boolean(m.activeChatId)}
        idInstance={m.credentials?.idInstance ?? '—'}
        apiUrl={m.credentials?.apiUrl ?? '—'}
        onLogout={m.logout}
      />
      <ChatPanel
        activeChatId={m.activeChatId}
        thread={m.activeThread}
        messages={m.messages}
        allMessagesCount={m.allMessagesCount}
        listRef={m.listRef}
        draft={m.draft}
        onDraftChange={m.setDraft}
        onSubmit={m.sendMessage}
        sending={m.sending}
        sendError={m.sendError}
        onBack={m.clearChat}
        visible={Boolean(m.activeChatId)}
        chatSearchOpen={m.chatSearchOpen}
        chatSearchQuery={m.chatSearchQuery}
        onChatSearchQueryChange={m.setChatSearchQuery}
        onToggleChatSearch={m.toggleChatSearch}
      />
    </div>
  );
}
