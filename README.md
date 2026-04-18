# TaskFlow — Project & Task Management App

A fully-featured React.js task management dashboard built with Redux Toolkit, React Router v6, and CSS Modules.

---

## 🚀 Setup Steps

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm start
```
The app will open at **http://localhost:3000** and auto-redirect to `/dashboard`.

### 4. Run tests
```bash
npm test
```

### 5. Build for production
```bash
npm run build
```

> **Note:** No `.env` file or external API keys are required. The app uses `jsonplaceholder.typicode.com` (public, free) and local mock data.

---

## 📁 Folder Structure

```
src/
├── __tests__/
│   └── tasks.test.js         # Unit tests for Redux slice and Badge component
│
├── components/
│   ├── common/               # Shared/reusable UI components
│   │   ├── Layout.jsx        # App shell — sidebar + header + main content area
│   │   ├── Sidebar.jsx       # Navigation sidebar with collapse/expand
│   │   ├── Header.jsx        # Top bar with page title and mobile menu toggle
│   │   └── UI.jsx            # Primitive components: Button, Badge, Input, Select, Modal, EmptyState, Skeleton
│   │
│   ├── dashboard/
│   │   └── Dashboard.jsx     # Stat cards, project progress, recent tasks, team members
│   │
│   ├── forms/
│   │   └── TaskForm.jsx      # Reusable add/edit task form with validation
│   │
│   ├── projects/
│   │   └── Projects.jsx      # Project card grid with search, filter, sort
│   │
│   └── tasks/
│       └── Tasks.jsx         # Task table with search, filter, pagination, CRUD modals
│
├── hooks/
│   └── index.js              # Custom hooks: useFetch, useDebounce, useLocalStorage, useMediaQuery, useClickOutside
│
├── pages/
│   └── AppRouter.jsx         # React Router v6 routes with React.lazy + Suspense (code splitting)
│
├── services/
│   └── api.js                # Axios instance with interceptors; todosService and usersService
│
├── store/
│   ├── index.js              # Redux store setup with localStorage persistence middleware
│   ├── tasksSlice.js         # Tasks state: CRUD, toggle, filter, search, pagination, async fetch
│   ├── projectsSlice.js      # Projects state: filter, search, sort
│   └── uiSlice.js            # UI state: sidebar, modal, toast notifications
│
├── utils/
│   └── mockData.js           # Static mock data for projects, tasks, and users
│
├── App.js                    # Root component — Redux Provider + Router
├── index.css                 # Global CSS variables (dark theme, typography, animations)
└── index.js                  # React DOM entry point
```

---

## 🗂 State Management Approach

**Redux Toolkit** is used as the single source of truth, split into 3 slices:

### `tasksSlice`
Manages all task-related state:
- **CRUD** — addTask, updateTask, deleteTask
- **Toggle** — toggleTaskStatus (Pending ↔ Completed)
- **UI filters** — setFilter (All / Pending / Completed), setSearch, setPage, setPageSize
- **Async thunk** — fetches todos from `jsonplaceholder.typicode.com/todos` on dashboard load and merges them with local mock tasks

### `projectsSlice`
Manages project listing state:
- setFilter (All / Active / Completed)
- setSearch (debounced from component side)
- setSort (name / taskCount / status, with asc/desc toggle)

### `uiSlice`
Manages global UI state:
- toggleSidebar — open/closed state for responsive sidebar
- openModal / closeModal — controls which modal is visible and passes data to it
- showNotification / clearNotification — toast messages for create/update/delete actions

### Persistence
A custom Redux middleware in `store/index.js` listens to every dispatched action and saves `tasks` and `projects` state to `localStorage`. On app reload, the store is initialized from `localStorage` if data exists, so tasks and projects survive page refreshes.

### Data Flow
```
User Action → Dispatch → Slice Reducer → Store → useSelector → Component re-render
```
Components never mutate state directly — all changes go through dispatched actions.

---

## 📝 Assumptions

1. **Authentication is out of scope.** There is no login/logout. The logged-in user is hardcoded as "John Doe (Admin)" in the sidebar.

2. **Mock data is used for projects and users.** Real project/user APIs are not available, so `src/utils/mockData.js` provides static projects, tasks, and team members. Only the todos list is fetched from a live API (`jsonplaceholder.typicode.com/todos`).

3. **No backend / database.** All data is stored in Redux state and persisted to `localStorage`. Refreshing the page retains tasks and projects, but clearing browser storage resets to mock data defaults.

4. **Styling uses CSS Modules instead of Bootstrap/Tailwind.** CSS Modules with CSS custom properties were chosen for scoped, conflict-free styles and full control over the dark theme design without adding a large UI library dependency.

5. **`/tasks/:id` detail route is not implemented.** The assignment marked this as optional. Task details are accessible via the Edit modal on the tasks page instead.

6. **Todos fetched from the API are read-only seeds.** The 20 todos fetched from jsonplaceholder are merged into the task list as initial data. They can be toggled, edited, or deleted like any local task after being loaded.

7. **Due dates for API-fetched todos are not provided by jsonplaceholder**, so they are left empty by default and can be set by editing the task.

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
