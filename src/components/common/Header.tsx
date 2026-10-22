import { Bell, Search, GraduationCap, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export const Header = () => {
  const { currentUser } = useAuth();
  const {
    setCurrentTab,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    setIsRoleSwitcherOpen,
  } = useApp();
  const initials =
    currentUser?.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("") || "CO";
  return (
    <header className="co-header">
      <button
        className="co-brand"
        onClick={() => setCurrentTab("home")}
        aria-label="CampusOne home"
      >
        <span className="co-brand-mark">
          <GraduationCap size={23} />
        </span>
        <span>
          Campus<span className="co-brand-one">One</span>
          <small>ONE PLATFORM, ENTIRE CAMPUS</small>
        </span>
      </button>
      <button
        className="co-header-search"
        onClick={() => setCurrentTab("search")}
      >
        <Search size={17} />
        <span>Search your campus</span>
        <ArrowUpRight size={15} />
      </button>
      <div className="co-header-actions">
        <button
          className="co-demo-pill"
          onClick={() => setIsRoleSwitcherOpen(true)}
        >
          Demo <span>· Switch profile</span>
        </button>
        {currentUser && (
          <>
            <button
              className="co-icon-button"
              aria-label={`Notifications, ${unreadNotificationsCount} unread`}
              onClick={() => setIsNotificationCenterOpen(true)}
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && <i />}
            </button>
            <button
              className="co-avatar"
              aria-label="Open your profile"
              onClick={() => setCurrentTab("profile")}
            >
              {initials}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
