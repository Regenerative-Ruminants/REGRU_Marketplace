# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it to us as soon as possible. 

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please email us at: `security@example.com` (Replace with actual email)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

## CVSS Triage SLA

We aim to triage reported vulnerabilities based on CVSS v3.1 scoring as follows:
- **Critical (9.0-10.0):** Acknowledge within 24 hours, update within 72 hours, patch within 7 days.
- **High (7.0-8.9):** Acknowledge within 48 hours, update within 5 days, patch within 14 days.
- **Medium (4.0-6.9):** Acknowledge within 72 hours, update within 7 days, patch within 30 days.
- **Low (0.1-3.9):** Acknowledge within 5 days, update within 14 days, patch as resources allow.

These are targets and may vary based on complexity and impact.

## Key Rotation Timetable

- **CI/CD Secrets (e.g., TAURI_PRIVATE_KEY_B64):** Rotated every 90 days or immediately upon suspected compromise.
- **Developer Access Keys:** Individual keys are the responsibility of the developer. Access is reviewed quarterly.
- **Autonomi Wallet Keys (Production):** Master production wallet keys are stored securely and access is highly restricted. Rotation schedule is TBD and will be documented here.

## ANT Wallet Incident Steps

In case of a suspected compromise of an ANT wallet used by the project (especially production wallets):
1. **Immediate Containment:** If possible, immediately attempt to move any remaining funds to a known secure wallet.
2. **Restrict Access:** Revoke any API keys, access tokens, or credentials associated with the compromised wallet.
3. **Investigation:** Conduct a thorough investigation to determine the scope and cause of the compromise.
4. **Notification:** 
    - Notify relevant internal stakeholders.
    - If user funds or data are impacted, prepare a public notification plan in accordance with legal and ethical obligations.
5. **Remediation:** Address the vulnerability that led to the compromise.
6. **Post-Mortem:** Conduct a post-mortem analysis to learn from the incident and improve security practices.

This policy is a living document and may be updated as our project evolves. 