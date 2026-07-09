# Security Notes

## Current posture
- Authentication is now handled through a role-based client-side flow with validation and rate limiting for sign-in and emergency actions.
- Sensitive routes are guarded by route-level access checks.
- Security headers are applied to server responses.

## Important next steps for production
- Replace the current demo auth flow with a real provider such as Supabase Auth, Clerk, or Auth0.
- Move role assignment and session management to a secure backend.
- Store secrets in environment variables and never in frontend code.
- Add server-side audit persistence and real MFA enforcement for admin accounts.
- Use HTTPS and enforce backend authorization on every protected API.
- Ensure the frontend does not expose API documentation or unsecured endpoints.

## What was implemented in this repo (demo-level)
- Mock JWT token flow: The frontend now issues a signed-like token (base64 payload) stored in `localStorage` and used to determine the effective role and expiry. This is implemented in `src/lib/auth.ts` and wired into `src/lib/security.ts`.
- Permission matrix: Route-level guards are enforced in `src/lib/security.ts` via `canAccessRoute()`; admin-only routes include `/admin`, `/security`, and `/audit`. Emergency routes require `admin` or `security` roles.
- Security dashboard: `src/routes/security.tsx` shows effective role and in-browser rate-limit buckets and offers token clearing.
- Audit dashboard: `src/routes/audit.tsx` lists recent audit events, allows exporting and adding test events; audit entries are stored in session storage.

## What must move server-side for production
- Token issuance and validation must be performed by a backend and signed with a secure secret; the frontend should only hold opaque session identifiers or short-lived JWTs signed by the server.
- Role assignment must be authoritative on the server and not derived from client-controlled values.
- All audit events should be sent to a write-once backend store (database, append-only log) with proper retention and tamper-resistance, not kept in browser storage.
- Rate-limiting must be enforced server-side per IP, per account, and on endpoints (not only via browser storage).
- CSP should be hardened on the server (remove `unsafe-inline`/`unsafe-eval`) and applied by the delivery edge or server.

## How to validate locally
- Login using the UI: when signing in a token is issued for 1 hour. Visit `/security` and `/audit` (admin only) to inspect runtime state.
- To harden further, replace `src/lib/auth.ts` with a client that accepts server-signed tokens and validate them.

