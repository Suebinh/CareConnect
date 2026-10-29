# CareConnect Project Proposal

Source: team's "CareConnect Project Proposal" Google Doc. IS 495 Group 6, prepared by Suebin Hur, Samuel Duarte, Brandon Howe, Nathan Mamaril. Dated 9/7/2026.

## Problem

Small clinics and private practices often rely on inefficient, disconnected systems to record and display appointments. Patients and staff can't see the same booking information, which causes no-shows, scheduling conflicts, and wasted time.

## Objective

An online booking system with:
- Appointment booking interface
- Time-slot availability management
- Automatic email reminders
- Admin dashboard for clinic staff
- Simple reporting (appointments/week, no-show rates)

## Scope / Constraints

- Scoped to one clinic's patients, physicians, and staff.
- In scope: booking appointments, managing availability, automated email reminders, appointments-per-week and no-show reports.
- Out of scope: accessing medical records, contacting physicians directly.
- Must be usable with minimal training on standard web browsers.
- **HIPAA-relevant constraint:** patients can only see their own name/details on appointments; other patients' reservations never reveal who holds them.

## Limitations (team-acknowledged)

- Limited team meeting availability and technical experience.
- No access to real clinic data, or to real patients/physicians for user testing.
- Class project — no real budget; mindful of any paid services/AI tooling used.

## Technical Approach

- **Frontend:** React, with HTML/CSS/JS (per README, split one HTML file per page under `pages/`).
- **Backend:** JavaScript on Node.js.
- **Database:** SQL — single source of truth for appointments, shared across all role-based interfaces, so a booked slot becomes instantly unavailable to everyone (no double-booking).
- **Three role-based interfaces:** Patient (Customer Portal), Clinic Staff (Employee/admin dashboard), Physician.
- **Reminders:** automated email reminders to patients, planned to be built via a Claude Code agent (not just a plain cron job).
- **Reporting:** appointments-per-week and no-show dashboard for staff.

## Success Metrics

1. Each interface is fully functional and HIPAA-compliant.
2. Target 90% appointment show rate using CareConnect.
3. Employee/patient satisfaction tracked via optional post-visit survey (patients) and weekly survey (staff).

## Team

| Name | GitHub |
|---|---|
| Suebin Hur | suebinhur |
| Samuel Duarte | ssamuelduarte |
| Brandon Howe | brandonhowe |
| Nathan Mamaril | nathanmamaril |
