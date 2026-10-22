import { Bookmark, ArrowUpRight, Pin, FileText } from "lucide-react";
import type { Notice } from "../../types";
import { useApp } from "../../context/AppContext";
interface NoticeCardProps {
  notice: Notice;
  onClick: () => void;
  compact?: boolean;
}
export const NoticeCard = ({ notice, onClick, compact }: NoticeCardProps) => {
  const { handleToggleBookmark, isItemBookmarked } = useApp();
  const saved = isItemBookmarked(notice.id);
  return (
    <article className={`co-notice-card ${compact ? "compact" : ""}`}>
      <div className="co-notice-meta">
        <span className="co-category">
          <FileText size={12} />
          {notice.category}
        </span>
        {notice.isUrgent && (
          <span className="co-priority">
            <Pin size={11} />
            Important
          </span>
        )}
        <button
          className={`co-save ${saved ? "saved" : ""}`}
          aria-label={saved ? "Remove saved notice" : "Save notice"}
          aria-pressed={saved}
          onClick={() =>
            handleToggleBookmark({
              itemType: "NOTICE",
              itemId: notice.id,
              title: notice.title,
              subtitle: notice.publisherName,
              category: notice.category,
              date: notice.publishedAt.slice(0, 10),
            })
          }
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <button className="co-notice-open" onClick={onClick}>
        <h3>{notice.title}</h3>
        {!compact && <p>{notice.description}</p>}
        <span className="co-notice-bottom">
          <span>
            {notice.scope === "COLLEGE"
              ? "Across campus"
              : notice.departmentCode}{" "}
            <i>·</i>{" "}
            {new Date(notice.publishedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
          <ArrowUpRight size={16} />
        </span>
      </button>
    </article>
  );
};
