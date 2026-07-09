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
