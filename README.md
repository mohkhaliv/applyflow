<img width="938" height="500" alt="Screenshot 2026-10-05 181347" src="https://github.com/user-attachments/assets/f184d324-3602-4cfc-8152-ae813f1fc468" />
<img width="938" height="500" alt="Screenshot 2026-10-05 181504" src="https://github.com/user-attachments/assets/c5236bc1-cf23-4042-b1f5-542238a9f344" />

# ApplyFlow

ApplyFlow is a React + TypeScript job application tracker with a responsive dashboard, application management, analytics, and a drag-and-drop Kanban board.

**Live Demo:** [applyflow-tau-five.vercel.app](https://applyflow-tau-five.vercel.app)

## Features

- Dashboard, Applications, and Kanban Board pages
- Add, edit, delete, search, filter, and sort applications
- Mouse/touch drag-and-drop with status changes and card reordering
- Application status history
- Interview and offer analytics
- LocalStorage persistence
- Responsive layout

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- dnd-kit
- Recharts
- LocalStorage

## Run Locally

Requires Node.js 20.19+ or Node.js 22+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Project Structure

```text
src/
├─ components/
├─ pages/
├─ repositories/
├─ state/
├─ types/
├─ utils/
├─ App.tsx
├─ main.tsx
└─ styles.css
```

Shared application state and CRUD coordination live in `ApplicationsProvider`. Persistence is separated behind a repository layer so LocalStorage can later be replaced with another data source.

## Data & Persistence

Sample applications are loaded on first launch. Changes are stored in the current browser using LocalStorage and persist after refresh.

Each status change records a timestamped history entry, allowing interview and offer rates to reflect stages an application has reached previously.

## Deployment

The app is a client-side React application. When deploying to a static host, configure unknown paths to serve `index.html` so React Router routes such as `/board` and `/applications` work on direct navigation.
