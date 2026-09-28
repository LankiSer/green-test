import type { ReactNode } from 'react';
import { AuthProvider } from '@/common/auth/providers/AuthProvider';
import { ChatStorageProvider } from '@/common/messaging/providers/ChatStorageProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatStorageProvider>{children}</ChatStorageProvider>
    </AuthProvider>
  );
}
