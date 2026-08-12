# AOBNAP — Afaan Oromo Business Name Approval Portal

Government-style portal for submitting, verifying, reviewing, approving, and managing Afaan Oromo business name applications for Adama City.

## Architecture

```
afaan-oromo-business-portal/
├── apps/
│   ├── frontend/           (React + Vite — Phase 2)
│   └── backend/            (Node.js + Express API)
├── database/               (Prisma schema, migrations, seed)
├── shared/                 (Cross-cutting constants, utilities)
├── docs/                   (Architecture & API contracts)
└── README.md
```

## Quick Start

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** 9+

### 1. Clone & Install
```bash
npm install
cd database && npm install && cd ..
cd apps/backend && npm install && cd ../..
```

### 2. Configure Environment
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your DATABASE_URL, JWT secrets, etc.
```

### 3. Initialize Database
```bash
cd database
npx prisma generate --schema=prisma/schema.prisma
npx prisma migrate dev --schema=prisma/schema.prisma --name init
node prisma/seed/seed.js
cd ..
```

### 4. Start the Backend
```bash
cd apps/backend
npm run dev
```

Server starts at `http://localhost:5000`.
Health check: `GET http://localhost:5000/api/health`

## Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aobnap.gov.et | Admin@123456 |
| Financial Officer | financial@aobnap.gov.et | Officer@123456 |
| Language Officer | language@aobnap.gov.et | Officer@123456 |
| Senior Officer | senior@aobnap.gov.et | Officer@123456 |

Register as a Business Owner via `POST /api/auth/register`.

## API Endpoints Summary

| Module | Base Path | Auth |
|--------|-----------|------|
| Auth | `/api/auth/*` | Public (register/login), Authenticated (others) |
| Applications | `/api/applications/*` | BUSINESS_OWNER / Officers |
| Business Names | `/api/business-names/*` | BUSINESS_OWNER |
| Permissions | `/api/permissions/*` | FINANCIAL_OFFICER |
| Language Reviews | `/api/language-reviews/*` | LANGUAGE_OFFICER |
| Certificates | `/api/certificates/*` | Authenticated |
| Notifications | `/api/notifications/*` | Authenticated |
| Public | `/api/public/*` | None (rate-limited) |
| Admin | `/api/admin/*` | ADMIN |

## Workflow

```
Business Owner submits application
    ↓
Automatic name validation (duplicate, reserved terms, format)
    ↓
Financial Officer reviews business permission → Approve/Reject/Correct
    ↓
Language Officer reviews Afaan Oromo name → Approve (+ Certificate) / Reject / Correct
    ↓
Certificate issued with QR code → Public verification available
```

## Key Design Decisions

- **No AI/fuzzy matching** — all name validation is deterministic
- **No online payments** — no payment integration
- **No appeals** — removed per project requirement
- **Single `normalizeBusinessName()`** — shared across all name operations
- **State machine enforced server-side** — frontend only reflects status
- **Audit logging on every state change** — immutable audit trail
- **JWT auth** with short-lived access tokens and rotated refresh tokens

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **File Upload:** Multer
- **QR Generation:** qrcode
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate-limiting
