import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import * as seed from "../../src/data/seedData";
import type { User } from "../../src/types";
export const tables = [
  "departments",
  "users",
  "notices",
  "events",
  "registrations",
  "exams",
  "career",
  "calendar",
  "faculty",
  "facilities",
  "notifications",
  "bookmarks",
  "class_notices",
] as const;
export type Table = (typeof tables)[number];
export interface Account {
  password_hash: string;
  account_status: "ACTIVE" | "PENDING" | "REJECTED";
}
export function openDatabase(filename = ":memory:") {
  const db = new Database(filename);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  for (const table of tables)
    db.exec(
      `CREATE TABLE IF NOT EXISTS ${table}(id TEXT PRIMARY KEY,data TEXT NOT NULL CHECK(json_valid(data)),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    );
  db.exec(`CREATE TABLE IF NOT EXISTS accounts(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,password_hash TEXT NOT NULL,account_status TEXT NOT NULL CHECK(account_status IN ('ACTIVE','PENDING','REJECTED')));
 CREATE UNIQUE INDEX IF NOT EXISTS user_email ON users(lower(json_extract(data,'$.email')));
 CREATE UNIQUE INDEX IF NOT EXISTS registration_once ON registrations(json_extract(data,'$.eventId'),json_extract(data,'$.userId'));
 CREATE UNIQUE INDEX IF NOT EXISTS bookmark_once ON bookmarks(json_extract(data,'$.userId'),json_extract(data,'$.itemType'),json_extract(data,'$.itemId'));
 CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS notification_reads(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,notification_id TEXT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,PRIMARY KEY(user_id,notification_id));`);
  for (const table of tables)
    db.exec(
      `CREATE INDEX IF NOT EXISTS ${table}_dept ON ${table}(json_extract(data,'$.departmentCode'));CREATE INDEX IF NOT EXISTS ${table}_user ON ${table}(json_extract(data,'$.userId'));CREATE INDEX IF NOT EXISTS ${table}_status ON ${table}(json_extract(data,'$.status'));`,
    );
  const all = <T>(table: Table): T[] =>
    (
      db
        .prepare(`SELECT data FROM ${table} ORDER BY created_at DESC,id`)
        .all() as { data: string }[]
    ).map((r) => JSON.parse(r.data));
  const get = <T>(table: Table, id: string): T | undefined => {
    const row = db.prepare(`SELECT data FROM ${table} WHERE id=?`).get(id) as
      { data: string } | undefined;
    return row ? JSON.parse(row.data) : undefined;
  };
  const put = <T extends { id: string }>(table: Table, data: T) => {
    db.prepare(
      `INSERT INTO ${table}(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=CURRENT_TIMESTAMP`,
    ).run(data.id, JSON.stringify(data));
    return data;
  };
  const remove = (table: Table, id: string) =>
    db.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
  const account = (id: string) =>
    db
      .prepare(
        "SELECT password_hash,account_status FROM accounts WHERE user_id=?",
      )
      .get(id) as Account | undefined;
  const seedDatabase = (password: string) => {
    if (all("users").length) return;
    const hashed = bcrypt.hashSync(password, 12);
    db.transaction(() => {
      const entries = {
        departments: seed.SEED_DEPARTMENTS,
        users: seed.SEED_USERS,
        notices: seed.SEED_NOTICES,
        events: seed.SEED_EVENTS,
        exams: seed.SEED_EXAMS,
        career: seed.SEED_CAREER,
        calendar: seed.SEED_CALENDAR,
        faculty: seed.SEED_FACULTY,
        facilities: seed.SEED_FACILITIES,
        notifications: seed.SEED_NOTIFICATIONS,
        class_notices: seed.SEED_CLASS_NOTICES,
      };
      for (const [table, rows] of Object.entries(entries))
        for (const row of rows) put(table as Table, row);
      for (const u of seed.SEED_USERS)
        db.prepare("INSERT INTO accounts VALUES(?,?,?)").run(
          u.id,
          hashed,
          "ACTIVE",
        );
      // Preserve supplied historical occupancy; new registrations use a transaction.
    })();
  };
  const findUser = (email: string) =>
    all<User>("users").find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  return { db, all, get, put, remove, account, seedDatabase, findUser };
}
export type Store = ReturnType<typeof openDatabase>;
