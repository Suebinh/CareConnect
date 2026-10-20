# CareConnect Backend

Node.js + Express API, backed by PostgreSQL. See `/CLAUDE.md` and `/docs/sprint-log.md` at the repo root for the product context this is built against.

## Setup

The whole team points at one shared Postgres instance (ask whoever set it up
for the connection string) rather than each running Postgres locally.

```
cd backend
npm install
cp .env.example .env   # paste in the shared DATABASE_URL, set JWT_SECRET, fill in SMTP_*
npm run migrate         # applies every file in src/db/migrations, in order
npm run dev
```

Health check: `GET http://localhost:4000/health`

Adding a migration later: drop a new `00N_description.sql` file into
`src/db/migrations/` and have everyone run `npm run migrate` again (it only
needs to be run once per new file, by whoever pulls it first — but it's not
guarded against re-running the same file twice against an already-migrated
DB, so don't run the whole set from scratch on a DB that already has it).

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
