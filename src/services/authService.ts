import { User, UserRole } from "../types";
import { StorageService } from "./storageService";

export const AuthService = {
  // Demo switch profiles for instant minor project presentation
  getDemoUsers: (): User[] => {
    return StorageService.getUsers();
  },

  loginAsDemoRole: (
    role: UserRole,
    departmentCode?: string,
  ): User | undefined => {
    const users = StorageService.getUsers();
    let match = users.find(
      (u) =>
        u.role === role &&
        (!departmentCode || u.departmentCode === departmentCode),
    );
    if (!match) {
      match = users.find((u) => u.role === role);
    }
    if (match) {
      StorageService.setCurrentUserId(match.id);
    }
    return match;
  },

  loginWithEmail: (
    email: string,
  ): { success: boolean; user?: User; error?: string } => {
    const users = StorageService.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user) {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    }
    StorageService.setCurrentUserId(user.id);
    return { success: true, user };
  },

  register: (payload: {
    name: string;
    email: string;
    studentOrEmpId: string;
    role: UserRole;
    departmentCode: string;
    course?: string;
    semester?: number;
    phone?: string;
  }): { success: boolean; user?: User; error?: string } => {
    const users = StorageService.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );
    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const dept = StorageService.getDepartmentByCode(payload.departmentCode);
    const departmentName = dept ? dept.name : "Computer Applications";
    const departmentId = dept ? dept.id : "dept-ccet";

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      studentOrEmpId: payload.studentOrEmpId,
      departmentId,
      departmentCode: payload.departmentCode,
      departmentName,
      course: payload.course,
      semester: payload.semester,
      phone: payload.phone,
      avatar: "/avatar-placeholder.svg",
      createdAt: new Date().toISOString(),
    };

    StorageService.saveUser(newUser);
    StorageService.setCurrentUserId(newUser.id);
    return { success: true, user: newUser };
  },

  // Permissions helpers
  canManageCollege: (user: User | null): boolean => {
    return user?.role === "COLLEGE_ADMIN";
  },

  canManageDepartment: (
    user: User | null,
    departmentCode?: string,
  ): boolean => {
    if (!user) return false;
    if (user.role === "COLLEGE_ADMIN") return true;
    if (user.role === "DEPARTMENT_ADMIN") {
      return (
        !departmentCode ||
        user.departmentCode.toUpperCase() === departmentCode.toUpperCase()
      );
    }
    return false;
  },

  canPublishDirectly: (
    user: User | null,
    scope: "COLLEGE" | "DEPARTMENT",
    departmentCode?: string,
  ): boolean => {
    if (!user) return false;
    if (user.role === "COLLEGE_ADMIN") return true;
    if (user.role === "DEPARTMENT_ADMIN" && scope === "DEPARTMENT") {
      return (
        !departmentCode ||
        user.departmentCode.toUpperCase() === departmentCode.toUpperCase()
      );
    }
    return false;
  },

  canSubmitForApproval: (user: User | null): boolean => {
    if (!user) return false;
    return (
      user.role === "FACULTY" ||
      user.role === "DEPARTMENT_ADMIN" ||
      user.role === "COLLEGE_ADMIN"
    );
  },
};
