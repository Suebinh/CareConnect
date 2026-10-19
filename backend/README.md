# CareConnect Backend

Node.js + Express API, backed by PostgreSQL. See `/CLAUDE.md` and `/docs/sprint-log.md` at the repo root for the product context this is built against.

## Setup

```
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, SMTP_*
createdb careconnect    # or point DATABASE_URL at an existing Postgres instance
psql $DATABASE_URL -f src/db/migrations/001_init.sql
npm run dev
```

Health check: `GET http://localhost:4000/health`

## Layout

```
src/
├── config/      # db connection, env validation
├── db/
│   ├── migrations/  # SQL schema, applied in order
│   └── seeds/        # local-dev sample data
├── middleware/  # requireAuth (JWT), requireRole (RBAC), errorHandler
├── routes/      # URL -> controller wiring, one file per resource
├── controllers/ # request/response handling, calls services/models
├── services/    # cross-cutting logic: conflict checks, slot generation,
│                # email sending, report de-identification
├── models/      # one file per table, holds the SQL
└── jobs/        # scheduled background work (reminders, survey summary)
```

## Status

This is a framework only — routes, middleware, and schema are wired up, but
controller/model/service bodies are stubs (`501 Not implemented` / thrown
errors) with `TODO` comments pointing at the relevant `docs/sprint-log.md`
task IDs. Fill them in story by story.
