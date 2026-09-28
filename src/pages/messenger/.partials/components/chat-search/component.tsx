import { Search } from 'lucide-react';
import type { ChatSearchProps } from '@/pages/messenger/.partials/components/chat-search/interface';
import { Input } from '@/shared/components/ui/Input';

export function ChatSearch({ value, onChange }: ChatSearchProps) {
  return (
    <div className="relative px-3 pb-2">
      <Search className="pointer-events-none absolute top-1/2 left-6 h-4 w-4 -translate-y-1/2 text-max-muted" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl bg-max-panel py-2 pl-9"
        placeholder="Найти"
      />
    </div>
  );
}
