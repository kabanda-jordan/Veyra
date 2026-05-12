# veyra — Biometric Fintech Platform

> **Money on Your Fingerprint.** The future of payments is your biometrics.

Veyra is a production-ready biometric payment ecosystem where users authenticate and pay using native device biometrics — Touch ID, Face ID, Windows Hello, Android Fingerprint — powered by WebAuthn/FIDO2 cryptography.

---

## Architecture Overview

```
veyra/
├── apps/
│   ├── frontend/          # Next.js 15 + TypeScript + Tailwind
│   └── backend/           # Express.js + TypeScript + Prisma
└── packages/
    └── shared/            # Shared TypeScript types
```

## Tech Stack

### Frontend
- **Next.js 15** — App Router, Server Components
- **React 18** + **TypeScript**
- **Tailwind CSS** — Custom design system
- **Framer Motion** — Animations
- **Recharts** — Financial charts
- **Zustand** — State management
- **TanStack Query** — Server state
- **@simplewebauthn/browser** — WebAuthn client

### Backend
- **Express.js** + **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **Redis** — Session cache, WebAuthn challenges
- **@simplewebauthn/server** — WebAuthn verification
- **JWT** — Access/refresh tokens
- **Zod** — Input validation

### Security
- WebAuthn / FIDO2 / Passkeys
- AES-256 encryption at rest
- TLS 1.3 in transit
- Rate limiting (global + per-endpoint)
- Fraud detection engine
- Device trust scoring

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### 1. Clone and install

```bash
git clone https://github.com/kabanda-jordan/veyra.git
cd veyra
npm install
```

### 2. Configure environment

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Edit DATABASE_URL, REDIS_URL, JWT_SECRET

# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 3. Set up database

```powershell
# In the apps/backend directory (or use cwd in your terminal)
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start development

```powershell
# Run both together from root (requires concurrently)
npm run dev

# Or run each separately in two terminals:
npm run dev:frontend    # UI on :3000
npm run dev:backend     # API on :3001
```

---

## Application Modules

| Module | Route | Description |
|--------|-------|-------------|
| Landing Page | `/` | Marketing site with biometric demo |
| User Dashboard | `/dashboard` | Wallet, transactions, analytics |
| Send Money | `/dashboard/send` | Biometric-authenticated transfers |
| QR Payments | `/dashboard/qr` | Scan/generate QR payment codes |
| Biometrics | `/dashboard/biometrics` | Passkey management |
| Security Center | `/dashboard/security` | Sessions, MFA, freeze wallet |
| Analytics | `/dashboard/analytics` | Spending charts and insights |
| Merchant Dashboard | `/dashboard/merchant` | POS, QR generator, settlements |
| Admin Dashboard | `/admin` | User management, KYC, fraud |
| Developer Portal | `/developers` | API docs, SDK, sandbox |
| Register | `/auth/register` | 3-step wallet creation |
| Login | `/auth/login` | Biometric authentication |

---

## Authentication Flow

### Registration
1. User creates account (email + name)
2. Server creates user + default USD wallet
3. Browser calls `navigator.credentials.create()` via WebAuthn
4. Device generates public/private key pair in Secure Enclave
5. Public key + credential ID stored in database
6. Private key **never leaves the device**

### Authentication (Payment)
1. User enters email → server returns WebAuthn challenge
2. Browser calls `navigator.credentials.get()` — triggers biometric prompt
3. Device signs challenge with private key
4. Server verifies signature using stored public key
5. JWT issued → payment authorized

### Security Guarantees
- Biometric data never transmitted or stored server-side
- Phishing-resistant (origin-bound credentials)
- Replay attack prevention (counter-based)
- FIDO2 Level 2 certified authenticators supported

---

## API Reference

### Base URL
```
https://api.veyra.finance/api/v1
```

### Authentication
```
Authorization: Bearer <access_token>
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/refresh` | Refresh JWT |
| POST | `/webauthn/register/options` | Get registration options |
| POST | `/webauthn/register/verify` | Save passkey |
| POST | `/webauthn/authenticate/options` | Get auth challenge |
| POST | `/webauthn/authenticate/verify` | Verify + issue JWT |
| GET | `/wallet` | List wallets |
| POST | `/transactions/send` | Send payment |
| GET | `/transactions` | Transaction history |
| POST | `/merchant/qr` | Generate QR code |
| GET | `/analytics/overview` | Financial overview |

---

## Database Schema

Key tables:
- `users` — Account data
- `wallets` — Multi-currency balances
- `transactions` — Payment records
- `webauthn_credentials` — Public keys only
- `devices` — Trusted device registry
- `sessions` — JWT session management
- `merchant_accounts` — Business accounts
- `kyc_records` — Identity verification
- `fraud_events` — Risk monitoring
- `audit_logs` — Compliance trail

---

## Deployment

### Frontend → Vercel
```bash
cd apps/frontend
vercel deploy --prod
```

### Backend → Railway
```bash
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
# Railway auto-deploys on push
```

### Database → Supabase / Neon
```bash
# Create project at supabase.com or neon.tech
# Copy connection string to DATABASE_URL
npx prisma migrate deploy
```

### Redis → Redis Cloud
```bash
# Create free cluster at redis.com
# Copy connection string to REDIS_URL
```

---

## Security Checklist

- [x] WebAuthn/FIDO2 biometric authentication
- [x] Biometric data never leaves device (Secure Enclave)
- [x] Public key cryptography (no passwords stored)
- [x] JWT with short expiry (15min) + refresh tokens
- [x] Rate limiting on all endpoints
- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma parameterized queries)
- [x] CORS configured for specific origins
- [x] Helmet.js security headers
- [x] Fraud detection engine
- [x] Device trust scoring
- [x] Audit logging
- [ ] PCI DSS compliance (production)
- [ ] SOC 2 Type II audit (production)
- [ ] Penetration testing (production)

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `neon-blue` | `#4DA3FF` | Primary actions, links |
| `neon-green` | `#16C784` | Success, income |
| `veyra-dark` | `#050508` | Background |
| `veyra-card` | `#111118` | Card surfaces |
| `veyra-border` | `#1E1E2E` | Borders |

### Key CSS Classes
- `.glass-card` — Glassmorphism card
- `.neon-border` — Blue neon border glow
- `.gradient-text` — Blue→green gradient text
- `.btn-primary` — Primary CTA button
- `.badge-success/pending/failed` — Status badges
- `.sidebar-item` — Navigation item

---

## License

MIT © 2026 Veyra Technologies Inc.
