import type { NavSection } from '@/pages/messenger/.partials/constants/nav-items';

export interface NavRailProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}
