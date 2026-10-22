import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, toastType, clearToast } = useApp();

  if (!toastMessage) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-900/95 text-white border-emerald-700',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
    },
    error: {
      bg: 'bg-rose-900/95 text-white border-rose-700',
      icon: <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
    },
    info: {
      bg: 'bg-slate-900/95 text-white border-slate-700',
      icon: <Info className="w-5 h-5 text-blue-300 shrink-0" />
    }
  };

  const config = typeConfig[toastType || 'info'];

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`flex items-center justify-between p-3.5 rounded-xl shadow-sm border backdrop-blur-md ${config.bg}`}
      >
        <div className="flex items-center gap-3">
          {config.icon}
          <p className="text-sm font-medium leading-snug">{toastMessage}</p>
        </div>
        <button
          onClick={clearToast}
          className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
