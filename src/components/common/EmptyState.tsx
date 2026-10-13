import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryTip?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  secondaryTip
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border border-dashed border-slate-200 bg-white/70 shadow-xs my-4">
      {/* Icon with soft academic navy ring */}
      <div className="relative mb-3.5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border"
          style={{ backgroundColor: '#eef2f8', borderColor: '#d6dff0', color: '#0a1628' }}
        >
          <Icon className="w-7 h-7 stroke-[1.75]" />
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>

      {secondaryTip && (
        <div className="mb-4 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium max-w-xs">
          💡 {secondaryTip}
        </div>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
          style={{ backgroundColor: '#0a1628' }}
        >
          <span>{actionText}</span>
          <span style={{ color: '#f59e0b' }} className="font-black">→</span>
        </button>
      )}
    </div>
  );
};
