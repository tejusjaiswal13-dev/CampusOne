import type {
  User,
  Notice,
  CampusEvent,
  ExamScheduleItem,
  CareerOpportunity,
  DirectClassNotice,
  InAppNotification,
  AcademicCalendarItem,
} from "../../src/types";
export function approvedScope(user: User, item: Notice | CampusEvent) {
  return (
    item.status === "APPROVED" &&
    (item.scope === "COLLEGE" || item.departmentCode === user.departmentCode)
  );
}
export function canReadContent(user: User, item: Notice | CampusEvent) {
  if (user.role === "COLLEGE_ADMIN") return true;
  if (approvedScope(user, item)) return true;
  if (user.role === "DEPARTMENT_ADMIN")
    return (
      item.scope === "DEPARTMENT" && item.departmentCode === user.departmentCode
    );
  return user.role === "FACULTY" && item.publisherId === user.id;
}
export function canManageContent(user: User, item: Notice | CampusEvent) {
  return (
    user.role === "COLLEGE_ADMIN" ||
    (user.role === "DEPARTMENT_ADMIN" &&
      item.scope === "DEPARTMENT" &&
      item.departmentCode === user.departmentCode)
  );
}
export function courseMatches(user: User, course: string) {
  return user.course === course || !!user.course?.includes(`(${course})`);
}
export function canReadExam(user: User, e: ExamScheduleItem) {
  return (
    user.role === "COLLEGE_ADMIN" ||
    (e.departmentCode === user.departmentCode &&
      (user.role !== "STUDENT" ||
        (courseMatches(user, e.course) && user.semester === e.semester)))
  );
}
export function canReadCareer(user: User, c: CareerOpportunity) {
  return (
    user.role === "COLLEGE_ADMIN" ||
    c.departmentCodes.includes("ALL") ||
    c.departmentCodes.includes(user.departmentCode)
  );
}
export function canReadClass(user: User, c: DirectClassNotice) {
  return (
    user.role === "COLLEGE_ADMIN" ||
    (c.departmentCode === user.departmentCode &&
      (user.role === "DEPARTMENT_ADMIN" ||
        (user.role === "FACULTY" && c.facultyId === user.id) ||
        (user.role === "STUDENT" &&
          courseMatches(user, c.course) &&
          user.semester === c.semester)))
  );
}
export function canReadNotification(user: User, n: InAppNotification) {
  return (
    n.userId === user.id ||
    (n.userId === "ALL" &&
      (!n.targetDepartmentCode ||
        n.targetDepartmentCode === user.departmentCode))
  );
}
export function canReadCalendar(user: User, c: AcademicCalendarItem) {
  return (
    user.role === "COLLEGE_ADMIN" ||
    c.scope === "COLLEGE" ||
    c.departmentCode === user.departmentCode
  );
}
