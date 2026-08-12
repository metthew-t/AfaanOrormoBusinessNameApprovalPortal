# AOBNAP Architecture

## System Overview
Three-layer architecture: Frontend / Backend / Database integrated through documented contracts.

## Backend Layers
```
Request → Middleware (auth, roles, validation) → Controller → Service → Repository → Prisma → PostgreSQL
                                                    ↕
                                            Cross-cutting:
                                            AuditLog Service
                                            Notification Service
```

## Module Structure
Each module follows: `controller.js`, `service.js`, `repository.js` (optional), `routes.js`, `validators.js`

## State Machine
All application status transitions are centralized in `shared/constants/statuses.js` and enforced by backend services. The frontend never enforces workflow rules.

## Security
- JWT access token (15m) + refresh token (7d, rotated)
- Helmet security headers
- CORS restricted to frontend origin
- Rate limiting (general + auth + public search)
- bcrypt password hashing (12 rounds)
- File upload: MIME + extension validation, size limits
- Ownership checks in service layer (not just role checks)

## No Appeal System
Per project requirement, the appeal workflow has been excluded from the implementation.
