import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/common/auth/providers/AuthProvider';
import { getInstanceState } from '@/common/messaging/api/greenApiClient';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

const DEFAULT_API_URL = import.meta.env.VITE_GREEN_API_URL ?? 'https://3100.api.green-api.com';

export function LoginPage() {
  const { login } = useAuth();
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [idInstance, setIdInstance] = useState(import.meta.env.VITE_GREEN_ID_INSTANCE ?? '');
  const [apiTokenInstance, setApiTokenInstance] = useState(
    import.meta.env.VITE_GREEN_API_TOKEN ?? '',
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const credentials = {
      apiUrl: apiUrl.trim().replace(/\/$/, ''),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };
    try {
      const state = await getInstanceState(credentials);
      if (state !== 'authorized') {
        setError(
          `Инстанс не авторизован (состояние: ${state}). Отсканируйте QR в личном кабинете GREEN-API.`,
        );
        setLoading(false);
        return;
      }
      login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось подключиться к API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-max-panel px-4 py-12 animate-max-fade-in">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-max-accent shadow-lg shadow-max-accent/30">
            <MessageCircle className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">MAX Web Chat</h1>
          <p className="mt-2 text-sm text-max-muted">
            Тестовое задание GREEN-API — вход по данным инстанса
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-max-border bg-white p-6 shadow-lg shadow-black/5"
        >
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-max-muted">apiUrl</span>
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://3100.api.green-api.com"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-max-muted">idInstance</span>
              <Input
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                placeholder="310022749233"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-max-muted">apiTokenInstance</span>
              <Input
                type="password"
                value={apiTokenInstance}
                onChange={(e) => setApiTokenInstance(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="off"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'Проверка…' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
