# TaskFlow — Project & Task Management App

A fully-featured React.js task management dashboard built with Redux Toolkit, React Router v6, and CSS Modules.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

The app opens at **http://localhost:3000** and auto-redirects to `/dashboard`.

---

## 📁 Project Structure

```
src/
├── __tests__/          # Jest + React Testing Library unit tests
├── components/
│   ├── common/         # Layout, Sidebar, Header, reusable UI primitives
│   ├── dashboard/      # Dashboard page & stats
│   ├── forms/          # TaskForm (add/edit, with validation)
│   ├── projects/       # Projects listing page
│   └── tasks/          # Task management table page
├── hooks/              # useFetch, useDebounce, useLocalStorage, useMediaQuery
├── pages/              # AppRouter (lazy-loaded routes)
├── services/           # Axios API abstraction layer
├── store/              # Redux Toolkit slices (tasks, projects, ui)
└── utils/              # Mock data
```

---

## ✅ Features Implemented

### Dashboard (`/dashboard`)
- Stat cards: Total Projects, Total Tasks, Completed Tasks, Pending Tasks
- Project progress bars with completion percentages
- Recent tasks list with toggle indicators
- Team members overview
- Fetches additional tasks from `jsonplaceholder.typicode.com/todos` on first load

### Projects (`/projects`)
- Card grid with progress bars, status badges, descriptions
- **Search** with 300ms debounce
- **Filter** by status: All / Active / Completed
- **Sort** by Name / Task Count / Status (ascending/descending toggle)

### Tasks (`/tasks`)
- Sortable table with Title, Project, Assigned To, Due Date, Priority, Status
- **Toggle** task complete/incomplete inline
- **Search** with debounce
- **Filter** by All / Pending / Completed
- **Pagination** with configurable page sizes (5 / 8 / 10 / 20)
- Overdue date highlighted in red
- Add / Edit / Delete via modals

### Task Form
- Reusable `<TaskForm />` used for both create and edit
- Fields: Title (required, min 3 chars), Assigned User (dropdown), Project (dropdown), Due Date, Priority, Status
- Client-side validation with inline error messages

### State Management (Redux Toolkit)
- `tasksSlice` — CRUD, toggle, filter, search, pagination, async API fetch
- `projectsSlice` — filter, search, sort
- `uiSlice` — sidebar open/closed, modal state, toast notifications
- **localStorage persistence** via custom middleware

### Routing (React Router v6)
- `/dashboard` → Dashboard
- `/projects` → Project listing
- `/tasks` → Task management
- Unknown routes redirect to `/dashboard`
- **Code splitting** via `React.lazy` + `Suspense`

### Custom Hooks
- `useFetch` — axios-based with AbortController cleanup
- `useDebounce` — delays value updates
- `useLocalStorage` — synced state with localStorage
- `useMediaQuery` — responsive breakpoint detection
- `useClickOutside` — detects clicks outside a ref

### API Layer
- `src/services/api.js` — Axios instance with request/response interceptors
- `todosService` and `usersService` for clean endpoint access

### UI/UX
- Dark theme with CSS custom properties
- Responsive layout (mobile sidebar overlay)
- Skeleton loading states on dashboard
- Toast notifications for create/update/delete actions
- Smooth animations and hover micro-interactions

---

## 🧪 Tests

Tests live in `src/__tests__/tasks.test.js` and cover:
- Redux slice: addTask, toggleTaskStatus, deleteTask
- Selectors: filtering by status/search, pagination page size
- `<Badge />` component rendering

Run with:
```bash
npm test
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 18 |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| Styling | CSS Modules + CSS Variables |
| HTTP Client | Axios |
| Testing | Jest + React Testing Library |
| Fonts | Space Grotesk + JetBrains Mono |

---

## 📦 Key Dependencies

```json
{
  "@reduxjs/toolkit": "^2.2.1",
  "react-redux": "^9.1.0",
  "react-router-dom": "^6.22.2",
  "axios": "^1.6.7"
}
```
