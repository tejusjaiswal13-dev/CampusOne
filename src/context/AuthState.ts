import { createContext, useContext } from "react";
import type { User, UserRole } from "../types";
export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  studentOrEmpId: string;
  role: UserRole;
  departmentCode: string;
  course?: string;
  semester?: number;
  phone?: string;
}
export interface AuthResult {
  success: boolean;
  error?: string;
  pending?: boolean;
}
export interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  mode: "online" | "demo";
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (input: RegistrationInput) => Promise<AuthResult>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchDemoRole: (role: UserRole, departmentCode?: string) => void;
  enterDemo: () => void;
  reconnect: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider required");
  return value;
};
