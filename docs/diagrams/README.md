# CampusOne: ER and data-flow diagrams for the synopsis

These figures describe the implemented CampusOne code at commit 22b113d, not an idealized future schema. Use **Insert > Pictures** in Word to insert PNG files. SVG files remain sharp when enlarged and can be edited as vector artwork. The `.dot` files for Figures 1–4 are editable Graphviz source. Open `index.html` to browse all figures. Figures 1–4 suit landscape pages; Figures 5–7 suit portrait pages. Do not shrink all seven onto one page.

## Suggested report order and captions

1. **Core entity relationship diagram** (`01-er-core`): Users belong to departments and have account/session records. Faculty and administrators publish notices and events. Student registrations associate users with events; bookmarks associate users with typed content targets.
2. **Academic and notification entity relationship diagram** (`02-er-academic`): Departments scope exams, directory faculty and calendar records. Faculty users author class notices. Notification read state links users to notifications. Careers use embedded department eligibility codes; facilities are campus-wide.
3. **DFD Level 0 — context diagram** (`03-dfd-level-0`): Represents CampusOne as one process, with students, faculty, department administrators, college administrators and the optional AI provider as external entities.
4. **DFD Level 1 — major processes** (`04-dfd-level-1`): Decomposes the system into authentication/account management, content moderation, scoped discovery, participation/alerts and AI assistance, with four grouped data stores.
5. **DFD Level 2 — publishing and approval** (`05-dfd-level-2-publishing`): Expands process 2.0 for faculty notices/events, including validation, pending content, authorized review, approval/rejection and author notifications.
6. **DFD Level 2 — event registration** (`06-dfd-level-2-registration`): Expands the booking part of process 4.0. Registration lookup, capacity checks, seat decrement and registration insertion operate within an immediate transaction to avoid overbooking.
7. **DFD Level 2 — grounded AI** (`07-dfd-level-2-ai`): Expands the question-answering part of process 5.0, showing scoped retrieval, prompt construction, provider interaction, citation validation and labelled fallback.

## Reading the ER diagrams

- `PK`: primary key. `FK`: physical SQL foreign key. `?`: optional payload value. `[]`: embedded array.
- `1`, `0..1`, `0..N`: relationship cardinalities. The career eligibility relationship is logical many-to-many.
- **Solid lines** show real SQL foreign keys. **Dashed lines** show logical JSON/application references, not SQL FK constraints.
- Thirteen content tables use `id`, `data` (JSON), `created_at` and `updated_at`. Attributes displayed beneath their IDs are selected JSON fields. Accounts, sessions and notification_reads use ordinary SQL columns.
- The database has 16 actual tables: departments, users, notices, events, registrations, exams, career, calendar, faculty, facilities, notifications, bookmarks, class_notices, accounts, sessions and notification_reads. USERS and DEPARTMENTS repeat on the second sheet only for readability.
- Notices/events optionally reference departments for department-scoped content; these scope fields are listed without additional crossing edges. College-scoped records need no department link.
- Bookmarks use a polymorphic `(itemType, itemId)` reference. No single target-table FK exists. Directory faculty and authenticated faculty users are different records, without a declared FK between them.
- There are no separate approvals, timetable, subject or semester SQL tables. Approval state/rejection reasons live on notices/events. Course/semester and assignment information is embedded. Do not claim those future entities are already implemented.

## Reading the DFDs

Rectangles represent external actors, rounded boxes represent numbered processes, and split boxes represent data stores. Arrows represent **data**, not execution order or button navigation. Store labels D1–D4 group actual tables for legibility; they are not additional physical tables. Level 2 figures are selected decompositions, not full expansions of every process. DFD 0 treats role groups separately; DFD 1 combines them as Campus user, with role checks applied to each operation.

The runtime applies authentication/RBAC before protected processes; repeated middleware details are omitted from individual arrows. Offline demo data is separate and never automatically synchronized with the server. No provider credentials are exposed in the client. Live AI remains unconfigured by the owner's choice, and mocked tests do not establish live answer accuracy.

## Source evidence

- `server/src/db.ts`: physical tables, keys and unique indexes.
- `src/types/index.ts`: payload fields and roles.
- `server/src/app.ts`, `permissions.ts`, `schemas.ts`: authorization, moderation and transactional registration.
- `server/src/ai/`: scoped retrieval, provider interface and validation.
- `src/services/aiService.ts`: Basic mode fallback.

Figures 1–4 can be regenerated from their Graphviz files. Figures 5–7 use hand-routed SVG for a clean, concise presentation; edit the SVG directly. PNG exports were visually inspected. This documentation-only change does not modify the app.

