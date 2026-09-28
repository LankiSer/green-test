import { LogOut, Shield } from 'lucide-react';
import type { SidebarSettingsProps } from '@/pages/messenger/.partials/components/sidebar-settings/interface';
import { Button } from '@/shared/components/ui/Button';

export function SidebarSettings({ idInstance, apiUrl, onLogout }: SidebarSettingsProps) {
  return (
    <div className="flex flex-1 flex-col overflow-auto px-4 py-4 animate-max-fade-in">
      <section className="rounded-2xl border border-max-border bg-max-panel p-4">
        <div className="mb-3 flex items-center gap-2 text-max-accent">
          <Shield className="h-5 w-5" />
          <h2 className="text-sm font-semibold">Инстанс GREEN-API</h2>
        </div>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-max-text-secondary">idInstance</dt>
            <dd className="font-medium break-all">{idInstance}</dd>
          </div>
          <div>
            <dt className="text-max-text-secondary">apiUrl</dt>
            <dd className="font-medium break-all">{apiUrl}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-max-border bg-white p-4 text-sm text-max-text-secondary">
        <p>
          Чаты и история подтягиваются через GetChats, журналы сообщений и GetChatHistory. Новые
          сообщения в реальном времени — через ReceiveNotification (webhook в кабинете должен быть
          пустым).
        </p>
      </section>

      <Button
        variant="outline"
        className="mt-auto w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        Выйти из аккаунта
      </Button>
    </div>
  );
}
