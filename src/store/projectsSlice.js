import { createSlice } from '@reduxjs/toolkit';
import { PROJECTS } from '../utils/mockData';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('taskflow_projects');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: loadFromStorage() || PROJECTS,
    loading: false,
    error: null,
    filter: 'All',
    search: '',
    sortBy: 'name',
    sortDir: 'asc',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSort: (state, action) => {
      if (state.sortBy === action.payload) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortDir = 'asc';
      }
    },
    addProject: (state, action) => {
      const newId = Math.max(...state.items.map((p) => p.id), 0) + 1;
      state.items.push({ ...action.payload, id: newId });
    },
    updateProject: (state, action) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
    },
  },
});

export const { setFilter, setSearch, setSort, addProject, updateProject } =
  projectsSlice.actions;

export const selectFilteredProjects = (state) => {
  const { items, filter, search, sortBy, sortDir } = state.projects;
  let filtered = items.filter((p) => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

export default projectsSlice.reducer;
