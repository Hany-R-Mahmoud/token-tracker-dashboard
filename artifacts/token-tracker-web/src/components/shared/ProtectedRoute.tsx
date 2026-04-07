import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth, canAccess } from '@/lib/auth';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  resource?: string;
}

/**
 * ProtectedRoute guards a route behind authentication and optional RBAC.
 *
 * v1 — single admin account, so isAuthenticated is always true.
 * Future (v2+): connect to real auth provider, check roles against RBAC table.
 *
 * Usage:
 *   <ProtectedRoute requiredRole="admin" resource="admin-panel">
 *     <AdminPage />
 *   </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredRole = 'viewer',
  resource = 'dashboard',
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to a future login page
    return <Redirect to="/login" />;
  }

  // RBAC check — currently always passes in v1
  if (!canAccess(user.role, resource)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 12,
        padding: 40,
      }}>
        <div style={{
          fontSize: 13,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          color: 'var(--tt-critical-text)',
        }}>
          Access Denied
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--tt-text-muted)',
          fontFamily: "'Manrope', sans-serif",
          textAlign: 'center',
          maxWidth: 360,
        }}>
          You do not have the required role ({requiredRole}) to access this page.
          Contact your admin to request elevated access.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
