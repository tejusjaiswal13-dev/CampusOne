import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import type { UserRole } from "../../types";
const profiles: {
  role: UserRole;
  title: string;
  detail: string;
  icon: typeof Users;
  department?: string;
}[] = [
  {
    role: "STUDENT",
    title: "Student",
    detail: "Classes, notices & opportunities",
    icon: GraduationCap,
    department: "CCET",
  },
  {
    role: "FACULTY",
    title: "Faculty",
    detail: "Teach, share & stay connected",
    icon: BookOpen,
    department: "CCET",
  },
  {
    role: "DEPARTMENT_ADMIN",
    title: "Department admin",
    detail: "Approvals & department updates",
    icon: Building2,
    department: "CCET",
  },
  {
    role: "COLLEGE_ADMIN",
    title: "College admin",
    detail: "People & campus administration",
    icon: ShieldCheck,
  },
];
export const LoginView = () => {
  const { login, switchDemoRole, mode } = useAuth();
  const { setCurrentTab } = useApp();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.success) setCurrentTab("home");
    else setError(result.error || "Profile not found.");
  }
  return (
    <div className="co-login">
      <section className="co-login-story">
        <span className="co-eyebrow">WELCOME TO CAMPUSONE</span>
        <h1>
          Your people.
          <br />
          Your possibilities.
          <br />
          <em>All in one place.</em>
        </h1>
        <p>
          From the first class to your next big opportunity, stay connected to
          everything happening at IPS.
        </p>
        <div className="co-login-seal">
          <GraduationCap size={31} />
          <span>
            Institute of Professional Studies
            <small>University of Allahabad</small>
          </span>
        </div>
      </section>
      <section className="co-login-form">
        <span className="co-pill">
          {mode === "demo" ? "LOCAL DEMO" : "SECURE SIGN IN"}
        </span>
        <h2>Find your campus view</h2>
        <p>
          {mode === "demo"
            ? "Choose a sample profile to explore."
            : "Sign in with your campus account."}
        </p>
        <div className="co-profile-choices">
          {mode === "demo" &&
            profiles.map(({ role, title, detail, icon: Icon, department }) => (
              <button
                key={role}
                onClick={() => {
                  switchDemoRole(role, department);
                  setCurrentTab("home");
                }}
              >
                <Icon size={22} />
                <span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
        </div>
        <div className="co-login-divider">SIGN IN WITH EMAIL</div>
        <form onSubmit={submit}>
          <label htmlFor="demo-email">Profile email</label>
          <input
            id="demo-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Your saved demo email"
            autoComplete="email"
          />
          {error && (
            <p className="co-form-error" role="alert">
              {error}
            </p>
          )}
          {mode === "online" && (
            <label>
              Password
              <input
                aria-label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          <button disabled={busy} className="co-button dark" type="submit">
            Continue <ArrowRight size={17} />
          </button>
        </form>
        <button
          className="co-text-button"
          onClick={() => setCurrentTab("register")}
        >
          Create an account <ArrowRight size={15} />
        </button>
        <p className="co-login-disclosure">
          {mode === "demo"
            ? "Offline sample accounts are stored on this device."
            : "Your account and permissions are verified by the CampusOne server."}
        </p>
      </section>
    </div>
  );
};
