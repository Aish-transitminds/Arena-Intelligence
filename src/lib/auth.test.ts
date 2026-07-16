import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { issueToken, getToken, clearToken, parseToken, isTokenValid, getRoleFromToken } from './auth';

describe('Auth Token System', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('issueToken & getToken', () => {
    it('issues and retrieves a token successfully', async () => {
      const token = await issueToken('admin', 3600);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token).toContain('.'); // Should have a dot separating payload and signature
      expect(getToken()).toBe(token);
    });
  });

  describe('parseToken & getRoleFromToken', () => {
    it('parses a valid token and returns correct role', async () => {
      await issueToken('manager', 3600);
      
      const payload = parseToken();
      expect(payload).not.toBeNull();
      expect(payload?.role).toBe('manager');

      const role = getRoleFromToken();
      expect(role).toBe('manager');
    });

    it('rejects an invalid role', async () => {
      await issueToken('superadmin', 3600);
      
      const role = getRoleFromToken();
      expect(role).toBeNull(); // 'superadmin' is not in the allowed list
      expect(getToken()).toBeNull(); // It clears the invalid token
    });
  });

  describe('isTokenValid', () => {
    it('returns true for a fresh token', async () => {
      await issueToken('fan', 3600);
      expect(isTokenValid()).toBe(true);
    });

    it('returns false for an expired token', async () => {
      await issueToken('fan', -100); // Expired 100 seconds ago
      expect(isTokenValid()).toBe(false);
    });
  });

  describe('Token Tampering & Escalation', () => {
    it('rejects unsigned legacy tokens', async () => {
      // Simulate an old token without a signature
      const fakeToken = btoa(JSON.stringify({ role: 'admin', iat: 1000, exp: 9000 }));
      localStorage.setItem('arena-token', fakeToken);
      
      expect(parseToken()).toBeNull();
      expect(getToken()).toBeNull(); // Should clear the tampered token
    });

    it('rejects tampered tokens with invalid signature', async () => {
      // Generate a valid token
      const validToken = await issueToken('fan', 3600);
      
      // Tamper with the payload (escalate to admin)
      const tamperedPayload = btoa(JSON.stringify({ role: 'admin', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 3600 }));
      
      // Re-attach the original signature from the valid token
      const originalSig = validToken.split('.')[1];
      const tamperedToken = `${tamperedPayload}.${originalSig}`;
      
      localStorage.setItem('arena-token', tamperedToken);
      
      expect(parseToken()).toBeNull();
      expect(getToken()).toBeNull();
    });

    it('clears token on signature mismatch', async () => {
      const token = await issueToken('manager', 3600);
      const [data, sig] = token.split('.');
      
      // Change signature slightly
      const badSig = sig.slice(0, -1) + '0';
      localStorage.setItem('arena-token', `${data}.${badSig}`);
      
      expect(parseToken()).toBeNull();
      expect(getToken()).toBeNull();
    });
  });
});
