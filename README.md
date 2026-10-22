# CampusOne

One Platform, Entire Campus — IPS, University of Allahabad BCA minor project.

## Run and check

Clone https://github.com/tejusjaiswal13-dev/CampusOne and run commands inside `CampusOne`:

```sh
npm ci
npm run dev
npm run build
npm run lint
npm test
```

## Architecture

React 19 components → context providers → services → localStorage. TypeScript 6, Vite 8, Tailwind 4 and Capacitor 8. Android is a hybrid WebView app. Native Share shares notice text; opt-in local notifications schedule approval and deadline reminders when configured from the notification center. These are device reminders, not remote push. Images are bundled SVG assets.

## Demo profiles (Phase 1 baseline)

Email-only local profiles, no password verification yet:

- Student: aarav.sharma@ips.allduniv.ac.in
- Faculty: pradeep.kumar@ips.allduniv.ac.in
- Department admin: hod.ccet@allduniv.ac.in
- College admin: admin.director@ips.allduniv.ac.in

These are sample identities, not real credentials. All information is sample data.

## Roles

- STUDENT: department/college approved feeds, bookmarks, event registrations.
- FACULTY: own proposals and class updates.
- DEPARTMENT_ADMIN: department approvals.
- COLLEGE_ADMIN: institution management, roles and calendar.

At this phase these are client-side capabilities, not a security boundary. Backend enforcement is the next phase.

## Android

Set ANDROID_HOME to the installed SDK. Run `npm run build` and `npx cap sync android`, then `android\gradlew.bat -p android assembleDebug`. APK: `android/app/build/outputs/apk/debug/app-debug.apk`. No physical-device verification is implied.

## Screenshots

Screenshots placeholder: capture Home, notice details, faculty submission and approval screens after the final backend integration.

## Limitations

No real backend or LLM yet. The guide performs keyword lookup. Sample attachments/QR graphics are not official documents or verified entry passes. The report candidate roll number coincides with a sample student; candidate details are retained.

MIT licensed. See AUDIT.md for the measured baseline.
