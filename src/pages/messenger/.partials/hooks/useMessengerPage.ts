import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/common/auth/providers/AuthProvider';
import { sendTextMessage } from '@/common/messaging/api/greenApiClient';
import { useChatMessages, useChatStorage } from '@/common/messaging/hooks/useChatStorage';
import { useNotificationPolling } from '@/common/messaging/hooks/useNotificationPolling';
import { formatPhoneDisplay, phoneToChatId } from '@/common/messaging/lib/phone';
import type { NavSection } from '@/pages/messenger/.partials/constants/nav-items';
import { filterThreadsBySection } from '@/pages/messenger/.partials/lib/filter-threads-by-section';

export function useMessengerPage() {
  const { logout, credentials } = useAuth();
  const { threads, upsertThread, appendMessage, updateMessage } = useChatStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get('chat');
  const allMessages = useChatMessages(activeChatId);
  const [draft, setDraft] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [query, setQuery] = useState('');
  const [navSection, setNavSection] = useState<NavSection>('all');
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useNotificationPolling(Boolean(credentials));

  const activeThread = threads.find((t) => t.chatId === activeChatId);

  const sectionThreads = useMemo(
    () => filterThreadsBySection(threads, navSection),
    [threads, navSection],
  );

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sectionThreads;
    return sectionThreads.filter(
      (t) => t.title.toLowerCase().includes(q) || t.chatId.toLowerCase().includes(q),
    );
  }, [sectionThreads, query]);

  const messages = useMemo(() => {
    const q = chatSearchQuery.trim().toLowerCase();
    if (!q || !chatSearchOpen) return allMessages;
    return allMessages.filter((m) => m.text.toLowerCase().includes(q));
  }, [allMessages, chatSearchQuery, chatSearchOpen]);

  useEffect(() => {
    document.title = activeChatId ? `${activeThread?.title ?? 'Чат'} — MAX` : 'Чаты — MAX';
  }, [activeChatId, activeThread?.title]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [allMessages.length, activeChatId]);

  useEffect(() => {
    if (!activeChatId) {
      setChatSearchOpen(false);
      setChatSearchQuery('');
    }
  }, [activeChatId]);

  const selectChat = (chatId: string) => setSearchParams({ chat: chatId });
  const clearChat = () => setSearchParams({});

  const changeNavSection = (section: NavSection) => {
    setNavSection(section);
    if (section === 'new') {
      setShowNewChat(true);
    }
    if (section === 'settings' || section === 'calls' || section === 'groups') {
      clearChat();
    }
  };

  const startChat = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const chatId = phoneToChatId(newPhone);
      const title = formatPhoneDisplay(newPhone);
      upsertThread({
        chatId,
        title,
        phone: newPhone.replace(/\D/g, ''),
        lastMessageAt: Date.now(),
      });
      setSearchParams({ chat: chatId });
      setNewPhone('');
      setShowNewChat(false);
      setSendError(null);
      setNavSection('all');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Неверный номер');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !credentials || !draft.trim()) return;
    setSendError(null);
    const text = draft.trim();
    const tempId = `pending-${Date.now()}`;
    appendMessage(
      {
        id: tempId,
        chatId: activeChatId,
        text,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'pending',
      },
      { title: activeThread?.title, phone: activeThread?.phone },
    );
    setDraft('');
    setSending(true);
    try {
      const { idMessage } = await sendTextMessage(credentials, activeChatId, text);
      updateMessage(activeChatId, tempId, { id: idMessage, status: 'sent' });
    } catch (err) {
      updateMessage(activeChatId, tempId, { status: 'failed' });
      setSendError(err instanceof Error ? err.message : 'Ошибка отправки');
    } finally {
      setSending(false);
    }
  };

  const toggleChatSearch = () => {
    setChatSearchOpen((open) => {
      if (open) setChatSearchQuery('');
      return !open;
    });
  };

  return {
    logout,
    credentials,
    threads: filteredThreads,
    navSection,
    changeNavSection,
    activeChatId,
    activeThread,
    messages,
    allMessagesCount: allMessages.length,
    draft,
    setDraft,
    newPhone,
    setNewPhone,
    showNewChat,
    setShowNewChat,
    query,
    setQuery,
    chatSearchOpen,
    chatSearchQuery,
    setChatSearchQuery,
    toggleChatSearch,
    sendError,
    sending,
    listRef,
    selectChat,
    clearChat,
    startChat,
    sendMessage,
  };
}
