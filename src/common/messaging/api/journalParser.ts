import type { ChatMessage } from '@/common/messaging/entities/message';

export interface JournalEntry {
  type?: string;
  idMessage?: string;
  timestamp?: number;
  typeMessage?: string;
  chatId?: string;
  textMessage?: string;
  senderName?: string;
  extendedTextMessage?: { text?: string };
}

const TEXT_TYPES = new Set(['textMessage', 'extendedTextMessage']);

function extractText(entry: JournalEntry): string | null {
  if (!TEXT_TYPES.has(entry.typeMessage ?? '')) return null;
  const text = entry.textMessage?.trim() || entry.extendedTextMessage?.text?.trim();
  return text || null;
}

export function journalEntryToMessage(entry: JournalEntry): ChatMessage | null {
  const chatId = entry.chatId;
  const text = extractText(entry);
  if (!chatId || !text || !entry.idMessage) return null;

  const direction: ChatMessage['direction'] =
    entry.type === 'outgoing' ? 'outgoing' : 'incoming';

  return {
    id: entry.idMessage,
    chatId,
    text,
    direction,
    timestamp: (entry.timestamp ?? 0) * 1000,
    status: 'sent',
  };
}

export function journalEntriesToMessages(entries: JournalEntry[]): ChatMessage[] {
  const result: ChatMessage[] = [];
  for (const entry of entries) {
    const msg = journalEntryToMessage(entry);
    if (msg) result.push(msg);
  }
  return result;
}
