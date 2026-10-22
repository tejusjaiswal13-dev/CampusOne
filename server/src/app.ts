import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { Store, Table } from "./db";
import * as schema from "./schemas";
import * as access from "./permissions";
import type {
  User,
  Notice,
  CampusEvent,
  Department,
  EventRegistration,
  ExamScheduleItem,
  CareerOpportunity,
  AcademicCalendarItem,
  DirectClassNotice,
  InAppNotification,
  BookmarkItem,
} from "../../src/types";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export interface ServerOptions {
  secret: string;
  origins?: string[];
  tokenSeconds?: number;
  rateLimit?: number;
}
export type AuthedResponse = Response<
  unknown,
  { user: User; sessionId: string }
>;
export function createApp(store: Store, options: ServerOptions) {
  if (options.secret.length < 32)
    throw new Error("JWT_SECRET must contain at least 32 characters");
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: options.origins || [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://localhost",
        "capacitor://localhost",
      ],
    }),
  );
  app.use(express.json({ limit: "64kb" }));
  const fail = (status: number, message: string): never => {
    throw new HttpError(status, message);
  };
  const roles = (user: User, allowed: User["role"][]) => {
    if (!allowed.includes(user.role)) fail(403, "Not authorised");
  };
  const auth = (req: Request, res: AuthedResponse, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!token)
        return res.status(401).json({ error: "Authentication required" });
      const claims = jwt.verify(token, options.secret, {
        algorithms: ["HS256"],
        issuer: "campusone",
        audience: "campusone-app",
      }) as jwt.JwtPayload;
      const user =
        typeof claims.sub === "string"
          ? store.get<User>("users", claims.sub)
          : undefined;
      const session = store.db
        .prepare(
          "SELECT id FROM sessions WHERE id=? AND user_id=? AND expires>?",
        )
        .get(claims.jti, user?.id, Math.floor(Date.now() / 1000));
      if (
        !user ||
        !session ||
        store.account(user.id)?.account_status !== "ACTIVE"
      )
        return res.status(401).json({ error: "Session expired or revoked" });
      res.locals.user = user;
      res.locals.sessionId = claims.jti!;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
  const issue = (user: User) => {
    const id = randomUUID();
    const seconds = options.tokenSeconds ?? 900;
    store.db
      .prepare("INSERT INTO sessions VALUES(?,?,?)")
      .run(id, user.id, Math.floor(Date.now() / 1000) + seconds);
    return jwt.sign({}, options.secret, {
      subject: user.id,
      jwtid: id,
      expiresIn: seconds,
      algorithm: "HS256",
      issuer: "campusone",
      audience: "campusone-app",
    });
  };
  const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: options.rateLimit ?? 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many authentication attempts. Try again later." },
  });
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/departments", (req, res) => {
    schema.emptySchema.parse(req.query);
    res.json(store.all<Department>("departments"));
  });
  app.post("/api/auth/login", loginLimit, async (req, res) => {
    const body = schema.loginSchema.parse(req.body);
    const user = store.findUser(body.email);
    const account = user && store.account(user.id);
    const valid = await bcrypt.compare(
      body.password,
      account?.password_hash ||
        "$2b$12$C6UzMDM.H6dfI/f/IKcEe.5yd5Hl9VQcRleH0xEjnJ3hgz9k2U8mK",
    );
    if (!user || !account || !valid)
      throw new HttpError(401, "Invalid email or password");
    if (account.account_status !== "ACTIVE")
      fail(403, "Account awaiting approval or rejected");
    res.json({ user, token: issue(user) });
  });
  app.post("/api/auth/register", loginLimit, async (req, res) => {
    if (["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"].includes(req.body?.role))
      fail(403, "Privileged roles cannot be self-created");
    const body = schema.registerSchema.parse(req.body);
    if (store.findUser(body.email)) fail(409, "Email already registered");
    const dept = store
      .all<Department>("departments")
      .find((d) => d.code === body.departmentCode);
    if (!dept) throw new HttpError(400, "Unknown department");
    const { password, ...profile } = body;
    const user: User = {
      ...profile,
      id: randomUUID(),
      departmentId: dept.id,
      departmentName: dept.name,
      createdAt: new Date().toISOString(),
      avatar: "/avatar-placeholder.svg",
    };
    const hash = await bcrypt.hash(password, 12);
    const pending = user.role === "FACULTY";
    store.db.transaction(() => {
      if (store.findUser(body.email)) fail(409, "Email already registered");
      store.put("users", user);
      store.db
        .prepare("INSERT INTO accounts VALUES(?,?,?)")
        .run(user.id, hash, pending ? "PENDING" : "ACTIVE");
    })();
    res
      .status(201)
      .json(
        pending
          ? {
              pending: true,
              message: "Faculty account requires department approval.",
            }
          : { user, token: issue(user) },
      );
  });
  app.use("/api", auth);
  app.get("/api/auth/me", (_req, res: AuthedResponse) =>
    res.json(res.locals.user),
  );
  app.post("/api/auth/logout", (req, res: AuthedResponse) => {
    schema.emptySchema.parse(req.body);
    store.db
      .prepare("DELETE FROM sessions WHERE id=?")
      .run(res.locals.sessionId);
    res.status(204).end();
  });
  app.patch("/api/auth/profile", (req, res: AuthedResponse) => {
    const body = schema.profileSchema.parse(req.body);
    res.json(store.put("users", { ...res.locals.user, ...body }));
  });
  function visible(table: Table, user: User): unknown[] {
    switch (table) {
      case "users":
        return user.role === "COLLEGE_ADMIN"
          ? store
              .all<User>("users")
              .map((u) => ({
                ...u,
                accountStatus: store.account(u.id)?.account_status,
              }))
          : user.role === "DEPARTMENT_ADMIN"
            ? store
                .all<User>("users")
                .filter(
                  (u) =>
                    u.departmentCode === user.departmentCode &&
                    store.account(u.id)?.account_status === "PENDING",
                )
                .map((u) => ({ ...u, accountStatus: "PENDING" }))
            : [];
      case "notices":
        return store
          .all<Notice>(table)
          .filter((n) => access.canReadContent(user, n));
      case "events":
        return store
          .all<CampusEvent>(table)
          .filter((n) => access.canReadContent(user, n))
          .map((e) => ({
            ...e,
            registeredUserIds:
              user.role === "STUDENT"
                ? e.registeredUserIds.filter((id) => id === user.id)
                : access.canManageContent(user, e) || e.publisherId === user.id
                  ? e.registeredUserIds
                  : [],
          }));
      case "exams":
        return store
          .all<ExamScheduleItem>(table)
          .filter((e) => access.canReadExam(user, e));
      case "career":
        return store
          .all<CareerOpportunity>(table)
          .filter((c) => access.canReadCareer(user, c));
      case "calendar":
        return store
          .all<AcademicCalendarItem>(table)
          .filter((c) => access.canReadCalendar(user, c));
      case "class_notices":
        return store
          .all<DirectClassNotice>(table)
          .filter((c) => access.canReadClass(user, c))
          .map((c) => ({
            ...c,
            readByUserIds: c.readByUserIds.filter((id) => id === user.id),
          }));
      case "notifications":
        return store
          .all<InAppNotification>(table)
          .filter((n) => access.canReadNotification(user, n))
          .map((n) => ({
            ...n,
            isRead: !!store.db
              .prepare(
                "SELECT 1 FROM notification_reads WHERE user_id=? AND notification_id=?",
              )
              .get(user.id, n.id),
          }));
      case "bookmarks":
        return store
          .all<BookmarkItem>(table)
          .filter(
            (b) =>
              b.userId === user.id &&
              bookmarkTarget(user, b.itemType, b.itemId),
          );
      case "registrations":
        return store
          .all<EventRegistration>(table)
          .filter(
            (r) =>
              r.userId === user.id ||
              user.role === "COLLEGE_ADMIN" ||
              (user.role === "DEPARTMENT_ADMIN" &&
                r.departmentCode === user.departmentCode) ||
              (user.role === "FACULTY" &&
                store.get<CampusEvent>("events", r.eventId)?.publisherId ===
                  user.id),
          );
      default:
        return store.all(table);
    }
  }
  app.get("/api/bootstrap", (req, res: AuthedResponse) => {
    schema.emptySchema.parse(req.query);
    res.json(
      Object.fromEntries(
        [
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
        ].map((t) => [t, visible(t as Table, res.locals.user)]),
      ),
    );
  });
  for (const table of [
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
  ] as Table[])
    app.get(`/api/${table}`, (req, res: AuthedResponse) => {
      if (table === "users")
        roles(res.locals.user, ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
      const query = schema.listSchema.parse(req.query);
      const rows = visible(table, res.locals.user).filter(
        (r) =>
          !query.q ||
          JSON.stringify(r).toLowerCase().includes(query.q.toLowerCase()),
      );
      res.json({
        items: rows.slice(query.offset, query.offset + query.limit),
        total: rows.length,
      });
    });
  app.patch("/api/users/:id/role", (req, res: AuthedResponse) => {
    roles(res.locals.user, ["COLLEGE_ADMIN"]);
    const id = schema.idSchema.parse(req.params.id);
    const { role } = z
      .object({ role: schema.roleSchema })
      .strict()
      .parse(req.body);
    const user = store.get<User>("users", id) || fail(404, "User not found");
    if (id === res.locals.user.id && role !== "COLLEGE_ADMIN")
      fail(409, "Cannot demote your own administrator account");
    if (store.account(id)?.account_status !== "ACTIVE")
      fail(409, "Approve the account first");
    store.put("users", { ...user, role });
    store.db.prepare("DELETE FROM sessions WHERE user_id=?").run(id);
    res.json({ success: true });
  });
  app.post("/api/users/:id/approval", (req, res: AuthedResponse) => {
    roles(res.locals.user, ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
    const id = schema.idSchema.parse(req.params.id);
    const body = z.object({ approve: z.boolean() }).strict().parse(req.body);
    const user = store.get<User>("users", id) || fail(404, "User not found");
    if (
      user.role !== "FACULTY" ||
      (res.locals.user.role === "DEPARTMENT_ADMIN" &&
        user.departmentCode !== res.locals.user.departmentCode)
    )
      fail(403, "Not authorised");
    if (store.account(id)?.account_status !== "PENDING")
      fail(409, "Account is not pending");
    store.db
      .prepare("UPDATE accounts SET account_status=? WHERE user_id=?")
      .run(body.approve ? "ACTIVE" : "REJECTED", id);
    res.json({ success: true });
  });
  const notification = (userId: string, title: string, message: string) =>
    store.put("notifications", {
      id: randomUUID(),
      userId,
      title,
      message,
      type: "APPROVAL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  for (const table of ["notices", "events"] as const) {
    const input =
      table === "notices" ? schema.noticeSchema : schema.eventSchema;
    const prepare = (user: User, body: Record<string, unknown>) => {
      roles(user, ["FACULTY", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
      if (
        user.role !== "COLLEGE_ADMIN" &&
        (body.scope !== "DEPARTMENT" ||
          (body.departmentCode && body.departmentCode !== user.departmentCode))
      )
        fail(
          403,
          "Only college administrators may publish outside their department",
        );
      const code =
        body.scope === "DEPARTMENT"
          ? body.departmentCode || user.departmentCode
          : undefined;
      const dept = store
        .all<Department>("departments")
        .find((d) => d.code === code);
      if (code && !dept) fail(400, "Unknown department");
      return {
        ...body,
        departmentCode: code,
        departmentId: dept?.id,
        publisherId: user.id,
        publisherName: user.name,
        publisherRole: user.role,
        status: user.role === "FACULTY" ? "PENDING_APPROVAL" : "APPROVED",
      };
    };
    app.post(`/api/${table}`, (req, res: AuthedResponse) => {
      roles(res.locals.user, ["FACULTY", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
      const body = input.parse(req.body);
      const data = {
        ...prepare(res.locals.user, body),
        id: randomUUID(),
        ...(table === "events"
          ? {
              availableSeats: (body as z.infer<typeof schema.eventSchema>)
                .totalSeats,
              registeredUserIds: [],
              bannerImage: "/campus-placeholder.svg",
              createdAt: new Date().toISOString(),
            }
          : { publishedAt: new Date().toISOString(), viewsCount: 0 }),
      };
      res.status(201).json(store.put(table, data));
    });
    app.patch(`/api/${table}/:id`, (req, res: AuthedResponse) => {
      const user = res.locals.user;
      roles(user, ["FACULTY", "DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
      const id = schema.idSchema.parse(req.params.id);
      const old =
        store.get<Notice | CampusEvent>(table, id) ||
        fail(404, "Content not found");
      if (
        !access.canManageContent(user, old) &&
        !(
          user.role === "FACULTY" &&
          old.publisherId === user.id &&
          ["DRAFT", "REJECTED"].includes(old.status)
        )
      )
        fail(403, "Not authorised to edit this content");
      const body = input.parse(req.body);
      const fields = prepare(user, body);
      const data = {
        ...old,
        ...fields,
        id,
        publisherId: old.publisherId,
        publisherName: old.publisherName,
        publisherRole: old.publisherRole,
        rejectionReason: undefined,
      };
      if (table === "events") {
        const event = old as CampusEvent;
        const seats = (body as z.infer<typeof schema.eventSchema>).totalSeats;
        const booked = event.totalSeats - event.availableSeats;
        if (seats < booked) fail(409, "Capacity is below booked seats");
        Object.assign(data, { availableSeats: seats - booked });
      }
      res.json(store.put(table, data));
    });
    app.post(`/api/${table}/:id/approval`, (req, res: AuthedResponse) => {
      const user = res.locals.user;
      roles(user, ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
      const id = schema.idSchema.parse(req.params.id);
      const body = schema.approvalSchema.parse(req.body);
      const item =
        store.get<Notice | CampusEvent>(table, id) ||
        fail(404, "Content not found");
      if (!access.canManageContent(user, item)) fail(403, "Not authorised");
      if (item.status !== "PENDING_APPROVAL")
        fail(409, "Only pending content may be reviewed");
      store.db.transaction(() => {
        store.put(table, {
          ...item,
          status: body.status,
          rejectionReason: body.status === "REJECTED" ? body.reason : undefined,
        });
        notification(
          item.publisherId,
          `${table === "notices" ? "Notice" : "Event"} ${body.status.toLowerCase()}`,
          body.reason || item.title,
        );
      })();
      res.json({ success: true });
    });
    app.post(`/api/${table}/:id/resubmit`, (req, res: AuthedResponse) => {
      const user = res.locals.user;
      roles(user, ["FACULTY"]);
      schema.emptySchema.parse(req.body);
      const id = schema.idSchema.parse(req.params.id);
      const item =
        store.get<Notice | CampusEvent>(table, id) ||
        fail(404, "Content not found");
      if (item.publisherId !== user.id) fail(403, "Not authorised");
      if (!["REJECTED", "APPROVED", "DRAFT"].includes(item.status))
        fail(409, "Content is already pending");
      res.json(
        store.put(table, {
          ...item,
          status: "PENDING_APPROVAL",
          rejectionReason: undefined,
        }),
      );
    });
    app.delete(`/api/${table}/:id`, (req, res: AuthedResponse) => {
      roles(res.locals.user, ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]);
      const id = schema.idSchema.parse(req.params.id);
      schema.emptySchema.parse(req.body || {});
      const item =
        store.get<Notice | CampusEvent>(table, id) ||
        fail(404, "Content not found");
      if (!access.canManageContent(res.locals.user, item))
        fail(403, "Not authorised");
      if (
        table === "events" &&
        store
          .all<EventRegistration>("registrations")
          .some((r) => r.eventId === id)
      )
        fail(409, "Registered events cannot be deleted");
      store.remove(table, id);
      res.status(204).end();
    });
  }
  app.post("/api/events/:id/register", (req, res: AuthedResponse) => {
    const user = res.locals.user;
    roles(user, ["STUDENT"]);
    schema.emptySchema.parse(req.body);
    const id = schema.idSchema.parse(req.params.id);
    const registration = store.db
      .transaction(() => {
        const event =
          store.get<CampusEvent>("events", id) || fail(404, "Event not found");
        if (!access.approvedScope(user, event)) fail(403, "Not authorised");
        const existing = store
          .all<EventRegistration>("registrations")
          .find((r) => r.userId === user.id && r.eventId === id);
        if (existing) return existing;
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        if (event.date < today || event.registrationDeadline < today)
          fail(409, "Registration closed");
        if (event.availableSeats < 1) fail(409, "No seats available");
        store.put("events", {
          ...event,
          availableSeats: event.availableSeats - 1,
          registeredUserIds: [...event.registeredUserIds, user.id],
        });
        return store.put("registrations", {
          id: randomUUID(),
          eventId: id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventVenue: event.venue,
          userId: user.id,
          studentName: user.name,
          studentId: user.studentOrEmpId,
          departmentCode: user.departmentCode,
          email: user.email,
          registeredAt: new Date().toISOString(),
          ticketCode: `IPS-${randomUUID()}`,
        });
      })
      .immediate();
    res.status(201).json(registration);
  });
  for (const [table, input] of [
    ["exams", schema.examSchema],
    ["career", schema.careerSchema],
    ["calendar", schema.calendarSchema],
  ] as const) {
    for (const method of ["post", "patch"] as const)
      app[method](
        `/api/${table}${method === "patch" ? "/:id" : ""}`,
        (req, res: AuthedResponse) => {
          const user = res.locals.user;
          roles(
            user,
            table === "exams"
              ? ["DEPARTMENT_ADMIN", "COLLEGE_ADMIN"]
              : ["COLLEGE_ADMIN"],
          );
          const body = input.parse(req.body);
          if (
            table === "exams" &&
            user.role !== "COLLEGE_ADMIN" &&
            (body as ExamScheduleItem).departmentCode !== user.departmentCode
          )
            fail(403, "Not authorised");
          const id =
            method === "post"
              ? randomUUID()
              : schema.idSchema.parse((req.params as { id?: string }).id);
          if (method === "patch") {
            const old =
              store.get<ExamScheduleItem>(table, id) ||
              fail(404, "Record not found");
            if (
              user.role === "DEPARTMENT_ADMIN" &&
              old.departmentCode !== user.departmentCode
            )
              fail(403, "Not authorised");
          }
          res.json(store.put(table, { ...body, id }));
        },
      );
    app.delete(`/api/${table}/:id`, (req, res: AuthedResponse) => {
      roles(res.locals.user, ["COLLEGE_ADMIN"]);
      const id = schema.idSchema.parse(req.params.id);
      schema.emptySchema.parse(req.body || {});
      store.remove(table, id);
      res.status(204).end();
    });
  }
  app.patch("/api/departments/:id", (req, res: AuthedResponse) => {
    roles(res.locals.user, ["COLLEGE_ADMIN"]);
    const id = schema.idSchema.parse(req.params.id);
    const body = schema.departmentUpdateSchema.parse(req.body);
    const old =
      store.get<Department>("departments", id) ||
      fail(404, "Department not found");
    res.json(store.put("departments", { ...old, ...body }));
  });
  app.post("/api/class_notices", (req, res: AuthedResponse) => {
    const user = res.locals.user;
    roles(user, ["FACULTY"]);
    const body = schema.classSchema.parse(req.body);
    if (
      !user.assignedClasses?.some(
        (c) =>
          c.course === body.course &&
          c.semester === body.semester &&
          c.subjectCode === body.subjectCode,
      )
    )
      fail(403, "Class is not assigned to this faculty member");
    res
      .status(201)
      .json(
        store.put("class_notices", {
          ...body,
          id: randomUUID(),
          facultyId: user.id,
          facultyName: user.name,
          facultyDesignation: user.designation || "Faculty",
          departmentCode: user.departmentCode,
          createdAt: new Date().toISOString(),
          readByUserIds: [],
        }),
      );
  });
  app.post("/api/class_notices/:id/read", (req, res: AuthedResponse) => {
    roles(res.locals.user, ["STUDENT"]);
    const id = schema.idSchema.parse(req.params.id);
    schema.emptySchema.parse(req.body);
    const item =
      store.get<DirectClassNotice>("class_notices", id) ||
      fail(404, "Not found");
    if (!access.canReadClass(res.locals.user, item))
      fail(403, "Not authorised");
    store.put("class_notices", {
      ...item,
      readByUserIds: [...new Set([...item.readByUserIds, res.locals.user.id])],
    });
    res.json({ success: true });
  });
  function bookmarkTarget(
    user: User,
    type: string,
    id: string,
  ): { title: string; category: string; date: string } | undefined {
    if (type === "NOTICE") {
      const n = store.get<Notice>("notices", id);
      if (n && access.canReadContent(user, n))
        return { title: n.title, category: n.category, date: n.publishedAt };
    }
    if (type === "EVENT") {
      const n = store.get<CampusEvent>("events", id);
      if (n && access.canReadContent(user, n))
        return { title: n.title, category: n.category, date: n.date };
    }
    if (type === "CAREER") {
      const n = store.get<CareerOpportunity>("career", id);
      if (n && access.canReadCareer(user, n))
        return {
          title: `${n.company}: ${n.role}`,
          category: n.type,
          date: n.applicationDeadline,
        };
    }
    if (type === "RESOURCE") {
      for (const d of store.all<Department>("departments")) {
        const r = d.resources.find((r) => r.id === id);
        if (r)
          return { title: r.title, category: r.category, date: r.uploadDate };
      }
    }
  }
  app.post("/api/bookmarks/toggle", (req, res: AuthedResponse) => {
    const body = schema.bookmarkSchema.parse(req.body);
    const target =
      bookmarkTarget(res.locals.user, body.itemType, body.itemId) ||
      fail(403, "Item is not accessible");
    const existing = store
      .all<BookmarkItem>("bookmarks")
      .find(
        (b) =>
          b.userId === res.locals.user.id &&
          b.itemType === body.itemType &&
          b.itemId === body.itemId,
      );
    if (existing) {
      store.remove("bookmarks", existing.id);
      return res.json({ saved: false });
    }
    store.put("bookmarks", {
      ...body,
      ...target,
      id: randomUUID(),
      userId: res.locals.user.id,
      subtitle: "",
      createdAt: new Date().toISOString(),
    });
    res.json({ saved: true });
  });
  app.post("/api/notifications/read", (req, res: AuthedResponse) => {
    const body = z
      .object({ id: schema.idSchema.optional() })
      .strict()
      .parse(req.body);
    const rows = store
      .all<InAppNotification>("notifications")
      .filter(
        (n) =>
          access.canReadNotification(res.locals.user, n) &&
          (!body.id || n.id === body.id),
      );
    if (body.id && !rows.length) fail(403, "Notification is not accessible");
    store.db.transaction(() => {
      for (const n of rows)
        store.db
          .prepare("INSERT OR IGNORE INTO notification_reads VALUES(?,?)")
          .run(res.locals.user.id, n.id);
    })();
    res.json({ success: true });
  });
  // Feature routers are mounted here before the final error handler.
  const finish = () => {
    app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
    app.use(
      (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (error instanceof z.ZodError)
          return res
            .status(400)
            .json({
              error: "Invalid input",
              issues: error.issues.map((i) => ({
                path: i.path,
                message: i.message,
              })),
            });
        if (error instanceof HttpError)
          return res.status(error.status).json({ error: error.message });
        if (error instanceof SyntaxError)
          return res.status(400).json({ error: "Invalid JSON" });
        console.error(
          "Request failed",
          error instanceof Error ? error.message : "Unknown error",
        );
        res.status(500).json({ error: "Server error" });
      },
    );
    return app;
  };
  return { app, finish, store, auth, visible };
}
