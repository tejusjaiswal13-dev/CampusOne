import { z } from "zod";
const text = z.string().trim().min(1).max(500);
const long = z.string().trim().min(1).max(20000);
const optional = z.string().max(1000).optional();
export const idSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
export const deptSchema = z.enum(["CCET", "CFT", "CMS", "CFDT", "CTF"]);
export const roleSchema = z.enum([
  "STUDENT",
  "FACULTY",
  "DEPARTMENT_ADMIN",
  "COLLEGE_ADMIN",
]);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date");
const scope = z.enum(["COLLEGE", "DEPARTMENT"]);
export const loginSchema = z
  .object({
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
    password: z.string().min(1).max(72),
  })
  .strict();
export const registerSchema = z
  .object({
    name: text,
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
    password: z.string().min(12).max(72),
    studentOrEmpId: text,
    role: z.enum(["STUDENT", "FACULTY"]),
    departmentCode: deptSchema,
    course: text.optional(),
    semester: z.number().int().min(1).max(12).optional(),
    phone: optional,
  })
  .strict();
export const profileSchema = z
  .object({
    name: text.optional(),
    phone: optional,
    semester: z.number().int().min(1).max(12).optional(),
  })
  .strict();
export const noticeSchema = z
  .object({
    title: text,
    description: long,
    category: z.enum([
      "General",
      "Academic",
      "Examination",
      "Department",
      "Placement",
      "Internship",
      "Scholarship",
      "Seminar",
      "Workshop",
      "Event",
      "Urgent",
      "Competition",
      "Guest Lecture",
    ]),
    scope,
    departmentCode: deptSchema.optional(),
    isUrgent: z.boolean().default(false),
    deadline: date.optional(),
  })
  .strict();
export const eventSchema = z
  .object({
    title: text,
    description: long,
    category: z.enum([
      "Seminar",
      "Workshop",
      "Conference",
      "Technical",
      "Cultural",
      "Sports",
      "Guest Lecture",
      "Competition",
    ]),
    scope,
    departmentCode: deptSchema.optional(),
    date,
    time: text,
    venue: text,
    organizer: text,
    speaker: optional,
    speakerDesignation: optional,
    totalSeats: z.number().int().min(1).max(100000),
    registrationDeadline: date,
  })
  .strict()
  .refine(
    (e) => e.registrationDeadline <= e.date,
    "Registration deadline must not follow event date",
  );
export const examSchema = z
  .object({
    course: text,
    semester: z.number().int().min(1).max(12),
    departmentCode: deptSchema,
    examType: z.enum([
      "Internal Sessional",
      "Semester Final",
      "Practical / Viva",
    ]),
    subjectCode: text,
    subjectName: text,
    date,
    shift: z.enum([
      "Morning (09:00 AM - 12:00 PM)",
      "Afternoon (02:00 PM - 05:00 PM)",
    ]),
    room: text,
    instructions: z.array(text).max(30),
  })
  .strict();
export const careerSchema = z
  .object({
    type: z.enum([
      "Placement",
      "Internship",
      "Industrial Visit",
      "Skill Workshop",
      "Training",
    ]),
    company: text,
    role: text,
    location: text,
    stipendOrSalary: text,
    eligibility: long,
    skills: z.array(text).max(30),
    description: long,
    applicationDeadline: date,
    applyUrl: z.url().refine((s) => s.startsWith("https://"), "HTTPS required"),
    departmentCodes: z
      .array(z.union([deptSchema, z.literal("ALL")]))
      .min(1)
      .max(5),
    status: z.enum(["Open", "Closing Soon", "Closed"]),
  })
  .strict();
export const calendarSchema = z
  .object({
    title: text,
    category: z.enum([
      "Semester",
      "Examination",
      "Holiday",
      "Deadline",
      "Workshop",
    ]),
    startDate: date,
    endDate: date.optional(),
    description: long,
    scope,
    departmentCode: deptSchema.optional(),
  })
  .strict();
export const classSchema = z
  .object({
    course: text,
    semester: z.number().int().min(1).max(12),
    subjectCode: text,
    subjectName: text,
    title: text,
    message: long,
    noticeType: z.enum([
      "CLASS_CANCELLED",
      "ROOM_CHANGED",
      "TIME_RESCHEDULED",
      "ASSIGNMENT_REMINDER",
      "LAB_UPDATE",
      "GENERAL_CLASS_UPDATE",
    ]),
  })
  .strict();
export const approvalSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    reason: z.string().max(2000).optional(),
  })
  .strict();
export const bookmarkSchema = z
  .object({
    itemType: z.enum(["NOTICE", "EVENT", "CAREER", "RESOURCE"]),
    itemId: idSchema,
  })
  .strict();
export const emptySchema = z.object({}).strict();
export const listSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(500).default(100),
    offset: z.coerce.number().int().min(0).max(100000).default(0),
    q: z.string().max(200).optional(),
  })
  .strict();
export const departmentUpdateSchema = z
  .object({
    description: long.optional(),
    location: text.optional(),
    contactEmail: z.email().optional(),
    contactPhone: text.optional(),
  })
  .strict();
