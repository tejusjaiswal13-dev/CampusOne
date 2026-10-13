import React from 'react';
import { Notice } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  AlertCircle,
  Paperclip,
  Bookmark,
  Eye,
  Building2,
  Globe,
  GraduationCap,
  Briefcase,
  Trophy,
  FileText,
  Mic
} from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  onClick: () => void;
  compact?: boolean;
}

const CATEGORY_CONFIG: Record<string, {
  bg: string; text: string; border: string; strip: string; icon: React.FC<{ className?: string }>;
}> = {
  'Urgent': {
    bg: '#fff2f0', text: '#c43030', border: '#ffc2b9', strip: '#ff6b6b',
    icon: AlertCircle
  },
  'Examination': {
    bg: '#fff2f0', text: '#c43030', border: '#ffc2b9', strip: '#e84d4d',
    icon: FileText
  },
  'Academic': {
    bg: '#eef2f8', text: '#162c47', border: '#adbde0', strip: '#0a1628',
    icon: GraduationCap
  },
  'Placement': {
    bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', strip: '#16a34a',
    icon: Briefcase
  },
  'Internship': {
    bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', strip: '#16a34a',
    icon: Briefcase
  },
  'Scholarship': {
    bg: '#fffbeb', text: '#92400e', border: '#fde68a', strip: '#f59e0b',
    icon: Trophy
  },
  'Seminar': {
    bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', strip: '#9333ea',
    icon: Mic
  },
  'Workshop': {
    bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', strip: '#9333ea',
    icon: Mic
  },
  'Guest Lecture': {
    bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', strip: '#9333ea',
    icon: Mic
  },
  'Competition': {
    bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', strip: '#7c3aed',
    icon: Trophy
  },
  'General': {
    bg: '#f8fafc', text: '#475569', border: '#cbd5e1', strip: '#94a3b8',
    icon: Building2
  },
  'Department': {
    bg: '#f8fafc', text: '#475569', border: '#cbd5e1', strip: '#94a3b8',
    icon: Building2
  },
};

const DEFAULT_CONFIG = CATEGORY_CONFIG['General'];

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onClick, compact }) => {
  const { handleToggleBookmark, isItemBookmarked } = useApp();
  const bookmarked = isItemBookmarked(notice.id);

  const cfg = notice.isUrgent
    ? CATEGORY_CONFIG['Urgent']
    : (CATEGORY_CONFIG[notice.category] || DEFAULT_CONFIG);

  const CategoryIcon = cfg.icon;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleBookmark({
      itemType: 'NOTICE',
      itemId: notice.id,
      title: notice.title,
      subtitle: notice.deadline ? `Deadline: ${notice.deadline}` : `Published: ${notice.publishedAt.slice(0, 10)}`,
      category: notice.category,
      date: notice.deadline || notice.publishedAt.slice(0, 10)
    });
  };

  const publishedDate = new Date(notice.publishedAt).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short'
  });

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl cursor-pointer text-left active:scale-[0.985] transition-all duration-150 overflow-hidden"
      style={{
        border: `1px solid ${notice.isUrgent ? '#ffc2b9' : '#e2e8f0'}`,
        boxShadow: notice.isUrgent
          ? '0 0 0 2px rgba(255,107,107,0.08), 0 1px 4px rgba(0,0,0,0.06)'
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left category strip */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[3px]"
        style={{ backgroundColor: cfg.strip }}
      />

      <div className="pl-4 pr-4 pt-3.5 pb-3">
        {/* Top row: badges + bookmark */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Urgent badge */}
            {notice.isUrgent && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white"
                style={{ backgroundColor: '#ff6b6b' }}
              >
                <AlertCircle className="w-2.5 h-2.5" />
                URGENT
              </span>
            )}

            {/* Scope */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
              style={
                notice.scope === 'COLLEGE'
                  ? { backgroundColor: '#eef2f8', color: '#162c47', borderColor: '#adbde0' }
                  : { backgroundColor: '#fffbeb', color: '#92400e', borderColor: '#fde68a' }
              }
            >
              {notice.scope === 'COLLEGE'
                ? <><Globe className="w-2.5 h-2.5" /><span>University</span></>
                : <><Building2 className="w-2.5 h-2.5" /><span>{notice.departmentCode || 'Dept'}</span></>
              }
            </span>

            {/* Category */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
              style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
            >
              <CategoryIcon className="w-2.5 h-2.5" />
              <span>{notice.category}</span>
            </span>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleBookmarkClick}
            className="shrink-0 p-1 rounded-lg transition-all cursor-pointer"
            style={bookmarked ? { color: '#f59e0b' } : { color: '#94a3b8' }}
            title={bookmarked ? 'Unbookmark' : 'Bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="text-sm font-bold leading-snug line-clamp-2 mb-1.5"
          style={{ color: '#0f172a' }}
        >
          {notice.title}
        </h3>

        {/* Snippet */}
        {!compact && (
          <p className="text-xs leading-relaxed line-clamp-2 mb-2.5" style={{ color: '#64748b' }}>
            {notice.description}
          </p>
        )}

        {/* Footer meta */}
        <div
          className="flex items-center justify-between pt-2 border-t text-[11px]"
          style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {publishedDate}
            </span>
            {notice.deadline && (
              <span
                className="font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#fff2f0', color: '#c43030' }}
              >
                Due: {notice.deadline}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {notice.attachmentName && (
              <span
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border"
                style={{ backgroundColor: '#eef2f8', color: '#162c47', borderColor: '#adbde0' }}
              >
                <Paperclip className="w-2.5 h-2.5" />
                PDF
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Eye className="w-3 h-3" />
              {notice.viewsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
