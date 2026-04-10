import { describe, it, expect } from 'vitest';
import { canAccess } from '../lib/auth';

describe('canAccess', () => {
  describe('admin role', () => {
    it('can read any resource', () => {
      expect(canAccess('admin', 'overview', 'read')).toBe(true);
      expect(canAccess('admin', 'analytics', 'read')).toBe(true);
      expect(canAccess('admin', 'sessions', 'read')).toBe(true);
      expect(canAccess('admin', 'settings', 'read')).toBe(true);
      expect(canAccess('admin', 'team', 'read')).toBe(true);
    });

    it('can write to any resource', () => {
      expect(canAccess('admin', 'overview', 'write')).toBe(true);
      expect(canAccess('admin', 'settings', 'write')).toBe(true);
    });

    it('has admin permission on all resources', () => {
      expect(canAccess('admin', 'overview', 'admin')).toBe(true);
      expect(canAccess('admin', 'settings', 'admin')).toBe(true);
    });
  });

  describe('analyst role', () => {
    it('can read most resources', () => {
      expect(canAccess('analyst', 'overview', 'read')).toBe(true);
      expect(canAccess('analyst', 'analytics', 'read')).toBe(true);
      expect(canAccess('analyst', 'sessions', 'read')).toBe(true);
      expect(canAccess('analyst', 'providers', 'read')).toBe(true);
      expect(canAccess('analyst', 'team', 'read')).toBe(true);
    });

    it('can write to analytics only', () => {
      expect(canAccess('analyst', 'analytics', 'write')).toBe(true);
    });

    it('cannot write to settings', () => {
      expect(canAccess('analyst', 'settings', 'write')).toBe(false);
    });

    it('cannot access settings at all', () => {
      expect(canAccess('analyst', 'settings', 'read')).toBe(false);
    });

    it('cannot have admin permission on any resource', () => {
      expect(canAccess('analyst', 'overview', 'admin')).toBe(false);
      expect(canAccess('analyst', 'analytics', 'admin')).toBe(false);
    });
  });

  describe('viewer role', () => {
    it('can read overview, analytics, sessions, providers', () => {
      expect(canAccess('viewer', 'overview', 'read')).toBe(true);
      expect(canAccess('viewer', 'analytics', 'read')).toBe(true);
      expect(canAccess('viewer', 'sessions', 'read')).toBe(true);
      expect(canAccess('viewer', 'providers', 'read')).toBe(true);
    });

    it('cannot read team', () => {
      expect(canAccess('viewer', 'team', 'read')).toBe(false);
    });

    it('cannot write to anything', () => {
      expect(canAccess('viewer', 'overview', 'write')).toBe(false);
      expect(canAccess('viewer', 'analytics', 'write')).toBe(false);
    });

    it('cannot access settings', () => {
      expect(canAccess('viewer', 'settings', 'read')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('defaults to read permission when permission not specified', () => {
      expect(canAccess('viewer', 'overview')).toBe(true);
      expect(canAccess('viewer', 'settings')).toBe(false);
    });

    it('returns false for unknown resource', () => {
      expect(canAccess('admin', 'unknown_resource', 'read')).toBe(false);
    });
  });
});
