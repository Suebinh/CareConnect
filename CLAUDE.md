# CareConnect

IS 495 Group 6 class project: an online clinic booking system (patient portal + staff/physician dashboards) with automated email appointment reminders.

Full context lives in `docs/`:
- `docs/project-proposal.md` — problem, scope/constraints, tech approach, success metrics.
- `docs/sprint-log.md` — full backlog: every user story with priority/sprint/story points, broken into tasks with assignee, status, and hour estimates.
- `README.md` — team git workflow (branching, PRs, commit style) and planned folder structure.

## Tech stack

- **Frontend:** React, HTML/CSS/JS. One HTML file per page under `pages/`.
- **Backend:** Node.js (JavaScript).
- **Database:** SQL.
- **Reminders:** automated emails, planned to be built via a Claude Code agent rather than a plain cron job.
- **Hosting:** GitHub Pages (static files only) — this repo's frontend is what's hosted; the `backend/` folder runs separately (or is mocked for the class prototype).

None of this is scaffolded yet — repo currently only has `README.md` and `docs/`.

## Team / GitHub usernames

| Name | GitHub |
|---|---|
| Suebin Hur | suebinhur |
| Samuel Duarte | ssamuelduarte |
| Brandon Howe (you're working with Brandon) | brandonhowe |
| Nathan Mamaril | nathanmamaril |

Brandon's tasks in the sprint log are mostly **backend**: registration/login/session endpoints, availability and conflict-check logic, sign-off and status endpoints, combined-schedule endpoint, input validation, and several privacy/access-control test tasks. Check `docs/sprint-log.md` for the current list — it's a point-in-time snapshot, confirm against the live sprint sheet before relying on assignments or status.

## HIPAA / privacy constraints (load-bearing across the whole backlog)

- Patients must only ever see their own name/appointment details — never another patient's.
- No full medical records are stored or exposed — scheduling data only.
- De-identified data for the Data Analyst role (no patient names/contact info).
- Generic error messages on unauthorized access — never leak PHI in errors.
- Reminder/confirmation emails show date/time/location only, never appointment reason.

## Conventions (from README)

- Filenames: lowercase-with-hyphens (`patient-login.html`, not `Patient Login.html`).
- Branch naming: `your-name/feature-name` (e.g. `brandonhowe/login-backend`).
- Never push directly to `main` — branch + PR only.
- Commit messages: present tense, verb-first, under ~70 chars (`Add`, `Fix`, `Update`, `Remove`).
