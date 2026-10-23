import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  api,
  ApiError,
  demoEnabled,
  hasToken,
  setToken,
} from "../services/api";
import { AuthService } from "../services/authService";
import { clearReminders } from "../services/nativeService";
import { StorageService } from "../services/storageService";
import type { User, UserRole } from "../types";
import {
  AuthContext,
  type AuthResult,
  type RegistrationInput,
} from "./AuthState";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"online" | "demo">("online");
  const [ready, setReady] = useState(false);
  const enterDemo = useCallback(() => {
    if (!demoEnabled) return;
    setToken(null);
    StorageService.init();
    const id = StorageService.getCurrentUserId();
    setUser(id ? StorageService.getUserById(id) || null : null);
    setMode("demo");
    setReady(true);
  }, []);
  const reconnect = useCallback(async () => {
    await api("/health");
    setToken(null);
    setUser(null);
    setMode("online");
    setReady(true);
  }, []);
  useEffect(() => {
    let active = true;
    const expired = () => {
      setUser(null);
    };
    window.addEventListener("campus-session-expired", expired);
    (async () => {
      try {
        await api("/health");
        if (hasToken()) {
          const user = await api<User>("/auth/me");
          if (active) setUser(user);
        }
      } catch (error) {
        if (active && error instanceof ApiError && error.status === 0)
          enterDemo();
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
      window.removeEventListener("campus-session-expired", expired);
    };
  }, [enterDemo]);
  async function login(email: string, password: string): Promise<AuthResult> {
    if (mode === "demo") {
      const r = AuthService.loginWithEmail(email);
      if (r.user) setUser(r.user);
      return { success: r.success, error: r.error };
    }
    try {
      const r = await api<{ user: User; token: string }>(
        "/auth/login",
        "POST",
        { email, password },
      );
      setToken(r.token);
      setUser(r.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }
  async function logout() {
    try {
      if (mode === "online" && hasToken())
        await api("/auth/logout", "POST", {});
    } catch {
      /* Local session is discarded even if the server is unavailable. */
    } finally {
      setToken(null);
      StorageService.clearCurrentUser();
      setUser(null);
      await clearReminders().catch(console.error);
    }
  }
  function switchDemoRole(role: UserRole, departmentCode?: string) {
    if (mode !== "demo" || !demoEnabled) return;
    const user = AuthService.loginAsDemoRole(role, departmentCode);
    if (user) {
      void clearReminders().catch(console.error);
      setUser(user);
    }
  }
  async function register(payload: RegistrationInput): Promise<AuthResult> {
    if (mode === "demo") {
      if (payload.role !== "STUDENT")
        return {
          success: false,
          error: "Faculty registration requires the server and approval.",
        };
      const r = AuthService.register(payload);
      if (r.user) setUser(r.user);
      return { success: r.success, error: r.error };
    }
    try {
      const r = await api<{ user?: User; token?: string; pending?: boolean }>(
        "/auth/register",
        "POST",
        payload,
      );
      if (r.user && r.token) {
        setToken(r.token);
        setUser(r.user);
      }
      return { success: true, pending: r.pending };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }
  async function updateProfile(updates: Partial<User>) {
    if (!currentUser) return;
    const allowed = {
      name: updates.name ?? currentUser.name,
      phone: updates.phone,
      semester: updates.semester,
    };
    if (mode === "online") {
      const user = await api<User>("/auth/profile", "PATCH", allowed);
      setUser(user);
    } else {
      const user = { ...currentUser, ...allowed };
      StorageService.saveUser(user);
      setUser(user);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || "STUDENT",
        isAuthenticated: !!currentUser,
        mode,
        ready,
        login,
        logout,
        register,
        updateProfile,
        switchDemoRole,
        enterDemo,
        reconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
