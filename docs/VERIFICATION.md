# Verification record

Delivery checks performed 23 October 2026 (India time). Local environment: Windows, Node 24.12.0, Java 21; Android SDK installed locally.

## Required phase gate
Executed sequentially: `npm run build`, `npm run lint`, `npm test`. All exited 0.

Actual final output excerpts:

```text
vite v8.2.2 building client environment for production...
✓ 1924 modules transformed.
✓ built in 2.23s

> oxlint --max-warnings 0
(no diagnostics; exit 0)

ℹ tests 7
ℹ pass 7
ℹ fail 0

Test Files  4 passed (4)
Tests  24 passed (24)
```

Total: 31 passing tests (7 original Node storage tests plus 24 Vitest API/component/AI tests). Provider tests use mocks; no live provider was configured, as requested by the owner.

## Android
Executed with VITE_API_URL=http://10.0.2.2:3001/api, VITE_DEMO_MODE=true and CAMPUS_ALLOW_HTTP=true:

```text
npm run build
npx cap sync android
[info] Found 5 Capacitor plugins for android
[info] Sync finished in 0.569s
android\gradlew.bat -p android assembleDebug --console=plain
BUILD SUCCESSFUL in 59s
244 actionable tasks: 35 executed, 209 up-to-date
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`. A delivery copy is in the workspace parent `outputs/CampusOne-secure-debug.apk`. This build targets the emulator host address; a physical phone needs a reachable HTTPS API or a separately configured local development build. Offline demo remains available.

Gradle emitted flatDir metadata and SDK XML version warnings. They did not fail the build. A signed release and installation on a physical phone have not been verified. No release keystore is committed.

## Browser smoke checks
Using the real local API and documented seeded student account: password sign-in displayed the student's scoped home; saving a notice persisted after a full browser reload. The online evaluator switcher is not rendered. The assistant was checked with no provider configured: a visible Basic mode label, error explanation and retry control appeared. This confirms graceful degradation, not live AI answer quality.

## Security and limits
Tests cover token rejection/revocation, faculty application approval, role-forbidden requests, department isolation, moderation transitions, last-seat registration, route guards and AI scope/citation/failure behavior. They are not an exhaustive penetration test. SQLite content payloads are JSON-backed rather than fully normalized. Some CRUD operations remain API-only. Timetable and attendance limitations are documented in the synopsis. Backend deployment/TLS, recovery/SSO, live AI evaluation and physical-device notification delivery remain outstanding.

GitHub CI status is reported separately after pushing; local success alone is not a CI result.
