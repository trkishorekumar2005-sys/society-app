@AGENTS.md

# Society Management App — Project Spec

## Stack

- Expo (React Native) + TypeScript (strict), Expo Router (file-based navigation)
- Zustand for state management
- AsyncStorage for persistence, seeded from JSON mock data
- react-native-paper for Material Design UI
- Jest + @testing-library/react-native for tests
- Targets: Android, iOS, Web (responsive layout for web)

## Architecture (Clean Architecture, layered)

src/
core/ -> theme, constants, utils (date format, id generator), error types
data/
mock/ -> seed JSON (users, announcements, complaints, visitors)
api/ -> mockApiClient: simulates 400–900ms latency and ~10% random failure (configurable, disabled in tests)
repositories/ -> one repository per feature; only layer that touches api/storage
domain/
models/ -> TypeScript types/interfaces
store/ -> one Zustand store per feature; each exposes { data, status: 'idle'|'loading'|'success'|'error', error, actions }
components/ -> reusable UI: AppButton, AppTextField, Card, StatusChip, LoadingState, EmptyState, ErrorState (with Retry), ScreenContainer
app/ -> Expo Router screens only; screens call stores, never repositories directly

Rules: screens -> stores -> repositories -> api/storage. No business logic in screens.
Every list screen must handle loading, empty, error+retry, and pull-to-refresh.
Forms must have validation with inline error messages.
Meaningful names, small components, short JSDoc comments on repositories/stores.

## Roles

- RESIDENT, ADMIN, SECURITY. Role-based tabs after login.
- Demo accounts (show on login screen):
  resident@demo.com / 123456, admin@demo.com / 123456, security@demo.com / 123456

## Features

1. Auth: login, register (resident), logout, persisted session, route guard.
2. Announcements: all roles view (pinned first, category filter); ADMIN creates/deletes/pins.
3. Complaints: RESIDENT raises (title, category, description, priority), sees own list with status timeline;
   ADMIN sees all, updates status OPEN -> IN_PROGRESS -> RESOLVED.
4. Visitor Management: RESIDENT pre-approves a visitor (name, phone, purpose, date) -> gets a 6-digit pass code;
   SECURITY verifies code, marks check-in/check-out; ADMIN views log.
5. Emergency Contacts: static list with tap-to-call (Linking).
6. Profile: view/edit name, flat number, phone; logout.

## Git

After each phase: run tests if present, then commit with a Conventional Commit message
(feat:, fix:, test:, docs:, refactor:) describing what changed. Push after each commit.
