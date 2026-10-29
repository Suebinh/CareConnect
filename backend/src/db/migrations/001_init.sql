-- Initial schema for CareConnect.
-- Covers the "Data models" items from the README backlog: accounts/roles,
-- Physician-to-PA/Nurse relationships, appointments (status, "booked by",
-- sign-off flag), availability rules, appointment types/durations, visit
-- notes, reminders, survey results.
--
-- This is a first pass to unblock building against real tables — expect
-- it to evolve as each story is implemented. Run migrations in order;
-- add 002_*.sql, 003_*.sql, etc. rather than editing this file in place
-- once it's been applied anywhere.

CREATE TABLE accounts (
  id             SERIAL PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL CHECK (role IN (
                   'physician', 'physician_assistant', 'nurse', 'patient',
                   'data_analyst', 'receptionist', 'process_manager'
                 )),
  name           TEXT NOT NULL,
  phone          TEXT,
  specialty      TEXT,                 -- physician/PA/nurse only (sprint log #304)
  date_of_birth  DATE,                 -- patient only (sprint log #286)
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deactivated')),
  email_verified_at TIMESTAMPTZ,       -- patient sign-up verification (sprint log #289)
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Physician -> PA/Nurse supervision or support relationship
-- (sprint log #104, #207, #422).
CREATE TABLE staff_relationships (
  physician_id  INTEGER NOT NULL REFERENCES accounts(id),
  staff_id      INTEGER NOT NULL REFERENCES accounts(id), -- PA or Nurse
  PRIMARY KEY (physician_id, staff_id)
);

CREATE TABLE password_reset_tokens (
  id          SERIAL PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ
);

-- Clinic-wide appointment type list (e.g. "New Patient", "Follow-up").
CREATE TABLE appointment_types (
  id    SERIAL PRIMARY KEY,
  name  TEXT UNIQUE NOT NULL
);

-- Each provider sets their own duration per type (sprint log #118-120).
CREATE TABLE provider_appointment_durations (
  provider_id         INTEGER NOT NULL REFERENCES accounts(id),
  appointment_type_id INTEGER NOT NULL REFERENCES appointment_types(id),
  duration_minutes    INTEGER NOT NULL,
  PRIMARY KEY (provider_id, appointment_type_id)
);

-- Recurring weekly availability (sprint log #71, #416).
CREATE TABLE availability_rules (
  id              SERIAL PRIMARY KEY,
  provider_id     INTEGER NOT NULL REFERENCES accounts(id),
  day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  effective_until DATE
);

-- One-off blocked time: vacations, sick days, meetings (sprint log #270-271).
CREATE TABLE blocked_time (
  id          SERIAL PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES accounts(id),
  start_at    TIMESTAMPTZ NOT NULL,
  end_at      TIMESTAMPTZ NOT NULL,
  reason      TEXT
);

CREATE TABLE appointments (
  id                  SERIAL PRIMARY KEY,
  patient_id          INTEGER NOT NULL REFERENCES accounts(id),
  provider_id         INTEGER NOT NULL REFERENCES accounts(id),
  appointment_type_id INTEGER NOT NULL REFERENCES appointment_types(id),
  start_at            TIMESTAMPTZ NOT NULL,
  end_at              TIMESTAMPTZ NOT NULL,
  status              TEXT NOT NULL DEFAULT 'booked' CHECK (status IN (
                        'booked', 'completed', 'no_show', 'cancelled'
                      )),
  booked_by           TEXT NOT NULL CHECK (booked_by IN ('patient', 'receptionist')),
  requires_sign_off   BOOLEAN NOT NULL DEFAULT false, -- PA-led visits (sprint log #274)
  signed_off_by       INTEGER REFERENCES accounts(id),
  signed_off_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent double-booking at the database level as a second line of
-- defense behind services/conflictCheck.service.js (sprint log #497).
CREATE INDEX idx_appointments_provider_time ON appointments (provider_id, start_at, end_at);
CREATE INDEX idx_appointments_patient ON appointments (patient_id);

CREATE TABLE visit_notes (
  id             SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id),
  author_id      INTEGER NOT NULL REFERENCES accounts(id),
  note           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reminders (
  id              SERIAL PRIMARY KEY,
  appointment_id  INTEGER NOT NULL REFERENCES appointments(id),
  send_at         TIMESTAMPTZ NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN (
                     'pending', 'sent', 'failed'
                   )),
  sent_at         TIMESTAMPTZ
);

-- Aggregated scores only — never raw per-respondent answers
-- (sprint log #238, CLAUDE.md HIPAA constraint).
CREATE TABLE survey_results (
  id              SERIAL PRIMARY KEY,
  respondent_role TEXT NOT NULL CHECK (respondent_role IN ('patient', 'staff')),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  avg_score       NUMERIC(3,2) NOT NULL,
  response_count  INTEGER NOT NULL
);
