import confetti from "canvas-confetti";
import React, { useCallback, useEffect, useState } from "react";
import { useCampusNavigation } from "../hooks/useCampusNavigation";
import { api, ApiError } from "../services/api";
import { StorageService } from "../services/storageService";
import type { User } from "../types";
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
import { useAuth } from "./AuthState";

import { AppContext } from "./AppState";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, role, mode, enterDemo } = useAuth();
  const [users, setUsers] = useState<User[]>(
    mode === "demo" ? StorageService.getUsers : [],
  );

  const { currentTab, setCurrentTab } = useCampusNavigation();
  const [deviceMode, setDeviceMode] = useState<"fluid" | "mobile-frame">(
    "fluid",
  );

  const [departments, setDepartments] = useState<Department[]>(
    mode === "demo" ? StorageService.getDepartments : [],
  );
  const [notices, setNotices] = useState<Notice[]>(
    mode === "demo" ? StorageService.getNotices : [],
  );
  const [events, setEvents] = useState<CampusEvent[]>(
    mode === "demo" ? StorageService.getEvents : [],
  );
  const [exams, setExams] = useState<ExamScheduleItem[]>(
    mode === "demo" ? StorageService.getExams : [],
  );
  const [career, setCareer] = useState<CareerOpportunity[]>(
    mode === "demo" ? StorageService.getCareerOpportunities : [],
  );
  const [calendar, setCalendar] = useState<AcademicCalendarItem[]>(
    mode === "demo" ? StorageService.getCalendar : [],
  );
  const [faculty, setFaculty] = useState<FacultyMember[]>(
    mode === "demo" ? StorageService.getFaculty : [],
  );
  const [facilities, setFacilities] = useState<CampusFacility[]>(
    mode === "demo" ? StorageService.getFacilities : [],
  );
  const [notifications, setNotifications] = useState<InAppNotification[]>(
    mode === "demo" ? StorageService.getNotifications : [],
  );
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(
    mode === "demo" ? StorageService.getBookmarks : [],
  );
  const [registrations, setRegistrations] = useState<EventRegistration[]>(
    mode === "demo" ? StorageService.getRegistrations : [],
  );
  const [classNotices, setClassNotices] = useState<DirectClassNotice[]>(
    mode === "demo" ? StorageService.getClassNotices : [],
  );

  // Modals state
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] =
    useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<
    "success" | "info" | "error" | null
  >(null);

  const showToast = (
    msg: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 4000);
  };

  const clearToast = () => {
    setToastMessage(null);
    setToastType(null);
  };

  const loadOnline = useCallback(() => {
    if(!currentUser) return api<Department[]>('/departments').then(setDepartments).catch(()=>{});
    return api<{departments:Department[];users:User[];notices:Notice[];events:CampusEvent[];exams:ExamScheduleItem[];career:CareerOpportunity[];calendar:AcademicCalendarItem[];faculty:FacultyMember[];facilities:CampusFacility[];notifications:InAppNotification[];bookmarks:BookmarkItem[];registrations:EventRegistration[];class_notices:DirectClassNotice[]}>('/bootstrap').then(data=>{
      setDepartments(data.departments);setUsers(data.users);setNotices(data.notices);setEvents(data.events);setExams(data.exams);setCareer(data.career);setCalendar(data.calendar);setFaculty(data.faculty);setFacilities(data.facilities);setNotifications(data.notifications);setBookmarks(data.bookmarks);setRegistrations(data.registrations);setClassNotices(data.class_notices);
    }).catch(error=>{
      showToast(error instanceof Error?error.message:'Unable to load campus data','error');
      if(error instanceof ApiError&&error.status===0)enterDemo();
    });
  },[currentUser,enterDemo]);
  const refreshAllData = useCallback(async () => {
    if (mode === "online") {
      await loadOnline();
      return;
    }
    setUsers(StorageService.getUsers());
    setDepartments(StorageService.getDepartments());
    setNotices(StorageService.getNotices());
    setEvents(StorageService.getEvents());
    setExams(StorageService.getExams());
    setCareer(StorageService.getCareerOpportunities());
    setCalendar(StorageService.getCalendar());
    setFaculty(StorageService.getFaculty());
    setFacilities(StorageService.getFacilities());
    setNotifications(StorageService.getNotifications());
    setBookmarks(StorageService.getBookmarks());
    setRegistrations(StorageService.getRegistrations());
    setClassNotices(StorageService.getClassNotices());
  }, [mode, loadOnline]);
  useEffect(() => {
    if (mode === "online") void loadOnline();
  }, [mode, loadOnline]);
  async function mutate(path: string, method: string, body: unknown) {
    try {
      await api(path, method, body);
      await refreshAllData();
      showToast("Changes saved.");
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Operation failed",
        "error",
      );
      return false;
    }
  }
  const manageUserRole = async (id: string, role: User["role"]) => {
    if (mode === "online")
      return mutate("/users/" + id + "/role", "PATCH", { role });
    const u = StorageService.getUserById(id);
    if (u) StorageService.saveUser({ ...u, role });
    await refreshAllData();
    return true;
  };
  const approveAccount = (id: string, approve: boolean) =>
    mutate("/users/" + id + "/approval", "POST", { approve });
  const saveCalendar = async (item: AcademicCalendarItem) => {
    if (mode === "online") {
      const { id: _id, ...body } = item;
      return mutate("/calendar", "POST", body);
    }
    StorageService.saveCalendarItem(item);
    await refreshAllData();
    return true;
  };
  const deleteNotice = async (id: string) => {
    if (mode === "online") return mutate("/notices/" + id, "DELETE", {});
    StorageService.deleteNotice(id);
    await refreshAllData();
    return true;
  };
  // Department-Aware notice filtering:
  // A student sees: All APPROVED College Notices + APPROVED notices from THEIR Department
  const getStudentNotices = useCallback(() => {
    if (!currentUser) return notices.filter((n) => n.status === "APPROVED");

    if (role === "COLLEGE_ADMIN") {
      return notices; // Admin sees all
    }

    if (role === "DEPARTMENT_ADMIN" || role === "FACULTY") {
      return notices.filter(
        (n) =>
          n.scope === "COLLEGE" ||
          n.departmentCode?.toUpperCase() ===
            currentUser.departmentCode?.toUpperCase(),
      );
    }

    // Student role:
    return notices.filter((n) => {
      if (n.status !== "APPROVED") return false;
      if (n.scope === "COLLEGE") return true;
      return (
        n.departmentCode?.toUpperCase() ===
        currentUser.departmentCode?.toUpperCase()
      );
    });
  }, [currentUser, notices, role]);

  const getStudentEvents = useCallback(() => {
    if (!currentUser) return events.filter((e) => e.status === "APPROVED");

    if (role === "COLLEGE_ADMIN") {
      return events;
    }

    if (role === "DEPARTMENT_ADMIN" || role === "FACULTY") {
      return events.filter(
        (e) =>
          e.scope === "COLLEGE" ||
          e.departmentCode?.toUpperCase() ===
            currentUser.departmentCode?.toUpperCase(),
      );
    }

    // Student role
    return events.filter((e) => {
      if (e.status !== "APPROVED") return false;
      if (e.scope === "COLLEGE") return true;
      return (
        e.departmentCode?.toUpperCase() ===
        currentUser.departmentCode?.toUpperCase()
      );
    });
  }, [currentUser, events, role]);

  // Approval queue
  const getPendingApprovals = useCallback(
    (deptCode?: string) => {
      const code = deptCode || currentUser?.departmentCode;
      const pendingNotices = notices.filter((n) => {
        if (n.status !== "PENDING_APPROVAL") return false;
        if (role === "COLLEGE_ADMIN") return true;
        return n.departmentCode?.toUpperCase() === code?.toUpperCase();
      });

      const pendingEvents = events.filter((e) => {
        if (e.status !== "PENDING_APPROVAL") return false;
        if (role === "COLLEGE_ADMIN") return true;
        return e.departmentCode?.toUpperCase() === code?.toUpperCase();
      });

      return { notices: pendingNotices, events: pendingEvents };
    },
    [currentUser, events, notices, role],
  );

  // Actions
  const handleRegisterEvent = async (event: CampusEvent) => {
    if (!currentUser) {
      showToast("Please log in to register for events.", "error");
      return { success: false, error: "User not logged in" };
    }

    if (mode === "online") {
      try {
        const registration = await api<EventRegistration>(
          "/events/" + event.id + "/register",
          "POST",
          {},
        );
        await refreshAllData();
        showToast("Registration confirmed.");
        return { success: true, registration };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        showToast(message, "error");
        return { success: false, error: message };
      }
    }
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (
      !event.registeredUserIds.includes(currentUser.id) &&
      (event.date < today ||
        event.registrationDeadline < today ||
        event.status !== "APPROVED")
    ) {
      showToast("Registration is closed for this event.", "info");
      return {
        success: false,
        error: "Registration is closed for this event.",
      };
    }
    if (
      event.availableSeats <= 0 &&
      !event.registeredUserIds.includes(currentUser.id)
    ) {
      showToast("Sorry, this event is fully booked.", "error");
      return { success: false, error: "No seats available" };
    }

    const reg = StorageService.registerForEvent(event, currentUser);
    if (reg) {
      refreshAllData();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn("Confetti effect failed:", e);
      }
      showToast(`Registration Successful! Pass: ${reg.ticketCode}`, "success");
      return { success: true, registration: reg };
    }

    showToast("Failed to register. You may already be registered.", "error");
    return { success: false, error: "Registration failed" };
  };

  const handleToggleBookmark = async (item: {
    itemType: "NOTICE" | "EVENT" | "CAREER" | "RESOURCE";
    itemId: string;
    title: string;
    subtitle: string;
    category: string;
    date: string;
  }): Promise<boolean> => {
    if (!currentUser) {
      showToast("Please log in to save bookmarks.", "info");
      return false;
    }

    if (mode === "online") {
      try {
        const result = await api<{ saved: boolean }>(
          "/bookmarks/toggle",
          "POST",
          { itemId: item.itemId, itemType: item.itemType },
        );
        await refreshAllData();
        return result.saved;
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Unable to save",
          "error",
        );
        return false;
      }
    }
    const newBookmark: BookmarkItem = {
      id: `bm-${Date.now()}`,
      userId: currentUser.id,
      itemType: item.itemType,
      itemId: item.itemId,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      date: item.date,
      createdAt: new Date().toISOString(),
    };

    const isAdded = StorageService.toggleBookmark(newBookmark);
    refreshAllData();
    showToast(
      isAdded
        ? "Item saved to your Bookmarks 🔖"
        : "Item removed from Bookmarks",
      "info",
    );
    return isAdded;
  };

  const isItemBookmarked = (itemId: string): boolean => {
    if (!currentUser) return false;
    return bookmarks.some(
      (b) => b.userId === currentUser.id && b.itemId === itemId,
    );
  };

  const handleApproveNotice = async (id: string) => {
    if (mode === "online") {
      await mutate("/notices/" + id + "/approval", "POST", {
        status: "APPROVED",
      });
      return;
    }
    StorageService.approveNotice(id);
    refreshAllData();
    showToast("Notice approved and published live!", "success");
  };

  const handleRejectNotice = async (id: string, reason: string) => {
    if (mode === "online") {
      await mutate("/notices/" + id + "/approval", "POST", {
        status: "REJECTED",
        reason,
      });
      return;
    }
    StorageService.rejectNotice(id, reason);
    refreshAllData();
    showToast("Notice has been rejected with feedback.", "info");
  };

  const handleApproveEvent = async (id: string) => {
    if (mode === "online") {
      await mutate("/events/" + id + "/approval", "POST", {
        status: "APPROVED",
      });
      return;
    }
    StorageService.approveEvent(id);
    refreshAllData();
    showToast("Event approved and open for registration!", "success");
  };

  const handleRejectEvent = async (id: string, reason: string) => {
    if (mode === "online") {
      await mutate("/events/" + id + "/approval", "POST", {
        status: "REJECTED",
        reason,
      });
      return;
    }
    StorageService.rejectEvent(id, reason);
    refreshAllData();
    showToast("Event has been returned with feedback.", "info");
  };

  const handleCreateNotice = async (noticeData: Partial<Notice>) => {
    if (!currentUser) return false;

    const isDirectApproved =
      currentUser.role === "COLLEGE_ADMIN" ||
      (currentUser.role === "DEPARTMENT_ADMIN" &&
        noticeData.scope === "DEPARTMENT");

    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      title: noticeData.title || "Untitled Notice",
      description: noticeData.description || "",
      category: noticeData.category || "General",
      scope: noticeData.scope || "DEPARTMENT",
      departmentId:
        noticeData.scope === "DEPARTMENT"
          ? noticeData.departmentId || currentUser.departmentId
          : undefined,
      departmentCode:
        noticeData.scope === "DEPARTMENT"
          ? noticeData.departmentCode || currentUser.departmentCode
          : undefined,
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherRole: currentUser.role,
      status: isDirectApproved ? "APPROVED" : "PENDING_APPROVAL",
      isUrgent: !!noticeData.isUrgent,
      publishedAt: new Date().toISOString(),
      deadline: noticeData.deadline || undefined,
      attachmentName: noticeData.attachmentName || "Official_Document.pdf",
      attachmentSize: "450 KB",
      attachmentUrl: "#",
      viewsCount: 1,
    };

    if (mode === "online") {
      const {
        title,
        description,
        category,
        scope,
        departmentCode,
        isUrgent,
        deadline,
      } = newNotice;
      return mutate("/notices", "POST", {
        title,
        description,
        category,
        scope,
        departmentCode,
        isUrgent,
        deadline,
      });
    }
    StorageService.saveNotice(newNotice);
    refreshAllData();
    showToast(
      isDirectApproved
        ? "Official notice published live!"
        : "Notice submitted for departmental approval.",
      "success",
    );
    return true;
  };

  const handleCreateEvent = async (eventData: Partial<CampusEvent>) => {
    if (!currentUser) return false;

    const isDirectApproved =
      currentUser.role === "COLLEGE_ADMIN" ||
      (currentUser.role === "DEPARTMENT_ADMIN" &&
        eventData.scope === "DEPARTMENT");

    const newEvent: CampusEvent = {
      id: `evt-${Date.now()}`,
      title: eventData.title || "Campus Event",
      description: eventData.description || "",
      category: eventData.category || "Workshop",
      scope: eventData.scope || "DEPARTMENT",
      departmentId:
        eventData.scope === "DEPARTMENT"
          ? eventData.departmentId || currentUser.departmentId
          : undefined,
      departmentCode:
        eventData.scope === "DEPARTMENT"
          ? eventData.departmentCode || currentUser.departmentCode
          : undefined,
      date: eventData.date || new Date().toISOString().split("T")[0],
      time: eventData.time || "10:00 AM - 01:00 PM",
      venue: eventData.venue || "IPS Seminar Hall",
      organizer: eventData.organizer || `${currentUser.departmentName} Society`,
      speaker: eventData.speaker || "Distinguished Guest",
      totalSeats: eventData.totalSeats || 60,
      availableSeats: eventData.totalSeats || 60,
      registrationDeadline:
        eventData.registrationDeadline ||
        new Date().toISOString().split("T")[0],
      registeredUserIds: [],
      status: isDirectApproved ? "APPROVED" : "PENDING_APPROVAL",
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherRole: currentUser.role,
      bannerImage: eventData.bannerImage || "/campus-placeholder.svg",
      createdAt: new Date().toISOString(),
    };

    if (mode === "online") {
      const {
        title,
        description,
        category,
        scope,
        departmentCode,
        date,
        time,
        venue,
        organizer,
        speaker,
        speakerDesignation,
        totalSeats,
        registrationDeadline,
      } = newEvent;
      return mutate("/events", "POST", {
        title,
        description,
        category,
        scope,
        departmentCode,
        date,
        time,
        venue,
        organizer,
        speaker,
        speakerDesignation,
        totalSeats,
        registrationDeadline,
      });
    }
    StorageService.saveEvent(newEvent);
    refreshAllData();
    showToast(
      isDirectApproved
        ? "Official event published live!"
        : "Event proposal submitted for approval.",
      "success",
    );
    return true;
  };

  const handleSendClassNotice = async (
    noticeData: Omit<DirectClassNotice, "id" | "createdAt" | "readByUserIds">,
  ) => {
    const newNotice: DirectClassNotice = {
      ...noticeData,
      id: `cn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readByUserIds: [],
    };
    if (mode === "online") {
      const {
        course,
        semester,
        subjectCode,
        subjectName,
        title,
        message,
        noticeType,
      } = newNotice;
      await mutate("/class_notices", "POST", {
        course,
        semester,
        subjectCode,
        subjectName,
        title,
        message,
        noticeType,
      });
      return;
    }
    StorageService.sendClassNotice(newNotice);
    refreshAllData();
    showToast(
      `Class Notice sent directly to ${noticeData.course} Sem ${noticeData.semester} students! 📢`,
      "success",
    );
  };

  const handleMarkClassNoticeRead = async (id: string) => {
    if (!currentUser) return;
    if (mode === "online") {
      await mutate("/class_notices/" + id + "/read", "POST", {});
      return;
    }
    StorageService.markClassNoticeRead(id, currentUser.id);
    refreshAllData();
  };

  const getStudentClassAlerts = useCallback(() => {
    if (!currentUser || role !== "STUDENT") return [];
    const course = currentUser.course?.includes("BCA")
      ? "BCA"
      : currentUser.course || "BCA";
    const semester = currentUser.semester || 5;
    return classNotices.filter(
      (cn) =>
        cn.departmentCode === currentUser.departmentCode &&
        cn.course === course &&
        cn.semester === semester,
    );
  }, [currentUser, role, classNotices]);

  const getFacultySentClassNotices = useCallback(() => {
    if (!currentUser || role !== "FACULTY") return [];
    return classNotices.filter((cn) => cn.facultyId === currentUser.id);
  }, [currentUser, role, classNotices]);

  const markNotificationAsRead = async (id: string) => {
    if (mode === "online") {
      await mutate("/notifications/read", "POST", { id });
      return;
    }
    StorageService.markNotificationRead(id);
    refreshAllData();
  };

  const markAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    if (mode === "online") {
      await mutate("/notifications/read", "POST", {});
      return;
    }
    StorageService.markAllNotificationsRead(currentUser.id);
    refreshAllData();
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead && (n.userId === currentUser?.id || n.userId === "ALL"),
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        deviceMode,
        setDeviceMode,
        users,
        manageUserRole,
        approveAccount,
        saveCalendar,
        deleteNotice,
        departments,
        notices,
        events,
        exams,
        career,
        calendar,
        faculty,
        facilities,
        notifications,
        bookmarks,
        registrations,
        selectedNotice,
        setSelectedNotice,
        selectedEvent,
        setSelectedEvent,
        selectedDepartment,
        setSelectedDepartment,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        isRoleSwitcherOpen,
        setIsRoleSwitcherOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isCreateNoticeOpen,
        setIsCreateNoticeOpen,
        isCreateEventOpen,
        setIsCreateEventOpen,
        getStudentNotices,
        getStudentEvents,
        getPendingApprovals,
        refreshAllData,
        handleRegisterEvent,
        handleToggleBookmark,
        isItemBookmarked,
        handleApproveNotice,
        handleRejectNotice,
        handleApproveEvent,
        handleRejectEvent,
        handleCreateNotice,
        handleCreateEvent,
        classNotices,
        handleSendClassNotice,
        handleMarkClassNoticeRead,
        getStudentClassAlerts,
        getFacultySentClassNotices,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        toastMessage,
        toastType,
        showToast,
        clearToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
