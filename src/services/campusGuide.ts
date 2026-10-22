import type {
  User,
  Notice,
  CampusEvent,
  ExamScheduleItem,
  CareerOpportunity,
  CampusFacility,
} from "../types";
export interface GuideData {
  user: User | null;
  notices: Notice[];
  events: CampusEvent[];
  exams: ExamScheduleItem[];
  career: CareerOpportunity[];
  facilities: CampusFacility[];
}
export function answerCampusQuery(
  query: string,
  data: GuideData,
  now = new Date(),
) {
  const q = query.toLowerCase();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const scoped = (item: Notice | CampusEvent) =>
    item.status === "APPROVED" &&
    (item.scope === "COLLEGE" ||
      item.departmentCode === data.user?.departmentCode);
  const list = (rows: string[], empty: string) =>
    rows.length ? rows.join("\n\n") : empty;
  if (/exam|assessment/.test(q)) {
    const rows = data.exams
      .filter(
        (e) =>
          e.departmentCode === data.user?.departmentCode &&
          (!data.user?.semester || e.semester === data.user.semester) &&
          e.date >= today,
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      text: list(
        rows
          .slice(0, 3)
          .map((e) => `${e.subjectName} — ${e.date}, ${e.shift}, ${e.room}`),
        "No upcoming exams are listed for your department and semester.",
      ),
      tab: "exams",
    };
  }
  if (/notice|announcement|circular/.test(q))
    return {
      text: list(
        data.notices
          .filter(scoped)
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
          .slice(0, 3)
          .map(
            (n) =>
              `${n.title}${n.deadline ? ` · Deadline: ${n.deadline}` : ""}`,
          ),
        "No approved notices are available for your department.",
      ),
      tab: "notices",
    };
  if (/event|seminar|workshop|hackathon/.test(q))
    return {
      text: list(
        data.events
          .filter((e) => scoped(e) && e.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 3)
          .map((e) => `${e.title} — ${e.date}, ${e.venue}`),
        "No upcoming approved events are listed for your department.",
      ),
      tab: "events",
    };
  if (/career|internship|placement|job/.test(q))
    return {
      text: list(
        data.career
          .filter(
            (c) =>
              c.status !== "Closed" &&
              c.applicationDeadline >= today &&
              (c.departmentCodes.includes("ALL") ||
                c.departmentCodes.includes(data.user?.departmentCode || "")),
          )
          .slice(0, 3)
          .map(
            (c) =>
              `${c.company}: ${c.role} · Apply by ${c.applicationDeadline}`,
          ),
        "No open opportunities are listed for your department.",
      ),
      tab: "career",
    };
  if (/library|lab|facility|campus|canteen/.test(q)) {
    const terms = q.split(/\W+/).filter((t) => t.length > 3);
    const rows = data.facilities.filter((f) =>
      terms.some((t) => `${f.name} ${f.category}`.toLowerCase().includes(t)),
    );
    return {
      text: list(
        rows
          .slice(0, 3)
          .map((f) => `${f.name} — ${f.location}. Hours: ${f.timings}.`),
        "No matching facility is listed. Browse the campus guide for available locations.",
      ),
      tab: "campus",
    };
  }
  if (/class|timetable|schedule/.test(q))
    return {
      text: "Open the sample weekly timetable for class times, faculty and rooms. Confirm changes with your department.",
      tab: "timetable",
    };
  return {
    text: "I can look up notices, events, exams, careers and campus facilities in the local dataset. Try a topic above or open search for a specific name.",
    tab: "search",
  };
}
