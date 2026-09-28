import type { RefObject } from 'react';

export interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
  anchorRef: RefObject<HTMLElement | null>;
}
