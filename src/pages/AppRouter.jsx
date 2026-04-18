import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { Spinner } from '../components/common/UI';

const Dashboard = lazy(() => import('../components/dashboard/Dashboard'));
const Projects = lazy(() => import('../components/projects/Projects'));
const Tasks = lazy(() => import('../components/tasks/Tasks'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Spinner />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<Spinner />}>
                <Projects />
              </Suspense>
            }
          />
          <Route
            path="tasks"
            element={
              <Suspense fallback={<Spinner />}>
                <Tasks />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
