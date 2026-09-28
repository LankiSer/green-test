import type { GreenApiCredentials } from '@/common/auth/entities/credentials';

export class GreenApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GreenApiError';
    this.status = status;
  }
}

/** В dev запросы идут через Vite proxy (обход CORS). */
export function resolveApiBase(credentials: GreenApiCredentials): string {
  if (import.meta.env.DEV) {
    return '/green-api';
  }
  return credentials.apiUrl.replace(/\/$/, '');
}

function instancePath(credentials: GreenApiCredentials, method: string): string {
  const base = resolveApiBase(credentials);
  return `${base}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`;
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; reason?: string };
    return data.message ?? data.reason ?? res.statusText;
  } catch {
    return res.statusText || 'Ошибка запроса';
  }
}

export async function sendTextMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
): Promise<{ idMessage: string }> {
  const url = instancePath(credentials, 'sendMessage');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  return (await res.json()) as { idMessage: string };
}

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: GreenNotificationBody;
}

export interface GreenNotificationBody {
  typeWebhook: string;
  timestamp?: number;
  idMessage?: string;
  senderData?: {
    chatId?: string;
    chatName?: string;
    senderPhoneNumber?: number | string;
  };
  messageData?: {
    typeMessage?: string;
    textMessageData?: { textMessage?: string };
  };
}

export async function receiveNotification(
  credentials: GreenApiCredentials,
  receiveTimeout = 25,
): Promise<ReceiveNotificationResponse | null> {
  const url = `${instancePath(credentials, 'receiveNotification')}?receiveTimeout=${receiveTimeout}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  const text = await res.text();
  if (!text || text === 'null') return null;
  try {
    const data = JSON.parse(text) as ReceiveNotificationResponse;
    if (!data?.receiptId || !data?.body) return null;
    return data;
  } catch {
    return null;
  }
}

export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
): Promise<void> {
  const url = `${instancePath(credentials, 'deleteNotification')}/${receiptId}`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
}

export async function getInstanceState(credentials: GreenApiCredentials): Promise<string> {
  const url = instancePath(credentials, 'getStateInstance');
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as { stateInstance?: string };
  return data.stateInstance ?? 'unknown';
}

export interface GreenApiChat {
  chatId: string;
  name: string;
  type: 'user' | 'group' | 'channel' | 'bot' | string;
  phoneNumber?: number;
}

export async function getChats(credentials: GreenApiCredentials): Promise<GreenApiChat[]> {
  const url = instancePath(credentials, 'getChats');
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as GreenApiChat[];
  return Array.isArray(data) ? data : [];
}

export async function getChatHistory(
  credentials: GreenApiCredentials,
  chatId: string,
  count = 100,
): Promise<unknown[]> {
  const url = instancePath(credentials, 'getChatHistory');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, count }),
  });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? data : [];
}

export async function lastIncomingMessages(
  credentials: GreenApiCredentials,
  minutes = 10_080,
): Promise<unknown[]> {
  const url = `${instancePath(credentials, 'lastIncomingMessages')}?minutes=${minutes}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? data : [];
}

export async function lastOutgoingMessages(
  credentials: GreenApiCredentials,
  minutes = 10_080,
): Promise<unknown[]> {
  const url = `${instancePath(credentials, 'lastOutgoingMessages')}?minutes=${minutes}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new GreenApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? data : [];
}
