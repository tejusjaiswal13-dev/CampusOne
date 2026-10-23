import { beforeEach, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import { fixture, password } from "./helpers";
import type { CampusEvent, Notice } from "../src/types";
let f: ReturnType<typeof fixture>;
let app: ReturnType<ReturnType<typeof fixture>["server"]["finish"]>;
beforeEach(() => {
  f = fixture();
  app = f.server.finish();
});
afterEach(() => f.store.db.close());
const payload = {
  title: "Regression circular",
  description: "Department circular for the evaluation.",
  category: "Academic",
  scope: "DEPARTMENT",
  departmentCode: "CCET",
  isUrgent: false,
};
describe("server authentication and permissions", () => {
  it("verifies passwords, revokes logout, and returns no password hashes", async () => {
    const bad = await request(app)
      .post("/api/auth/login")
      .send({ email: f.student.email, password: "wrong" });
    expect(bad.status).toBe(401);
    const ok = await request(app)
      .post("/api/auth/login")
      .send({ email: f.student.email, password });
    expect(ok.status).toBe(200);
    expect(JSON.stringify(ok.body)).not.toContain("password_hash");
    await request(app)
      .post("/api/auth/logout")
      .auth(ok.body.token, { type: "bearer" })
      .send({})
      .expect(204);
    await request(app)
      .get("/api/bootstrap")
      .auth(ok.body.token, { type: "bearer" })
      .expect(401);
  });
  it("isolates student feeds, exams and class notices by department and semester", async () => {
    for (const user of [f.student, f.other]) {
      const r = await request(app)
        .get("/api/bootstrap")
        .auth(f.token(user), { type: "bearer" })
        .expect(200);
      expect(r.body.notices.length).toBeGreaterThan(0);
      for (const n of r.body.notices)
        expect(
          n.status === "APPROVED" &&
            (n.scope === "COLLEGE" || n.departmentCode === user.departmentCode),
        ).toBe(true);
      for (const e of r.body.exams) {
        expect(e.departmentCode).toBe(user.departmentCode);
        expect(e.semester).toBe(user.semester);
      }
      expect(r.body.users).toEqual([]);
      for (const n of r.body.class_notices)
        expect(n.departmentCode).toBe(user.departmentCode);
    }
  });
  it("keeps faculty signup pending and forbids self-created administrators", async () => {
    for (const role of ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"])
      await request(app).post("/api/auth/register").send({ role }).expect(403);
    const data = {
      name: "Test Faculty",
      email: "faculty-test@example.org",
      password,
      studentOrEmpId: "FAC-TEST",
      role: "FACULTY",
      departmentCode: "CCET",
    };
    const r = await request(app)
      .post("/api/auth/register")
      .send(data)
      .expect(201);
    expect(r.body.pending).toBe(true);
    expect(r.body.token).toBeUndefined();
    await request(app)
      .post("/api/auth/login")
      .send({ email: data.email, password })
      .expect(403);
    const u = f.store.findUser(data.email)!;
    await request(app)
      .post(`/api/users/${u.id}/approval`)
      .auth(f.token(f.hod), { type: "bearer" })
      .send({ approve: true })
      .expect(200);
    await request(app)
      .post("/api/auth/login")
      .send({ email: data.email, password })
      .expect(200);
  });
  it("rejects tampered, expired and missing tokens", async () => {
    await request(app).get("/api/bootstrap").expect(401);
    await request(app)
      .get("/api/bootstrap")
      .auth("invalid", { type: "bearer" })
      .expect(401);
    await request(app)
      .get("/api/bootstrap")
      .auth(f.token(f.student, -1), { type: "bearer" })
      .expect(401);
  });
  it("does not permit profile role escalation or unexpected fields", async () => {
    await request(app)
      .patch("/api/auth/profile")
      .auth(f.token(f.student), { type: "bearer" })
      .send({ role: "COLLEGE_ADMIN" })
      .expect(400);
    await request(app)
      .post("/api/notices")
      .auth(f.token(f.faculty), { type: "bearer" })
      .send({ ...payload, status: "APPROVED" })
      .expect(400);
  });
  it("enforces the approval state machine and author-only resubmission", async () => {
    const r = await request(app)
      .post("/api/notices")
      .auth(f.token(f.faculty), { type: "bearer" })
      .send(payload)
      .expect(201);
    const id = r.body.id;
    expect(r.body.status).toBe("PENDING_APPROVAL");
    await request(app)
      .post(`/api/notices/${id}/approval`)
      .auth(f.token(f.hod), { type: "bearer" })
      .send({ status: "REJECTED", reason: "Revise wording" })
      .expect(200);
    await request(app)
      .post(`/api/notices/${id}/approval`)
      .auth(f.token(f.hod), { type: "bearer" })
      .send({ status: "APPROVED" })
      .expect(409);
    await request(app)
      .post(`/api/notices/${id}/resubmit`)
      .auth(f.token(f.faculty), { type: "bearer" })
      .send({})
      .expect(200);
    await request(app)
      .post(`/api/notices/${id}/approval`)
      .auth(f.token(f.hod), { type: "bearer" })
      .send({ status: "APPROVED" })
      .expect(200);
    expect(f.store.get<Notice>("notices", id)?.status).toBe("APPROVED");
  });
  it("prevents HOD approval/edit across departments and faculty publishing college content", async () => {
    const n = {
      ...f.store.all<Notice>("notices")[0],
      id: "foreign-notice",
      departmentCode: "CFT",
      scope: "DEPARTMENT" as const,
      status: "PENDING_APPROVAL" as const,
    };
    f.store.put("notices", n);
    for (const action of ["approval"])
      await request(app)
        .post(`/api/notices/${n.id}/${action}`)
        .auth(f.token(f.hod), { type: "bearer" })
        .send({ status: "APPROVED" })
        .expect(403);
    await request(app)
      .patch(`/api/notices/${n.id}`)
      .auth(f.token(f.hod), { type: "bearer" })
      .send(payload)
      .expect(403);
    await request(app)
      .post("/api/notices")
      .auth(f.token(f.faculty), { type: "bearer" })
      .send({ ...payload, scope: "COLLEGE" })
      .expect(403);
  });
  it("transactionally awards only the last seat and repeat registration is idempotent", async () => {
    const e = {
      ...f.store.all<CampusEvent>("events")[0],
      id: "last-seat",
      scope: "COLLEGE" as const,
      status: "APPROVED" as const,
      date: "2099-01-02",
      registrationDeadline: "2099-01-01",
      totalSeats: 1,
      availableSeats: 1,
      registeredUserIds: [],
    };
    f.store.put("events", e);
    const responses = await Promise.all(
      [f.student, f.other].map((u) =>
        request(app)
          .post("/api/events/last-seat/register")
          .auth(f.token(u), { type: "bearer" })
          .send({}),
      ),
    );
    expect(responses.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(f.store.get<CampusEvent>("events", e.id)?.availableSeats).toBe(0);
    const winner = responses[0].status === 201 ? f.student : f.other;
    await request(app)
      .post("/api/events/last-seat/register")
      .auth(f.token(winner), { type: "bearer" })
      .send({})
      .expect(201);
    expect(f.store.all("registrations")).toHaveLength(1);
  });
  it("returns 403 for all forbidden role/route combinations in the mutation matrix", async () => {
    const cases: [string, string, string[]][] = [
      ["post", "/api/notices", ["STUDENT"]],
      ["post", "/api/events", ["STUDENT"]],
      ["patch", "/api/notices/not-01", ["STUDENT"]],
      ["patch", "/api/events/evt-01", ["STUDENT"]],
      ["delete", "/api/notices/not-01", ["STUDENT", "FACULTY"]],
      ["delete", "/api/events/evt-01", ["STUDENT", "FACULTY"]],
      ["post", "/api/notices/not-01/approval", ["STUDENT", "FACULTY"]],
      ["post", "/api/events/evt-01/approval", ["STUDENT", "FACULTY"]],
      [
        "post",
        "/api/notices/not-01/resubmit",
        ["STUDENT", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
      ],
      [
        "post",
        "/api/events/evt-01/resubmit",
        ["STUDENT", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
      ],
      [
        "post",
        "/api/events/evt-01/register",
        ["FACULTY", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
      ],
      [
        "patch",
        "/api/users/user-student-1/role",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      ["post", "/api/users/user-student-1/approval", ["STUDENT", "FACULTY"]],
      ["post", "/api/calendar", ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"]],
      [
        "patch",
        "/api/calendar/cal-01",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      [
        "delete",
        "/api/calendar/cal-01",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      ["post", "/api/career", ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"]],
      [
        "patch",
        "/api/career/job-01",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      [
        "delete",
        "/api/career/job-01",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      ["post", "/api/exams", ["STUDENT", "FACULTY"]],
      ["patch", "/api/exams/exam-01", ["STUDENT", "FACULTY"]],
      [
        "delete",
        "/api/exams/exam-01",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      [
        "patch",
        "/api/departments/dept-ccet",
        ["STUDENT", "FACULTY", "DEPARTMENT_ADMIN"],
      ],
      [
        "post",
        "/api/class_notices",
        ["STUDENT", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
      ],
      [
        "post",
        "/api/class_notices/cn-01/read",
        ["FACULTY", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"],
      ],
      ["get", "/api/users", ["STUDENT", "FACULTY"]],
    ];
    for (const [method, path, roles] of cases)
      for (const role of roles) {
        const user = f.users.find((u) => u.role === role)!;
        const client = request(app);
        const result = await client[method as "post"](path)
          .auth(f.token(user), { type: "bearer" })
          .send({});
        expect(
          result.status,
          `${role} ${method} ${path}: ${JSON.stringify(result.body)}`,
        ).toBe(403);
      }
  });
  it("does not allow bookmarks of inaccessible notices", async () => {
    const n = {
      ...f.store.all<Notice>("notices")[0],
      id: "private-cft",
      scope: "DEPARTMENT" as const,
      departmentCode: "CFT",
    };
    f.store.put("notices", n);
    await request(app)
      .post("/api/bookmarks/toggle")
      .auth(f.token(f.student), { type: "bearer" })
      .send({ itemType: "NOTICE", itemId: n.id })
      .expect(403);
  });
});
