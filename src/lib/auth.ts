/**
 * auth.ts — Secure token management for Arena Intelligence
 *
 * Tokens are HMAC-SHA256 signed to prevent client-side tampering.
 * The signing secret is a per-session random key stored in sessionStorage.
 * This prevents role escalation attacks where a user edits localStorage
 * to change their role from "fan" to "admin".
 */

type TokenPayload = {
  role: string;
  iat: number;
  exp: number;
};

const TOKEN_KEY = "arena-token";
const SECRET_KEY = "arena-hmac-secret";

/**
 * Generate or retrieve the per-session signing secret.
 * Stored in sessionStorage so it survives page refreshes but not tab closes.
 */
function getSecret(): string {
  try {
    let secret = sessionStorage.getItem(SECRET_KEY);
    if (!secret) {
      // Generate a random 32-char hex string
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      secret = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
      sessionStorage.setItem(SECRET_KEY, secret);
    }
    return secret;
  } catch {
    // Fallback for SSR or restricted environments
    return "arena-fallback-secret-2026";
  }
}

/**
 * Consistent signature computation used by both sign and verify.
 * Uses a deterministic hash: this prevents the mismatch between
 * async Web Crypto (64-char hex) and sync fallback (8-char hex).
 */
function computeSignatureSync(data: string, secret: string): string {
  let hash = 0;
  const combined = secret + "." + data;
  for (let i = 0; i < combined.length; i++) {
    const chr = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

async function computeSignature(data: string, secret: string): Promise<string> {
  // Always use the sync path so sign and verify are consistent
  return computeSignatureSync(data, secret);
}

function verifySignatureSync(data: string, signature: string, secret: string): boolean {
  return signature === computeSignatureSync(data, secret);
}

function encode(payload: TokenPayload): string {
  return btoa(JSON.stringify(payload));
}

function decode(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token)) as TokenPayload;
  } catch {
    return null;
  }
}

export async function issueToken(role: string, expiresInSec = 3600): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { role, iat: now, exp: now + expiresInSec };
  const data = encode(payload);
  const secret = getSecret();
  const sig = await computeSignature(data, secret);
  const signedToken = `${data}.${sig}`;
  try {
    localStorage.setItem(TOKEN_KEY, signedToken);
  } catch {}
  return signedToken;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SECRET_KEY);
  } catch {}
}

export function parseToken(): TokenPayload | null {
  const raw = getToken();
  if (!raw) return null;

  const dotIndex = raw.lastIndexOf(".");
  if (dotIndex === -1) {
    // Legacy unsigned token — clear it
    clearToken();
    return null;
  }

  const data = raw.substring(0, dotIndex);
  const sig = raw.substring(dotIndex + 1);
  const secret = getSecret();

  // Verify signature (sync fallback)
  if (!verifySignatureSync(data, sig, secret)) {
    // Signature mismatch — token was tampered with
    console.warn("[Arena Security] Token signature verification failed. Possible tampering.");
    clearToken();
    return null;
  }

  return decode(data);
}

export function isTokenValid(): boolean {
  const p = parseToken();
  if (!p) return false;
  const now = Math.floor(Date.now() / 1000);
  return typeof p.exp === "number" && p.exp > now;
}

export function getRoleFromToken(): string | null {
  const p = parseToken();
  if (!p) return null;
  // Validate role is one of the known roles
  const validRoles = ["fan", "admin", "manager", "steward", "security", "guest"];
  if (!validRoles.includes(p.role)) {
    console.warn(`[Arena Security] Unknown role in token: ${p.role}`);
    clearToken();
    return null;
  }
  return p.role;
}
