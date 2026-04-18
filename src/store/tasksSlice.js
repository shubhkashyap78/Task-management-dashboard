import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_TASKS } from '../utils/mockData';
import { todosService } from '../services/api';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const fetchTodosFromAPI = createAsyncThunk('tasks/fetchTodos', async () => {
  const todos = await todosService.getAll();
  return todos.slice(0, 20).map((todo) => ({
    id: todo.id + 100,
    title: todo.title,
    status: todo.completed ? 'Completed' : 'Pending',
    assignedTo: (todo.userId % 5) + 1,
    projectId: (todo.id % 6) + 1,
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    fromAPI: true,
  }));
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: loadFromStorage() || INITIAL_TASKS,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 8,
    filter: 'All',
    search: '',
    apiLoaded: false,
  },
  reducers: {
    addTask: (state, action) => {
      const newId = Math.max(...state.items.map((t) => t.id), 0) + 1;
      state.items.push({ ...action.payload, id: newId });
    },
    updateTask: (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.currentPage = 1;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosFromAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosFromAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.apiLoaded = true;
        // Merge API tasks with existing
        const apiTasks = action.payload.filter(
          (t) => !state.items.find((e) => e.id === t.id)
        );
        state.items = [...state.items, ...apiTasks];
      })
      .addCase(fetchTodosFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setFilter,
  setSearch,
  setPage,
  setPageSize,
} = tasksSlice.actions;

// Selectors
export const selectFilteredTasks = (state) => {
  const { items, filter, search } = state.tasks;
  return items.filter((task) => {
    const matchesFilter = filter === 'All' || task.status === filter;
    const matchesSearch =
      !search || task.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
};

export const selectPaginatedTasks = (state) => {
  const filtered = selectFilteredTasks(state);
  const { currentPage, pageSize } = state.tasks;
  const start = (currentPage - 1) * pageSize;
  return {
    tasks: filtered.slice(start, start + pageSize),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
};

export default tasksSlice.reducer;
