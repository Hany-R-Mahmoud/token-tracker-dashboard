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

type Permission = 'read' | 'write' | 'admin';

const RBAC: Record<UserRole, Record<string, Permission[]>> = {
  admin: {
    overview: ['read', 'write', 'admin'],
    analytics: ['read', 'write', 'admin'],
    sessions: ['read', 'write', 'admin'],
    providers: ['read', 'write', 'admin'],
    team: ['read', 'write', 'admin'],
    settings: ['read', 'write', 'admin'],
  },
  analyst: {
    overview: ['read'],
    analytics: ['read', 'write'],
    sessions: ['read'],
    providers: ['read'],
    team: ['read'],
    settings: [],
  },
  viewer: {
    overview: ['read'],
    analytics: ['read'],
    sessions: ['read'],
    providers: ['read'],
    team: [],
    settings: [],
  },
};

export function canAccess(role: UserRole, resource: string, permission: Permission = 'read'): boolean {
  const rolePerms = RBAC[role];
  if (!rolePerms) return false;
  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) return false;
  return resourcePerms.includes(permission);
}

export const ROLES: Record<UserRole, string> = {
  admin: 'Admin',
  analyst: 'Analyst',
  viewer: 'Viewer',
};
