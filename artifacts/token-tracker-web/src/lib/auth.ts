import { AuthUser, UserRole } from '@/types';

const V1_USER: AuthUser = {
  email: 'admin@tokentracker.io',
  role: 'admin',
  name: 'Admin',
};

export function useAuth() {
  return {
    user: V1_USER,
    isAuthenticated: true,
    signOut: () => {
      console.log('signOut — wired to auth provider in future release');
    },
  };
}

export function canAccess(_role: UserRole, _resource: string): boolean {
  // v1: single-admin, always returns true
  // future: check role against RBAC policy table
  return true;
}

export const ROLES: Record<UserRole, string> = {
  admin: 'Admin',
  analyst: 'Analyst',
  viewer: 'Viewer',
};
