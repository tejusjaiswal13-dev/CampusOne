import {
  AlertCircle,
  Bookmark,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Globe,
  Printer,
  Share2,
  X,
} from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { shareNotice } from "../../services/nativeService";
import { Notice } from "../../types";

interface NoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  onClose,
}) => {
  const { handleToggleBookmark, isItemBookmarked, showToast } = useApp();

  if (!notice) return null;

  const bookmarked = isItemBookmarked(notice.id);

  const handleShare = async () => {
    try {
      await shareNotice(notice);
      showToast("Notice shared or copied.", "success");
    } catch {
      showToast("Sharing was cancelled or unavailable.", "info");
    }
  };

  const handleDownload = () => {
    showToast(
      `Downloading ${notice.attachmentName || "Notice_Document.pdf"}...`,
      "info",
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top bar with actions */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
              Official Campus Communication
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleToggleBookmark({
                  itemType: "NOTICE",
                  itemId: notice.id,
                  title: notice.title,
                  subtitle: notice.deadline
                    ? `Deadline: ${notice.deadline}`
                    : `Published: ${notice.publishedAt.slice(0, 10)}`,
                  category: notice.category,
                  date: notice.deadline || notice.publishedAt.slice(0, 10),
                })
              }
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                bookmarked
                  ? "text-amber-400 bg-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
              title="Bookmark Notice"
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Share Notice"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Print Notice"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal content body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1 text-left">
          {/* Official Letterhead Heading */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-blue-900 flex items-center justify-center p-1">
                <Globe className="w-full h-full text-amber-400" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-blue-950 uppercase">
                University of Allahabad
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight">
              Institute of Professional Studies (IPS)
            </h4>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Ref: IPS/UOA/PUB/{notice.id.toUpperCase()}-2026
            </p>
          </div>

          {/* Urgent Alert Banner */}
          {notice.isUrgent && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">CRITICAL / ACTION REQUIRED: </span>
                <span>
                  Please read the instructions carefully before the stated
                  deadline.
                </span>
              </div>
            </div>
          )}

          {/* Metadata badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                notice.scope === "COLLEGE"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {notice.scope === "COLLEGE" ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Building2 className="w-3.5 h-3.5" />
              )}
              <span>
                {notice.scope === "COLLEGE"
                  ? "College-Wide Announcement"
                  : `${notice.departmentCode} Department`}
              </span>
            </span>

            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              Category: {notice.category}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(notice.publishedAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>

          {/* Notice Title */}
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {notice.title}
          </h2>

          {/* Deadline reminder */}
          {notice.deadline && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900">
                Submission / Last Date:
              </span>
              <span className="font-extrabold text-rose-600 bg-white px-2.5 py-1 rounded-md border border-rose-200 shadow-2xs">
                {new Date(notice.deadline).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Full description */}
          <div className="prose prose-sm text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
            {notice.description}
          </div>

          {/* Simulated PDF Attachment Preview */}
          {notice.attachmentName && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {notice.attachmentName}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {notice.attachmentSize || "Official PDF Document"} •
                      Digitally Signed
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              {/* Simulated document page box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 font-mono space-y-1 shadow-inner">
                <p className="font-bold text-slate-700">
                  --- [OFFICIAL ATTACHMENT PREVIEW] ---
                </p>
                <p>
                  INSTITUTE OF PROFESSIONAL STUDIES • UNIVERSITY OF ALLAHABAD
                </p>
                <p>SUBJECT: {notice.title}</p>
                <p>DOCUMENT STATUS: VERIFIED & SEALED BY COMPETENT AUTHORITY</p>
              </div>
            </div>
          )}

          {/* Digital Signature & Publisher Seal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                Published By
              </p>
              <p className="text-xs font-bold text-slate-900">
                {notice.publisherName}
              </p>
              <p className="text-[11px] text-slate-500">
                {notice.publisherRole}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>IPS Authenticated</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
