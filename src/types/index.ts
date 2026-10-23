export type UserRole =
  "STUDENT" | "FACULTY" | "DEPARTMENT_ADMIN" | "COLLEGE_ADMIN";

export type NoticeCategory =
  | "General"
  | "Academic"
  | "Examination"
  | "Department"
  | "Placement"
  | "Internship"
  | "Scholarship"
  | "Seminar"
  | "Workshop"
  | "Event"
  | "Urgent"
  | "Competition"
  | "Guest Lecture";

export type EventCategory =
  | "Seminar"
  | "Workshop"
  | "Conference"
  | "Technical"
  | "Cultural"
  | "Sports"
  | "Guest Lecture"
  | "Competition";

export type ContentScope = "COLLEGE" | "DEPARTMENT";

export type ApprovalStatus =
  "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export interface Department {
  id: string;
  code: string; // e.g. CCET, CFT, CMS, CFDT, CTF
  name: string;
  fullName: string;
  description: string;
  hodName: string;
  hodEmail: string;
  hodPhone: string;
  facultyCount: number;
  studentCount: number;
  location: string;
  courses: CourseInfo[];
  contactEmail: string;
  contactPhone: string;
  bannerImage: string;
  resources: DepartmentResource[];
}

export interface CourseInfo {
  id: string;
  name: string;
  code: string;
  durationYears: number;
  totalSemesters: number;
  type: "Undergraduate" | "Postgraduate" | "Diploma";
}

export interface DepartmentResource {
  id: string;
  title: string;
  category: "Syllabus" | "Lab Manual" | "Previous Papers" | "Curriculum";
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
}

export interface User {
  accountStatus?: "ACTIVE" | "PENDING" | "REJECTED";
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentOrEmpId: string;
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  course?: string;
  semester?: number;
  phone?: string;
  avatar?: string;
  designation?: string; // For faculty / HOD
  qualification?: string;
  cabinOrOffice?: string;
  assignedClasses?: FacultyClassAssignment[];
  createdAt: string;
}

export interface FacultyClassAssignment {
  id: string;
  course: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  room: string;
  studentCount: number;
}

export type ClassNoticeType =
  | "CLASS_CANCELLED"
  | "ROOM_CHANGED"
  | "TIME_RESCHEDULED"
  | "ASSIGNMENT_REMINDER"
  | "LAB_UPDATE"
  | "GENERAL_CLASS_UPDATE";

export interface DirectClassNotice {
  id: string;
  facultyId: string;
  facultyName: string;
  facultyDesignation: string;
  departmentCode: string;
  course: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  title: string;
  message: string;
  noticeType: ClassNoticeType;
  createdAt: string;
  readByUserIds: string[];
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  scope: ContentScope;
  departmentId?: string; // Set if scope === 'DEPARTMENT'
  departmentCode?: string;
  publisherId: string;
  publisherName: string;
  publisherRole: UserRole;
  status: ApprovalStatus;
  rejectionReason?: string;
  isUrgent: boolean;
  publishedAt: string;
  deadline?: string;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  viewsCount: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  scope: ContentScope;
  departmentId?: string;
  departmentCode?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 10:30 AM - 01:00 PM
  venue: string;
  organizer: string;
  speaker?: string;
  speakerDesignation?: string;
  totalSeats: number;
  availableSeats: number;
  registrationDeadline: string;
  registeredUserIds: string[];
  bannerImage?: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  publisherId: string;
  publisherName: string;
  publisherRole: UserRole;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  userId: string;
  studentName: string;
  studentId: string;
  departmentCode: string;
  email: string;
  registeredAt: string;
  ticketCode: string;
}

export interface ExamScheduleItem {
  id: string;
  course: string;
  semester: number;
  departmentCode: string;
  examType: "Internal Sessional" | "Semester Final" | "Practical / Viva";
  subjectCode: string;
  subjectName: string;
  date: string;
  shift: "Morning (09:00 AM - 12:00 PM)" | "Afternoon (02:00 PM - 05:00 PM)";
  room: string;
  instructions: string[];
}

export interface CareerOpportunity {
  id: string;
  type:
    | "Placement"
    | "Internship"
    | "Industrial Visit"
    | "Skill Workshop"
    | "Training";
  company: string;
  companyLogo?: string;
  role: string;
  location: string;
  stipendOrSalary: string;
  eligibility: string;
  skills: string[];
  description: string;
  applicationDeadline: string;
  applyUrl: string;
  departmentCodes: string[]; // Can target CCET, CFT, CMS, or ['ALL']
  status: "Open" | "Closing Soon" | "Closed";
}

export interface AcademicCalendarItem {
  id: string;
  title: string;
  category: "Semester" | "Examination" | "Holiday" | "Deadline" | "Workshop";
  startDate: string;
  endDate?: string;
  description: string;
  scope: ContentScope;
  departmentCode?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  qualification: string;
  specialization: string;
  subjects: string[];
  email: string;
  phone: string;
  office: string;
  avatar: string;
  experienceYears: number;
}

export interface CampusFacility {
  id: string;
  name: string;
  category:
    | "Academic"
    | "Laboratory"
    | "Library"
    | "Hostel"
    | "Sports"
    | "Administrative"
    | "Amenity";
  location: string;
  timings: string;
  incharge: string;
  contact: string;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface InAppNotification {
  id: string;
  userId: string; // 'ALL' or specific user ID
  targetDepartmentCode?: string; // for department broadcasts
  title: string;
  message: string;
  type: "NOTICE" | "EVENT" | "EXAM" | "CAREER" | "URGENT" | "APPROVAL";
  linkTarget?: {
    tab: string;
    itemId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  itemType: "NOTICE" | "EVENT" | "CAREER" | "RESOURCE";
  itemId: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  createdAt: string;
}
