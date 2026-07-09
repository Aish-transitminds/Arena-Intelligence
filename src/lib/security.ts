export type UserRole = "fan" | "admin" | "security" | "guest";

const ROLE_STORAGE_KEY = "arena-role";
const AUDIT_STORAGE_KEY = "arena-audit-events";
const RATE_LIMIT_STORAGE_KEY = "arena-rate-limit";

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
  return input.replace(/[<>]/g, "").trim().slice(0, maxLength);
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

export function isStrongPassword(input: string): boolean {
  return input.length >= 8 && /[A-Z]/.test(input) && /[0-9]/.test(input);
}

export function getStoredRole(): UserRole {
  const storage = getStorage();
  const role = storage?.getItem(ROLE_STORAGE_KEY);
  return role === "admin" || role === "security" || role === "fan" ? role : "guest";
}

export function persistRole(role: UserRole): void {
  const storage = getStorage();
  if (storage) storage.setItem(ROLE_STORAGE_KEY, role);
}

export function clearStoredRole(): void {
  const storage = getStorage();
  if (storage) storage.removeItem(ROLE_STORAGE_KEY);
}

export function canAccessRoute(pathname: string, role: UserRole): boolean {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/emergency")) return role === "admin" || role === "security";
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

export function setSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
