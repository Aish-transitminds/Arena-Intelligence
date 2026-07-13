export type UserRole = "fan" | "admin" | "manager" | "steward" | "security" | "guest";

const ROLE_STORAGE_KEY = "arena-role";
import { getRoleFromToken, isTokenValid, issueToken, clearToken } from "./auth";
const AUDIT_STORAGE_KEY = "arena-audit-events";
export const RATE_LIMIT_STORAGE_KEY = "arena-rate-limit";
const AUTHORIZED_EMAIL_KEY = "arena-authorized-email";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function sanitizeText(input: string, maxLength = 140): string {
  if (!input) return "";
  const sanitized = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  return sanitized.trim().slice(0, maxLength);
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

export function isStrongPassword(input: string): boolean {
  return input.length >= 8 && /[A-Z]/.test(input) && /[0-9]/.test(input);
}

export function getStoredRole(): UserRole {
  // Prefer token-based role if token valid
  try {
    if (isTokenValid()) {
      const r = getRoleFromToken();
      if (r === "admin" || r === "manager" || r === "steward" || r === "security" || r === "fan") return r;
    }
  } catch {}

  const storage = getStorage();
  const role = storage?.getItem(ROLE_STORAGE_KEY);
  return role === "admin" || role === "manager" || role === "steward" || role === "security" || role === "fan" ? role as UserRole : "guest";
}

export function persistRole(role: UserRole): void {
  // persist both token and fallback storage
  try {
    issueToken(role, 60 * 60); // 1 hour
  } catch {}
  const storage = getStorage();
  if (storage) storage.setItem(ROLE_STORAGE_KEY, role);
}

export function clearStoredRole(): void {
  try {
    clearToken();
  } catch {}
  const storage = getStorage();
  if (storage) storage.removeItem(ROLE_STORAGE_KEY);
}

export function canAccessRoute(pathname: string, role: UserRole): boolean {
  if (pathname.startsWith("/admin") || pathname.startsWith("/security") || pathname.startsWith("/audit") || pathname.startsWith("/emergency")) {
    if (role === "steward") {
      // Steward is only allowed on the transport map
      return pathname.startsWith("/admin/transport");
    }
    return role === "admin" || role === "manager" || role === "security";
  }
  if (pathname.startsWith("/fan")) {
    return role === "fan" || role === "admin" || role === "manager" || role === "security";
  }
  if (pathname.startsWith("/assistant")) {
    return role === "admin" || role === "manager" || role === "security" || role === "fan";
  }
  // Public routes (e.g. index, /login)
  return true;
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60000): RateLimitResult {
  const storage = getStorage();
  if (!storage) {
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowMs };
  }

  const bucketKey = `${RATE_LIMIT_STORAGE_KEY}:${key}`;
  const raw = storage.getItem(bucketKey);
  const now = Date.now();

  if (!raw) {
    storage.setItem(bucketKey, JSON.stringify({ count: 1, resetAt: now + windowMs }));
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  try {
    const parsed = JSON.parse(raw) as { count: number; resetAt: number };
    if (parsed.resetAt <= now) {
      storage.setItem(bucketKey, JSON.stringify({ count: 1, resetAt: now + windowMs }));
      return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
    }

    if (parsed.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: parsed.resetAt };
    }

    parsed.count += 1;
    storage.setItem(bucketKey, JSON.stringify(parsed));
    return { allowed: true, remaining: limit - parsed.count, resetAt: parsed.resetAt };
  } catch {
    storage.setItem(bucketKey, JSON.stringify({ count: 1, resetAt: now + windowMs }));
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
}

export function recordAuditEvent(type: string, detail: string): void {
  const storage = getStorage();
  if (!storage) return;
  const prior = storage.getItem(AUDIT_STORAGE_KEY);
  const entries = prior ? (JSON.parse(prior) as string[]) : [];
  const stamp = new Date().toISOString();
  entries.unshift(`[${stamp}] ${type.toUpperCase()}: ${detail}`);
  storage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(entries.slice(0, 12)));
}

export function readAuditEvents(): string[] {
  const storage = getStorage();
  if (!storage) return [];
  const prior = storage.getItem(AUDIT_STORAGE_KEY);
  if (!prior) return [];
  try {
    return JSON.parse(prior) as string[];
  } catch {
    return [];
  }
}

export function registerAuthorizedEmail(email: string): void {
  const storage = getStorage();
  if (!storage) return;
  const existing = storage.getItem(AUTHORIZED_EMAIL_KEY);
  if (!existing) {
    storage.setItem(AUTHORIZED_EMAIL_KEY, email.toLowerCase());
  }
}

export function verifyAuthorizedEmail(email: string): boolean {
  const storage = getStorage();
  if (!storage) return true;
  const existing = storage.getItem(AUTHORIZED_EMAIL_KEY);
  if (!existing) return true; // If none registered yet, allow
  return existing === email.toLowerCase();
}

export function setSecurityHeaders(response: Response): Response {
  if (!response || !(response instanceof Response)) {
    return response;
  }

  try {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';"
    );
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';"
    );
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
}
