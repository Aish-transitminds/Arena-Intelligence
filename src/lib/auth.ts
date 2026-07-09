type TokenPayload = {
  role: string;
  iat: number;
  exp: number;
};

const TOKEN_KEY = "arena-token";

function encode(payload: TokenPayload) {
  return btoa(JSON.stringify(payload));
}

function decode(token: string) {
  try {
    return JSON.parse(atob(token)) as TokenPayload;
  } catch {
    return null;
  }
}

export function issueToken(role: string, expiresInSec = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { role, iat: now, exp: now + expiresInSec };
  const token = encode(payload);
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
  return token;
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
  } catch {}
}

export function parseToken() {
  const t = getToken();
  if (!t) return null;
  return decode(t);
}

export function isTokenValid() {
  const p = parseToken();
  if (!p) return false;
  const now = Math.floor(Date.now() / 1000);
  return typeof p.exp === "number" && p.exp > now;
}

export function getRoleFromToken(): string | null {
  const p = parseToken();
  if (!p) return null;
  return p.role;
}
