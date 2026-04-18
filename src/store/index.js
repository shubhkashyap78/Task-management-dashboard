import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import projectsReducer from './projectsSlice';
import uiReducer from './uiSlice';

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  try {
    localStorage.setItem('taskflow_tasks', JSON.stringify(state.tasks.items));
    localStorage.setItem('taskflow_projects', JSON.stringify(state.projects.items));
  } catch {}
  return result;
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
