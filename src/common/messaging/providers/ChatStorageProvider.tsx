import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { GreenApiChat } from '@/common/messaging/api/greenApiClient';
import type { ChatMessage, ChatThread } from '@/common/messaging/entities/message';
import { phoneToChatId } from '@/common/messaging/lib/phone';

const THREADS_KEY = 'green-max-threads';
const messagesKey = (chatId: string) => `green-max-messages-${chatId}`;

function loadThreads(): ChatThread[] {
  try {
    const raw = localStorage.getItem(THREADS_KEY);
    return raw ? (JSON.parse(raw) as ChatThread[]) : [];
  } catch {
    return [];
  }
}

function saveThreads(threads: ChatThread[]) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

function loadMessages(chatId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(messagesKey(chatId));
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function normalizePhone(value?: string | number): string {
  return String(value ?? '').replace(/\D/g, '');
}

function threadMetaFromMessages(
  messages: ChatMessage[],
): Pick<ChatThread, 'lastMessageAt' | 'lastMessagePreview'> {
  if (!messages.length) {
    return { lastMessageAt: 0, lastMessagePreview: undefined };
  }
  const last = messages[messages.length - 1];
  return {
    lastMessageAt: last.timestamp,
    lastMessagePreview: last.text.slice(0, 120),
  };
}

export interface ChatStorageContextValue {
  threads: ChatThread[];
  upsertThread: (thread: ChatThread) => void;
  removeThread: (chatId: string) => void;
  getMessages: (chatId: string) => ChatMessage[];
  mergeMessages: (
    chatId: string,
    incoming: ChatMessage[],
    meta?: { title?: string; phone?: string },
  ) => void;
  migrateChatId: (
    fromChatId: string,
    toChatId: string,
    meta?: { title?: string; phone?: string },
  ) => string;
  syncThreadsFromChats: (chats: GreenApiChat[]) => void;
  appendMessage: (message: ChatMessage, meta?: { title?: string; phone?: string }) => void;
  updateMessage: (chatId: string, id: string, patch: Partial<ChatMessage>) => void;
  resolveChatIdForPhone: (phone: string) => string;
}

const ChatStorageContext = createContext<ChatStorageContextValue | null>(null);

function useChatStorageState(): ChatStorageContextValue {
  const [threads, setThreads] = useState<ChatThread[]>(loadThreads);

  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  const upsertThread = useCallback((thread: ChatThread) => {
    setThreads((prev) => {
      const idx = prev.findIndex((t) => t.chatId === thread.chatId);
      if (idx === -1) {
        return [thread, ...prev].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      }
      const next = [...prev];
      const merged: ChatThread = {
        ...next[idx],
        ...thread,
        lastMessageAt: Math.max(next[idx].lastMessageAt, thread.lastMessageAt ?? 0),
        title: thread.title || next[idx].title,
        lastMessagePreview: thread.lastMessagePreview ?? next[idx].lastMessagePreview,
      };
      next[idx] = merged;
      return next.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    });
  }, []);

  const removeThread = useCallback((chatId: string) => {
    setThreads((prev) => prev.filter((t) => t.chatId !== chatId));
  }, []);

  const getMessages = useCallback((chatId: string) => loadMessages(chatId), []);

  const mergeMessages = useCallback(
    (
      chatId: string,
      incoming: ChatMessage[],
      meta?: { title?: string; phone?: string },
    ) => {
      if (!incoming.length) return;

      const normalized = incoming.map((m) => ({ ...m, chatId }));
      const existing = loadMessages(chatId);
      const byId = new Map(existing.map((m) => [m.id, m]));
      for (const m of normalized) byId.set(m.id, m);
      const merged = [...byId.values()].sort((a, b) => a.timestamp - b.timestamp);
      localStorage.setItem(messagesKey(chatId), JSON.stringify(merged));

      const existingThread = loadThreads().find((t) => t.chatId === chatId);
      const preview = threadMetaFromMessages(merged);
      upsertThread({
        chatId,
        title: meta?.title ?? existingThread?.title ?? chatId,
        phone: meta?.phone ?? existingThread?.phone,
        ...preview,
      });

      window.dispatchEvent(new CustomEvent('chat-messages-updated', { detail: chatId }));
      window.dispatchEvent(new CustomEvent('chat-threads-updated'));
    },
    [upsertThread],
  );

  const migrateChatId = useCallback(
    (fromChatId: string, toChatId: string, meta?: { title?: string; phone?: string }) => {
      if (fromChatId === toChatId) return toChatId;
      const fromMessages = loadMessages(fromChatId);
      const toMessages = loadMessages(toChatId);
      const byId = new Map<string, ChatMessage>();
      for (const m of toMessages) byId.set(m.id, m);
      for (const m of fromMessages) byId.set(m.id, { ...m, chatId: toChatId });
      const merged = [...byId.values()].sort((a, b) => a.timestamp - b.timestamp);
      localStorage.setItem(messagesKey(toChatId), JSON.stringify(merged));
      localStorage.removeItem(messagesKey(fromChatId));
      removeThread(fromChatId);
      const preview = threadMetaFromMessages(merged);
      upsertThread({
        chatId: toChatId,
        title: meta?.title ?? toChatId,
        phone: meta?.phone,
        ...preview,
      });
      window.dispatchEvent(new CustomEvent('chat-messages-updated', { detail: toChatId }));
      window.dispatchEvent(new CustomEvent('chat-threads-updated'));
      window.dispatchEvent(
        new CustomEvent('chat-id-migrated', { detail: { from: fromChatId, to: toChatId } }),
      );
      return toChatId;
    },
    [removeThread, upsertThread],
  );

  const syncThreadsFromChats = useCallback(
    (chats: GreenApiChat[]) => {
      const current = loadThreads();
      for (const chat of chats) {
        if (chat.type === 'bot' || chat.type === 'channel') continue;

        const phone =
          chat.phoneNumber && chat.phoneNumber > 0 ? String(chat.phoneNumber) : undefined;
        const legacyThread = current.find((t) => {
          if (t.chatId === chat.chatId) return true;
          if (!phone) return false;
          return normalizePhone(t.phone) === normalizePhone(phone);
        });

        if (legacyThread && legacyThread.chatId !== chat.chatId) {
          migrateChatId(legacyThread.chatId, chat.chatId, {
            title: chat.name,
            phone,
          });
        } else {
          upsertThread({
            chatId: chat.chatId,
            title: chat.name,
            phone,
            lastMessageAt: legacyThread?.lastMessageAt ?? 0,
            lastMessagePreview: legacyThread?.lastMessagePreview,
          });
        }
      }
    },
    [migrateChatId, upsertThread],
  );

  const appendMessage = useCallback(
    (message: ChatMessage, meta?: { title?: string; phone?: string }) => {
      mergeMessages(message.chatId, [message], meta);
    },
    [mergeMessages],
  );

  useEffect(() => {
    const handler = () => setThreads(loadThreads());
    window.addEventListener('chat-threads-updated', handler);
    return () => window.removeEventListener('chat-threads-updated', handler);
  }, []);

  const updateMessage = useCallback((chatId: string, id: string, patch: Partial<ChatMessage>) => {
    const existing = loadMessages(chatId);
    const next = existing.map((m) => (m.id === id ? { ...m, ...patch } : m));
    localStorage.setItem(messagesKey(chatId), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('chat-messages-updated', { detail: chatId }));
  }, []);

  const resolveChatIdForPhone = useCallback((phone: string): string => {
    const digits = normalizePhone(phone);
    const fromThreads = loadThreads().find((t) => normalizePhone(t.phone) === digits);
    if (fromThreads) return fromThreads.chatId;
    try {
      return phoneToChatId(phone);
    } catch {
      return phone;
    }
  }, []);

  return useMemo(
    () => ({
      threads,
      upsertThread,
      removeThread,
      getMessages,
      mergeMessages,
      migrateChatId,
      syncThreadsFromChats,
      appendMessage,
      updateMessage,
      resolveChatIdForPhone,
    }),
    [
      threads,
      upsertThread,
      removeThread,
      getMessages,
      mergeMessages,
      migrateChatId,
      syncThreadsFromChats,
      appendMessage,
      updateMessage,
      resolveChatIdForPhone,
    ],
  );
}

export function ChatStorageProvider({ children }: { children: ReactNode }) {
  const value = useChatStorageState();
  return <ChatStorageContext.Provider value={value}>{children}</ChatStorageContext.Provider>;
}

export function useChatStorage(): ChatStorageContextValue {
  const ctx = useContext(ChatStorageContext);
  if (!ctx) {
    throw new Error('useChatStorage must be used within ChatStorageProvider');
  }
  return ctx;
}

export function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const refresh = () => setMessages(loadMessages(chatId));
    refresh();
    const onMessages = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === chatId) refresh();
    };
    const onMigrate = (e: Event) => {
      const { from, to } = (e as CustomEvent<{ from: string; to: string }>).detail;
      if (from === chatId || to === chatId) refresh();
    };
    window.addEventListener('chat-messages-updated', onMessages);
    window.addEventListener('chat-id-migrated', onMigrate);
    return () => {
      window.removeEventListener('chat-messages-updated', onMessages);
      window.removeEventListener('chat-id-migrated', onMigrate);
    };
  }, [chatId]);

  return messages;
}
