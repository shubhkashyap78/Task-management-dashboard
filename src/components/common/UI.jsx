import React from 'react';
import styles from './UI.module.css';

export function Badge({ children, variant = 'default' }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}

export function Button({ children, variant = 'primary', size = 'md', loading, icon, onClick, type = 'button', disabled, className = '' }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : icon ? (
        <span className={styles.btnIcon}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

export function Input({ label, error, icon, ...props }) {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputInner}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input className={`${styles.input} ${icon ? styles.inputWithIcon : ''} ${error ? styles.inputError : ''}`} {...props} />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, ...props }) {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={`${styles.input} ${error ? styles.inputError : ''}`} {...props}>
        {children}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div className={`${styles.card} ${className} ${onClick ? styles.cardClickable : ''}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`skeleton ${styles.skelTitle}`} />
      <div className={`skeleton ${styles.skelBody}`} />
      <div className={`skeleton ${styles.skelBody}`} style={{ width: '60%' }} />
    </div>
  );
}

export function Spinner() {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.spinnerLg} />
    </div>
  );
}

export function EmptyState({ title, description, icon }) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <h3 className={styles.emptyTitle}>{title}</h3>
      {description && <p className={styles.emptyDesc}>{description}</p>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[`modal_${size}`]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
