import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
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
  const { login, switchDemoRole } = useAuth();
  const { setCurrentTab } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const result = login(email);
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
        <span className="co-pill">LOCAL DEMO</span>
        <h2>Find your campus view</h2>
        <p>Choose a sample profile to explore.</p>
        <div className="co-profile-choices">
          {profiles.map(({ role, title, detail, icon: Icon, department }) => (
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
        <div className="co-login-divider">OR OPEN A SAVED PROFILE</div>
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
          <button className="co-button dark" type="submit">
            Continue <ArrowRight size={17} />
          </button>
        </form>
        <button
          className="co-text-button"
          onClick={() => setCurrentTab("register")}
        >
          Create a local profile <ArrowRight size={15} />
        </button>
        <p className="co-login-disclosure">
          Sample accounts are stored on this device. This preview does not
          verify your identity or connect to university systems.
        </p>
      </section>
    </div>
  );
};
