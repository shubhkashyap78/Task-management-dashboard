import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.css';

export default function Layout() {
  const { sidebarOpen } = useSelector((s) => s.ui);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={`${styles.main} ${sidebarOpen ? styles.mainShifted : styles.mainCollapsed}`}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
