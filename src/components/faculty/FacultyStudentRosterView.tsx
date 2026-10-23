import {
  BookOpen,
  CheckCircle2,
  Download,
  Filter,
  GraduationCap,
  Mail,
  Search,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { FacultyClassAssignment } from "../../types";

interface RosterStudent {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  attendancePercent: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  category: string;
}

const MOCK_BCA_STUDENTS: RosterStudent[] = [
  {
    id: "st-01",
    rollNo: "IPS2023-BCA-042",
    name: "Aarav Sharma",
    email: "aarav.sharma@ips.allduniv.ac.in",
    phone: "+91 98765 43210",
    attendancePercent: 91,
    assignmentsSubmitted: 2,
    totalAssignments: 2,
    category: "Regular",
  },
  {
    id: "st-02",
    rollNo: "IPS2023-BCA-015",
    name: "Ananya Gupta",
    email: "ananya.gupta@ips.allduniv.ac.in",
    phone: "+91 98112 33445",
    attendancePercent: 88,
    assignmentsSubmitted: 2,
    totalAssignments: 2,
    category: "Regular",
  },
  {
    id: "st-03",
    rollNo: "IPS2023-BCA-029",
    name: "Divyansh Mishra",
    email: "divyansh.m@ips.allduniv.ac.in",
    phone: "+91 97234 55667",
    attendancePercent: 72,
    assignmentsSubmitted: 1,
    totalAssignments: 2,
    category: "Short Attendance",
  },
  {
    id: "st-04",
    rollNo: "IPS2023-BCA-008",
    name: "Isha Patel",
    email: "isha.patel@ips.allduniv.ac.in",
    phone: "+91 94567 11223",
    attendancePercent: 95,
    assignmentsSubmitted: 2,
    totalAssignments: 2,
    category: "Regular",
  },
  {
    id: "st-05",
    rollNo: "IPS2023-BCA-053",
    name: "Kunal Srivastava",
    email: "kunal.s@ips.allduniv.ac.in",
    phone: "+91 93355 44889",
    attendancePercent: 68,
    assignmentsSubmitted: 1,
    totalAssignments: 2,
    category: "Defaulter",
  },
  {
    id: "st-06",
    rollNo: "IPS2023-BCA-037",
    name: "Pooja Tiwari",
    email: "pooja.t@ips.allduniv.ac.in",
    phone: "+91 91234 88990",
    attendancePercent: 84,
    assignmentsSubmitted: 2,
    totalAssignments: 2,
    category: "Regular",
  },
  {
    id: "st-07",
    rollNo: "IPS2023-BCA-061",
    name: "Rohan Verma",
    email: "rohan.v@ips.allduniv.ac.in",
    phone: "+91 99112 77881",
    attendancePercent: 79,
    assignmentsSubmitted: 2,
    totalAssignments: 2,
    category: "Regular",
  },
  {
    id: "st-08",
    rollNo: "IPS2023-BCA-019",
    name: "Sneha Pandey",
    email: "sneha.p@ips.allduniv.ac.in",
    phone: "+91 98390 12345",
    attendancePercent: 92,
    assignmentsSubmitted: 2,
    totalAssignments: 2,
    category: "Regular",
  },
];

const MOCK_MCA_STUDENTS: RosterStudent[] = [
  {
    id: "mc-01",
    rollNo: "IPS2024-MCA-005",
    name: "Aditya Raj",
    email: "aditya.mca@ips.allduniv.ac.in",
    phone: "+91 98881 22334",
    attendancePercent: 94,
    assignmentsSubmitted: 3,
    totalAssignments: 3,
    category: "Regular",
  },
  {
    id: "mc-02",
    rollNo: "IPS2024-MCA-012",
    name: "Bhavna Sen",
    email: "bhavna.mca@ips.allduniv.ac.in",
    phone: "+91 97772 33445",
    attendancePercent: 71,
    assignmentsSubmitted: 2,
    totalAssignments: 3,
    category: "Short Attendance",
  },
  {
    id: "mc-03",
    rollNo: "IPS2024-MCA-024",
    name: "Gaurav Dubey",
    email: "gaurav.mca@ips.allduniv.ac.in",
    phone: "+91 96663 44556",
    attendancePercent: 89,
    assignmentsSubmitted: 3,
    totalAssignments: 3,
    category: "Regular",
  },
  {
    id: "mc-04",
    rollNo: "IPS2024-MCA-031",
    name: "Tanvi Jaiswal",
    email: "tanvi.mca@ips.allduniv.ac.in",
    phone: "+91 95554 55667",
    attendancePercent: 96,
    assignmentsSubmitted: 3,
    totalAssignments: 3,
    category: "Regular",
  },
];

export const FacultyStudentRosterView: React.FC = () => {
  const { currentUser, mode } = useAuth();
  const { setCurrentTab, showToast } = useApp();
  const assignedClasses: FacultyClassAssignment[] =
    currentUser?.assignedClasses || [];

  const [selectedClassId, setSelectedClassId] = useState<string>(
    assignedClasses[0]?.id || "cls-assign-1",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "DEFAULTER" | "REGULAR">(
    "ALL",
  );

  const activeClass = assignedClasses.find((c) => c.id === selectedClassId) ||
    assignedClasses[0] || {
      id: "cls-assign-1",
      course: "BCA",
      semester: 5,
      subjectCode: "BCA-502",
      subjectName: "Database Management Systems & SQL",
      room: "Room B-204 (2nd Floor)",
      studentCount: 64,
    };

  const rawStudents =
    mode === "demo"
      ? activeClass.course === "MCA"
        ? MOCK_MCA_STUDENTS
        : MOCK_BCA_STUDENTS
      : [];

  const filteredStudents = rawStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "DEFAULTER") {
      return student.attendancePercent < 75;
    }
    if (filterType === "REGULAR") {
      return student.attendancePercent >= 75;
    }
    return true;
  });

  const defaultersCount = rawStudents.filter(
    (s) => s.attendancePercent < 75,
  ).length;
  const avgAttendance = Math.round(
    rawStudents.reduce((acc, curr) => acc + curr.attendancePercent, 0) /
      rawStudents.length,
  );

  return (
    <div className="space-y-6 pb-12">
      <p className="text-xs text-slate-500">
        {mode === "demo"
          ? "Sample roster and attendance for evaluation only."
          : "Live attendance records are not collected by CampusOne."}
      </p>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Registry • CCET</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Enrolled Student Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor attendance, assignment submissions, and contact students in
            your enrolled batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              showToast(
                "Attendance export is unavailable; attendance is not collected by this system.",
                "success",
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setCurrentTab("class-notices")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Blast Class Alert</span>
          </button>
        </div>
      </div>

      {/* Class Switcher & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Class Selection */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Select Assigned Class
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assignedClasses.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                      {cls.course} Sem {cls.semester}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {cls.studentCount} Students
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mt-2 line-clamp-1">
                    {cls.subjectName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>{cls.subjectCode}</span>
                    <span className="mx-1">•</span>
                    <span>{cls.room}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Batch Snapshot
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-semibold tracking-tight">
                {activeClass.studentCount}
              </div>
              <div className="text-xs text-slate-300">
                Total Enrolled in {activeClass.course} Sem{" "}
                {activeClass.semester}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/60 mt-4">
            <div>
              <div className="text-xs text-slate-400">Avg Attendance</div>
              <div className="text-base font-bold text-emerald-400">
                {avgAttendance}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Short Attendance</div>
              <div
                className={`text-base font-bold ${defaultersCount > 0 ? "text-amber-400" : "text-slate-300"}`}
              >
                {defaultersCount} Students
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({rawStudents.length})
            </button>
            <button
              onClick={() => setFilterType("REGULAR")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "REGULAR"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              &gt;75% Attendance
            </button>
            <button
              onClick={() => setFilterType("DEFAULTER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "DEFAULTER"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Defaulters (&lt;75%)
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Assignments</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No students match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const isLow = st.attendancePercent < 75;
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {st.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {st.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {st.rollNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isLow ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${st.attendancePercent}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-bold ${isLow ? "text-amber-600" : "text-emerald-700"}`}
                          >
                            {st.attendancePercent}%
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                              Short
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>
                            {st.assignmentsSubmitted}/{st.totalAssignments} Done
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`mailto:${st.email}`}
                            title={`Email ${st.name}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => {
                              showToast(
                                `Copied ${st.name}'s contact info to clipboard`,
                                "info",
                              );
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
