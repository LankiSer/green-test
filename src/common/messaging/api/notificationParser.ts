import type { ChatMessage } from '@/common/messaging/entities/message';
import type { GreenNotificationBody } from '@/common/messaging/api/greenApiClient';

const TEXT_TYPES = new Set(['textMessage', 'extendedTextMessage']);

function extractText(body: GreenNotificationBody): string | null {
  const type = body.messageData?.typeMessage;
  if (!type || !TEXT_TYPES.has(type)) return null;
  const text = body.messageData?.textMessageData?.textMessage;
  return text?.trim() ? text : null;
}

export function notificationToMessage(body: GreenNotificationBody): ChatMessage | null {
  const text = extractText(body);
  if (!text) return null;

  const chatId = body.senderData?.chatId;
  if (!chatId) return null;

  const type = body.typeWebhook;
  const isIncoming = type === 'incomingMessageReceived';
  const isOutgoing =
    type === 'outgoingMessageReceived' || type === 'outgoingAPIMessageReceived';

  if (!isIncoming && !isOutgoing) return null;

  const direction: ChatMessage['direction'] = isIncoming ? 'incoming' : 'outgoing';

  const id = body.idMessage ?? `${body.timestamp ?? Date.now()}-${Math.random()}`;
  const timestamp = (body.timestamp ?? Math.floor(Date.now() / 1000)) * 1000;

  return {
    id,
    chatId,
    text,
    direction,
    timestamp,
    status: 'sent',
  };
}
