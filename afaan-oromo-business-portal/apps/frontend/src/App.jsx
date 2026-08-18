import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RoleGuard from '@/routes/RoleGuard';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ROLES } from '@/constants/roles';

// ── Public pages ─────────────────────────────────────────────────
import LandingPage from '@/pages/LandingPage';

// ── Auth pages ──────────────────────────────────────────────────
import LoginPage  from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// ── Shared pages ────────────────────────────────────────────────
import ProfilePage       from '@/pages/shared/ProfilePage';
import NotificationsPage from '@/pages/shared/NotificationsPage';

// ── Business Owner pages ─────────────────────────────────────────
import OwnerDashboard        from '@/pages/owner/OwnerDashboard';
import ApplicationsPage      from '@/pages/owner/ApplicationsPage';
import NewApplicationPage    from '@/pages/owner/NewApplicationPage';
import ApplicationDetailPage from '@/pages/owner/ApplicationDetailPage';
import CorrectionsPage       from '@/pages/owner/CorrectionsPage';
import ApprovalMessagesPage  from '@/pages/owner/ApprovalMessagesPage';

// ── Communication Biro pages ────────────────────────────────────
import CommunicationDashboard from '@/pages/communication/CommunicationDashboard';
import IncomingApplicationsPage from '@/pages/communication/IncomingApplicationsPage';
import MessagesPage from '@/pages/communication/MessagesPage';
import FromTurizmPage from '@/pages/communication/FromTurizmPage';
import FromCommercialPage from '@/pages/communication/FromCommercialPage';

// ── Addaf Turizm Biro pages ─────────────────────────────────────
import TurizmDashboard from '@/pages/turizm/TurizmDashboard';
import TurizmQueuePage from '@/pages/turizm/TurizmQueuePage';
import TurizmReviewDetailPage from '@/pages/turizm/TurizmReviewDetailPage';

// ── Commercial Office pages ─────────────────────────────────────
import CommercialDashboard from '@/pages/commercial/CommercialDashboard';
import CommercialQueuePage from '@/pages/commercial/CommercialQueuePage';
import CommercialReviewDetailPage from '@/pages/commercial/CommercialReviewDetailPage';

// ── Admin pages ──────────────────────────────────────────────────
import AdminDashboard       from '@/pages/admin/AdminDashboard';
import AdminUsersPage       from '@/pages/admin/AdminUsersPage';
import AdminCategoriesPage  from '@/pages/admin/AdminCategoriesPage';
import AdminReservedTerms   from '@/pages/admin/AdminReservedTerms';
import AdminHistoricalNames from '@/pages/admin/AdminHistoricalNames';
import AdminAuditLogs       from '@/pages/admin/AdminAuditLogs';
import AdminSettingsPage    from '@/pages/admin/AdminSettingsPage';

// ── Public pages ─────────────────────────────────────────────────
import PublicBusinessNames from '@/pages/public/PublicBusinessNames';
import PublicVerify        from '@/pages/public/PublicVerify';

// ── Error pages ──────────────────────────────────────────────────
import ForbiddenPage from '@/pages/error/ForbiddenPage';
import NotFoundPage  from '@/pages/error/NotFoundPage';

// ── Layout wrapper for dashboard pages ──────────────────────────
function DashLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

// ── Role-gated layout ────────────────────────────────────────────
function RoleLayout({ roles, children }) {
  return (
    <DashLayout>
      <RoleGuard allowedRoles={roles}>{children}</RoleGuard>
    </DashLayout>
  );
}

import { SettingsProvider } from '@/context/SettingsContext';

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
      <AuthProvider>
        <NotificationProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
              },
              success: { style: { borderColor: '#a7d7b8' } },
              error:   { style: { borderColor: '#fca5a5' } },
            }}
          />

        <Routes>
          {/* ── Root/Landing page ──────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />

          {/* ── Public auth routes ─────────────────────────────── */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Public search / verify ─────────────────────────── */}
          <Route path="/public/business-names" element={<PublicBusinessNames />} />
          <Route path="/public/verify"         element={<PublicVerify />} />

          {/* ─────────────────────────────────────────────────────
              BUSINESS OWNER routes
          ───────────────────────────────────────────────────────── */}
          <Route path="/owner/dashboard"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><OwnerDashboard /></RoleLayout>} />
          <Route path="/owner/applications"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><ApplicationsPage /></RoleLayout>} />
          <Route path="/owner/applications/new"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><NewApplicationPage /></RoleLayout>} />
          <Route path="/owner/applications/:id"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><ApplicationDetailPage /></RoleLayout>} />
          <Route path="/owner/corrections"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><CorrectionsPage /></RoleLayout>} />
          <Route path="/owner/approval-messages"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><ApprovalMessagesPage /></RoleLayout>} />
          <Route path="/owner/notifications"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><NotificationsPage /></RoleLayout>} />
          <Route path="/owner/profile"
            element={<RoleLayout roles={[ROLES.BUSINESS_OWNER]}><ProfilePage /></RoleLayout>} />

          {/* ─────────────────────────────────────────────────────
              COMMUNICATION BIRO routes
          ───────────────────────────────────────────────────────── */}
          <Route path="/communication/dashboard"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><CommunicationDashboard /></RoleLayout>} />
          <Route path="/communication/applications"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><IncomingApplicationsPage /></RoleLayout>} />
          <Route path="/communication/messages"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><MessagesPage /></RoleLayout>} />
          <Route path="/communication/from-turizm"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><FromTurizmPage /></RoleLayout>} />
          <Route path="/communication/from-commercial"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><FromCommercialPage /></RoleLayout>} />
          <Route path="/communication/notifications"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><NotificationsPage /></RoleLayout>} />
          <Route path="/communication/profile"
            element={<RoleLayout roles={[ROLES.FINANCIAL_OFFICER]}><ProfilePage /></RoleLayout>} />

          {/* ─────────────────────────────────────────────────────
              ADDAF TURIZM BIRO routes
          ───────────────────────────────────────────────────────── */}
          <Route path="/turizm/dashboard"
            element={<RoleLayout roles={[ROLES.LANGUAGE_OFFICER]}><TurizmDashboard /></RoleLayout>} />
          <Route path="/turizm/reviews"
            element={<RoleLayout roles={[ROLES.LANGUAGE_OFFICER]}><TurizmQueuePage /></RoleLayout>} />
          <Route path="/turizm/reviews/:id"
            element={<RoleLayout roles={[ROLES.LANGUAGE_OFFICER]}><TurizmReviewDetailPage /></RoleLayout>} />
          <Route path="/turizm/notifications"
            element={<RoleLayout roles={[ROLES.LANGUAGE_OFFICER]}><NotificationsPage /></RoleLayout>} />
          <Route path="/turizm/profile"
            element={<RoleLayout roles={[ROLES.LANGUAGE_OFFICER]}><ProfilePage /></RoleLayout>} />

          {/* ─────────────────────────────────────────────────────
              COMMERCIAL OFFICE routes
          ───────────────────────────────────────────────────────── */}
          <Route path="/commercial/dashboard"
            element={<RoleLayout roles={[ROLES.SENIOR_OFFICER]}><CommercialDashboard /></RoleLayout>} />
          <Route path="/commercial/reviews"
            element={<RoleLayout roles={[ROLES.SENIOR_OFFICER]}><CommercialQueuePage /></RoleLayout>} />
          <Route path="/commercial/reviews/:id"
            element={<RoleLayout roles={[ROLES.SENIOR_OFFICER]}><CommercialReviewDetailPage /></RoleLayout>} />
          <Route path="/commercial/notifications"
            element={<RoleLayout roles={[ROLES.SENIOR_OFFICER]}><NotificationsPage /></RoleLayout>} />
          <Route path="/commercial/profile"
            element={<RoleLayout roles={[ROLES.SENIOR_OFFICER]}><ProfilePage /></RoleLayout>} />

          {/* ─────────────────────────────────────────────────────
              ADMIN routes
          ───────────────────────────────────────────────────────── */}
          <Route path="/admin/dashboard"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminDashboard /></RoleLayout>} />
          <Route path="/admin/users"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminUsersPage /></RoleLayout>} />
          <Route path="/admin/categories"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminCategoriesPage /></RoleLayout>} />
          <Route path="/admin/reserved-terms"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminReservedTerms /></RoleLayout>} />
          <Route path="/admin/historical-names"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminHistoricalNames /></RoleLayout>} />
          <Route path="/admin/audit-logs"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminAuditLogs /></RoleLayout>} />
          <Route path="/admin/settings"
            element={<RoleLayout roles={[ROLES.ADMIN]}><AdminSettingsPage /></RoleLayout>} />
          <Route path="/admin/profile"
            element={<RoleLayout roles={[ROLES.ADMIN]}><ProfilePage /></RoleLayout>} />

          {/* ── Error pages ──────────────────────────────────────── */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*"    element={<NotFoundPage />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
