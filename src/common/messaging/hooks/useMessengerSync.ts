import { useCallback, useEffect, useRef, useState } from 'react';
import type { GreenApiCredentials } from '@/common/auth/entities/credentials';
import {
  getChatHistory,
  getChats,
  lastIncomingMessages,
  lastOutgoingMessages,
  type GreenApiError,
} from '@/common/messaging/api/greenApiClient';
import {
  journalEntriesToMessages,
  type JournalEntry,
} from '@/common/messaging/api/journalParser';
import type { ChatStorageContextValue } from '@/common/messaging/providers/ChatStorageProvider';
import { sleep } from '@/common/messaging/lib/sleep';

const HISTORY_TTL_MS = 5 * 60 * 1000;
const API_GAP_MS = 400;

export function useMessengerSync(
  credentials: GreenApiCredentials | null,
  storage: Pick<ChatStorageContextValue, 'syncThreadsFromChats' | 'mergeMessages'>,
) {
  const { syncThreadsFromChats, mergeMessages } = storage;
  const [syncing, setSyncing] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const initialSyncDone = useRef(false);
  const historyCache = useRef<Map<string, number>>(new Map());
  const syncInFlight = useRef(false);

  const syncAll = useCallback(
    async (force = false) => {
      if (!credentials || syncInFlight.current) return;
      syncInFlight.current = true;
      setSyncing(true);
      setSyncError(null);
      try {
        const chats = await getChats(credentials);
        await sleep(API_GAP_MS);
        syncThreadsFromChats(chats);

        const incomingRaw = await lastIncomingMessages(credentials, 10_080);
        await sleep(API_GAP_MS);
        const outgoingRaw = await lastOutgoingMessages(credentials, 10_080);

        const entries = [...incomingRaw, ...outgoingRaw] as JournalEntry[];
        const messages = journalEntriesToMessages(entries);

        const byChat = new Map<string, typeof messages>();
        for (const msg of messages) {
          const list = byChat.get(msg.chatId) ?? [];
          list.push(msg);
          byChat.set(msg.chatId, list);
        }

        for (const chat of chats) {
          const batch = byChat.get(chat.chatId);
          if (!batch?.length) continue;
          mergeMessages(chat.chatId, batch, {
            title: chat.name,
            phone: chat.phoneNumber ? String(chat.phoneNumber) : undefined,
          });
        }

        for (const [chatId, batch] of byChat) {
          if (chats.some((c) => c.chatId === chatId)) continue;
          mergeMessages(chatId, batch);
        }

        if (force) {
          historyCache.current.clear();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка синхронизации';
        setSyncError(message.includes('429') ? 'Слишком много запросов. Подождите минуту.' : message);
        console.error('[sync]', err);
      } finally {
        setSyncing(false);
        syncInFlight.current = false;
      }
    },
    [credentials, mergeMessages, syncThreadsFromChats],
  );

  const loadChatHistory = useCallback(
    async (chatId: string, force = false) => {
      if (!credentials || !chatId) return;

      const cachedAt = historyCache.current.get(chatId);
      if (!force && cachedAt && Date.now() - cachedAt < HISTORY_TTL_MS) {
        return;
      }

      setHistoryLoading(true);
      try {
        await sleep(API_GAP_MS);
        const raw = await getChatHistory(credentials, chatId, 50);
        const messages = journalEntriesToMessages(raw as JournalEntry[]);
        if (messages.length) {
          mergeMessages(chatId, messages);
        }
        historyCache.current.set(chatId, Date.now());
      } catch (err) {
        const error = err as GreenApiError;
        if (error.status === 429) {
          setSyncError('Лимит API: история чата загрузится позже.');
        }
        console.error('[history]', error.message);
      } finally {
        setHistoryLoading(false);
      }
    },
    [credentials, mergeMessages],
  );

  useEffect(() => {
    if (!credentials || initialSyncDone.current) return;
    initialSyncDone.current = true;
    void syncAll(false);
  }, [credentials, syncAll]);

  return {
    syncing,
    historyLoading,
    syncError,
    syncAll,
    loadChatHistory,
  };
}
