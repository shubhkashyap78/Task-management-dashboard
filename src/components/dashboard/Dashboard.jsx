import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTodosFromAPI } from '../../store/tasksSlice';
import { USERS } from '../../utils/mockData';
import { Card, Badge, Button, SkeletonCard } from '../common/UI';
import styles from './Dashboard.module.css';

function StatCard({ title, value, icon, color, sub }) {
  return (
    <Card className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statTitle}>{title}</span>
        <div className={styles.statIcon} style={{ background: `${color}20`, color }}>
          {icon}
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </Card>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: tasks, loading, apiLoaded } = useSelector((s) => s.tasks);
  const { items: projects } = useSelector((s) => s.projects);

  useEffect(() => {
    if (!apiLoaded) dispatch(fetchTodosFromAPI());
  }, [dispatch, apiLoaded]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Active').length;

  const recentTasks = [...tasks]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 5);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`${styles.dashboard} fade-in`}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Projects"
              value={totalProjects}
              color="#6366f1"
              sub={`${activeProjects} active`}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
            />
            <StatCard
              title="Total Tasks"
              value={totalTasks}
              color="#3b82f6"
              sub="Across all projects"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
            />
            <StatCard
              title="Completed Tasks"
              value={completedTasks}
              color="#10b981"
              sub={`${completionRate}% completion rate`}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
            />
            <StatCard
              title="Pending Tasks"
              value={pendingTasks}
              color="#f59e0b"
              sub="Needs attention"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
            />
          </>
        )}
      </div>

      {/* Progress + Recent */}
      <div className={styles.mainGrid}>
        {/* Project Progress */}
        <Card className={styles.projectProgress}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>View all</Button>
          </div>
          <div className={styles.projectList}>
            {projects.slice(0, 5).map((p) => {
              const pct = p.taskCount > 0 ? Math.round((p.completedTasks / p.taskCount) * 100) : 0;
              return (
                <div key={p.id} className={styles.projectRow}>
                  <div className={styles.projectDot} style={{ background: p.color }} />
                  <div className={styles.projectInfo}>
                    <div className={styles.projectMeta}>
                      <span className={styles.projectName}>{p.name}</span>
                      <span className={styles.projectPct}>{pct}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${pct}%`, background: p.color }}
                      />
                    </div>
                  </div>
                  <Badge variant={p.status === 'Active' ? 'active' : 'completed'}>
                    {p.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card className={styles.recentTasks}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Tasks</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>View all</Button>
          </div>
          <div className={styles.taskList}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.taskRow}>
                    <div className={`skeleton`} style={{ width: 20, height: 20, borderRadius: 6 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 14, marginBottom: 6, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 11, width: '50%', borderRadius: 4 }} />
                    </div>
                  </div>
                ))
              : recentTasks.map((task) => {
                  const user = USERS.find((u) => u.id === task.assignedTo);
                  return (
                    <div key={task.id} className={styles.taskRow}>
                      <div
                        className={styles.taskCheck}
                        style={task.status === 'Completed' ? { background: 'var(--success)', borderColor: 'var(--success)' } : {}}
                      >
                        {task.status === 'Completed' && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.taskInfo}>
                        <span className={`${styles.taskTitle} ${task.status === 'Completed' ? styles.taskDone : ''}`}>
                          {task.title}
                        </span>
                        <span className={styles.taskMeta}>
                          {user?.name || 'Unassigned'} · {task.dueDate}
                        </span>
                      </div>
                      <Badge variant={task.status === 'Completed' ? 'success' : 'pending'}>
                        {task.status}
                      </Badge>
                    </div>
                  );
                })}
          </div>
        </Card>
      </div>

      {/* Team */}
      <Card>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Team Members</h2>
        </div>
        <div className={styles.teamGrid}>
          {USERS.map((user) => {
            const assigned = tasks.filter((t) => t.assignedTo === user.id).length;
            const done = tasks.filter((t) => t.assignedTo === user.id && t.status === 'Completed').length;
            return (
              <div key={user.id} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{user.avatar}</div>
                <div className={styles.teamName}>{user.name}</div>
                <div className={styles.teamRole}>{user.role}</div>
                <div className={styles.teamStats}>
                  <span>{done}/{assigned} tasks</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
