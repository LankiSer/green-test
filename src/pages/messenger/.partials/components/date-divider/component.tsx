import type { DateDividerProps } from '@/pages/messenger/.partials/components/date-divider/interface';

export function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="flex justify-center py-3">
      <span className="rounded-full bg-[#99b4c9]/90 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}
