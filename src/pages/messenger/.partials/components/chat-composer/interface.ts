export interface ChatComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  error?: string | null;
}
