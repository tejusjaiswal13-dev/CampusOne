import {
  Department,
  User,
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
import {
  SEED_DEPARTMENTS,
  SEED_USERS,
  SEED_NOTICES,
  SEED_EVENTS,
  SEED_EXAMS,
  SEED_CAREER,
  SEED_CALENDAR,
  SEED_FACULTY,
  SEED_FACILITIES,
  SEED_NOTIFICATIONS,
  SEED_CLASS_NOTICES
} from '../data/seedData';

const KEYS = {
  DEPARTMENTS: 'ips_departments_v1',
  USERS: 'ips_users_v1',
  CURRENT_USER_ID: 'ips_current_user_id_v1',
  NOTICES: 'ips_notices_v1',
  EVENTS: 'ips_events_v1',
  REGISTRATIONS: 'ips_registrations_v1',
  EXAMS: 'ips_exams_v1',
  CAREER: 'ips_career_v1',
  CALENDAR: 'ips_calendar_v1',
  FACULTY: 'ips_faculty_v1',
  FACILITIES: 'ips_facilities_v1',
  NOTIFICATIONS: 'ips_notifications_v1',
  BOOKMARKS: 'ips_bookmarks_v1',
  CLASS_NOTICES: 'ips_class_notices_v1'
};

function getStored<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultData;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Reset all to seed data
  resetToDefaults: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    setStored(KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
    setStored(KEYS.USERS, SEED_USERS);
    setStored(KEYS.CURRENT_USER_ID, SEED_USERS[0].id);
    setStored(KEYS.NOTICES, SEED_NOTICES);
    setStored(KEYS.EVENTS, SEED_EVENTS);
    setStored(KEYS.EXAMS, SEED_EXAMS);
    setStored(KEYS.CAREER, SEED_CAREER);
    setStored(KEYS.CALENDAR, SEED_CALENDAR);
    setStored(KEYS.FACULTY, SEED_FACULTY);
    setStored(KEYS.FACILITIES, SEED_FACILITIES);
    setStored(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    setStored(KEYS.CLASS_NOTICES, SEED_CLASS_NOTICES);
    setStored(KEYS.REGISTRATIONS, [
      {
        id: 'reg-demo-1',
        eventId: 'evt-01',
        eventTitle: 'AI & Machine Learning Workshop: Building Production LLMs',
        eventDate: '2026-09-15',
        eventTime: '10:00 AM - 04:00 PM',
        eventVenue: 'CCET Computer Lab 2 & Seminar Hall',
        userId: 'user-student-1',
        studentName: 'Aarav Sharma',
        studentId: 'IPS2023-BCA-042',
        departmentCode: 'CCET',
        email: 'aarav.sharma@ips.allduniv.ac.in',
        registeredAt: '2026-09-06T14:30:00Z',
        ticketCode: 'IPS-2026-CCET-8491'
      }
    ]);
    setStored(KEYS.BOOKMARKS, [
      {
        id: 'bm-1',
        userId: 'user-student-1',
        itemType: 'NOTICE',
        itemId: 'not-01',
        title: 'Semester Examination Form Submission Deadline (Odd Semester 2026)',
        subtitle: 'Deadline: Sep 18, 2026',
        category: 'Examination',
        date: '2026-09-02',
        createdAt: '2026-09-06T10:00:00Z'
      }
    ]);
  },

  // Initialize if empty
  init: () => {
    if (!localStorage.getItem(KEYS.DEPARTMENTS)) {
      StorageService.resetToDefaults();
    }
  },

  // Departments
  getDepartments: (): Department[] => getStored<Department[]>(KEYS.DEPARTMENTS, SEED_DEPARTMENTS),
  getDepartmentByCode: (code: string): Department | undefined => {
    const list = StorageService.getDepartments();
    return list.find(d => d.code.toUpperCase() === code.toUpperCase());
  },
  updateDepartment: (updatedDept: Department) => {
    const list = StorageService.getDepartments();
    const updated = list.map(d => (d.id === updatedDept.id ? updatedDept : d));
    setStored(KEYS.DEPARTMENTS, updated);
  },

  // Users
  getUsers: (): User[] => getStored<User[]>(KEYS.USERS, SEED_USERS),
  getUserById: (id: string): User | undefined => {
    return StorageService.getUsers().find(u => u.id === id);
  },
  getCurrentUserId: (): string | null => getStored<string | null>(KEYS.CURRENT_USER_ID, null),
  setCurrentUserId: (id: string) => setStored(KEYS.CURRENT_USER_ID, id),
  clearCurrentUser: () => localStorage.removeItem(KEYS.CURRENT_USER_ID),
  saveUser: (user: User) => {
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    setStored(KEYS.USERS, users);
  },

  // Notices
  getNotices: (): Notice[] => getStored<Notice[]>(KEYS.NOTICES, SEED_NOTICES),
  saveNotice: (notice: Notice) => {
    const list = StorageService.getNotices();
    const index = list.findIndex(n => n.id === notice.id);
    if (index >= 0) {
      list[index] = notice;
    } else {
      list.unshift(notice);
    }
    setStored(KEYS.NOTICES, list);
  },
  deleteNotice: (id: string) => {
    const list = StorageService.getNotices().filter(n => n.id !== id);
    setStored(KEYS.NOTICES, list);
  },
  approveNotice: (id: string) => {
    const list = StorageService.getNotices();
    const notice = list.find(n => n.id === id);
    if (notice) {
      notice.status = 'APPROVED';
      delete notice.rejectionReason;
      setStored(KEYS.NOTICES, list);
      // Dispatch notification
      StorageService.addNotification({
        id: `notif-${Date.now()}`,
        userId: notice.publisherId,
        title: 'Notice Approved! 🎉',
        message: `Your notice "${notice.title.slice(0, 45)}..." has been approved and published.`,
        type: 'APPROVAL',
        linkTarget: { tab: 'notices', itemId: notice.id },
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  },
  rejectNotice: (id: string, reason: string) => {
    const list = StorageService.getNotices();
    const notice = list.find(n => n.id === id);
    if (notice) {
      notice.status = 'REJECTED';
      notice.rejectionReason = reason;
      setStored(KEYS.NOTICES, list);
      StorageService.addNotification({
        id: `notif-${Date.now()}`,
        userId: notice.publisherId,
        title: 'Notice Requires Revision',
        message: `Your notice "${notice.title.slice(0, 35)}..." was rejected. Reason: ${reason}`,
        type: 'APPROVAL',
        linkTarget: { tab: 'notices', itemId: notice.id },
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  },

  // Events
  getEvents: (): CampusEvent[] => getStored<CampusEvent[]>(KEYS.EVENTS, SEED_EVENTS),
  saveEvent: (event: CampusEvent) => {
    const list = StorageService.getEvents();
    const index = list.findIndex(e => e.id === event.id);
    if (index >= 0) {
      list[index] = event;
    } else {
      list.unshift(event);
    }
    setStored(KEYS.EVENTS, list);
  },
  deleteEvent: (id: string) => {
    const list = StorageService.getEvents().filter(e => e.id !== id);
    setStored(KEYS.EVENTS, list);
  },
  approveEvent: (id: string) => {
    const list = StorageService.getEvents();
    const event = list.find(e => e.id === id);
    if (event) {
      event.status = 'APPROVED';
      delete event.rejectionReason;
      setStored(KEYS.EVENTS, list);
      StorageService.addNotification({
        id: `notif-${Date.now()}`,
        userId: event.publisherId,
        title: 'Event Approved! 🌟',
        message: `Your event "${event.title.slice(0, 45)}..." is approved and open for registration.`,
        type: 'APPROVAL',
        linkTarget: { tab: 'events', itemId: event.id },
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  },
  rejectEvent: (id: string, reason: string) => {
    const list = StorageService.getEvents();
    const event = list.find(e => e.id === id);
    if (event) {
      event.status = 'REJECTED';
      event.rejectionReason = reason;
      setStored(KEYS.EVENTS, list);
      StorageService.addNotification({
        id: `notif-${Date.now()}`,
        userId: event.publisherId,
        title: 'Event Submission Returned',
        message: `Your event "${event.title.slice(0, 35)}..." was rejected. Reason: ${reason}`,
        type: 'APPROVAL',
        linkTarget: { tab: 'events', itemId: event.id },
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  },

  // Event Registrations
  getRegistrations: (): EventRegistration[] => getStored<EventRegistration[]>(KEYS.REGISTRATIONS, []),
  registerForEvent: (event: CampusEvent, user: User): EventRegistration | null => {
    const events = StorageService.getEvents();
    const targetEvent = events.find(e => e.id === event.id);
    if (!targetEvent) return null;

    if (targetEvent.registeredUserIds.includes(user.id)) {
      const existing = StorageService.getRegistrations().find(r => r.eventId === event.id && r.userId === user.id);
      if (existing) return existing;
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (targetEvent.status !== 'APPROVED' || targetEvent.availableSeats <= 0 ||
        targetEvent.date < today || targetEvent.registrationDeadline < today) return null;

    targetEvent.availableSeats -= 1;
    targetEvent.registeredUserIds.push(user.id);
    setStored(KEYS.EVENTS, events);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const registration: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      userId: user.id,
      studentName: user.name,
      studentId: user.studentOrEmpId,
      departmentCode: user.departmentCode,
      email: user.email,
      registeredAt: new Date().toISOString(),
      ticketCode: `IPS-${new Date().getFullYear()}-${user.departmentCode}-${randomNum}`
    };

    const registrations = StorageService.getRegistrations();
    registrations.unshift(registration);
    setStored(KEYS.REGISTRATIONS, registrations);

    // Send confirmation notification
    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: 'Event Registration Confirmed ✓',
      message: `You are confirmed for "${event.title.slice(0, 40)}...". Ticket: ${registration.ticketCode}`,
      type: 'EVENT',
      linkTarget: { tab: 'events', itemId: event.id },
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return registration;
  },

  // Exams
  getExams: (): ExamScheduleItem[] => getStored<ExamScheduleItem[]>(KEYS.EXAMS, SEED_EXAMS),
  saveExam: (exam: ExamScheduleItem) => {
    const list = StorageService.getExams();
    const index = list.findIndex(e => e.id === exam.id);
    if (index >= 0) list[index] = exam;
    else list.push(exam);
    setStored(KEYS.EXAMS, list);
  },

  // Career
  getCareerOpportunities: (): CareerOpportunity[] => getStored<CareerOpportunity[]>(KEYS.CAREER, SEED_CAREER),
  saveCareerOpportunity: (item: CareerOpportunity) => {
    const list = StorageService.getCareerOpportunities();
    const index = list.findIndex(c => c.id === item.id);
    if (index >= 0) list[index] = item;
    else list.unshift(item);
    setStored(KEYS.CAREER, list);
  },

  // Academic Calendar
  getCalendar: (): AcademicCalendarItem[] => getStored<AcademicCalendarItem[]>(KEYS.CALENDAR, SEED_CALENDAR),
  saveCalendarItem: (item: AcademicCalendarItem) => {
    const list = StorageService.getCalendar();
    const index = list.findIndex(c => c.id === item.id);
    if (index >= 0) list[index] = item;
    else list.push(item);
    setStored(KEYS.CALENDAR, list);
  },

  // Faculty Directory
  getFaculty: (): FacultyMember[] => getStored<FacultyMember[]>(KEYS.FACULTY, SEED_FACULTY),

  // Facilities
  getFacilities: (): CampusFacility[] => getStored<CampusFacility[]>(KEYS.FACILITIES, SEED_FACILITIES),

  // Notifications
  getNotifications: (): InAppNotification[] => getStored<InAppNotification[]>(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS),
  addNotification: (notif: InAppNotification) => {
    const list = StorageService.getNotifications();
    list.unshift(notif);
    setStored(KEYS.NOTIFICATIONS, list);
  },
  markNotificationRead: (id: string) => {
    const list = StorageService.getNotifications();
    const target = list.find(n => n.id === id);
    if (target) {
      target.isRead = true;
      setStored(KEYS.NOTIFICATIONS, list);
    }
  },
  markAllNotificationsRead: (userId: string) => {
    const list = StorageService.getNotifications();
    list.forEach(n => {
      if (n.userId === userId || n.userId === 'ALL') {
        n.isRead = true;
      }
    });
    setStored(KEYS.NOTIFICATIONS, list);
  },

  // Bookmarks
  getBookmarks: (): BookmarkItem[] => getStored<BookmarkItem[]>(KEYS.BOOKMARKS, []),
  toggleBookmark: (item: BookmarkItem): boolean => {
    const list = StorageService.getBookmarks();
    const index = list.findIndex(b => b.userId === item.userId && b.itemId === item.itemId);
    if (index >= 0) {
      list.splice(index, 1);
      setStored(KEYS.BOOKMARKS, list);
      return false; // unbookmarked
    } else {
      list.unshift(item);
      setStored(KEYS.BOOKMARKS, list);
      return true; // bookmarked
    }
  },
  isBookmarked: (userId: string, itemId: string): boolean => {
    const list = StorageService.getBookmarks();
    return list.some(b => b.userId === userId && b.itemId === itemId);
  },

  // Direct Faculty -> Class Notices (Operational updates without HOD approval)
  getClassNotices: (): DirectClassNotice[] => getStored<DirectClassNotice[]>(KEYS.CLASS_NOTICES, SEED_CLASS_NOTICES),
  sendClassNotice: (notice: DirectClassNotice): void => {
    const list = StorageService.getClassNotices();
    list.unshift(notice);
    setStored(KEYS.CLASS_NOTICES, list);
  },
  markClassNoticeRead: (noticeId: string, studentId: string): void => {
    const list = StorageService.getClassNotices();
    const target = list.find(cn => cn.id === noticeId);
    if (target && !target.readByUserIds.includes(studentId)) {
      target.readByUserIds.push(studentId);
      setStored(KEYS.CLASS_NOTICES, list);
    }
  },
  getStudentClassNotices: (course: string, semester: number): DirectClassNotice[] => {
    const list = StorageService.getClassNotices();
    return list.filter(cn => cn.course === course && cn.semester === semester);
  },
  getFacultyClassNotices: (facultyId: string): DirectClassNotice[] => {
    const list = StorageService.getClassNotices();
    return list.filter(cn => cn.facultyId === facultyId);
  }
};
