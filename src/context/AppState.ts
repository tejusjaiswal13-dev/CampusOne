import { createContext, useContext } from "react";
import {
  AcademicCalendarItem,
  BookmarkItem,
  CampusEvent,
  CampusFacility,
  CareerOpportunity,
  Department,
  DirectClassNotice,
  EventRegistration,
  ExamScheduleItem,
  FacultyMember,
  InAppNotification,
  Notice,
} from "../types";

interface AppContextType {
  // Navigation & View
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  deviceMode: "fluid" | "mobile-frame";
  setDeviceMode: (mode: "fluid" | "mobile-frame") => void;

  // Data
  departments: Department[];
  notices: Notice[];
  events: CampusEvent[];
  exams: ExamScheduleItem[];
  career: CareerOpportunity[];
  calendar: AcademicCalendarItem[];
  faculty: FacultyMember[];
  facilities: CampusFacility[];
  notifications: InAppNotification[];
  bookmarks: BookmarkItem[];
  registrations: EventRegistration[];
  classNotices: DirectClassNotice[];

  // Modals & Active details
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
  selectedEvent: CampusEvent | null;
  setSelectedEvent: (event: CampusEvent | null) => void;
  selectedDepartment: Department | null;
  setSelectedDepartment: (dept: Department | null) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isCreateNoticeOpen: boolean;
  setIsCreateNoticeOpen: (open: boolean) => void;
  isCreateEventOpen: boolean;
  setIsCreateEventOpen: (open: boolean) => void;

  // Department-aware notice & event helpers
  getStudentNotices: () => Notice[];
  getStudentEvents: () => CampusEvent[];
  getPendingApprovals: (departmentCode?: string) => {
    notices: Notice[];
    events: CampusEvent[];
  };

  // Actions
  refreshAllData: () => void;
  handleRegisterEvent: (event: CampusEvent) => {
    success: boolean;
    registration?: EventRegistration;
    error?: string;
  };
  handleToggleBookmark: (item: {
    itemType: "NOTICE" | "EVENT" | "CAREER" | "RESOURCE";
    itemId: string;
    title: string;
    subtitle: string;
    category: string;
    date: string;
  }) => boolean;
  isItemBookmarked: (itemId: string) => boolean;
  handleApproveNotice: (id: string) => void;
  handleRejectNotice: (id: string, reason: string) => void;
  handleApproveEvent: (id: string) => void;
  handleRejectEvent: (id: string, reason: string) => void;
  handleCreateNotice: (noticeData: Partial<Notice>) => void;
  handleCreateEvent: (eventData: Partial<CampusEvent>) => void;
  handleSendClassNotice: (
    noticeData: Omit<DirectClassNotice, "id" | "createdAt" | "readByUserIds">,
  ) => void;
  handleMarkClassNoticeRead: (id: string) => void;
  getStudentClassAlerts: () => DirectClassNotice[];
  getFacultySentClassNotices: () => DirectClassNotice[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Toast feedback
  toastMessage: string | null;
  toastType: "success" | "info" | "error" | null;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  clearToast: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
