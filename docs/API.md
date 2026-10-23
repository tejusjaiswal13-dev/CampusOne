# API reference

Base URL: `/api`. JSON request/response. Protected endpoints require `Authorization: Bearer <JWT>`. All endpoint payloads are parsed with Zod; unknown write fields are rejected. Typical errors: 400 invalid input, 401 missing/expired/revoked session, 403 forbidden, 404 missing, 409 state/capacity conflict, 429 rate limit, 503 unavailable AI. Server errors do not disclose credentials.

## Authentication / catalog

- GET /health — availability, no auth.
- GET /departments — public department catalog.
- POST /auth/login — `{email,password}`; returns `{user,token}`. 20 auth attempts per 15 minutes/IP shared with signup.
- POST /auth/register — `{name,email,password,studentOrEmpId,role,departmentCode,course?,semester?,phone?}`. Password 12–72 characters. STUDENT active; FACULTY pending, no token; administrator roles forbidden.
- GET /auth/me — authenticated profile.
- PATCH /auth/profile — own `{name?,phone?,semester?}` only.
- POST /auth/logout — `{}`, revokes current session.

## Reads

GET /bootstrap returns scoped data used by the current UI. It is a small-dataset bootstrap (not paginated); do not assume suitability for a large university dataset.

GET `/notices`, `/events`, `/registrations`, `/exams`, `/career`, `/calendar`, `/faculty`, `/facilities`, `/notifications`, `/bookmarks`, `/class_notices`, `/users`: `{items,total}`. Query: `limit` 1–500 (default 100), `offset`, optional `q` max 200 characters. `/users` requires HOD or college admin; HOD sees only own-department pending faculty accounts. No account hashes returned.

## Content lifecycle

POST /notices and POST /events: faculty/HOD/college admin. Fields follow `server/src/schemas.ts`; server derives author, id, status and timestamps. Faculty creates department-only PENDING_APPROVAL. HOD creates own-department APPROVED; only college admin creates COLLEGE or other-department records.

PATCH /notices/:id and /events/:id: complete editable payload; owner faculty may edit draft/rejected records (resubmitted pending), managers may edit within their scope. Clients cannot set publisher or status.

POST /notices/:id/approval and /events/:id/approval: `{status:"APPROVED"|"REJECTED",reason?}`, HOD own department or college admin, pending only. A private author notification is created.

POST /notices/:id/resubmit and /events/:id/resubmit: `{}`, owning faculty, draft/rejected/approved → pending. Approved content disappears from student feeds while being reviewed. Resubmission/edit endpoints currently have no dedicated editing form in the UI.

DELETE /notices/:id and /events/:id: manager in scope. Events with registrations cannot be deleted.

## Other writes

- POST /events/:id/register — `{}`, STUDENT only; approved visible event before deadline, seats available. Immediate transaction, idempotent per student/event.
- PATCH /users/:id/role — `{role}`, COLLEGE_ADMIN only; active accounts, no self-demotion; revokes that user's sessions.
- POST /users/:id/approval — `{approve:boolean}`, own-department HOD or college admin, pending faculty only.
- POST/PATCH `/exams[/:id]` — own department HOD or college admin.
- POST/PATCH `/career[/:id]`, `/calendar[/:id]` — college admin only.
- DELETE /exams/:id, /career/:id, /calendar/:id — college admin.
- PATCH /departments/:id — college admin, description/location/contact fields only.
- POST /class_notices — faculty assigned course/semester/subject only. Server supplies author/department.
- POST /class_notices/:id/read — `{}`, student with access.
- POST /bookmarks/toggle — `{itemType,itemId}`, authenticated accessible item; server supplies title/user.
- POST /notifications/read — `{id?}`; omitted id marks all accessible notifications read for the current user only.

Calendar creation, role changes, approvals, notices/events, bookmarking and registration are connected to existing UI controls. Generic exam/career/department editing is currently API-only. Directory data and sample timetable are not mutable through API routes.

## AI

All AI routes are authenticated; shared quota 12/minute/user.

- POST /ai/ask — `{question,language?:"auto"|"en"|"hi"}`; returns `{answer,sources:[{type,id,title}],mode}`. No matches bypass the model. Missing provider/failure returns 503; frontend uses Basic mode.
- POST /ai/draft — `{points,language?}`, faculty/HOD/college admin, editable `{title,description,requiresReview:true}`; no persistence/publication.
- POST /ai/summarize — `{noticeId,language?}`, only accessible notice. Summary plus explicitly provided deadlines.

See AI_DESIGN.md for provider and privacy boundaries.
