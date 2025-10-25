# Production Security Best Practices for Polling System

This document outlines critical security tasks and best practices to implement before deploying the polling system to production.

## 1. Authentication and Authorization

**Current State:** Several critical API endpoints lack authentication, allowing unauthorized access and modification of sensitive data.

**Tasks:**

*   **Implement JWT-based Authentication for all protected routes:**
    *   Ensure `backend/middleware/authMiddleware.js` is robust and correctly validates JWTs.
    *   Apply `authMiddleware.authenticateToken` to all routes that require user or couple-specific access.
*   **Protect Couple Management Endpoints:**
    *   `POST /api/couples/create`: While creation might not require a pre-existing token, consider adding rate limiting to prevent abuse. The `accessCode` should be securely generated and transmitted.
    *   `POST /api/couples/authenticate`: Implement robust rate limiting to prevent brute-force attacks on `accessCode`. Upon successful authentication, a JWT should be issued.
    *   `GET /api/couples/:coupleId`: **CRITICAL:** This endpoint currently allows anyone with a `coupleId` to retrieve sensitive couple details. It **MUST** be protected by `authMiddleware.authenticateToken` to ensure only authenticated partners of that couple can access their data.
    *   `PUT /api/couples/:coupleId/status`: **CRITICAL:** This endpoint allows anyone to update a couple's status. It **MUST** be protected by `authMiddleware.authenticateToken` and further authorization checks to ensure only authenticated partners of that couple can modify their status.
    *   `PUT /api/couples/:coupleId/reset-status`: **CRITICAL:** This endpoint is intended for admin/automated use. It **MUST** be protected by `authMiddleware.authenticateToken` and potentially an additional role-based authorization check (e.g., only an admin user or a dedicated automated service can call this).
*   **Implement Role-Based Access Control (RBAC):** If different types of users (e.g., admin, regular user) have different permissions, implement RBAC to enforce these.

## 2. Data Protection

*   **Encrypt Sensitive Data at Rest:**
    *   Ensure that sensitive data in the database (e.g., `accessCode` if stored, although it's better to hash it) is encrypted.
    *   **Hash `accessCode`:** The `accessCode` should never be stored in plain text. Use a strong, one-way hashing algorithm (e.g., bcrypt) before storing it in the database.
*   **Secure Data in Transit (HTTPS):**
    *   Ensure all communication between the frontend and backend uses HTTPS. This prevents eavesdropping and tampering.
*   **Input Validation:**
    *   Thoroughly validate all incoming data on the backend to prevent injection attacks (SQL injection, NoSQL injection, XSS). The DTOs are a good start, but ensure comprehensive validation.

## 3. Error Handling and Logging

*   **Avoid Leaking Sensitive Information in Error Messages:**
    *   Ensure error messages returned to the client do not contain sensitive details about the server environment, database schema, or internal logic.
*   **Centralized Logging:**
    *   Implement a robust logging system to capture security-related events (failed login attempts, unauthorized access attempts, etc.).
    *   Monitor logs for suspicious activity.

## 4. Dependency Management

*   **Regularly Update Dependencies:**
    *   Keep all project dependencies (npm packages) up-to-date to patch known vulnerabilities.
    *   Use tools like `npm audit` regularly.

## 5. Environment Configuration

*   **Secure Environment Variables:**
    *   Store all sensitive configuration (database credentials, API keys, JWT secrets) in environment variables, not directly in the codebase.
    *   Ensure these variables are not committed to version control.
*   **Production vs. Development Settings:**
    *   Have distinct configurations for development and production environments, especially for logging levels, error reporting, and security features.

## 6. Rate Limiting

*   **Implement Rate Limiting on Critical Endpoints:**
    *   Apply rate limiting to authentication endpoints (`/authenticate`, `/create`) to prevent brute-force attacks.
    *   Consider rate limiting other resource-intensive or sensitive endpoints.

## 7. Cross-Site Scripting (XSS) Prevention

*   **Sanitize User-Generated Content:**
    *   If the application displays any user-generated content, ensure it is properly sanitized to prevent XSS attacks.

## 8. Cross-Site Request Forgery (CSRF) Protection**

*   **Implement CSRF Tokens:**
    *   For state-changing requests (POST, PUT, DELETE), implement CSRF protection to prevent unauthorized commands from being transmitted from a trusted user.

## 9. Session Management

*   **Secure Session Cookies/Tokens:**
    *   If using session cookies, ensure they are `HttpOnly`, `Secure`, and have appropriate `SameSite` attributes.
    *   For JWTs, ensure they are short-lived and refresh tokens are handled securely.

## 10. Security Headers

*   **Implement HTTP Security Headers:**
    *   Use headers like `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` to enhance browser security.
