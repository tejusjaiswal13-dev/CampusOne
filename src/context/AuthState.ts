import { createContext, useContext } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  switchDemoRole: (role: UserRole, departmentCode?: string) => void;
  register: (payload: {
    name: string;
    email: string;
    studentOrEmpId: string;
    role: UserRole;
    departmentCode: string;
    course?: string;
    semester?: number;
    phone?: string;
  }) => { success: boolean; error?: string };
  updateProfile: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
