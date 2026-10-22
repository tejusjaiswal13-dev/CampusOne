import { Bookmark, MapPin, ArrowUpRight, CalendarDays } from "lucide-react";
import type { MouseEvent } from "react";
import type { CampusEvent } from "../../types";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
interface EventCardProps {
  event: CampusEvent;
  onClick: () => void;
  onRegisterClick: (e: MouseEvent) => void;
}
export const EventCard = ({
  event,
  onClick,
  onRegisterClick,
}: EventCardProps) => {
  const { currentUser } = useAuth();
  const { handleToggleBookmark, isItemBookmarked } = useApp();
  const saved = isItemBookmarked(event.id);
  const registered =
    !!currentUser && event.registeredUserIds.includes(currentUser.id);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const ended = event.date < today;
  const closed =
    ended ||
    event.registrationDeadline < today ||
    event.availableSeats <= 0 ||
    event.status !== "APPROVED";
  return (
    <article className="co-event-card">
      <div className="co-event-image">
        {event.bannerImage ? (
          <img src={event.bannerImage} alt="" loading="lazy" />
        ) : (
          <div className="co-event-image-fallback">
            <CalendarDays size={48} />
          </div>
        )}
        <span className="co-event-tag">
          {ended ? "Past event" : event.category}
        </span>
        <button
          className={`co-save ${saved ? "saved" : ""}`}
          aria-label={saved ? "Remove saved event" : "Save event"}
          aria-pressed={saved}
          onClick={() =>
            handleToggleBookmark({
              itemType: "EVENT",
              itemId: event.id,
              title: event.title,
              subtitle: event.venue,
              category: event.category,
              date: event.date,
            })
          }
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="co-event-body">
        <button className="co-event-title" onClick={onClick}>
          <span className="co-eyebrow">
            {new Date(event.date + "T12:00:00").toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
            })}{" "}
            · {event.time}
          </span>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </button>
        <div className="co-event-location">
          <MapPin size={14} />
          {event.venue}
        </div>
        <div className="co-event-footer">
          <span>
            {registered
              ? "You’re registered"
              : closed
                ? "Registration closed"
                : `${event.availableSeats} places available`}
          </span>
          <button
            className="co-text-button"
            onClick={registered || closed ? onClick : onRegisterClick}
          >
            {registered ? "View event" : closed ? "Details" : "Register"}
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};
