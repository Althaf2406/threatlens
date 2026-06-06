# Email Verification & Anti-Abuse Account Protection

## Feature Overview
ThreatLens uses email verification to ensure that new users provide a valid email address before accessing core functionality. This acts as an anti-abuse measure to prevent automated bot sign-ups from draining student AI quotas and creating spam projects.

## Why Account Verification is Needed
- **Cost Control**: AI tokens are expensive. Unverified users could repeatedly sign up to generate free reports.
- **Data Quality**: Ensures that our userbase metrics are legitimate.
- **Abuse Prevention**: Rate limiting and bot protection starts with verifying identity.

## User Flow
1. User registers via `/register`.
2. Instead of immediate login, user is redirected to `/check-email`.
3. An email (or console log in local mode) is sent with a verification link.
4. User clicks the link (`/verify-email?token=...`).
5. Backend verifies the token and marks the account as active.
6. User can now log in and use ThreatLens.

## Backend Endpoints
- `POST /api/v1/auth/register`: Generates token, saves hash, sends email, returns 200 without login cookie.
- `GET /api/v1/auth/verify-email`: Validates token hash and activates user.
- `POST /api/v1/auth/resend-verification`: Resends verification email with cooldown limits.
- `POST /api/v1/auth/login`: Returns 403 if user is not verified.

## User Model Fields
- `email_verified`: Boolean, default False.
- `email_verified_at`: Timestamp of verification.
- `verification_token_hash`: SHA-256 hash of the current active token.
- `verification_token_expires_at`: Expiration time for the token.
- `verification_sent_at`: Timestamp when the last email was sent.
- `verification_attempt_count`: Counter for attempts.
- `resend_verification_count`: Counter for resends.
- `account_status`: Enum-like string (`pending_verification`, `active`, `suspended`, `disabled`).

## Verification Token Design
- Tokens are generated using `secrets.token_urlsafe(32)`.
- Tokens are **never** stored in plain text. They are hashed using SHA-256 (`hashlib.sha256`) before being saved to the database.
- Tokens expire in 24 hours.

## Console Email Mode
For local development, an SMTP server is not required. By default, `EMAIL_PROVIDER` is set to `console`, and the verification link is printed directly to the backend terminal.

## Frontend Pages
- `/register`: Handles registration and redirects.
- `/check-email`: Instructs the user to check their email and allows resending.
- `/verify-email`: Processes the token from the URL and shows success/error states.
- `/login`: Modified to show a "Resend verification email" link if a 403 verification error occurs.

## Anti-Abuse Rules
- **Project Creation**: Unverified users receive a 403 Forbidden.
- **Passive Checks**: Unverified users receive a 403 Forbidden.
- **AI Summary Generation**: Unverified users receive a 403 Forbidden.
- **Report Generation**: Unverified users receive a 403 Forbidden.

## Security Notes
- Verification tokens are strictly hashed.
- Resend functionality has a cooldown (60 seconds) and daily limit (5) to prevent email spam.
- Enums and proper status checks prevent bypassing the flow.

## Limitations
- Currently uses a simple cooldown approach for rate limiting resends. In a production environment, an IP-based rate limiter (e.g., Redis) should be used.
- IP-based registration limits are not fully implemented.

## Future Improvements
- Implement SMTP integration.
- Implement Redis-based rate limiting for `/register` and `/resend-verification` endpoints.
- Support "Forgot Password" flow utilizing similar token logic.
