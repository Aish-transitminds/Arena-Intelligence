import { describe, it, expect, beforeEach, vi } from 'vitest';
import { persistRole, getStoredRole, canAccessRoute, clearStoredRole } from './security';
import { issueToken, getToken, clearToken } from './auth';

describe('Auth & Access Control Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('allows a fan to access /fan but blocks them from /admin', async () => {
    // Simulate fan login
    persistRole('fan');
    
    // Check that role is saved properly
    const role = getStoredRole();
    expect(role).toBe('fan');
    
    // Verify token exists in localStorage (HMAC signed)
    const token = getToken();
    expect(token).toBeTruthy();
    
    // Test route access control
    expect(canAccessRoute('/fan', role)).toBe(true);
    expect(canAccessRoute('/assistant', role)).toBe(true);
    expect(canAccessRoute('/admin', role)).toBe(false);
  });

  it('allows an admin to access /admin and /fan', async () => {
    // Simulate admin login
    persistRole('admin');
    
    const role = getStoredRole();
    expect(role).toBe('admin');
    
    // Test route access control
    expect(canAccessRoute('/admin', role)).toBe(true);
    expect(canAccessRoute('/fan', role)).toBe(true);
    expect(canAccessRoute('/assistant', role)).toBe(true);
  });

  it('clears access upon logout', async () => {
    persistRole('admin');
    expect(getStoredRole()).toBe('admin');
    
    // Simulate logout
    clearStoredRole();
    
    expect(getStoredRole()).toBe('guest');
    expect(getToken()).toBeNull();
    
    // Guest should be blocked from protected routes
    expect(canAccessRoute('/admin', 'guest')).toBe(false);
    expect(canAccessRoute('/fan', 'guest')).toBe(false);
  });
});
