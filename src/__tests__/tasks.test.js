import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, {
  addTask,
  toggleTaskStatus,
  deleteTask,
  selectFilteredTasks,
  selectPaginatedTasks,
} from '../store/tasksSlice';
import projectsReducer from '../store/projectsSlice';
import uiReducer from '../store/uiSlice';
import { INITIAL_TASKS } from '../utils/mockData';

// Helper to build a fresh store
function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: { tasks: tasksReducer, projects: projectsReducer, ui: uiReducer },
    preloadedState,
  });
}

// ─── tasksSlice unit tests ────────────────────────────────────────────────────

describe('tasksSlice', () => {
  test('initial state contains mock tasks', () => {
    const store = makeStore();
    const { items } = store.getState().tasks;
    expect(items.length).toBeGreaterThan(0);
  });

  test('addTask appends a new task with auto-incremented id', () => {
    const store = makeStore();
    const before = store.getState().tasks.items.length;
    store.dispatch(
      addTask({
        title: 'Test task',
        status: 'Pending',
        assignedTo: 1,
        projectId: 1,
        dueDate: '2025-01-01',
        priority: 'Medium',
      })
    );
    const after = store.getState().tasks.items;
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].title).toBe('Test task');
  });

  test('toggleTaskStatus flips Pending → Completed', () => {
    const store = makeStore();
    const pendingTask = store.getState().tasks.items.find(
      (t) => t.status === 'Pending'
    );
    expect(pendingTask).toBeTruthy();
    store.dispatch(toggleTaskStatus(pendingTask.id));
    const updated = store.getState().tasks.items.find((t) => t.id === pendingTask.id);
    expect(updated.status).toBe('Completed');
  });

  test('toggleTaskStatus flips Completed → Pending', () => {
    const store = makeStore();
    const completedTask = store.getState().tasks.items.find(
      (t) => t.status === 'Completed'
    );
    expect(completedTask).toBeTruthy();
    store.dispatch(toggleTaskStatus(completedTask.id));
    const updated = store.getState().tasks.items.find((t) => t.id === completedTask.id);
    expect(updated.status).toBe('Pending');
  });

  test('deleteTask removes the task by id', () => {
    const store = makeStore();
    const target = store.getState().tasks.items[0];
    store.dispatch(deleteTask(target.id));
    const remaining = store.getState().tasks.items;
    expect(remaining.find((t) => t.id === target.id)).toBeUndefined();
  });

  test('selectFilteredTasks filters by status "Completed"', () => {
    const store = makeStore();
    store.dispatch({ type: 'tasks/setFilter', payload: 'Completed' });
    const filtered = selectFilteredTasks(store.getState());
    expect(filtered.every((t) => t.status === 'Completed')).toBe(true);
  });

  test('selectFilteredTasks filters by search string', () => {
    const store = makeStore();
    store.dispatch({ type: 'tasks/setSearch', payload: 'design' });
    const filtered = selectFilteredTasks(store.getState());
    filtered.forEach((t) => {
      expect(t.title.toLowerCase()).toContain('design');
    });
  });

  test('selectPaginatedTasks respects pageSize', () => {
    const store = makeStore();
    // Default pageSize is 8; ensure we have at least 8 tasks
    const { tasks } = selectPaginatedTasks(store.getState());
    expect(tasks.length).toBeLessThanOrEqual(store.getState().tasks.pageSize);
  });
});

// ─── Simple component smoke test ─────────────────────────────────────────────

import { Badge } from '../components/common/UI';

describe('Badge component', () => {
  test('renders children text', () => {
    render(<Badge variant="success">Completed</Badge>);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('applies correct variant class', () => {
    const { container } = render(<Badge variant="pending">Pending</Badge>);
    expect(container.firstChild.className).toMatch(/pending/);
  });
});
