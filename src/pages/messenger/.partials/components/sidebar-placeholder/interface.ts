import type { LucideIcon } from 'lucide-react';

export interface SidebarPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
