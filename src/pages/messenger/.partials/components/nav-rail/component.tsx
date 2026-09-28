import { NAV_ITEMS, NAV_SETTINGS } from '@/pages/messenger/.partials/constants/nav-items';
import type { NavRailProps } from '@/pages/messenger/.partials/components/nav-rail/interface';
import { cn } from '@/shared/lib/cn';

export function NavRail({ activeSection, onSectionChange }: NavRailProps) {
  return (
    <nav
      className="animate-max-fade-in hidden w-[72px] shrink-0 flex-col border-r border-max-border bg-max-rail py-3 md:flex"
      aria-label="Навигация"
    >
      <div className="flex flex-1 flex-col items-center gap-1 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'group flex w-full cursor-pointer flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition-all duration-200',
                isActive ? 'bg-max-active text-max-accent' : 'text-max-text-secondary hover:bg-max-hover',
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 transition-transform duration-200 group-hover:scale-105',
                  isActive && 'text-max-accent',
                )}
                strokeWidth={1.75}
              />
              <span className="max-w-full truncate text-[10px] leading-tight font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onSectionChange(NAV_SETTINGS.id)}
        className={cn(
          'mx-2 flex cursor-pointer flex-col items-center gap-0.5 rounded-xl py-2 transition-colors duration-200',
          activeSection === 'settings'
            ? 'bg-max-active text-max-accent'
            : 'text-max-text-secondary hover:bg-max-hover hover:text-max-text',
        )}
      >
        <NAV_SETTINGS.icon className="h-6 w-6" strokeWidth={1.75} />
        <span className="text-[10px] font-medium">{NAV_SETTINGS.label}</span>
      </button>
    </nav>
  );
}
