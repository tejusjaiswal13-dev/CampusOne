import React from "react";

export const NoticeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-200 rounded-full" />
        <div className="h-4 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-100 rounded-md" />
        <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
      </div>
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <div className="h-4 w-28 bg-slate-200 rounded-md" />
        <div className="h-4 w-12 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
};

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-200 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="h-4 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-5 w-4/5 bg-slate-200 rounded-md" />
        <div className="h-3.5 w-1/2 bg-slate-100 rounded-md" />
        <div className="h-9 w-full bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};
