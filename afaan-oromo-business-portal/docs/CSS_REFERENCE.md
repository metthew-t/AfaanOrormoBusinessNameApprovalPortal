# AOBNAP Frontend — CSS Reference (all styles, one file, kept individual per component)

This file lists every CSS file in the project. Each file's content is kept **separate** (under its own heading) — nothing is merged or renamed. This is a read-only reference for reviewing all styles in one place; the actual project still uses the individual `.module.css` files next to each component.

---

## main.jsx (entry point)
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/global.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## `src/assets/styles/global.css`
```css
/* ─── AOBNAP Global Stylesheet ─────────────────────────────────── */

/* CSS Custom Properties */
:root {
  /* Brand Colors */
  --color-primary:        #1a6b3c;
  --color-primary-dark:   #134f2d;
  --color-primary-light:  #e8f5ee;
  --color-primary-mid:    #2d8a52;

  /* Accent */
  --color-accent:         #c8993a;
  --color-accent-light:   #fdf3e0;

  /* Neutrals */
  --color-white:          #ffffff;
  --color-bg:             #f5f7f5;
  --color-surface:        #ffffff;
  --color-border:         #e0e6e1;
  --color-border-light:   #f0f4f1;

  /* Text */
  --color-text-primary:   #1a2e1f;
  --color-text-secondary: #4a5e50;
  --color-text-muted:     #7a9080;
  --color-text-light:     #a8bcad;

  /* Status */
  --color-success:        #1a6b3c;
  --color-success-bg:     #e8f5ee;
  --color-warning:        #b45309;
  --color-warning-bg:     #fef3c7;
  --color-danger:         #b91c1c;
  --color-danger-bg:      #fef2f2;
  --color-info:           #1d4ed8;
  --color-info-bg:        #eff6ff;
  --color-neutral:        #4b5563;
  --color-neutral-bg:     #f3f4f6;
  --color-orange:         #c2410c;
  --color-orange-bg:      #fff7ed;

  /* Sidebar */
  --sidebar-width:        260px;
  --sidebar-bg:           #0f3d22;
  --sidebar-text:         #c8dbd0;
  --sidebar-text-active:  #ffffff;
  --sidebar-item-active:  #1a6b3c;
  --sidebar-hover:        rgba(255,255,255,0.07);

  /* Navbar */
  --navbar-height:        64px;
  --navbar-bg:            #ffffff;
  --navbar-border:        #e0e6e1;

  /* Shadows */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-lg:  0 10px 30px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05);
  --shadow-xl:  0 20px 60px rgba(0,0,0,0.12);

  /* Border Radius */
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  14px;
  --radius-xl:  20px;
  --radius-full: 9999px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs:   11px;
  --font-size-sm:   13px;
  --font-size-base: 14px;
  --font-size-md:   15px;
  --font-size-lg:   17px;
  --font-size-xl:   20px;
  --font-size-2xl:  24px;
  --font-size-3xl:  30px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* Z-Index */
  --z-sidebar:  200;
  --z-navbar:   300;
  --z-dropdown: 400;
  --z-modal:    500;
  --z-toast:    600;
}

/* ─── Reset ────────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 14px;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

ul, ol {
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
}

/* ─── Scrollbar ─────────────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-full);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-light);
}

/* ─── Focus Styles ──────────────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ─── Utility Classes ───────────────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.w-full { width: 100%; }

/* ─── Page Wrapper ──────────────────────────────────────────────── */
.page-content {
  padding: var(--space-6);
  max-width: 1400px;
}

/* ─── Page Header ───────────────────────────────────────────────── */
.page-header {
  margin-bottom: var(--space-6);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-header p {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-top: 4px;
}

/* ─── Card ──────────────────────────────────────────────────────── */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.card-header h2,
.card-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.card-body {
  padding: var(--space-6);
}

/* ─── Stats Grid ─────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  transition: box-shadow var(--transition-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.stat-card__info { flex: 1; min-width: 0; }

.stat-card__value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* ─── Table ──────────────────────────────────────────────────────── */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.data-table thead th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);
}

.data-table tbody tr:hover {
  background: var(--color-primary-light);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table tbody td {
  padding: var(--space-4);
  vertical-align: middle;
  color: var(--color-text-primary);
}

/* ─── Form ───────────────────────────────────────────────────────── */
.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.form-label .required {
  color: var(--color-danger);
  margin-left: 2px;
}

.form-control {
  display: block;
  width: 100%;
  padding: 10px 14px;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

.form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26, 107, 60, 0.12);
}

.form-control.error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
}

.form-control:disabled {
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.form-error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 5px;
}

/* ─── Modal Overlay ──────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
  animation: fadeIn var(--transition-fast);
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp var(--transition-base);
}

.modal-lg { max-width: 720px; }
.modal-sm { max-width: 380px; }

.modal-header {
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* ─── Animations ─────────────────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* ─── Skeleton Loader ───────────────────────────────────────────── */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    var(--color-border) 50%,
    var(--color-border-light) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.6s infinite linear;
  border-radius: var(--radius-sm);
}

.skeleton-text { height: 14px; margin-bottom: 8px; }
.skeleton-title { height: 20px; width: 60%; margin-bottom: 16px; }
.skeleton-card { height: 100px; border-radius: var(--radius-lg); }

/* ─── Alert ──────────────────────────────────────────────────────── */
.alert {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  line-height: 1.5;
}

.alert-success { background: var(--color-success-bg); color: var(--color-success); border: 1px solid #a7d7b8; }
.alert-warning { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid #fcd34d; }
.alert-danger  { background: var(--color-danger-bg);  color: var(--color-danger);  border: 1px solid #fca5a5; }
.alert-info    { background: var(--color-info-bg);    color: var(--color-info);    border: 1px solid #bfdbfe; }

/* ─── Badge ──────────────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.badge-success  { background: var(--color-success-bg); color: var(--color-success); }
.badge-warning  { background: var(--color-warning-bg); color: var(--color-warning); }
.badge-danger   { background: var(--color-danger-bg);  color: var(--color-danger);  }
.badge-info     { background: var(--color-info-bg);    color: var(--color-info);    }
.badge-neutral  { background: var(--color-neutral-bg); color: var(--color-neutral); }
.badge-orange   { background: var(--color-orange-bg);  color: var(--color-orange);  }
.badge-primary  { background: var(--color-primary-light); color: var(--color-primary); }

/* ─── Empty State ────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  color: var(--color-text-muted);
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.empty-state__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.empty-state__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-5);
}

/* ─── Error State ────────────────────────────────────────────────── */
.error-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.error-state__icon { font-size: 48px; margin-bottom: var(--space-4); }
.error-state__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.error-state__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-5);
}

/* ─── Timeline ───────────────────────────────────────────────────── */
.timeline {
  position: relative;
  padding-left: var(--space-8);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--color-border);
}

.timeline-item {
  position: relative;
  padding-bottom: var(--space-6);
}

.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-dot.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.timeline-dot.completed {
  border-color: var(--color-success);
  background: var(--color-success);
}

.timeline-dot.error {
  border-color: var(--color-danger);
  background: var(--color-danger);
}

.timeline-item__title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.timeline-item__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* ─── Divider ────────────────────────────────────────────────────── */
.divider {
  height: 1px;
  background: var(--color-border-light);
  margin: var(--space-5) 0;
}

/* ─── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-content {
    padding: var(--space-4);
  }

  .modal {
    margin: var(--space-2);
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

## `src/components/ui/Button.module.css`
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  text-decoration: none;
  outline: none;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ── Sizes ──────────────────────────────────────────────────────── */
.sm { padding: 6px 14px;  font-size: var(--font-size-xs); }
.md { padding: 10px 20px; font-size: var(--font-size-sm); }
.lg { padding: 13px 28px; font-size: var(--font-size-base); }

/* ── Variants ────────────────────────────────────────────────────── */
.primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 1px 3px rgba(26,107,60,0.3);
}
.primary:hover:not(:disabled) { background: var(--color-primary-dark); }

.secondary {
  background: white;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
}
.secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.danger {
  background: var(--color-danger);
  color: white;
}
.danger:hover:not(:disabled) { background: #991b1b; }

.ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  box-shadow: none;
}
.ghost:hover:not(:disabled) {
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.success {
  background: var(--color-success);
  color: white;
}
.success:hover:not(:disabled) { background: #14532d; }

.warning {
  background: var(--color-warning);
  color: white;
}
.warning:hover:not(:disabled) { background: #92400e; }

/* ── States ─────────────────────────────────────────────────────── */
.btn:disabled,
.loading {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

.fullWidth { width: 100%; }

/* ── Icon helpers ────────────────────────────────────────────────── */
.iconLeft,
.iconRight {
  display: inline-flex;
  align-items: center;
  font-size: 1.1em;
}

/* ── Spinner ─────────────────────────────────────────────────────── */
.spinner {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.secondary .spinner,
.ghost .spinner {
  border-color: rgba(0,0,0,0.15);
  border-top-color: var(--color-primary);
}

@keyframes spin { to { transform: rotate(360deg); } }
```

## `src/components/ui/Card.module.css`
```css
.card { }
.noPadding .card-body { padding: 0; }
```

## `src/components/ui/FileUpload.module.css`
```css
.wrapper { display: flex; flex-direction: column; gap: 6px; }

.label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg);
}

.dropzone:hover, .dragging {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.hasError {
  border-color: var(--color-danger);
}

.uploadIcon { font-size: 32px; display: block; margin-bottom: 8px; }

.dropText {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.fileTypes {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.hiddenInput {
  display: none;
}

/* Existing file preview */
.filePreview {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-light);
  border: 1.5px solid #a7d7b8;
  border-radius: var(--radius-md);
}

.fileIcon { font-size: 24px; flex-shrink: 0; }

.fileInfo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.fileName {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fileSize {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.progressWrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.progressBar {
  flex: 1;
  height: 6px;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progressText {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}

.removeBtn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 14px;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
  flex-shrink: 0;
}
.removeBtn:hover { color: var(--color-danger); }

.error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}
```

## `src/components/ui/Input.module.css`
```css
.group { display: flex; flex-direction: column; width: 100%; }

.label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.required { color: var(--color-danger); margin-left: 2px; }

.inputWrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
  font-family: var(--font-sans);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26,107,60,0.12);
}

.hasError .input {
  border-color: var(--color-danger);
}

.hasError .input:focus {
  box-shadow: 0 0 0 3px rgba(185,28,28,0.10);
}

.input:disabled {
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.hasIcon  { padding-left: 40px; }
.hasSuffix{ padding-right: 44px; }

.iconLeft {
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  font-size: 16px;
  pointer-events: none;
  z-index: 1;
}

.suffix, .toggle {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  font-size: 16px;
  z-index: 1;
}

.toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: color var(--transition-fast);
  line-height: 1;
}

.toggle:hover { color: var(--color-primary); }

.error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  margin-top: 5px;
}

.hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 5px;
}
```

## `src/components/ui/LoadingSpinner.module.css`
```css
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.centered {
  display: flex;
  width: 100%;
  padding: 40px 0;
}

.ring {
  display: block;
  border-radius: 50%;
  border-style: solid;
  border-color: var(--color-border) var(--color-border) var(--color-border) var(--color-primary);
  animation: spin 0.75s linear infinite;
}

.sm .ring { width: 18px; height: 18px; border-width: 2px; }
.md .ring { width: 28px; height: 28px; border-width: 3px; }
.lg .ring { width: 44px; height: 44px; border-width: 4px; }

@keyframes spin { to { transform: rotate(360deg); } }
```

## `src/components/ui/NotificationBell.module.css`
```css
.wrapper { position: relative; }

.bell {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
  color: var(--color-text-secondary);
}

.bell:hover { background: var(--color-bg); }

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--color-danger);
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 340px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  animation: fadeIn 0.15s ease;
  overflow: hidden;
}

.dropHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--color-border-light);
}

.dropTitle {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.markAll {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 500;
}

.list {
  max-height: 320px;
  overflow-y: auto;
}

.empty {
  text-align: center;
  padding: 32px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
  font-family: var(--font-sans);
}

.item:hover { background: var(--color-bg); }
.unread { background: var(--color-primary-light); }
.unread:hover { background: #d8eddf; }

.typeIcon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.content { flex: 1; min-width: 0; }

.itemTitle {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.itemMsg {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.itemTime {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 3px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  margin-top: 4px;
  flex-shrink: 0;
}

.dropFooter {
  padding: 10px;
  border-top: 1px solid var(--color-border-light);
  text-align: center;
}

.viewAll {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 500;
  width: 100%;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.viewAll:hover { background: var(--color-primary-light); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; } }
```

## `src/components/ui/Pagination.module.css`
```css
.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-light);
}

.btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background: white;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.active:hover { background: var(--color-primary-dark); }
```

## `src/components/ui/ProfileMenu.module.css`
```css
.wrapper { position: relative; }

.trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

.trigger:hover {
  background: var(--color-bg);
  border-color: var(--color-primary);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 700;
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}

.name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.role {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.chevron {
  font-size: 10px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* ── Dropdown ──────────────────────────────────────────────────── */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  animation: fadeIn 0.15s ease;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.avatarLg {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  font-weight: 700;
  flex-shrink: 0;
}

.headerName {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.headerEmail {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.roleBadge { font-size: 10px; }

.divider {
  height: 1px;
  background: var(--color-border-light);
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 16px;
  background: none;
  border: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-sans);
  transition: background var(--transition-fast);
}

.menuItem:hover { background: var(--color-bg); color: var(--color-text-primary); }

.logout { color: var(--color-danger); }
.logout:hover { background: var(--color-danger-bg); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; } }
```

## `src/components/ui/Select.module.css`
```css
.select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 36px;
  cursor: pointer;
}

.arrow {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: var(--color-text-muted);
  font-size: 12px;
}
```

## `src/components/ui/Skeleton.module.css`
```css
.group { display: flex; flex-direction: column; gap: 8px; }

.line { border-radius: 4px; }

.tableWrap { width: 100%; }

.tableRow {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.cell {
  flex: 1;
  border-radius: 4px;
}
```

## `src/components/ui/Textarea.module.css`
```css
.textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
}
```

## `src/layouts/DashboardLayout.module.css`
```css
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
  position: relative;
}

/* Main area: pushes right of the fixed sidebar */
.main {
  flex: 1;
  min-width: 0;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: var(--space-6);
  overflow-x: hidden;
}

/* Mobile overlay behind drawer */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: calc(var(--z-sidebar) - 1);
  animation: fadeIn 0.2s ease;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .main {
    margin-left: 0;
  }
  .content {
    padding: var(--space-4);
  }
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

## `src/layouts/Navbar.module.css`
```css
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-navbar);
  height: var(--navbar-height);
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--navbar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  gap: var(--space-4);
  box-shadow: var(--shadow-sm);
}

/* ── Left ──────────────────────────────────────────────────────── */
.left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.menuBtn {
  display: none;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background var(--transition-fast);
  flex-shrink: 0;
}

.menuBtn:hover { background: var(--color-bg); }

.titleWrap {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.logoText {
  font-size: var(--font-size-base);
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}

.titleSep {
  color: var(--color-border);
  font-size: 18px;
  font-weight: 300;
}

.pageTitle {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Right ─────────────────────────────────────────────────────── */
.right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .menuBtn {
    display: flex;
  }
  .logoText {
    font-size: var(--font-size-sm);
  }
  .pageTitle {
    font-size: var(--font-size-sm);
    max-width: 140px;
  }
}

@media (max-width: 480px) {
  .navbar { padding: 0 var(--space-4); }
  .titleSep { display: none; }
  .pageTitle { display: none; }
}
```

## `src/layouts/Sidebar.module.css`
```css
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sidebar);
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform var(--transition-base);
}

/* ── Brand ──────────────────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 18px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.brandIcon {
  font-size: 26px;
  flex-shrink: 0;
}

.brandText {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brandName {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.08em;
  line-height: 1.2;
}

.brandSub {
  font-size: 10px;
  font-weight: 400;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 2px;
}

.closeBtn {
  display: none;
  margin-left: auto;
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  line-height: 1;
  flex-shrink: 0;
  transition: color var(--transition-fast);
}
.closeBtn:hover { color: white; }

/* ── Nav ────────────────────────────────────────────────────────── */
.nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.navItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--sidebar-text);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.navItem:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-text-active);
  text-decoration: none;
}

.navItem.active {
  background: var(--sidebar-item-active);
  color: var(--sidebar-text-active);
  font-weight: 600;
}

.itemIcon {
  font-size: 17px;
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  filter: grayscale(20%);
}

.itemLabel {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 6px 12px;
}

/* ── Footer ─────────────────────────────────────────────────────── */
.footer {
  padding: 10px 10px 20px;
  border-top: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.logoutBtn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-sans);
  transition: all var(--transition-fast);
}

.logoutBtn:hover {
  background: rgba(185,28,28,0.18);
  color: #fca5a5;
}

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: var(--shadow-xl);
  }

  .open {
    transform: translateX(0);
  }

  .closeBtn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

## `src/pages/auth/AuthPage.module.css`
```css
/* ── Auth page wrapper ───────────────────────────────────────────── */
.page {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg);
}

/* ── Left panel ──────────────────────────────────────────────────── */
.left {
  width: 420px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-10) var(--space-8);
}

.brandBox {
  text-align: left;
  max-width: 320px;
}

.brandIcon {
  font-size: 48px;
  margin-bottom: var(--space-4);
}

.brandName {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.brandFull {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
  margin-bottom: 4px;
}

.brandSub {
  font-size: var(--font-size-sm);
  color: rgba(255,255,255,0.45);
  margin-bottom: var(--space-8);
}

.featureList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featureItem {
  font-size: var(--font-size-sm);
  color: rgba(255,255,255,0.65);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Right panel ─────────────────────────────────────────────────── */
.right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
  overflow-y: auto;
}

.formCard {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.formHeader { }

.formTitle {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.formSub {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.formRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.forgotRow {
  display: flex;
  justify-content: flex-end;
  margin-top: -8px;
}

.forgotLink {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: 500;
}

.divider {
  text-align: center;
  position: relative;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.divider::before {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  position: relative;
  background: var(--color-bg);
  padding: 0 12px;
}

.signupLink {
  display: block;
  text-align: center;
  padding: 11px 20px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.signupLink:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
  text-decoration: none;
}

/* ── Demo credentials ────────────────────────────────────────────── */
.demoBox {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.demoTitle {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-3);
}

.demoGrid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.demoNote {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.demoNote code {
  background: white;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  font-size: 11px;
}

/* ── Success card ────────────────────────────────────────────────── */
.successCard {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  text-align: center;
  max-width: 420px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.successIcon {
  width: 64px;
  height: 64px;
  background: var(--color-success-bg);
  color: var(--color-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}

.successCard h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.successCard p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .left { display: none; }
  .right { padding: var(--space-6) var(--space-4); }
}

@media (max-width: 560px) {
  .formRow { grid-template-columns: 1fr; }
  .formCard { max-width: 100%; }
}
```

## `src/pages/error/ErrorPages.module.css`
```css
.errorPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-6);
}

.errorContent {
  text-align: center;
  max-width: 480px;
}

.errorCode {
  font-size: 96px;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-4);
  opacity: 0.15;
}

.errorTitle {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.errorText {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-8);
}

.errorActions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

.primaryBtn {
  padding: 11px 28px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.primaryBtn:hover {
  background: var(--color-primary-dark);
}

.secondaryBtn {
  padding: 11px 28px;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.secondaryBtn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

## `src/pages/owner/AppealsPage.module.css`
```css
.page { max-width: 860px; }
.header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap;
}
.header h1 { font-size: var(--font-size-2xl); font-weight: 700; }
.header p  { color: var(--color-text-secondary); margin-top: 4px; }
.list { display: flex; flex-direction: column; gap: var(--space-4); }
.appealHeader {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: var(--space-4); margin-bottom: var(--space-4);
}
.appealHeader h3 { font-size: var(--font-size-lg); font-weight: 700; }
.appealHeader p  { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.appealGrid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4); margin-bottom: var(--space-4);
}
.metaLabel {
  font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;
}
.reasonBox {
  background: var(--color-bg); border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md); padding: var(--space-4);
  font-size: var(--font-size-sm); color: var(--color-text-primary); line-height: 1.6;
}
.decisionBox { background: var(--color-info-bg); border-color: #bfdbfe; margin-top: var(--space-3); }
@media (max-width: 640px) { .appealGrid { grid-template-columns: 1fr 1fr; } }
```

## `src/pages/owner/ApplicationDetailPage.module.css`
```css
.page { max-width: 1200px; }
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.header h1 { font-size: var(--font-size-2xl); font-weight: 700; margin-top: 4px; }
.header p  { color: var(--color-text-muted); font-size: var(--font-size-sm); margin-top: 2px; }
.headerRight {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  flex-shrink: 0;
}
.backBtn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  margin-bottom: 4px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-5);
  align-items: start;
}

.mainCol { display: flex; flex-direction: column; }
.sideCol { position: sticky; top: calc(var(--navbar-height) + 16px); }

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.docCard {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .sideCol { position: static; }
  .infoGrid { grid-template-columns: 1fr; }
}
```

## `src/pages/owner/ApplicationsPage.module.css`
```css
.page { max-width: 1200px; }
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.header h1 { font-size: var(--font-size-2xl); font-weight: 700; }
.header p  { color: var(--color-text-secondary); margin-top: 4px; }

.filters {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  flex-wrap: wrap;
}

.searchInput {
  flex: 1;
  min-width: 200px;
  padding: 9px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color var(--transition-fast);
}
.searchInput:focus { border-color: var(--color-primary); }

.filterSelect { min-width: 180px; flex-shrink: 0; }
```

## `src/pages/owner/CertificatesPage.module.css`
```css
.page { max-width: 1100px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-5);
}
.certCard { overflow: hidden; }
.certPreview {
  background: linear-gradient(135deg, var(--sidebar-bg) 0%, var(--color-primary) 100%);
  padding: var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.previewLogo { font-size: 36px; }
.previewGov {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.previewTitle {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}
.previewPortal {
  font-size: var(--font-size-xs);
  color: rgba(255,255,255,0.6);
}
.certDetails { flex: 1; }
.certName {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}
.certGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.statusRow { margin-bottom: var(--space-4); }
.certActions { display: flex; flex-direction: column; gap: var(--space-3); align-items: flex-start; }
.qrCode {
  width: 80px;
  height: 80px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
```

## `src/pages/owner/CorrectionsPage.module.css`
```css
.page { max-width: 860px; }
.list { display: flex; flex-direction: column; gap: var(--space-4); }
.corrHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.corrHeader h3 { font-size: var(--font-size-lg); font-weight: 700; }
.corrHeader p  { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 2px; }
.corrActions { display: flex; align-items: center; gap: var(--space-3); }
.reasonBox {
  background: var(--color-warning-bg);
  border: 1px solid #fcd34d;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}
.reasonLabel {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-warning);
  margin-bottom: 6px;
}
.reasonText { font-size: var(--font-size-sm); color: var(--color-text-primary); line-height: 1.6; }
.corrMeta {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  flex-wrap: wrap;
}
.viewApp {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  margin-left: auto;
}
.modalBody { display: flex; flex-direction: column; gap: var(--space-3); }
```

## `src/pages/owner/NewApplicationPage.module.css`
```css
.page { max-width: 860px; }
.header { margin-bottom: var(--space-6); }
.header h1 { font-size: var(--font-size-2xl); font-weight: 700; }
.header p  { color: var(--color-text-secondary); margin-top: 4px; }

/* ── Stepper ─────────────────────────────────────────────────────── */
.stepper {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: var(--space-6);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.stepItem {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  position: relative;
}

.stepItem:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -8px;
  color: var(--color-text-light);
  font-size: 14px;
}

.stepCircle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.stepActive .stepCircle {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.stepDone .stepCircle {
  background: var(--color-success-bg);
  border-color: var(--color-success);
  color: var(--color-success);
}

.stepLabel {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.stepActive .stepLabel {
  color: var(--color-text-primary);
  font-weight: 600;
}

.stepDone .stepLabel {
  color: var(--color-success);
}

/* ── Step content ────────────────────────────────────────────────── */
.stepContent { display: flex; flex-direction: column; gap: var(--space-5); }

.stepTitle {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-light);
}

.stepDesc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.stepFooter {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

/* ── Validation ──────────────────────────────────────────────────── */
.nameToValidate {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}
.nameLabel { font-size: var(--font-size-sm); color: var(--color-text-muted); font-weight: 500; }
.nameValue { font-size: var(--font-size-base); font-weight: 600; color: var(--color-text-primary); }

.validationResults {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.validationHeader {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.validPass { background: var(--color-success-bg); color: var(--color-success); }
.validFail { background: var(--color-danger-bg);  color: var(--color-danger);  }

.checkItem {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--color-border-light);
}

.checkPass { color: var(--color-success); }
.checkFail { color: var(--color-danger); }

.revalidate {
  display: block;
  width: 100%;
  padding: var(--space-3);
  background: none;
  border: none;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  text-align: center;
  transition: background var(--transition-fast);
}
.revalidate:hover { background: var(--color-primary-light); }

/* ── Review grid ─────────────────────────────────────────────────── */
.reviewGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .formGrid, .reviewGrid { grid-template-columns: 1fr; }
  .stepLabel { display: none; }
}
```

## `src/pages/owner/OwnerDashboard.module.css`
```css
.page { max-width: 1200px; }
.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-5);
}
```

## `src/pages/shared/NotificationsPage.module.css`
```css
.page { max-width: 760px; }

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.header h1 { font-size: var(--font-size-2xl); font-weight: 700; }
.header p  { color: var(--color-text-secondary); margin-top: 4px; font-size: var(--font-size-sm); }

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background var(--transition-fast);
  font-family: var(--font-sans);
}

.item:last-child { border-bottom: none; }
.item:hover { background: var(--color-bg); }
.unread { background: var(--color-primary-light); }
.unread:hover { background: #d8eddf; }

.typeIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.content { flex: 1; min-width: 0; }

.titleRow {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: 4px;
}

.title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
}

.message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
}
```

## `src/pages/shared/ProfilePage.module.css`
```css
.page { max-width: 1100px; }

.header { margin-bottom: var(--space-6); }
.header h1 { font-size: var(--font-size-2xl); font-weight: 700; }
.header p  { color: var(--color-text-secondary); margin-top: 4px; }

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-6);
  align-items: start;
}

/* ── Avatar card ─────────────────────────────────────────────────── */
.avatarCard {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-2);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.userName {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.userEmail {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.roleBadge { margin-top: var(--space-2); }

.statusRow { margin-top: var(--space-1); }

.metaList {
  width: 100%;
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border-top: 1px solid var(--color-border-light);
  padding-top: var(--space-4);
}

.metaItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.metaLabel {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metaValue {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: 500;
}

/* ── Tab card ────────────────────────────────────────────────────── */
.tabCard {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg);
}

.tab {
  padding: 14px 24px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

.tab:hover { color: var(--color-primary); }

.activeTab {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background: white;
  font-weight: 600;
}

.tabContent { padding: var(--space-6); }

.fieldGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}

.fieldGroup { display: flex; flex-direction: column; gap: 6px; }

.fieldLabel {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.fieldValue {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.fieldNote {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.pwFields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 420px;
  margin-bottom: var(--space-6);
}

.actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .fieldGrid { grid-template-columns: 1fr; }
}
```

