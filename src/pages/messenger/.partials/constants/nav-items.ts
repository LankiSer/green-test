import type { LucideIcon } from 'lucide-react';
import { CircleDot, MessageCircle, Phone, Settings, UserRound, Users } from 'lucide-react';

export type NavSection = 'all' | 'new' | 'contacts' | 'groups' | 'calls' | 'settings';

export interface NavItem {
  id: NavSection;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'all', label: 'Все', icon: MessageCircle },
  { id: 'new', label: 'Новые', icon: CircleDot },
  { id: 'contacts', label: 'Контакты', icon: UserRound },
  { id: 'groups', label: 'Группы', icon: Users },
  { id: 'calls', label: 'Звонки', icon: Phone },
];

export const NAV_SETTINGS: NavItem = {
  id: 'settings',
  label: 'Настройки',
  icon: Settings,
};

export const SIDEBAR_TITLES: Record<NavSection, string> = {
  all: 'Чаты',
  new: 'Новые',
  contacts: 'Контакты',
  groups: 'Группы',
  calls: 'Звонки',
  settings: 'Настройки',
};
