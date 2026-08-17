import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ForbiddenPage from '@/pages/error/ForbiddenPage';

/**
 * Restricts access to routes based on user role.
 *
 * Usage:
 *   <RoleGuard allowedRoles={['BUSINESS_OWNER']}>
 *     <OwnerDashboard />
 *   </RoleGuard>
 *
 * If the user's role is not in `allowedRoles`, renders the 403 page.
 */
export default function RoleGuard({ allowedRoles = [], children }) {
  const { role, isAuthenticated, homePath } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <ForbiddenPage />;
  }

  return children;
}
