# Phase 6: Security Hardening & Best Practices

**Goal:** Implement essential security measures for the server, Nginx, and the Actix web application.

---
## Stub P6.A: Server-Level Security

*   **P6.A.1:** **Regular Updates:** `sudo apt update && sudo apt upgrade -y` (automate this if possible, e.g., `unattended-upgrades`).
*   **P6.A.2:** **Firewall Review (UFW):** Ensure only necessary ports are open (SSH, HTTP, HTTPS).
*   **P6.A.3:** **SSH Hardening Review:** Key-based auth only, no root login, strong ciphers if customized.
*   **P6.A.4:** **Intrusion Detection (Optional):** Consider `fail2ban` to block IPs after multiple failed login attempts.
*   **P6.A.5:** **Reduce Attack Surface:** Uninstall unnecessary packages/services.
*   **P6.A.6:** **User Privileges:** Ensure `your_deploy_user` has minimal necessary sudo privileges. Avoid running application processes as root.

---
## Stub P6.B: Nginx Security

*   **P6.B.7:** **HTTPS Setup with Certbot (Let's Encrypt).**
    *   **P6.B.7.1:** Ensure you have a domain name pointed to your droplet's IP.
    *   **P6.B.7.2:** Install Certbot: `sudo snap install --classic certbot`; `sudo ln -s /snap/bin/certbot /usr/bin/certbot`.
    *   **P6.B.7.3:** Obtain and install SSL certificate: `sudo certbot --nginx -d your_domain.com -d www.your_domain.com` (if applicable). Follow prompts.
    *   **P6.B.7.4:** Certbot should automatically update Nginx config for HTTPS and set up auto-renewal. Verify renewal: `sudo certbot renew --dry-run`.
*   **P6.B.8:** **Strong TLS Configuration:**
    *   Review Nginx SSL settings (Certbot usually sets good defaults). Aim for A+ on SSL Labs test.
    *   Disable old SSL/TLS protocols (SSLv3, TLSv1.0, TLSv1.1).
    *   Use strong cipher suites.
*   **P6.B.9:** **Security Headers in Nginx:**
    *   `add_header X-Frame-Options "SAMEORIGIN";`
    *   `add_header X-Content-Type-Options "nosniff";`
    *   `add_header X-XSS-Protection "1; mode=block";` (Deprecated by some browsers, but still good for defense in depth).
    *   `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;` (HSTS - add after confirming HTTPS works perfectly).
    *   `add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://placehold.co; font-src 'self' https:; connect-src 'self' ws: wss: your_autonomi_node_domain_if_different;";` (CSP - **Crucial and needs careful tuning.** Remove `'unsafe-inline'` for scripts/styles by using hashes, nonces, or refactoring inline JS/CSS if possible. `connect-src` needs to allow WebSocket connections if your Autonomi client uses them from frontend, and connections to your Autonomi network node if Actix makes calls on behalf of client directly in some scenarios).
    *   `add_header Referrer-Policy "strict-origin-when-cross-origin";`
    *   `add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";` (Restrict browser features).
*   **P6.B.10:** **Limit Nginx Information Disclosure:** `server_tokens off;` in `nginx.conf`.
*   **P6.B.11:** **Protect Sensitive Files/Directories:** Use `location` blocks in Nginx to deny access to files like `.env` if they were accidentally placed in webroot (they shouldn't be).

---
## Stub P6.C: Actix Application Security (Rust Backend)

*   **P6.C.12:** **Input Validation:**
    *   Rigorously validate ALL inputs from users/clients (query parameters, path parameters, request bodies) using crates like `validator` or custom logic.
    *   Protect against common injection attacks (though less common in Rust than e.g. SQL injection in other languages, validation is key for data integrity and business logic).
*   **P6.C.13:** **Output Encoding:** Ensure data sent to frontend is properly encoded if it contains user-supplied content (Serde usually handles JSON encoding well, but be mindful if constructing HTML or other formats in Rust).
*   **P6.C.14:** **Error Handling:** Do not leak sensitive error details or stack traces to clients. Log detailed errors on server, return generic error messages.
*   **P6.C.15:** **Dependency Management:** Regularly update Rust dependencies (`cargo update`) and audit them for known vulnerabilities (`cargo audit`).
*   **P6.C.16:** **Authentication & Authorization (If/When Implemented):**
    *   If user accounts or protected APIs are added:
        *   Use strong password hashing (e.g., `argon2`, `bcrypt` via pure Rust crates).
        *   Implement secure session management or token-based authentication (JWTs).
        *   Enforce proper authorization checks for accessing resources.
*   **P6.C.17:** **Rate Limiting (Actix Middleware):** Protect against DoS/brute-force attacks. Consider crates like `actix-ratelimit` or custom middleware.
*   **P6.C.18:** **Secure Defaults:** Use secure defaults in Actix and other libraries.
*   **P6.C.19:** **Logging & Monitoring:** Implement comprehensive logging to detect and investigate suspicious activities.

---
## Stub P6.D: Review and Testing

*   **P6.D.20:** **Security Audit/Review:** Manually review configurations and code for security best practices.
*   **P6.D.21:** **Penetration Testing (Optional/Future):** For high-security applications, consider a professional penetration test.
*   **P6.D.22:** **Automated Security Scans:** Use tools like `cargo audit` and Nginx vulnerability scanners if available.
*   **P6.D.23:** **Update CSP:** After deploying other security measures, iteratively refine the Content-Security-Policy to be as restrictive as possible.

---
**End of Phase 6** 