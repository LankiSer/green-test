export interface NewChatFormProps {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error?: string | null;
}
