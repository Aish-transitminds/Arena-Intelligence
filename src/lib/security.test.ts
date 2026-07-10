import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeText, isValidEmail, isStrongPassword, canAccessRoute, checkRateLimit } from './security';

describe('Security Utility Functions', () => {
  describe('sanitizeText', () => {
    it('removes html tags and limits length', () => {
      const input = '<script>alert("xss")</script>Hello World!';
      const result = sanitizeText(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });
    it('returns empty string for nullish input', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });
    it('rejects invalid emails', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('validates strong passwords', () => {
      expect(isStrongPassword('Strong12')).toBe(true);
    });
    it('rejects weak passwords', () => {
      expect(isStrongPassword('weak')).toBe(false); // too short, no upper, no number
      expect(isStrongPassword('weakpassword')).toBe(false); // no upper, no number
      expect(isStrongPassword('Weakpassword')).toBe(false); // no number
    });
  });

  describe('canAccessRoute', () => {
    it('allows admin to access /admin', () => {
      expect(canAccessRoute('/admin', 'admin')).toBe(true);
    });
    it('blocks guest from /admin', () => {
      expect(canAccessRoute('/admin', 'guest')).toBe(false);
    });
    it('allows fan to access /fan', () => {
      expect(canAccessRoute('/fan', 'fan')).toBe(true);
    });
    it('blocks guest from /fan', () => {
      expect(canAccessRoute('/fan', 'guest')).toBe(false);
    });
    it('allows all roles except guest to access /assistant', () => {
      expect(canAccessRoute('/assistant', 'admin')).toBe(true);
      expect(canAccessRoute('/assistant', 'fan')).toBe(true);
      expect(canAccessRoute('/assistant', 'guest')).toBe(false);
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('allows requests within limit', () => {
      const res = checkRateLimit('test-key', 5);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(4);
    });

    it('blocks requests over limit', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit('test-key', 5);
      }
      const res = checkRateLimit('test-key', 5);
      expect(res.allowed).toBe(false);
      expect(res.remaining).toBe(0);
    });
  });
});
