import { useEffect, useRef } from 'react';
import { EMOJI_CATEGORIES } from '@/pages/messenger/.partials/constants/emojis';
import type { EmojiPickerProps } from '@/pages/messenger/.partials/components/emoji-picker/interface';
import { cn } from '@/shared/lib/cn';

export function EmojiPicker({ open, onClose, onPick, anchorRef }: EmojiPickerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute bottom-full left-0 z-50 mb-2 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-max-border bg-white shadow-xl',
        'animate-max-slide-down origin-bottom-left',
      )}
      role="dialog"
      aria-label="Выбор эмодзи"
    >
      <div className="max-h-56 overflow-auto p-2">
        {EMOJI_CATEGORIES.map((cat) => (
          <div key={cat.id} className="mb-2 last:mb-0">
            <p className="px-1 py-1 text-[11px] font-semibold text-max-text-secondary uppercase tracking-wide">
              {cat.label}
            </p>
            <div className="grid grid-cols-8 gap-0.5">
              {cat.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-xl transition-transform hover:bg-max-hover active:scale-90"
                  onClick={() => {
                    onPick(emoji);
                    onClose();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
