# ApplyFlow

A complete React + TypeScript job application tracker. Four routes: Dashboard, Applications, Kanban Board and Analytics. Device-local persistence, mouse/touch drag-and-drop, full status history and responsive layouts.

## Run

Requires Node.js 20.19+ (or Node 22+) and npm.

```bash
npm install
npm run dev
npm run build
```

Production output is in `dist/`. Configure your static host to serve `index.html` for unknown paths so React Router can handle deep links.

## Usage

Four fictional sample applications (Blibli, tiket.com, Formulatrix, and Shopee) are seeded on first load. Add an application, open a row/card for details or editing, and use the trash action to delete after confirmation. Data stays in this browser and does not sync between devices.

On the board, drag the handle to reorder or change stages. Editing the status in application details is an alternative. Moving out of Wishlist without an applied date opens the edit form; save a date to finish the transition. That move is appended to its target column. Active search/status filters disable same-column reordering; cross-column moves append to the destination.

## Structure

- `src/main.tsx`: starts React, the router, and the application provider.
- `src/App.tsx`: maps URLs to pages.
- `src/pages/`: Dashboard, Applications, Board, and Analytics page UI.
- `src/components/`: shared UI, including the layout, dialogs, form, table, cards, and charts.
- `src/state/ApplicationsProvider.tsx`: shared application state, filters, dialog actions, and CRUD/persistence coordination. Pages use `useApplications()` to access it.
- `src/repositories/applicationRepository.ts`: repository interface, localStorage validation, schema migration, and sample data.
- `src/utils/applications.ts`: pure add/edit/delete/move/filter operations.
- `src/utils/stats.ts`: pure history-based metrics.
- `src/types/index.ts`: domain types and stages.
- `src/styles.css`: shared styles.

Use `npm run format` to format the project with Prettier, or `npm run format:check` to check formatting.

Every status change appends an immutable {status, enteredAt} history entry. Order is normalized per column. Interview/offer rates count each application once if its history contains that stage, divided by all applications that ever left Wishlist. A zero denominator displays N/A. Applied date drives monthly counts and activity charts. Current interview/offer counts use current status.

Storage schema version is 2. A recognizable complete set of the original eight examples is replaced by the four new examples on upgrade; custom or partial saved data is retained. Invalid/corrupted or incompatible records reset to sample data; an intentionally empty array stays empty. Storage failures show an error and retain working data in memory. Clearing browser storage removes applications.

## Verification

Run `npm run build` for TypeScript checking and the production build. Automated tests and test dependencies have been removed for now.

All dependency versions are exact; package-lock.json is included. No backend, account system, or API keys are required.

The board uses a floating drag preview and transient column state to show insertion during a drag. Only dropping commits a status/history change; Escape cancels without saving.

Browser visual/pointer/touch QA was not exercised in the build environment.
