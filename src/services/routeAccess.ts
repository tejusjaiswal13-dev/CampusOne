import type { UserRole } from "../types";
const protectedTabs: Record<string, UserRole[]> = {
  users: ["COLLEGE_ADMIN"],
  "college-admin": ["COLLEGE_ADMIN"],
  approvals: ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
  "dept-admin": ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
  students: ["FACULTY"],
  classes: ["FACULTY"],
  "class-notices": ["FACULTY"],
  "faculty-dash": ["FACULTY"],
};
export function canAccessTab(role: UserRole, tab: string) {
  return !protectedTabs[tab] || protectedTabs[tab].includes(role);
}
