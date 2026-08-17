# AOBNAP Frontend — App Flow

## 1. Startup flow (entry point)

```
index.html
  → loads /src/main.jsx
      → imports global.css (once, app-wide)
      → renders <App /> into #root
          → <BrowserRouter>
              → <AuthProvider>          (session/auth state for the whole app)
                  → <Toaster />         (toast notifications)
                  → <Routes>            (all pages, see section 3)
```

`main.jsx` is the only place `global.css` is imported. Every page/component
below it uses its own `*.module.css` file (scoped automatically by Vite),
so styles never leak between components.

## 2. Auth flow

```
App loads
  → AuthProvider checks localStorage for a saved token (utils/storage.js)
      ├─ No token       → loading = false, user = null   → user sees /login
      └─ Token found    → calls GET /api/auth/me
            ├─ Valid    → user = { ...profile, role }    → loading = false
            └─ Invalid  → token cleared, user = null      → loading = false

User submits Login form
  → authService.login(email, password)
  → POST /api/auth/token+profile
  → token saved to storage, user set in context
  → redirected to ROLE_HOME_PATHS[role]:
        BUSINESS_OWNER     → /owner/dashboard
        FINANCIAL_OFFICER  → /financial/dashboard
        LANGUAGE_OFFICER   → /language/dashboard
        SENIOR_OFFICER     → /senior/dashboard
        ADMIN              → /admin/dashboard
```

## 3. Route protection flow (every dashboard route)

Every non-public route is wrapped twice — first "are you logged in", then
"are you allowed here":

```
<Route path="/owner/dashboard" element={
  <ProtectedRoute>              ← 1) must be authenticated
    <DashboardLayout>           ← navbar + role-aware sidebar
      <RoleGuard allowedRoles={['BUSINESS_OWNER']}>   ← 2) must have the right role
        <OwnerDashboard />      ← 3) the actual page
      </RoleGuard>
    </DashboardLayout>
  </ProtectedRoute>
} />
```

- `ProtectedRoute`: while auth is loading → spinner. Not logged in → redirect
  to `/login` (remembers where you came from). Logged in → renders children.
- `RoleGuard`: not logged in → redirect to `/login`. Logged in but wrong role
  → renders the 403 `ForbiddenPage`. Right role → renders the page.

## 4. Page groups (matches App.jsx routing)

```
Public (no login required)
  /login, /signup
  /public/business-names   → search approved names
  /public/verify           → verify a certificate number

Business Owner            /owner/...
  dashboard → applications → applications/new → applications/:id
  corrections, appeals, certificates, notifications, profile

Financial Officer         /financial/...
  dashboard → permissions (queue) → permissions/:id (review)
  notifications, profile

Language Officer          /language/...
  dashboard → reviews (queue) → reviews/:id (review)
  notifications, profile

Senior Officer            /senior/...
  dashboard → appeals → appeals/:id
  notifications, profile

Admin                     /admin/...
  dashboard, users, categories, reserved-terms,
  historical-names, audit-logs, profile

Errors
  /403 (forbidden), /404 and catch-all
```

## 5. Business application state flow (owner side)

```
DRAFT
  → SUBMITTED
      → PERMISSION_PENDING  ──(Financial Officer reviews)──┐
            ├─ PERMISSION_CORRECTION_REQUIRED → owner fixes → back to PERMISSION_PENDING
            ├─ PERMISSION_REJECTED → owner may appeal
            └─ PERMISSION_APPROVED
                  → LANGUAGE_REVIEW_PENDING ──(Language Officer reviews)──┐
                        ├─ LANGUAGE_CORRECTION_REQUIRED → owner fixes → back to review
                        ├─ LANGUAGE_REJECTED → owner may appeal
                        └─ APPROVED → certificate issued

Appeal flow (on PERMISSION_REJECTED / LANGUAGE_REJECTED)
  APPEAL_SUBMITTED → APPEAL_UNDER_REVIEW → APPEAL_APPROVED or APPEAL_REJECTED
  (reviewed by Senior Officer)
```

This mirrors the requirements doc — the frontend only *displays* this state
machine and disables actions that don't make sense yet (e.g. Language
Officer can't approve until Financial permission is approved); the backend
is still the source of truth that enforces it.
