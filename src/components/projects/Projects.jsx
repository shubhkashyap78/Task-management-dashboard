import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilter,
  setSearch,
  setSort,
  selectFilteredProjects,
} from '../../store/projectsSlice';
import { useDebounce } from '../../hooks';
import { Badge, Button, Card, Input, EmptyState } from '../common/UI';
import styles from './Projects.module.css';

function ProjectCard({ project }) {
  const pct =
    project.taskCount > 0
      ? Math.round((project.completedTasks / project.taskCount) * 100)
      : 0;

  return (
    <Card className={styles.projectCard}>
      <div className={styles.cardTop}>
        <div className={styles.colorDot} style={{ background: project.color }} />
        <Badge variant={project.status === 'Active' ? 'active' : 'completed'}>
          {project.status}
        </Badge>
      </div>
      <h3 className={styles.projectName}>{project.name}</h3>
      <p className={styles.projectDesc}>{project.description}</p>
      <div className={styles.progressSection}>
        <div className={styles.progressMeta}>
          <span className={styles.taskCount}>{project.completedTasks}/{project.taskCount} tasks</span>
          <span className={styles.pct}>{pct}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%`, background: project.color }}
          />
        </div>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.createdAt}>Created {project.createdAt}</span>
        <Button variant="ghost" size="sm">Details →</Button>
      </div>
    </Card>
  );
}

export default function Projects() {
  const dispatch = useDispatch();
  const { filter, search, sortBy, sortDir } = useSelector((s) => s.projects);
  const projects = useSelector(selectFilteredProjects);
  const [localSearch, setLocalSearch] = React.useState(search);
  const debounced = useDebounce(localSearch, 300);

  React.useEffect(() => {
    dispatch(setSearch(debounced));
  }, [debounced, dispatch]);

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span style={{ opacity: 0.3 }}>↕</span>;
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className={`${styles.projects} fade-in`}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Input
          placeholder="Search projects..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
        />
        <div className={styles.filters}>
          {['All', 'Active', 'Completed'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => dispatch(setFilter(f))}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.sortBtns}>
          <span className={styles.sortLabel}>Sort:</span>
          {['name', 'taskCount', 'status'].map((field) => (
            <button
              key={field}
              className={`${styles.sortBtn} ${sortBy === field ? styles.sortActive : ''}`}
              onClick={() => dispatch(setSort(field))}
            >
              {field === 'taskCount' ? 'Tasks' : field.charAt(0).toUpperCase() + field.slice(1)}{' '}
              <SortIcon field={field} />
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className={styles.summary}>
        <span className={styles.summaryText}>
          Showing <strong>{projects.length}</strong> project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your search or filter criteria."
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
      ) : (
        <div className={styles.grid}>
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
