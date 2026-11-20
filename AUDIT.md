# CampusOne final presentation audit

Updated 19 November 2026 from the checked-out `codex/design-overhaul` branch.

## Verified architecture

- React 19, TypeScript 6, Vite 8 and Tailwind 4 frontend. Capacitor 8 packages the web app for Android; this is a hybrid WebView app, not React Native/Expo.
- Express 5 TypeScript API with SQLite (`better-sqlite3`); API startup binds `0.0.0.0` on `PORT` (default 3001).
- Password login uses bcrypt, short-lived JWTs and server-side session rows. API middleware checks the signed token, session and active account. Role/department checks are in server routes; the UI also has route guards.
- AI routes are server-side and configurable by provider. No live provider key was supplied; mocked provider tests cover grounding and failure behavior.
- `VITE_DEMO_MODE=true` enables a visibly labelled, separate local demo fallback. The checked-in `.env.example` uses localhost; a phone needs a LAN-reachable API URL baked into its frontend build.

## Implemented and documented

The repository contains notice/event/exam/career/calendar/bookmark/class-notice APIs, account approval and content moderation workflows, search and role-aware feeds, local reminder/share integrations, grounded AI endpoints, Android Gradle configuration, seeded demo records, architecture/API/demo documents and CI configuration. Refer to `docs/API.md` and `docs/VERIFICATION.md` for endpoint and previous verification details. Some management functions remain API-only; the AI provider is not live-tested.

## Current test run

On 19 November 2026:

- `npm run build`: PASS (frontend TypeScript, server TypeScript and Vite production build).
- `npm run lint`: PASS (Oxlint configured with zero warnings allowed).
- `npm test` in the default restricted environment: 7 Node storage tests pass; 17 Vitest API/AI tests cannot bind their local test ports (`connect EACCES 127.0.0.1`).
- Re-running `npm test` with local loopback access: PASS, 4 Vitest files / 24 tests and 7 Node tests.

## Android and device status

The Android docs record a successful build on 23 October, but this audit could not confirm a current APK in the repo output directory. The LAN-configured frontend built and `npx cap sync android` succeeded. A fresh Gradle build then stopped because no Android SDK path was configured (`ANDROID_HOME`/`ANDROID_SDK_ROOT` missing and no `android/local.properties`). No attached Android device was available. The laptop Wi-Fi IPv4 observed during this audit was `192.168.31.198`; it can change, so discover it again on presentation day. API health requests were blocked/timed out in this environment, so LAN reachability, Windows Firewall access, and phone-to-laptop notice synchronization remain UNVERIFIED.

## Data and risks

- Seed content and user profiles are demonstrations, not official IPS announcements or verified live data. The app itself marks demo/offline mode.
- No genuine attendance record source or calculation workflow was confirmed. Do not present attendance-like sample figures as actual results.
- Timetable upload/extraction and AI mapping are not verified as an operational end-to-end workflow. Do not claim automatic timetable updates. Keep human review/confirmation as the intended workflow.
- No live AI provider call, signed release APK, physical-phone install, notification delivery, or exhaustive penetration test was performed in this audit.
- The candidate's roll-number clash with a seeded demo user remains documented in README/DEMO and needs an explanation in the viva.

## Presentation recommendation

Use one laptop-hosted API and build the debug APK with the current laptop LAN IP in `VITE_API_URL`. Demonstrate admin notice creation then refresh the student's notice list on a second device only after verifying that both devices can reach the same API. If Wi-Fi/firewall/device connectivity fails, use the labelled offline demo and describe cross-device synchronization as unverified; do not imply offline local changes sync.
