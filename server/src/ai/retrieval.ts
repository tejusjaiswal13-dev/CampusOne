import type { Store } from "../db";
import type {
  User,
  Notice,
  CampusEvent,
  ExamScheduleItem,
  CareerOpportunity,
} from "../../../src/types";
import { approvedScope, canReadExam, canReadCareer } from "../permissions";
export interface Source {
  type: "notice" | "event" | "exam" | "career";
  id: string;
  title: string;
}
export interface ContextRecord extends Source {
  text: string;
}
// Defense in depth, not a complete prompt-injection detector. Flagged records are omitted.
export const suspicious = (text: string) =>
  /ignore.{0,40}(instruction|previous|system)|system\s*prompt|reveal.{0,30}(secret|token|password)|<\/?(system|assistant)|\[INST\]|disregard.{0,30}instruction/i.test(
    text,
  );
const stop = new Set([
  "is",
  "of",
  "on",
  "in",
  "at",
  "to",
  "a",
  "an",
  "my",
  "me",
  "it",
  "as",
  "be",
  "do",
  "was",
  "were",
  "will",
  "would",
  "should",
  "could",
  "what",
  "when",
  "where",
  "which",
  "please",
  "about",
  "from",
  "with",
  "have",
  "this",
  "that",
  "does",
  "your",
  "show",
  "tell",
  "the",
  "and",
  "for",
  "are",
  "can",
  "how",
  "मुझे",
  "क्या",
  "कब",
  "है",
  "के",
  "की",
  "का",
  "बताओ",
]);
export function tokens(text: string) {
  let q = text
    .toLowerCase()
    .replace(/परीक्षा/g, " exam ")
    .replace(/सूचना|नोटिस/g, " notice ")
    .replace(/कार्यशाला/g, " workshop ")
    .replace(/अंतिम तिथि|समय सीमा/g, " deadline ")
    .replace(/इंटर्नशिप/g, " internship ");
  return q
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1 && !stop.has(t))
    .map((t) => (t.endsWith("s") ? t.slice(0, -1) : t));
}
export function retrieve(
  store: Store,
  user: User,
  question: string,
  now = new Date(),
): ContextRecord[] {
  const records: ContextRecord[] = [];
  const today = now.toISOString().slice(0, 10);
  for (const n of store
    .all<Notice>("notices")
    .filter((n) => approvedScope(user, n)))
    records.push({
      type: "notice",
      id: n.id,
      title: n.title,
      text: `Notice | ${n.category}\n${n.description}\nPublished: ${n.publishedAt}${n.deadline ? `\nDeadline: ${n.deadline}` : ""}`,
    });
  for (const e of store
    .all<CampusEvent>("events")
    .filter((e) => approvedScope(user, e)))
    records.push({
      type: "event",
      id: e.id,
      title: e.title,
      text: `Event | ${e.category}\n${e.description}\nDate: ${e.date} ${e.time}\nVenue: ${e.venue}\nRegistration deadline: ${e.registrationDeadline}`,
    });
  for (const e of store
    .all<ExamScheduleItem>("exams")
    .filter(
      (e) => e.departmentCode === user.departmentCode && canReadExam(user, e),
    ))
    records.push({
      type: "exam",
      id: e.id,
      title: e.subjectName,
      text: `Exam | ${e.examType}\n${e.course} Semester ${e.semester}\n${e.date} ${e.shift}\nRoom: ${e.room}`,
    });
  for (const c of store
    .all<CareerOpportunity>("career")
    .filter(
      (c) =>
        canReadCareer(user, c) &&
        c.status !== "Closed" &&
        c.applicationDeadline >= today,
    ))
    records.push({
      type: "career",
      id: c.id,
      title: `${c.company}: ${c.role}`,
      text: `${c.type}\n${c.description}\nEligibility: ${c.eligibility}\nDeadline: ${c.applicationDeadline}`,
    });
  const safe = records.filter((r) => !suspicious(r.title + " " + r.text));
  const terms = [...new Set(tokens(question))];
  if (!terms.length) return [];
  const documents = safe.map((r) => tokens(r.title + " " + r.text));
  const average =
    documents.reduce((a, b) => a + b.length, 0) / (documents.length || 1);
  return safe
    .map((r, index) => {
      const words = documents[index];
      let score = 0;
      for (const term of terms) {
        const count = words.filter((w) => w === term).length;
        if (!count) continue;
        const df = documents.filter((d) => d.includes(term)).length;
        score +=
          (Math.log(1 + (documents.length - df + 0.5) / (df + 0.5)) *
            count *
            2.2) /
          (count + 1.2 * (0.25 + (0.75 * words.length) / (average || 1)));
      }
      return { record: r, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => ({ ...r.record, text: r.record.text.slice(0, 2400) }));
}
