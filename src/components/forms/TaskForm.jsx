import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../../store/tasksSlice';
import { showNotification } from '../../store/uiSlice';
import { USERS, PROJECTS } from '../../utils/mockData';
import { Input, Select, Button } from '../common/UI';
import styles from './TaskForm.module.css';

const EMPTY_FORM = {
  title: '',
  assignedTo: '',
  dueDate: '',
  status: 'Pending',
  projectId: '',
  priority: 'Medium',
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  else if (form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
  if (!form.assignedTo) errors.assignedTo = 'Please assign a user';
  if (!form.dueDate) errors.dueDate = 'Due date is required';
  if (!form.projectId) errors.projectId = 'Please select a project';
  return errors;
}

export default function TaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        assignedTo: task.assignedTo || '',
        dueDate: task.dueDate || '',
        status: task.status || 'Pending',
        projectId: task.projectId || '',
        priority: task.priority || 'Medium',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // Simulate async

    const payload = {
      ...form,
      assignedTo: Number(form.assignedTo),
      projectId: Number(form.projectId),
    };

    if (task) {
      dispatch(updateTask({ ...task, ...payload }));
      dispatch(showNotification({ type: 'success', message: 'Task updated successfully!' }));
    } else {
      dispatch(addTask(payload));
      dispatch(showNotification({ type: 'success', message: 'Task created successfully!' }));
    }

    setLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Task Title *"
        name="title"
        placeholder="Enter task title..."
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className={styles.row}>
        <Select
          label="Assigned To *"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          error={errors.assignedTo}
        >
          <option value="">Select user...</option>
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
          ))}
        </Select>

        <Select
          label="Project *"
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
          error={errors.projectId}
        >
          <option value="">Select project...</option>
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <div className={styles.row}>
        <Input
          label="Due Date *"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />

        <Select label="Priority" name="priority" value={form.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
      </div>

      <Select label="Status" name="status" value={form.status} onChange={handleChange}>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </Select>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
