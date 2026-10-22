# CampusOne baseline audit

Inspected on 2026-10-22 at commit 4195793.

- React 19 / TypeScript 6 / Vite 8 / Tailwind 4, packaged as a Capacitor 8 WebView Android application. Existing design and sample records will be preserved.
- No server, database migrations, password verification, token validation or server authorization exists. Email selects a local profile; registration accepts privileged roles.
- Every record is localStorage data. Staff screens directly call StorageService; hiding controls cannot enforce permissions. Tab rendering lacks role guards.
- The assistant is a keyword lookup, not a model integration.
- Seed images depend on Unsplash/DiceBear. Attachment download buttons include simulated success messages. Seed information is not verified institutional information.
- Native share/local notification dependencies are not used. Android permits backups and includes template tests.
- Documentation overstates identity verification, performance and backend capabilities. Candidate Tejus Jaiswal's roll number IPS2023-BCA-042 matches a demo student's identifier; preserve candidate details and flag this conflict.
- No CI workflow or license is present.

## Baseline execution

- npm run build: PASS (1908 modules, Vite build completed).
- npm run lint: exit 0, 87 diagnostics; warnings are not a clean baseline.
- npm test: PASS, 7 tests / 0 failures.

## Implementation sequence

1. Clean warnings, offline assets/native integrations and repository hygiene.
2. Add validated SQLite API, password authentication and server RBAC; keep explicit isolated demo fallback.
3. Add API and component regression tests.
4. Add server-only grounded model integration and evaluated fallbacks.
5. Verify Android packaging and align documentation with executed checks.

Each phase ends with build, lint and tests, followed by its own commit. Remote CI and live model responses will only be described as verified if actually observed.
