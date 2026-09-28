import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage, ChatThread } from '@/common/messaging/entities/message';

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

function loadMessages(chatId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(messagesKey(chatId));
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function useChatStorage() {
  const [threads, setThreads] = useState<ChatThread[]>(loadThreads);

  useEffect(() => {
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  }, [threads]);

  const upsertThread = useCallback((thread: ChatThread) => {
    setThreads((prev) => {
      const idx = prev.findIndex((t) => t.chatId === thread.chatId);
      if (idx === -1) return [thread, ...prev].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      const next = [...prev];
      next[idx] = { ...next[idx], ...thread };
      return next.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    });
  }, []);

  const getMessages = useCallback((chatId: string) => loadMessages(chatId), []);

  const appendMessage = useCallback(
    (message: ChatMessage, meta?: { title?: string; phone?: string }) => {
      const existing = loadMessages(message.chatId);
      if (existing.some((m) => m.id === message.id)) return;

      const merged = [...existing, message].sort((a, b) => a.timestamp - b.timestamp);
      localStorage.setItem(messagesKey(message.chatId), JSON.stringify(merged));

      upsertThread({
        chatId: message.chatId,
        title: meta?.title ?? message.chatId,
        phone: meta?.phone,
        lastMessageAt: message.timestamp,
        lastMessagePreview: message.text.slice(0, 120),
      });

      window.dispatchEvent(new CustomEvent('chat-messages-updated', { detail: message.chatId }));
      window.dispatchEvent(new CustomEvent('chat-threads-updated'));
    },
    [upsertThread],
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

  return { threads, upsertThread, getMessages, appendMessage, updateMessage };
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
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === chatId) refresh();
    };
    window.addEventListener('chat-messages-updated', handler);
    return () => window.removeEventListener('chat-messages-updated', handler);
  }, [chatId]);

  return messages;
}
