import { useEffect, useRef } from 'react';
import { useAuth } from '@/common/auth/providers/AuthProvider';
import {
  deleteNotification,
  receiveNotification,
  type GreenApiError,
} from '@/common/messaging/api/greenApiClient';
import { notificationToMessage } from '@/common/messaging/api/notificationParser';
import { useChatStorage } from '@/common/messaging/hooks/useChatStorage';
import { formatPhoneDisplay } from '@/common/messaging/lib/phone';

export function useNotificationPolling(enabled: boolean) {
  const { credentials } = useAuth();
  const { appendMessage } = useChatStorage();
  const running = useRef(false);
  const abort = useRef(false);

  useEffect(() => {
    if (!enabled || !credentials) return;

    abort.current = false;

    const loop = async () => {
      if (running.current || abort.current) return;
      running.current = true;
      try {
        while (!abort.current) {
          const notification = await receiveNotification(credentials, 25);
          if (abort.current) break;
          if (notification) {
            const msg = notificationToMessage(notification.body);
            if (msg) {
              const title =
                notification.body.senderData?.chatName ??
                formatPhoneDisplay(String(notification.body.senderData?.senderPhoneNumber ?? ''));
              appendMessage(msg, { title: title || msg.chatId });
            }
            await deleteNotification(credentials, notification.receiptId);
          }
        }
      } catch (err) {
        const error = err as GreenApiError;
        console.error('[GREEN-API polling]', error.message);
        if (!abort.current) {
          await new Promise((r) => setTimeout(r, 3000));
          running.current = false;
          void loop();
        }
      } finally {
        running.current = false;
      }
    };

    void loop();

    return () => {
      abort.current = true;
    };
  }, [enabled, credentials, appendMessage]);
}
