import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';
import { AuthService } from '../services/authService';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    StorageService.init();
    const currentId = StorageService.getCurrentUserId();
    const user = currentId ? StorageService.getUserById(currentId) : undefined;
    if (user) {
      setCurrentUser(user);
      StorageService.setCurrentUserId(user.id);
    }
  }, []);

  const login = (email: string) => {
    const res = AuthService.loginWithEmail(email);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const logout = () => {
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
    return { success: false, error: res.error || 'Registration failed' };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    StorageService.saveUser(updated);
    setCurrentUser(updated);
  };

  const role: UserRole = currentUser ? currentUser.role : 'STUDENT';

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
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
