-- Server-side session tracking (sprint log #283, #110, #199, #221, #404,
-- #447, #465, #503). A plain stateless JWT can't satisfy "logging out
-- completely prevents access" (sprint log #111, #339) since the token
-- stays valid until it expires — so each login creates a session row,
-- the JWT carries its id as `jti`, and requireAuth checks the row is
-- still active on every request. Logout just sets revoked_at.

-- gen_random_uuid() is built into Postgres 13+; this is a no-op there
-- and only matters on older servers.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ
);

CREATE INDEX idx_sessions_account ON sessions (account_id);
