import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Department,
  Notice,
  CampusEvent,
  ExamScheduleItem,
  CareerOpportunity,
  AcademicCalendarItem,
  FacultyMember,
  CampusFacility,
  InAppNotification,
  EventRegistration,
  BookmarkItem,
  DirectClassNotice
} from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import { useCampusNavigation } from '../hooks/useCampusNavigation';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Navigation & View
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  deviceMode: 'fluid' | 'mobile-frame';
  setDeviceMode: (mode: 'fluid' | 'mobile-frame') => void;

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
  getPendingApprovals: (departmentCode?: string) => { notices: Notice[]; events: CampusEvent[] };

  // Actions
  refreshAllData: () => void;
  handleRegisterEvent: (event: CampusEvent) => { success: boolean; registration?: EventRegistration; error?: string };
  handleToggleBookmark: (item: {
    itemType: 'NOTICE' | 'EVENT' | 'CAREER' | 'RESOURCE';
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
  handleSendClassNotice: (noticeData: Omit<DirectClassNotice, 'id' | 'createdAt' | 'readByUserIds'>) => void;
  handleMarkClassNoticeRead: (id: string) => void;
  getStudentClassAlerts: () => DirectClassNotice[];
  getFacultySentClassNotices: () => DirectClassNotice[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Toast feedback
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'error' | null;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, role } = useAuth();

  const { currentTab, setCurrentTab } = useCampusNavigation();
  const [deviceMode, setDeviceMode] = useState<'fluid' | 'mobile-frame'>('fluid');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [exams, setExams] = useState<ExamScheduleItem[]>([]);
  const [career, setCareer] = useState<CareerOpportunity[]>([]);
  const [calendar, setCalendar] = useState<AcademicCalendarItem[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [facilities, setFacilities] = useState<CampusFacility[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [classNotices, setClassNotices] = useState<DirectClassNotice[]>([]);

  // Modals state
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error' | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
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

  const refreshAllData = useCallback(() => {
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
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Department-Aware notice filtering:
  // A student sees: All APPROVED College Notices + APPROVED notices from THEIR Department
  const getStudentNotices = useCallback(() => {
    if (!currentUser) return notices.filter(n => n.status === 'APPROVED');

    if (role === 'COLLEGE_ADMIN') {
      return notices; // Admin sees all
    }

    if (role === 'DEPARTMENT_ADMIN' || role === 'FACULTY') {
      return notices.filter(
        n =>
          n.scope === 'COLLEGE' ||
          n.departmentCode?.toUpperCase() === currentUser.departmentCode?.toUpperCase()
      );
    }

    // Student role:
    return notices.filter(n => {
      if (n.status !== 'APPROVED') return false;
      if (n.scope === 'COLLEGE') return true;
      return n.departmentCode?.toUpperCase() === currentUser.departmentCode?.toUpperCase();
    });
  }, [currentUser, notices, role]);

  const getStudentEvents = useCallback(() => {
    if (!currentUser) return events.filter(e => e.status === 'APPROVED');

    if (role === 'COLLEGE_ADMIN') {
      return events;
    }

    if (role === 'DEPARTMENT_ADMIN' || role === 'FACULTY') {
      return events.filter(
        e =>
          e.scope === 'COLLEGE' ||
          e.departmentCode?.toUpperCase() === currentUser.departmentCode?.toUpperCase()
      );
    }

    // Student role
    return events.filter(e => {
      if (e.status !== 'APPROVED') return false;
      if (e.scope === 'COLLEGE') return true;
      return e.departmentCode?.toUpperCase() === currentUser.departmentCode?.toUpperCase();
    });
  }, [currentUser, events, role]);

  // Approval queue
  const getPendingApprovals = useCallback(
    (deptCode?: string) => {
      const code = deptCode || currentUser?.departmentCode;
      const pendingNotices = notices.filter(n => {
        if (n.status !== 'PENDING_APPROVAL') return false;
        if (role === 'COLLEGE_ADMIN') return true;
        return n.departmentCode?.toUpperCase() === code?.toUpperCase();
      });

      const pendingEvents = events.filter(e => {
        if (e.status !== 'PENDING_APPROVAL') return false;
        if (role === 'COLLEGE_ADMIN') return true;
        return e.departmentCode?.toUpperCase() === code?.toUpperCase();
      });

      return { notices: pendingNotices, events: pendingEvents };
    },
    [currentUser, events, notices, role]
  );

  // Actions
  const handleRegisterEvent = (event: CampusEvent) => {
    if (!currentUser) {
      showToast('Please log in to register for events.', 'error');
      return { success: false, error: 'User not logged in' };
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (!event.registeredUserIds.includes(currentUser.id) && (event.date < today || event.registrationDeadline < today || event.status !== 'APPROVED')) {
      showToast('Registration is closed for this event.', 'info');
      return { success: false, error: 'Registration is closed for this event.' };
    }
    if (event.availableSeats <= 0 && !event.registeredUserIds.includes(currentUser.id)) {
      showToast('Sorry, this event is fully booked.', 'error');
      return { success: false, error: 'No seats available' };
    }

    const reg = StorageService.registerForEvent(event, currentUser);
    if (reg) {
      refreshAllData();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti effect failed:', e);
      }
      showToast(`Registration Successful! Pass: ${reg.ticketCode}`, 'success');
      return { success: true, registration: reg };
    }

    showToast('Failed to register. You may already be registered.', 'error');
    return { success: false, error: 'Registration failed' };
  };

  const handleToggleBookmark = (item: {
    itemType: 'NOTICE' | 'EVENT' | 'CAREER' | 'RESOURCE';
    itemId: string;
    title: string;
    subtitle: string;
    category: string;
    date: string;
  }): boolean => {
    if (!currentUser) {
      showToast('Please log in to save bookmarks.', 'info');
      return false;
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
      createdAt: new Date().toISOString()
    };

    const isAdded = StorageService.toggleBookmark(newBookmark);
    refreshAllData();
    showToast(isAdded ? 'Item saved to your Bookmarks 🔖' : 'Item removed from Bookmarks', 'info');
    return isAdded;
  };

  const isItemBookmarked = (itemId: string): boolean => {
    if (!currentUser) return false;
    return StorageService.isBookmarked(currentUser.id, itemId);
  };

  const handleApproveNotice = (id: string) => {
    StorageService.approveNotice(id);
    refreshAllData();
    showToast('Notice approved and published live!', 'success');
  };

  const handleRejectNotice = (id: string, reason: string) => {
    StorageService.rejectNotice(id, reason);
    refreshAllData();
    showToast('Notice has been rejected with feedback.', 'info');
  };

  const handleApproveEvent = (id: string) => {
    StorageService.approveEvent(id);
    refreshAllData();
    showToast('Event approved and open for registration!', 'success');
  };

  const handleRejectEvent = (id: string, reason: string) => {
    StorageService.rejectEvent(id, reason);
    refreshAllData();
    showToast('Event has been returned with feedback.', 'info');
  };

  const handleCreateNotice = (noticeData: Partial<Notice>) => {
    if (!currentUser) return;

    const isDirectApproved =
      currentUser.role === 'COLLEGE_ADMIN' ||
      (currentUser.role === 'DEPARTMENT_ADMIN' && noticeData.scope === 'DEPARTMENT');

    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      title: noticeData.title || 'Untitled Notice',
      description: noticeData.description || '',
      category: noticeData.category || 'General',
      scope: noticeData.scope || 'DEPARTMENT',
      departmentId: noticeData.scope === 'DEPARTMENT' ? (noticeData.departmentId || currentUser.departmentId) : undefined,
      departmentCode: noticeData.scope === 'DEPARTMENT' ? (noticeData.departmentCode || currentUser.departmentCode) : undefined,
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherRole: currentUser.role,
      status: isDirectApproved ? 'APPROVED' : 'PENDING_APPROVAL',
      isUrgent: !!noticeData.isUrgent,
      publishedAt: new Date().toISOString(),
      deadline: noticeData.deadline,
      attachmentName: noticeData.attachmentName || 'Official_Document.pdf',
      attachmentSize: '450 KB',
      attachmentUrl: '#',
      viewsCount: 1
    };

    StorageService.saveNotice(newNotice);
    refreshAllData();
    showToast(
      isDirectApproved
        ? 'Official notice published live!'
        : 'Notice submitted for departmental approval.',
      'success'
    );
  };

  const handleCreateEvent = (eventData: Partial<CampusEvent>) => {
    if (!currentUser) return;

    const isDirectApproved =
      currentUser.role === 'COLLEGE_ADMIN' ||
      (currentUser.role === 'DEPARTMENT_ADMIN' && eventData.scope === 'DEPARTMENT');

    const newEvent: CampusEvent = {
      id: `evt-${Date.now()}`,
      title: eventData.title || 'Campus Event',
      description: eventData.description || '',
      category: eventData.category || 'Workshop',
      scope: eventData.scope || 'DEPARTMENT',
      departmentId: eventData.scope === 'DEPARTMENT' ? (eventData.departmentId || currentUser.departmentId) : undefined,
      departmentCode: eventData.scope === 'DEPARTMENT' ? (eventData.departmentCode || currentUser.departmentCode) : undefined,
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '10:00 AM - 01:00 PM',
      venue: eventData.venue || 'IPS Seminar Hall',
      organizer: eventData.organizer || `${currentUser.departmentName} Society`,
      speaker: eventData.speaker || 'Distinguished Guest',
      totalSeats: eventData.totalSeats || 60,
      availableSeats: eventData.totalSeats || 60,
      registrationDeadline: eventData.registrationDeadline || new Date().toISOString().split('T')[0],
      registeredUserIds: [],
      status: isDirectApproved ? 'APPROVED' : 'PENDING_APPROVAL',
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherRole: currentUser.role,
      bannerImage: eventData.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    };

    StorageService.saveEvent(newEvent);
    refreshAllData();
    showToast(
      isDirectApproved
        ? 'Official event published live!'
        : 'Event proposal submitted for approval.',
      'success'
    );
  };

  const handleSendClassNotice = (
    noticeData: Omit<DirectClassNotice, 'id' | 'createdAt' | 'readByUserIds'>
  ) => {
    const newNotice: DirectClassNotice = {
      ...noticeData,
      id: `cn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readByUserIds: []
    };
    StorageService.sendClassNotice(newNotice);
    refreshAllData();
    showToast(`Class Notice sent directly to ${noticeData.course} Sem ${noticeData.semester} students! 📢`, 'success');
  };

  const handleMarkClassNoticeRead = (id: string) => {
    if (!currentUser) return;
    StorageService.markClassNoticeRead(id, currentUser.id);
    refreshAllData();
  };

  const getStudentClassAlerts = useCallback(() => {
    if (!currentUser || role !== 'STUDENT') return [];
    const course = currentUser.course?.includes('BCA') ? 'BCA' : currentUser.course || 'BCA';
    const semester = currentUser.semester || 5;
    return classNotices.filter(
      cn => cn.course === course && cn.semester === semester
    );
  }, [currentUser, role, classNotices]);

  const getFacultySentClassNotices = useCallback(() => {
    if (!currentUser || role !== 'FACULTY') return [];
    return classNotices.filter(cn => cn.facultyId === currentUser.id);
  }, [currentUser, role, classNotices]);

  const markNotificationAsRead = (id: string) => {
    StorageService.markNotificationRead(id);
    refreshAllData();
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    StorageService.markAllNotificationsRead(currentUser.id);
    refreshAllData();
  };

  const unreadNotificationsCount = notifications.filter(
    n => !n.isRead && (n.userId === currentUser?.id || n.userId === 'ALL')
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        deviceMode,
        setDeviceMode,
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
        clearToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
