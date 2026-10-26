# CampusOne synopsis diagrams

The set contains five numbered, report-ready figures: one master ER diagram and four DFD figures. Use the PNG files in Word for reliable rendering; use SVG when you need to resize or edit vector artwork. Open `index.html` to view or print one figure per page.

## Report figures and captions

1. **Master entity relationship diagram** (`master-er`): all 16 implemented SQLite tables, key payload fields, the four physical foreign keys and a complete register of the JSON/application references represented by the current model.
2. **DFD Level 0 — system context** (`03-dfd-level-0`): Campus users exchange information with CampusOne; a server-side AI provider is optional.
3. **DFD Level 1 — main processes** (`04-dfd-level-1`): Authentication, content publishing/review, information discovery and student participation. This is intentionally summarized into four straight workflows.
4. **DFD Level 2 — content approval** (`05-dfd-level-2-publishing`): Faculty submission, validation, authorized administrator review and decision recording.
5. **DFD Level 2 — event registration** (`06-dfd-level-2-registration`): Student access check, availability check and transactional registration.

## ER notation and implementation notes

- `PK` means primary key; `FK` means physical SQL foreign key; `?` means optional payload value; `[]` means embedded array.
- Solid connectors show actual SQL foreign keys. The master ER diagram lists JSON/application references in a separate register rather than drawing them as physical connectors.
- Thirteen content tables store `id`, `data` (JSON), `created_at` and `updated_at`. Accounts, sessions and notification read state use dedicated columns.
- The database has 16 tables: departments, users, notices, events, registrations, exams, career, calendar, faculty, facilities, notifications, bookmarks, class_notices, accounts, sessions and notification_reads.
- Notices and events may carry department-scope fields in their JSON payloads. Career eligibility uses embedded department-code arrays. Bookmark targets are polymorphic; no single target-table foreign key exists.
- The schema has no separate approval, timetable, subject or semester tables. Approval details are stored with notices/events; course, semester and assignment information is embedded.
- Facilities are campus-wide. Directory faculty and authenticated faculty users are separate records without a declared foreign key.

## DFD notation

Rectangles are external entities, rounded boxes are numbered processes, and split cylinders are logical data stores. Arrows represent data. Double-ended arrows in Figure 4 summarize request/response or read/update flows. D2 is repeated for readability; D1–D3 are group labels, not extra database tables. The Level 2 diagrams expand selected processes, not the entire system.

Protected operations apply server-side authentication, role and department-scope checks. The optional AI provider is shown in Level 0. Offline demo data is separate and is never automatically synchronized with the backend. Live AI remains unconfigured; the provider integration was tested with a mock, not a live model.

## Implementation references

- `server/src/db.ts`: tables, keys and indexes.
- `src/types/index.ts`: content fields and role types.
- `server/src/app.ts`, `permissions.ts` and `schemas.ts`: authorization, moderation and transactional registration.
- `server/src/ai/`: scoped retrieval, provider interface and response validation.
- `src/services/aiService.ts`: Basic mode fallback.
