# CampusOne

**One Platform, Entire Campus** — BCA minor project for the Institute of Professional Studies, University of Allahabad. Existing React mobile design retained; Android packaging uses Capacitor's WebView, not React Native.

## Run locally

Requirements: Node 22.12+ (CI uses Node 22), npm, Java 21 and Android SDK for APKs. SQLite uses better-sqlite3 native bindings; npm may need compiler tools if no prebuilt binary is available for your platform.

```powershell
git clone https://github.com/tejusjaiswal13-dev/CampusOne.git
cd CampusOne
npm ci
Copy-Item .env.example .env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Paste the generated random value into **JWT_SECRET** in `.env`. It is server-only; never prefix secrets with `VITE_`. Use separate terminal windows:

```powershell
npm run server
npm run dev
```

Open the Vite URL (normally http://localhost:5173). The server defaults to port 3001. `SEED_DEMO=true` seeds the empty SQLite database from the existing TypeScript seed module; it does not overwrite an existing database. Changes to DEMO_PASSWORD do not reset existing account passwords.

## Checks

```powershell
npm run build
npm run lint
npm test
```

Build type-checks frontend and server and produces `dist/`. Lint fails on any warning. Tests run the original Node storage tests, then Vitest/React Testing Library/Supertest tests. CI runs install, lint, build and test. See [verification](docs/VERIFICATION.md) for actual results and limits.

## Sample sign-ins

For locally seeded evaluation accounts, password: **CampusOne-Demo-2026!** (set via DEMO_PASSWORD in `.env.example`). These are deliberately public sample credentials, not production accounts.

- Student CCET: `aarav.sharma@ips.allduniv.ac.in`
- Student CFT: `priya.patel@ips.allduniv.ac.in`
- Faculty: `pradeep.kumar@ips.allduniv.ac.in`
- HOD: `hod.ccet@allduniv.ac.in`
- College admin: `admin.director@ips.allduniv.ac.in`

Never publicly deploy the sample database/password. Faculty self-registration is pending until department/college approval; students can register normally. No self-registration of HOD or college admin. Password recovery/email verification/SSO are not implemented.

## Roles and enforcement

| Role | Server permissions |
|---|---|
| STUDENT | Approved college + own department content, own bookmarks/registrations; course/semester exams |
| FACULTY | Approved accessible content + own submissions; department proposals pending approval; own assigned class updates |
| DEPARTMENT_ADMIN | Own department review, faculty-account approval, exam management; no role assignment or college calendar edits |
| COLLEGE_ADMIN | Content administration, role assignment, faculty-account approval, calendar/career/department updates |

Every write is authenticated and validated on the server. Role changes revoke existing sessions. Event seat allocation uses a SQLite immediate transaction and a unique event/user registration index. Client tab guards improve UX but are not the security boundary.

## Architecture

UI → Auth/App contexts → `src/services/api.ts` → Express validation/RBAC → SQLite. Tables preserve existing record structures using validated JSON documents plus SQL indexes; accounts/sessions/notification-read relations are separate tables. This is not a fully normalized relational schema. No online records are copied into localStorage. JWTs expire after 15 minutes and are held in memory/sessionStorage; logout revokes the server session when reachable. Protect the frontend against XSS and serve production APIs over HTTPS.

## Offline evaluation

`VITE_DEMO_MODE=true` allows fallback when the backend is unreachable. A visible **Demo/offline mode** badge and local sample profiles appear. Click the badge to retry the server; reconnect requires sign-in. Offline writes stay in the local sample store and are never uploaded as trusted changes. Auth/validation failures do not enable offline mode. Set the flag to `false` for production. API failure during a write reports an error rather than pretending it was saved.

## AI

Set server-only `AI_PROVIDER` (`openai`, `gemini`, `claude`), `AI_MODEL` and `AI_API_KEY`. Restart the API after changing them. Model availability depends on your account. No provider key was supplied for delivery, by user choice: live model output is **unverified**.

The assistant retrieves permitted records, ranks up to eight, requests short JSON answers and validates citations. It supports English/Hindi output, source navigation, loading/error/retry states and labelled Basic-mode fallback. Faculty/staff can generate editable circular drafts; students cannot. Notice details support summaries/Hindi summaries. Nothing generated is automatically published. See [AI design and evaluation](AI_DESIGN.md).

## Android

See [Android build and signing](docs/ANDROID.md). Debug output: `android/app/build/outputs/apk/debug/app-debug.apk`. Native notice sharing is wired. Opt-in local reminders are configured from the notification center; they are device-scheduled reminders based on currently loaded records, not server push. Reconfigure after new content arrives. Haptics/keyboard dependencies were removed. Native runtime behaviour requires device testing.

## Documentation and screenshots

- [Architecture](docs/ARCHITECTURE.md) · [ER diagram](docs/ER.md) · [API](docs/API.md)
- [Five-minute demonstration](docs/DEMO.md) · [Project synopsis](PROJECT_SYNOPSIS_REPORT.md)
- Screenshots placeholder: capture the final password login, home, submission and approval screens on your evaluation device. Existing design is preserved.

## Honest limitations

Seed dates/details are sample information, not verified university announcements. Existing sample timetable/roster information is labelled. No real attendance/RFID, Web Push, 2G/3G performance benchmark, institutional hall-ticket issuing, attachment upload, password recovery or automatic timetable extraction exists. Some management operations are API-only (see API reference). CI/browser/API checks do not replace physical-device or live-provider testing. Candidate Tejus Jaiswal's roll number remains IPS2023-BCA-042; it also appears in a demo student record and should be clarified before submission.

MIT licensed. See AUDIT.md for the original measured baseline.
