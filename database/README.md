# AOBNAP Database Layer

## Overview
PostgreSQL database managed via Prisma ORM.

## Setup

### Prerequisites
- PostgreSQL 14+
- Node.js 18+

### 1. Install dependencies
```bash
cd database
npm install
```

### 2. Configure DATABASE_URL
Copy `apps/backend/.env.example` to `apps/backend/.env` and set:
```
DATABASE_URL=postgresql://user:password@localhost:5432/aobnap_db
```

### 3. Run migrations
```bash
npx prisma migrate dev --schema=prisma/schema.prisma --name init
```

### 4. Seed the database
```bash
node prisma/seed/seed.js
```

### 5. Open Prisma Studio (optional)
```bash
npx prisma studio --schema=prisma/schema.prisma
```

## Default Seed Users

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@aobnap.gov.et | Admin@123456 |
| FINANCIAL_OFFICER | financial@aobnap.gov.et | Officer@123456 |
| LANGUAGE_OFFICER | language@aobnap.gov.et | Officer@123456 |
| SENIOR_OFFICER | senior@aobnap.gov.et | Officer@123456 |

## Historical Import
Place CSV files in `imports/historical-business-names/`.
Required column: `business_name` (or `maqaa`).
Use the admin API endpoint `POST /api/admin/historical-names/import`.

## Schema Diagram
See `prisma/schema.prisma` for the complete schema definition.
All relationships, indexes, and constraints are defined there.
