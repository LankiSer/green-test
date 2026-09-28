import { useRef, useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { EmojiPicker } from '@/pages/messenger/.partials/components/emoji-picker/component';
import { insertTextAtCursor } from '@/pages/messenger/.partials/lib/insert-text-at-cursor';
import type { ChatComposerProps } from '@/pages/messenger/.partials/components/chat-composer/interface';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/cn';

export function ChatComposer({ draft, onDraftChange, onSubmit, sending, error }: ChatComposerProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      onDraftChange(draft + emoji);
      return;
    }
    const { value, cursor } = insertTextAtCursor(el, emoji, draft);
    onDraftChange(value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <footer className="border-t border-max-border bg-max-sidebar px-3 py-3 md:px-4">
      {error && <p className="mb-2 text-center text-xs text-red-500">{error}</p>}
      <form
        onSubmit={onSubmit}
        className="relative mx-auto flex max-w-3xl items-end gap-2 rounded-2xl bg-max-panel p-1.5 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-max-accent/20"
      >
        <div className="relative shrink-0">
          <button
            ref={emojiBtnRef}
            type="button"
            onClick={() => setEmojiOpen((v) => !v)}
            className={cn(
              'flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors',
              emojiOpen
                ? 'bg-max-accent-soft text-max-accent'
                : 'text-max-muted hover:bg-white hover:text-max-accent',
            )}
            aria-label="Эмодзи"
            aria-expanded={emojiOpen}
          >
            <Smile className="h-5 w-5" />
          </button>
          <EmojiPicker
            open={emojiOpen}
            onClose={() => setEmojiOpen(false)}
            onPick={insertEmoji}
            anchorRef={emojiBtnRef}
          />
        </div>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Сообщение"
          rows={1}
          maxLength={4000}
          disabled={sending}
          className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2.5 text-[15px] text-max-text placeholder:text-max-muted focus:outline-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !draft.trim()}
          className="shrink-0 rounded-xl"
          aria-label="Отправить"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </footer>
  );
}
