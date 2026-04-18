import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleTaskStatus,
  deleteTask,
  setFilter,
  setSearch,
  setPage,
  setPageSize,
  selectFilteredTasks,
  selectPaginatedTasks,
} from '../../store/tasksSlice';
import { openModal, closeModal, showNotification } from '../../store/uiSlice';
import { USERS, PROJECTS } from '../../utils/mockData';
import { useDebounce } from '../../hooks';
import { Badge, Button, Input, Select, Modal, EmptyState } from '../common/UI';
import TaskForm from '../forms/TaskForm';
import styles from './Tasks.module.css';

const PRIORITY_COLOR = { High: 'danger', Medium: 'pending', Low: 'info' };

export default function Tasks() {
  const dispatch = useDispatch();
  const { filter, search, currentPage, pageSize } = useSelector((s) => s.tasks);
  const { tasks, totalPages } = useSelector(selectPaginatedTasks);
  const filteredTotal = useSelector(selectFilteredTasks).length;
  const { modal } = useSelector((s) => s.ui);

  const [localSearch, setLocalSearch] = useState(search);
  const debounced = useDebounce(localSearch, 300);

  React.useEffect(() => {
    dispatch(setSearch(debounced));
  }, [debounced, dispatch]);

  const handleToggle = (id) => {
    dispatch(toggleTaskStatus(id));
    dispatch(showNotification({ type: 'success', message: 'Task status updated!' }));
  };

  const handleDelete = (task) => {
    dispatch(openModal({ type: 'confirmDelete', data: task }));
  };

  const confirmDelete = () => {
    dispatch(deleteTask(modal.data.id));
    dispatch(showNotification({ type: 'success', message: 'Task deleted.' }));
    dispatch(closeModal());
  };

  const getUserName = (id) => USERS.find((u) => u.id === id)?.name || 'Unassigned';
  const getProjectName = (id) => PROJECTS.find((p) => p.id === id)?.name || '—';

  const isOverdue = (date) => date && new Date(date) < new Date() && date !== '';

  return (
    <div className={`${styles.tasks} fade-in`}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Input
          placeholder="Search tasks..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
        />
        <div className={styles.filters}>
          {['All', 'Pending', 'Completed'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => dispatch(setFilter(f))}
            >
              {f}
            </button>
          ))}
        </div>
        <Button
          variant="primary"
          size="md"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
          onClick={() => dispatch(openModal({ type: 'addTask', data: null }))}
        >
          Add Task
        </Button>
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <span>{filteredTotal} task{filteredTotal !== 1 ? 's' : ''}</span>
        <Select
          value={pageSize}
          onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
          style={{ width: 'auto', padding: '6px 32px 6px 10px', fontSize: 13 }}
        >
          {[5, 8, 10, 20].map((n) => (
            <option key={n} value={n}>{n} per page</option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="Try adjusting your search or create a new task."
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            }
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const overdue = task.status !== 'Completed' && isOverdue(task.dueDate);
                return (
                  <tr key={task.id} className={`${styles.row} ${task.status === 'Completed' ? styles.rowDone : ''}`}>
                    <td>
                      <button
                        className={`${styles.checkbox} ${task.status === 'Completed' ? styles.checkboxDone : ''}`}
                        onClick={() => handleToggle(task.id)}
                        title="Toggle status"
                      >
                        {task.status === 'Completed' && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td>
                      <span className={`${styles.taskTitle} ${task.status === 'Completed' ? styles.taskTitleDone : ''}`}>
                        {task.title}
                      </span>
                    </td>
                    <td>
                      <span className={styles.projectName}>{getProjectName(task.projectId)}</span>
                    </td>
                    <td>
                      <div className={styles.assignee}>
                        <div className={styles.assigneeAvatar}>
                          {USERS.find((u) => u.id === task.assignedTo)?.avatar || '?'}
                        </div>
                        <span>{getUserName(task.assignedTo)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
                        {overdue && '⚠ '}{task.dueDate || '—'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={PRIORITY_COLOR[task.priority] || 'default'}>
                        {task.priority || '—'}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={task.status === 'Completed' ? 'success' : 'pending'}>
                        {task.status}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dispatch(openModal({ type: 'editTask', data: task }))}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(task)}
                        >
                          Del
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => dispatch(setPage(currentPage - 1))}
          >
            ← Prev
          </Button>
          <div className={styles.pages}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''}`}
                onClick={() => dispatch(setPage(p))}
              >
                {p}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => dispatch(setPage(currentPage + 1))}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={modal?.type === 'addTask'}
        onClose={() => dispatch(closeModal())}
        title="Create New Task"
      >
        <TaskForm onClose={() => dispatch(closeModal())} />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={modal?.type === 'editTask'}
        onClose={() => dispatch(closeModal())}
        title="Edit Task"
      >
        <TaskForm task={modal?.data} onClose={() => dispatch(closeModal())} />
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={modal?.type === 'confirmDelete'}
        onClose={() => dispatch(closeModal())}
        title="Delete Task"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{modal?.data?.title}"</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => dispatch(closeModal())}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
