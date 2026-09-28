import type { SidebarPlaceholderProps } from '@/pages/messenger/.partials/components/sidebar-placeholder/interface';
import { Button } from '@/shared/components/ui/Button';

export function SidebarPlaceholder({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: SidebarPlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center animate-max-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-max-panel">
        <Icon className="h-7 w-7 text-max-muted" strokeWidth={1.5} />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-max-text-secondary">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" className="mt-2 rounded-xl" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
