import { MessageCircle } from 'lucide-react';

export function ChatEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-max-panel/40 animate-max-scale-in">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
        <MessageCircle className="h-12 w-12 text-max-accent/70" strokeWidth={1.5} />
      </div>
      <div className="max-w-xs text-center">
        <p className="text-lg font-semibold text-max-text">MAX Web Chat</p>
        <p className="mt-1 text-sm text-max-text-secondary">
          Выберите чат слева или создайте новый по номеру телефона
        </p>
      </div>
    </div>
  );
}
