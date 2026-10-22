import React, { useState } from "react";
import { AuthService } from "../services/authService";
import { clearReminders } from "../services/nativeService";
import { StorageService } from "../services/storageService";
import { User, UserRole } from "../types";

import { AuthContext } from "./AuthState";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    StorageService.init();
    const id = StorageService.getCurrentUserId();
    return id ? StorageService.getUserById(id) || null : null;
  });

  const login = (email: string) => {
    const res = AuthService.loginWithEmail(email);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || "Login failed" };
  };

  const logout = () => {
    void clearReminders().catch(console.error);
    StorageService.clearCurrentUser();
    setCurrentUser(null);
  };

  const switchDemoRole = (role: UserRole, departmentCode?: string) => {
    const user = AuthService.loginAsDemoRole(role, departmentCode);
    if (user) {
      setCurrentUser(user);
    }
  };

  const register = (payload: {
    name: string;
    email: string;
    studentOrEmpId: string;
    role: UserRole;
    departmentCode: string;
    course?: string;
    semester?: number;
    phone?: string;
  }) => {
    const res = AuthService.register(payload);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || "Registration failed" };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    StorageService.saveUser(updated);
    setCurrentUser(updated);
  };

  const role: UserRole = currentUser ? currentUser.role : "STUDENT";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchDemoRole,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
