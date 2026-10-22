import { ArrowLeft, ShieldAlert } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { UserRole } from "../../types";

export const RegisterView: React.FC = () => {
  const { register } = useAuth();
  const { setCurrentTab, departments, showToast } = useApp();

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [deptCode, setDeptCode] = useState("CCET");
  const [course, setCourse] = useState(
    "Bachelor of Computer Applications (BCA)",
  );
  const [semester, setSemester] = useState(1);
  const [phone, setPhone] = useState("+91 ");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setBusy(true);
    const res = await register({
      password,
      name,
      email,
      studentOrEmpId: studentId,
      role,
      departmentCode: deptCode,
      course,
      semester: Number(semester),
      phone,
    });

    setBusy(false);
    if (res.pending) {
      setError(
        "Faculty account submitted. Wait for department approval before signing in.",
      );
      return;
    }
    if (res.success) {
      showToast("Account setup complete! Welcome to IPS UOA 🎉", "success");
      setCurrentTab("home");
    } else {
      setError(res.error || "Failed to setup account");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-left">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="co-surface-banner text-white p-6 sm:p-7">
          <button
            onClick={() => setCurrentTab("login")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
          <h1 className="text-xl font-semibold text-white">
            Student & Scholar Account Setup
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Institute of Professional Studies, University of Allahabad
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-7 space-y-3.5 text-xs"
        >
          <label>
            Password (12–72 characters)
            <input
              aria-label="New password"
              type="password"
              minLength={12}
              maxLength={72}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
          </label>
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Singh"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@allduniv.ac.in"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Enrollment / Roll ID *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="IPS2026-BCA-001"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Department Center *
              </label>
              <select
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Account Role Request
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">
                  Faculty (Requires Admin Endorsement)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Degree / Course
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. BCA / MCA / Food Tech"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
              >
                <option value={1}>Semester I</option>
                <option value={2}>Semester II</option>
                <option value={3}>Semester III</option>
                <option value={4}>Semester IV</option>
                <option value={5}>Semester V</option>
                <option value={6}>Semester VI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mobile Contact
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Privileged roles (HOD, College Admin) are issued strictly by
              College Directorate records and cannot be self-elevated.
            </span>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Complete Registration & Enter Campus
          </button>
        </form>
      </div>
    </div>
  );
};
