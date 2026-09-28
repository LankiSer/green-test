import { X } from 'lucide-react';
import type { NewChatFormProps } from '@/pages/messenger/.partials/components/new-chat-form/interface';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export function NewChatForm({ phone, onPhoneChange, onSubmit, onClose, error }: NewChatFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="animate-max-slide-down mx-3 mb-2 rounded-2xl border border-max-border bg-white p-3 shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Новый чат</p>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full p-1 text-max-muted transition-colors hover:bg-max-hover hover:text-max-text"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mb-2 text-xs text-max-text-secondary">Номер телефона получателя</p>
      <div className="flex gap-2">
        <Input
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="+7 999 123-45-67"
          autoFocus
        />
        <Button type="submit" className="shrink-0 rounded-xl">
          Создать
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </form>
  );
}
