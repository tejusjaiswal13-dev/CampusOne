import {
  ArrowUpRight,
  BellRing,
  Bookmark,
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  Compass,
  FileCheck,
  Home,
  Plus,
  Send,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";

export const DesktopSidebar = () => {
  const { currentUser, role } = useAuth();
  const {
    currentTab,
    setCurrentTab,
    getPendingApprovals,
    setIsCreateNoticeOpen,
    deviceMode,
  } = useApp();
  if (!currentUser || deviceMode === "mobile-frame") return null;
  const roleLinks =
    role === "FACULTY"
      ? [
          { id: "classes", label: "My classes", icon: BookOpen },
          { id: "class-notices", label: "Class notices", icon: Send },
          { id: "students", label: "Students", icon: Users },
        ]
      : role === "DEPARTMENT_ADMIN"
        ? [
            { id: "approvals", label: "Approvals", icon: FileCheck },
            { id: "faculty", label: "Faculty", icon: Users },
          ]
        : role === "COLLEGE_ADMIN"
          ? [
              { id: "users", label: "People & access", icon: ShieldCheck },
              { id: "departments", label: "Departments", icon: Building2 },
            ]
          : [{ id: "timetable", label: "My timetable", icon: Clock }];
  const links = [
    {
      id: "home",
      label: role === "STUDENT" ? "Overview" : "Dashboard",
      icon: Home,
    },
    { id: "explore", label: "Explore campus", icon: Compass },
    { id: "notices", label: "Noticeboard", icon: BellRing },
    { id: "events", label: "Events", icon: CalendarDays },
    ...roleLinks,
    { id: "bookmarks", label: "Saved items", icon: Bookmark },
  ];
  const pending = getPendingApprovals();
  return (
    <aside className="co-sidebar">
      <div className="co-sidebar-label">
        YOUR WORKSPACE <span>{currentUser.departmentCode}</span>
      </div>
      <nav aria-label="Campus navigation">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            aria-current={currentTab === id ? "page" : undefined}
            className={currentTab === id ? "active" : ""}
            onClick={() => setCurrentTab(id)}
          >
            <Icon size={19} />
            <span>{label}</span>
            {id === "approvals" &&
              pending.notices.length + pending.events.length > 0 && (
                <small>{pending.notices.length + pending.events.length}</small>
              )}
          </button>
        ))}
      </nav>
      <div className="co-sidebar-divider" />
      <div className="co-sidebar-label">PERSONAL</div>
      <nav>
        <button
          aria-current={currentTab === "profile" ? "page" : undefined}
          className={currentTab === "profile" ? "active" : ""}
          onClick={() => setCurrentTab("profile")}
        >
          <User size={19} />
          My profile
        </button>
      </nav>
      <div className="co-sidebar-bottom">
        {role !== "STUDENT" && (
          <button
            className="co-button dark"
            onClick={() => setIsCreateNoticeOpen(true)}
          >
            <Plus size={17} />
            Create notice
          </button>
        )}
        <div className="co-sidebar-note">
          <span className="co-eyebrow">A PLACE TO BELONG</span>
          <p>
            Your department.
            <br />
            Your possibilities.
          </p>
          <button onClick={() => setCurrentTab("departments")}>
            Meet the campus <ArrowUpRight size={15} />
          </button>
        </div>
        <span className="co-sidebar-footer">
          Institute of Professional Studies
          <br />
          University of Allahabad
        </span>
      </div>
    </aside>
  );
};
