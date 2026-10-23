import React, { Suspense, lazy } from "react";
import { BottomNav } from "./components/common/BottomNav";
import { DesktopSidebar } from "./components/common/DesktopSidebar";
import { Header } from "./components/common/Header";
import { RoleGuard } from "./components/common/RoleGuard";
import { Toast } from "./components/common/Toast";
import { ExploreView } from "./components/explore/ExploreView";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/AppState";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthState";
import { demoEnabled } from "./services/api";

import { EventList } from "./components/events/EventList";
import { NoticeList } from "./components/notices/NoticeList";
import { StudentHome } from "./components/student/StudentHome";
const AcademicCalendarView = lazy(() =>
  import("./components/calendar/AcademicCalendarView").then((module) => ({
    default: module.AcademicCalendarView,
  })),
);
const ExamScheduleView = lazy(() =>
  import("./components/exams/ExamScheduleView").then((module) => ({
    default: module.ExamScheduleView,
  })),
);
const CareerPortalView = lazy(() =>
  import("./components/career/CareerPortalView").then((module) => ({
    default: module.CareerPortalView,
  })),
);
const FacultyDirectoryView = lazy(() =>
  import("./components/faculty/FacultyDirectoryView").then((module) => ({
    default: module.FacultyDirectoryView,
  })),
);
const FacultyClassesView = lazy(() =>
  import("./components/faculty/FacultyClassesView").then((module) => ({
    default: module.FacultyClassesView,
  })),
);
const FacultyDirectNoticeView = lazy(() =>
  import("./components/faculty/FacultyDirectNoticeView").then((module) => ({
    default: module.FacultyDirectNoticeView,
  })),
);
const FacultyStudentRosterView = lazy(() =>
  import("./components/faculty/FacultyStudentRosterView").then((module) => ({
    default: module.FacultyStudentRosterView,
  })),
);
const StudentTimetableView = lazy(() =>
  import("./components/student/StudentTimetableView").then((module) => ({
    default: module.StudentTimetableView,
  })),
);
const DepartmentDirectoryView = lazy(() =>
  import("./components/departments/DepartmentDirectoryView").then((module) => ({
    default: module.DepartmentDirectoryView,
  })),
);
const CampusGuideView = lazy(() =>
  import("./components/campus/CampusGuideView").then((module) => ({
    default: module.CampusGuideView,
  })),
);
const BookmarksView = lazy(() =>
  import("./components/profile/BookmarksView").then((module) => ({
    default: module.BookmarksView,
  })),
);
const GlobalSearchView = lazy(() =>
  import("./components/search/GlobalSearchView").then((module) => ({
    default: module.GlobalSearchView,
  })),
);
const UserProfileView = lazy(() =>
  import("./components/profile/UserProfileView").then((module) => ({
    default: module.UserProfileView,
  })),
);
const FacultyDashboard = lazy(() =>
  import("./components/faculty/FacultyDashboard").then((module) => ({
    default: module.FacultyDashboard,
  })),
);
const DeptAdminDashboard = lazy(() =>
  import("./components/admin/DeptAdminDashboard").then((module) => ({
    default: module.DeptAdminDashboard,
  })),
);
const CollegeAdminDashboard = lazy(() =>
  import("./components/admin/CollegeAdminDashboard").then((module) => ({
    default: module.CollegeAdminDashboard,
  })),
);

import { CampusAIAssistantModal } from "./components/ai/CampusAIAssistantModal";
import { ForgotPasswordView } from "./components/auth/ForgotPasswordView";
import { LoginView } from "./components/auth/LoginView";
import { RegisterView } from "./components/auth/RegisterView";
import { RoleSwitcherDrawer } from "./components/auth/RoleSwitcherDrawer";
import { CreateEventModal } from "./components/events/CreateEventModal";
import { CreateNoticeModal } from "./components/notices/CreateNoticeModal";
import { NotificationCenterModal } from "./components/notifications/NotificationCenterModal";

const AppContent: React.FC = () => {
  const { currentTab, deviceMode, setDeviceMode } = useApp();
  const { isAuthenticated, role, currentUser, ready, mode } = useAuth();

  const renderActiveView = () => {
    if (!ready) return <div role="status">Connecting to campus…</div>;
    if (!isAuthenticated) {
      if (currentTab === "register") return <RegisterView />;
      if (currentTab === "forgot-password") return <ForgotPasswordView />;
      return <LoginView />;
    }
    switch (currentTab) {
      case "explore":
        return <ExploreView />;
      case "home":
        if (role === "FACULTY") return <FacultyDashboard />;
        if (role === "DEPARTMENT_ADMIN") return <DeptAdminDashboard />;
        if (role === "COLLEGE_ADMIN") return <CollegeAdminDashboard />;
        return <StudentHome />;
      case "timetable":
        return <StudentTimetableView />;
      case "classes":
        return <FacultyClassesView />;
      case "class-notices":
        return <FacultyDirectNoticeView />;
      case "students":
        return <FacultyStudentRosterView />;
      case "approvals":
        return <DeptAdminDashboard />;
      case "users":
        return <CollegeAdminDashboard />;
      case "notices":
        return <NoticeList />;
      case "events":
        return <EventList />;
      case "calendar":
        return <AcademicCalendarView />;
      case "exams":
        return <ExamScheduleView />;
      case "career":
        return <CareerPortalView />;
      case "faculty":
        return <FacultyDirectoryView />;
      case "departments":
        return <DepartmentDirectoryView />;
      case "campus":
        return <CampusGuideView />;
      case "bookmarks":
        return <BookmarksView />;
      case "search":
        return <GlobalSearchView />;
      case "profile":
        return <UserProfileView />;
      case "faculty-dash":
        return <FacultyDashboard />;
      case "dept-admin":
        return <DeptAdminDashboard />;
      case "college-admin":
        return <CollegeAdminDashboard />;
      case "auth":
      case "login":
        return <LoginView />;
      case "register":
        return <RegisterView />;
      case "forgot-password":
        return <ForgotPasswordView />;
      default:
        if (role === "FACULTY") return <FacultyDashboard />;
        if (role === "DEPARTMENT_ADMIN") return <DeptAdminDashboard />;
        if (role === "COLLEGE_ADMIN") return <CollegeAdminDashboard />;
        return <StudentHome />;
    }
  };

  // If mobile frame preview is toggled on desktop
  if (deviceMode === "mobile-frame") {
    return (
      <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center font-sans">
        {/* Device toggle banner */}
        <div className="mb-4 flex items-center justify-between w-full max-w-sm text-xs text-slate-400 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
          <span className="font-semibold text-white">
            📱 Mobile Preview Frame
          </span>
          <button
            onClick={() => setDeviceMode("fluid")}
            className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
          >
            Switch to Full Width
          </button>
        </div>

        {/* Smartphone Bezel */}
        <div className="w-full max-w-md h-[880px] bg-black rounded-[52px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col relative overflow-hidden">
          {/* Speaker Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-2 border border-slate-800" />
          </div>

          {/* Screen area */}
          <div className="co-phone-frame flex-1 bg-slate-50 rounded-[44px] overflow-hidden flex flex-col relative border border-slate-800">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 pb-20">
              <Suspense
                fallback={
                  <div className="co-empty" role="status">
                    Opening your campus…
                  </div>
                }
              >
                <RoleGuard
                  role={role}
                  tab={isAuthenticated ? currentTab : "auth"}
                >
                  {renderActiveView()}
                </RoleGuard>
              </Suspense>
            </main>
            {isAuthenticated && <BottomNav />}
          </div>
        </div>

        {/* Global Modals */}
        {demoEnabled && mode === "demo" && <RoleSwitcherDrawer />}
        <NotificationCenterModal />
        <CampusAIAssistantModal key={currentUser?.id} />
        <CreateNoticeModal />
        <CreateEventModal />
        <Toast />
      </div>
    );
  }

  // Standard responsive layout (Mobile bottom-nav, Desktop left sidebar)
  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="co-layout flex-1 w-full">
        {/* Left Desktop Sidebar */}
        <DesktopSidebar />

        {/* Main Content Pane */}
        <main className="campus-main flex-1 min-w-0 w-full">
          <Suspense
            fallback={
              <div className="co-empty" role="status">
                Opening your campus…
              </div>
            }
          >
            <RoleGuard role={role} tab={isAuthenticated ? currentTab : "auth"}>
              {renderActiveView()}
            </RoleGuard>
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && <BottomNav />}

      {/* Global Interactive Modals */}
      {demoEnabled && mode === "demo" && <RoleSwitcherDrawer />}
      <NotificationCenterModal />
      <CampusAIAssistantModal key={currentUser?.id} />
      <CreateNoticeModal />
      <CreateEventModal />
      <Toast />
    </div>
  );
};

function AuthenticatedApp() {
  const { currentUser, mode } = useAuth();
  return (
    <AppProvider key={`${mode}:${currentUser?.id || "guest"}`}>
      <AppContent />
    </AppProvider>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
