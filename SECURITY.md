# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly:

- **Email**: security@odia.ai
- **Response Time**: We will respond within 24 hours
- **Disclosure**: We will work with you to coordinate disclosure

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What NOT to Do

- Do not test production systems without consent
- Do not publicly disclose vulnerabilities before coordination
- Do not attempt to access data beyond what's necessary to demonstrate the issue

## Security Measures

- All secrets are stored in environment variables
- Branch protection rules prevent direct pushes to main
- CI/CD pipelines scan for secrets and vulnerabilities
- Code reviews are required for all changes
- Regular security audits and dependency updates

## Key Rotation

We rotate all exposed keys within 24 hours of credible security reports.

## Bug Bounties

We do not currently offer bug bounties, but we appreciate responsible disclosure and will credit researchers appropriately.
