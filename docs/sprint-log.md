# CareConnect Sprint Backlog

Source: team sprint-tracking sheet (task-level: assignee/status/hours) merged with the Product Backlog doc (priority/sprint). Hours shown are Original/Remaining estimate — identical because nothing has started yet. This is a point-in-time snapshot (pasted into Claude 2026-10-14); re-sync from source if it drifts.


---
## Physician

### As a Physician, I want to create an account and log in securely so that I can access my schedule and patient list.
**Priority:** High · **Sprint:** 1 · **Story points:** 7.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 279 | Task 1: Design account/login database | ssamuelduarte | Not Started | 1.5 |
| 280 | Task 2: Build user registration registration form (include option to select role) | suebinhur | Not Started | 1 |
| 281 | Task 3: Build backend registration with password hashing | brandonhowe | Not Started | 2 |
| 282 | Task 4: Build login page | nathanmamaril | Not Started | 0.5 |
| 283 | Task 5: Build backend login endpoint with session/token handling | brandonhowe | Not Started | 2 |
| 284 | Task 6: Test login/logout flow | suebinhur | Not Started | 0.5 |

### As a Physician, I want to reset my password if I forget it so that I'm not locked out of my schedule.
**Priority:** Medium · **Sprint:** 1 · **Story points:** 5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 61 | Task 1: Build "Forgot Password" link/form (frontend) | nathanmamaril | Not Started | 1 |
| 62 | Task 2: Build backend endpoint to generate reset token and email it | brandonhowe | Not Started | 2 |
| 63 | Task 3: Build reset password page to accept new password with token | suebinhur | Not Started | 1.5 |
| 64 | Task 4: Test token expiration and invalid-token handling | ssamuelduarte | Not Started | 0.5 |

### As a Physician, I want to update my profile (name, role, phone number) so that my details stay accurate.
**Priority:** Low · **Sprint:** 2 · **Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 266 | Task 1: Build profile edit form (frontend) | suebinhur | Not Started | 1 |
| 267 | Task 2: Build a backend endpoint to update profile fields | suebinhur | Not Started | 1 |
| 268 | Task 3: Add input validation for phone number format and required fields | brandonhowe | Not Started | 0.5 |

### As a Physician, I want to define recurring weekly availability so that I don't have to manually set my schedule each week.
**Priority:** High · **Sprint:** 1 · **Story points:** 7.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 71 | Task 1: Design recurring-availability data model (include day of the week, time range, and end date) | ssamuelduarte | Not Started | 1.5 |
| 72 | Task 2: Build availability-setting UI | nathanmamaril | Not Started | 3 |
| 73 | Task 3: Build backend endpoint to update recurring rules | brandonhowe | Not Started | 1.5 |
| 74 | Task 4: Write logic to generate updated bookable slots from recurring roles | brandonhowe | Not Started | 1 |
| 75 | Task 5: Test that changes to recurring availability update calendar/appointment slots correctly | nathanmamaril | Not Started | 0.5 |

### As a Physician, I want to avoid schedule conflicts so that I am only seeing one patient at a time.
**Priority:** High · **Sprint:** 1 · **Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 77 | Task 1: Design conflict-check logic | ssamuelduarte | Not Started | 1 |
| 78 | Task 2: Build backend validation to reject overlapping bookings at write-time | ssamuelduarte | Not Started | 2 |
| 79 | Task 3: Add frontend warning/error message when a conflict is attempted | nathanmamaril | Not Started | 0.5 |
| 80 | Task 4: Test concurrent booking attempts on same slot | nathanmamaril | Not Started | 1 |

### As a Physician, I want to block out vacations, sick days, and meetings so that those times aren't bookable.
**Priority:** High · **Sprint:** 2 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 270 | Task 1: Build "block time off" UI (date/time range picker with reason text box) | suebinhur | Not Started | 1.5 |
| 271 | Task 2: Build a backend endpoint to save blocked time and exclude it from availability | nathanmamaril | Not Started | 1.5 |
| 272 | Task 3: Test that blocked time correctly remove/hides slots from the patient-facing view | brandonhowe | Not Started | 1 |

### As a Physician, I want to view my full daily schedule with patient names and appointment types so that I can prepare for the day.
**Priority:** High · **Sprint:** 1 · **Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 87 | Task 1: Design schedule view page | suebinhur | Not Started | 1.5 |
| 88 | Task 2: Build backend endpoint to fetch physician's appointments for a given day | ssamuelduarte | Not Started | 1.5 |
| 89 | Task 3: Connect frontend to endpoint and show patient name + appointment type | nathanmamaril | Not Started | 1 |
| 91 | Task 4: Test with different types of days (full, empty, appointments in morning and evening) | brandonhowe | Not Started | 0.5 |

### As a Physician, I want to mark an appointment as completed, no-show, or cancelled so that my records stay accurate
**Priority:** High · **Sprint:** 1 · **Story points:** 3

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 94 | Task 1: Add status field to appointment data model | nathanmamaril | Not Started | 0.5 |
| 95 | Task 2: Build UI control on each appointment to set status | ssamuelduarte | Not Started | 1 |
| 96 | Task 3: Build backend endpoint to update appointment status | brandonhowe | Not Started | 1 |
| 97 | Task 4: Test that status updates reflect correctly for reporting purposes | suebinhur | Not Started | 0.5 |

### As a Physician, I want to see flags on appointments that require my sign-off for PA-led visits so that supervision requirements are met.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 274 | Task 1: Add "requires sign-off" tag to appointment data model for PA-led visits | _unassigned_ | Not Started | 0.5 |
| 275 | Task 2: Build UI indicator on flagged appointments | _unassigned_ | Not Started | 1 |
| 276 | Task 3: Build sign-off button (include backend endpoint to mark signed) | _unassigned_ | Not Started | 2 |
| 277 | Task 4: Test flag appears only on PA-led visits and clears after sign-off | _unassigned_ | Not Started | 1 |

### As a Physician, I want to view the combined schedule of PAs and Nurses I supervise so that I can coordinate patient care
**Priority:** Medium · **Sprint:** 1 · **Story points:** 6

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 104 | Task 1: Design Physician to PA and Nurse relationship in data model | ssamuelduarte | Not Started | 1 |
| 105 | Task 2: Build backend endpoint to fetch schedules of all supervised staff | brandonhowe | Not Started | 2 |
| 106 | Task 3: Build combined schedule UI | suebinhur | Not Started | 2 |
| 107 | Task 4: Test with multiple supervised staff and overlapping appointments | nathanmamaril | Not Started | 1 |

### As a Physician, I want to log out of my account so that information isn't left exposed on a shared device.
**Priority:** High · **Sprint:** 1 · **Story points:** 1.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 109 | Task 1: Build logout button | nathanmamaril | Not Started | 0.5 |
| 110 | Task 2: Build backend endpoint to invalidate session/token | brandonhowe | Not Started | 0.5 |
| 111 | Task 3: Test that logging out of the system completely prevents access to private pages | suebinhur | Not Started | 0.5 |

### As a Physician, I want confidence that patients can't see other patients' names or appointment details on the platform so that I'm not liable for a privacy breach
**Priority:** High · **Sprint:** 1 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 114 | Task 1: Implement role-based access control rules restricting patient views to their own data | ssamuelduarte | Not Started | 2 |
| 115 | Task 2: Review all patient facing endpoints/UI for data leakage | suebinhur | Not Started | 1 |
| 116 | Task 3: Test by attempting to access another patient's appointment via URL manipulation | brandonhowe | Not Started | 1 |

### As a Physician, I want to set the length of my appointments by type so that the right amount of time is booked.
**Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 118 | Task 1: Add appointment types with their corresponding duration in data model | ssamuelduarte | Not Started | 1 |
| 119 | Task 2: Build UI for physician to set durations per type | nathanmamaril | Not Started | 1.5 |
| 120 | Task 3: Build backend endpoint to save duration settings | brandonhowe | Not Started | 1.5 |
| 121 | Task 4: Test that slot length adjusts correctly when appointment type changes | suebinhur | Not Started | 0.5 |

---
## Data Analyst

### As a Data Analyst, I want to create an account and log in securely so that I can access reporting data.
**Priority:** High · **Sprint:** 1 · **Story points:** 7

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 452 | Task 1: Design account/login database for Data Analyst role | _unassigned_ | Not Started | 1 |
| 453 | Task 2: Build the registration form (include an option to select role) | _unassigned_ | Not Started | 1 |
| 454 | Task 3: Build the backend registration with password hashing | _unassigned_ | Not Started | 2 |
| 455 | Task 4: Build the login page | _unassigned_ | Not Started | 0.5 |
| 456 | Task 5: Build the backend login endpoint with session/token handling | _unassigned_ | Not Started | 2 |
| 457 | Task 6: Restrict the reporting tools in the Employee Dashboard to the Data Analyst role | _unassigned_ | Not Started | - |
| 459 | Task 7: Test login/logout flow and role access | _unassigned_ | Not Started | 0.5 |

### As a Data Analyst, I want to generate a chart of appointments booked per week so that trends are visible to management.
**Priority:** High · **Sprint:** 2 · **Story points:** 5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 253 | Task 1: Design the chart layout and weekly aggregation logic | _unassigned_ | Not Started | 1 |
| 254 | Task 2: Build a backend query to count appointments booked per week | _unassigned_ | Not Started | 1.5 |
| 255 | Task 3: Build a chart UI in the reporting dashboard (with date range filter) | _unassigned_ | Not Started | 2 |
| 256 | Task 4: Test with weeks of different volumes, including empty weeks | _unassigned_ | Not Started | 0.5 |

### As a Data Analyst, I want to generate a no-show rate report broken down by physician, day of week, or appointment type so that patterns can be identified.
**Priority:** High · **Sprint:** 1 · **Story points:** 5.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 248 | Task 1: Define no-show rate calculation (exclude patient-cancelled appointments) | _unassigned_ | Not Started | 0.5 |
| 249 | Task 2: Build backend queries to calculate no-show rate by physician, day of week, and appointment type | _unassigned_ | Not Started | 2 |
| 250 | Task 3: Build report UI with a breakdown selector and table/chart view | _unassigned_ | Not Started | 2 |
| 251 | Task 4: Test that rates are accurate against sample data for each breakdown | _unassigned_ | Not Started | 1 |

### As a Data Analyst, I want to pull raw appointment data from the database so that I can analyze it.
**Priority:** High · **Sprint:** 2 · **Story points:** 4.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 243 | Task 1: Create read-only database access/view for appointment data | _unassigned_ | Not Started | 1 |
| 244 | Task 2: Build a backend endpoint to retrieve raw appointment records with date and field filters | _unassigned_ | Not Started | 1.5 |
| 245 | Task 3: Build a raw data table view in the dashboard with pagination; 1.5 hrs | _unassigned_ | Not Started | 1.5 |
| 246 | Task 4: Test retrieval with large data volumes and filters | _unassigned_ | Not Started | 0.5 |

### As a Data Analyst, I want to view aggregated patient and staff satisfaction survey results so that I can include that data in reporting.
**Priority:** Low · **Sprint:** 2 · **Story points:** 5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 238 | Task 1: Design survey results data model (aggregated scores only) | _unassigned_ | Not Started | 1 |
| 239 | Task 2: Build a backend endpoint to aggregate patient and staff survey results | _unassigned_ | Not Started | 1.5 |
| 240 | Task 3: Build the survey results view with averages and trends | _unassigned_ | Not Started | 2 |
| 241 | Task 4: Test that aggregates match the underlying survey responses | _unassigned_ | Not Started | 0.5 |

### As a Data Analyst, I want to export dashboards and reports so that I can share them outside of CareConnect.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 4.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 233 | Task 1: Add export buttons (PDF/CSV) to dashboards and reports | _unassigned_ | Not Started | 1 |
| 234 | Task 2: Build backend export generation for charts and report tables | _unassigned_ | Not Started | 2 |
| 235 | Task 3: Confirm exported files contain no patient names or other Protected Health Information (PHI) | _unassigned_ | Not Started | 0.5 |
| 236 | Task 4: Test exports for each report type and file format | _unassigned_ | Not Started | 1 |

### As a Data Analyst, I want to access data that does not include patient names so that I am not handling sensitive information.
**Priority:** High · **Sprint:** 1 · **Story points:** 4.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 228 | Task 1: Create a de-identified data view that removes patient names and contact details | _unassigned_ | Not Started | 1.5 |
| 229 | Task 2: Point all Data Analyst endpoints and reports to the de-identified view | _unassigned_ | Not Started | 1 |
| 230 | Task 3: Restrict the Data Analyst role from accessing identifiable patient tables | _unassigned_ | Not Started | 1 |
| 231 | Task 4: Test that no patient names or contact details appear in any analyst view or endpoint | _unassigned_ | Not Started | 1 |

### As a Data Analyst, I want to log out of my account so that reporting data stays secure.
**Priority:** High · **Sprint:** 1 · **Story points:** 1.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 224 | Task 1: Build a logout button in the reporting dashboard | _unassigned_ | Not Started | 0.5 |
| 225 | Task 2: Build a backend endpoint to invalidate the session/token | _unassigned_ | Not Started | 0.5 |
| 226 | Task 3: Test that reporting pages can't be reopened after logout | _unassigned_ | Not Started | 0.5 |

---
## Nurse

### As a Nurse, I want to create an account and log in securely so that I can access relevant schedules.
**Priority:** High · **Sprint:** 1 · **Story points:** 6.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 195 | Task 1: Design the account/login database for Nurse accounts (include a link to supervising Physicians/PAs for internal system) | _unassigned_ | Not Started | 1.5 |
| 196 | Task 2: Build a registration form and include an option to select a role | _unassigned_ | Not Started | 1 |
| 197 | Task 3: Build backend registration with a password hashing system | _unassigned_ | Not Started | 2 |
| 198 | Task 4: Build the login page | _unassigned_ | Not Started | 0.5 |
| 199 | Task 5: Build backend login endpoint with session/token handling | _unassigned_ | Not Started | 1 |
| 200 | Task 6: Test the login/logout flow | _unassigned_ | Not Started | 0.5 |

### As a Nurse, I want to reset my password if I forget it so that I can regain access.
**Priority:** High · **Sprint:** 1 · **Story points:** 5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 202 | Task 1: Build "Forgot Password" link/form (frontend) | _unassigned_ | Not Started | 1 |
| 203 | Task 2: Build a backend endpoint to generate a reset token and email it | _unassigned_ | Not Started | 2 |
| 204 | Task 3: Build a reset password page to accept a new password with a token | _unassigned_ | Not Started | 1.5 |
| 205 | Task 4: Test token expiration and invalid-token handling | _unassigned_ | Not Started | 0.5 |

### As a Nurse, I want to view the daily schedules of the Physicians and PAs I support so I can prepare for each patient's visit.
**Story points:** 8 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 207 | Task 1: Design Nurse-to-Physician/PA support relationship in data model | _unassigned_ | Not Started | 1 |
| 208 | Task 2: Design a daily schedule view page for supported providers | _unassigned_ | Not Started | 1.5 |
| 209 | Task 3: Build a backend endpoint to fetch daily appointments for all supported Physicians and PAs | _unassigned_ | Not Started | 2 |
| 210 | Task 4: Connect the frontend to the endpoint and show the patient name, appointment type, and provider | _unassigned_ | Not Started | 1.5 |
| 211 | Task 5: Restrict the view so a Nurse only sees providers they support | _unassigned_ | Not Started | 1 |
| 212 | Task 6: Test with different types of days (full, empty, overlapping providers, morning and evening appointments) | _unassigned_ | Not Started | 1 |

### As a Nurse, I want to add visit notes tied to a specific appointment so that care details are logged.
**Priority:** Low · **Sprint:** 2 · **Story points:** 5.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 214 | Task 1: Add a visit notes table to the data model (linked to appointment, author, timestamp) | _unassigned_ | Not Started | 1 |
| 215 | Task 2: Build an "Add Note" UI on each appointment | _unassigned_ | Not Started | 1 |
| 216 | Task 3: Build a backend endpoint to save and retrieve notes for an appointment | _unassigned_ | Not Started | 1.5 |
| 217 | Task 4: Add role-based access so only authorized staff can view or add notes | _unassigned_ | Not Started | 1 |
| 218 | Task 5: Test that notes save to the correct appointment and aren't visible to patients | _unassigned_ | Not Started | 1 |

### As a Nurse. I want to log out of my account so that patient information stays secure.
**Priority:** High · **Sprint:** 1 · **Story points:** 1.5 · **Story owner:** suebinhur

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 220 | Task 1: Build a logout button | _unassigned_ | Not Started | 0.5 |
| 221 | Task 2: Build a backend endpoint to invalidate the session/token | _unassigned_ | Not Started | 0.5 |
| 222 | Task 3: Test that logging out completely prevents access to private pages | _unassigned_ | Not Started | 0.5 |

---
## Patient

### As a Patient, I want to create a patient account so that my appointment history is tied to my identity
**Priority:** High · **Sprint:** 2 · **Story points:** 5.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 286 | Task 1: Add patient profile fields (name, date of birth, email, phone) to the account data model | _unassigned_ | Not Started | 1 |
| 287 | Task 2: Build a patient registration form in the Customer Portal | _unassigned_ | Not Started | 1 |
| 288 | Task 3: Build a backend endpoint to create a patient account and link it to their appointment records | _unassigned_ | Not Started | 1.5 |
| 289 | Task 4: Add email verification on sign-up | _unassigned_ | Not Started | 1.5 |
| 290 | Task 5: Test registration with duplicate emails and missing required fields | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to log in securely so that my personal appointment data is protected.
**Priority:** High · **Sprint:** 2 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 292 | Task 1: Build patient login page in the Customer Portal | _unassigned_ | Not Started | 0.5 |
| 293 | Task 2: Connect the login page to the backend login endpoint with session/token handling | _unassigned_ | Not Started | 1 |
| 294 | Task 3: Add account lockout after repeated failed login attempts | _unassigned_ | Not Started | 1 |
| 295 | Task 4: Add automatic session timeout after a period of inactivity | _unassigned_ | Not Started | 1 |
| 296 | Task 5: Test login with valid, invalid, and locked-out credentials | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to receive a reminder for my appointment so that I do not forget about my booking.
**Priority:** High · **Sprint:** 2 · **Story points:** 7

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 298 | Task 1: Design reminder data model (appointment, send time, delivery status) | _unassigned_ | Not Started | 1 |
| 299 | Task 2: Build a scheduled job that finds upcoming appointments and queues reminders | _unassigned_ | Not Started | 2 |
| 300 | Task 3: Integrate email service to send reminder messages | _unassigned_ | Not Started | 2 |
| 301 | Task 4: Log the delivery status of each reminder so failed sends can be flagged | _unassigned_ | Not Started | 1 |
| 302 | Task 5: Test that reminders are sent at the correct time and are not duplicated | _unassigned_ | Not Started | 1 |

### As a Patient, I want to search for available appointment times by physician, date, or specialty so that I can find a convenient booking.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 6

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 304 | Task 1: Add specialty field to Physician, PA, and Nurse profiles in data model - 0.5hr | _unassigned_ | Not Started | 0.5 |
| 305 | Task 2: Build backend search endpoint that returns open time slots filtered by physician, date, or specialty | _unassigned_ | Not Started | 2 |
| 306 | Task 3: Build search UI with filters and a list of matching time slots | _unassigned_ | Not Started | 2 |
| 307 | Task 4: Exclude blocked time and already-booked slots from search results | _unassigned_ | Not Started | 1 |
| 308 | Task 5: Test search with each filter on its own and combined | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to book an appointment online so that I do not have to set up appointments over the phone.
**Priority:** High · **Sprint:** 2 · **Story points:** 6

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 310 | Task 1: Build booking UI to select a time slot and appointment type | _unassigned_ | Not Started | 1.5 |
| 311 | Task 2: Build a backend booking endpoint that saves the appointment to the patient's account | _unassigned_ | Not Started | 2 |
| 312 | Task 3: Reuse conflict-check logic to reject a slot that was just taken | _unassigned_ | Not Started | 1 |
| 313 | Task 4: Show a booking success or error message to the patient | _unassigned_ | Not Started | 0.5 |
| 314 | Task 5: Test two patients booking the same slot at the same time | _unassigned_ | Not Started | 1 |

### As a Patient, I want to call the Receptionist to book an appointment so that I can opt to call the office if I prefer not to use the site.
**Priority:** Low · **Sprint:** 2 · **Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 316 | Task 1: Display the clinic phone number and office hours in the Customer Portal | _unassigned_ | Not Started | 0.5 |
| 317 | Task 2: Add "booked by" field (online or Receptionist) to appointment data model | _unassigned_ | Not Started | 0.5 |
| 318 | Task 3: Link phone bookings made by the Receptionist to the patient's existing account | _unassigned_ | Not Started | 1 |
| 319 | Task 4: Test that a phone booking shows up in the patient's upcoming appointments | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to reschedule my own appointment so that the booking can be opened for someone else.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 321 | Task 1: Add a "Reschedule" button to each upcoming appointment | _unassigned_ | Not Started | 0.5 |
| 322 | Task 2: Build reschedule UI that shows open time slots with the same provider | _unassigned_ | Not Started | 1.5 |
| 323 | Task 3: Build backend endpoint to move the appointment and release the original time slot | _unassigned_ | Not Started | 1.5 |
| 324 | Task 4: Test that the original slot becomes bookable again after rescheduling | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to view my upcoming appointments in one place so that I know what is scheduled.
**Priority:** High · **Sprint:** 2 · **Story points:** 3.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 327 | Task 1: Build backend endpoint to fetch the logged-in patient's upcoming appointments | _unassigned_ | Not Started | 1 |
| 328 | Task 2: Build "My Appointments" page showing date, time, provider, and location | _unassigned_ | Not Started | 1.5 |
| 329 | Task 3: Show an empty-state message when no appointments are scheduled | _unassigned_ | Not Started | 0.5 |
| 330 | Task 4: Test that cancelled and past appointments don't show as upcoming | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to see my own name and details, never another patient's, so that my privacy is protected under HIPAA.
**Priority:** High · **Sprint:** 2 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 332 | Task 1: Scope all patient endpoints to the patient ID from the session instead of the URL | _unassigned_ | Not Started | 1.5 |
| 333 | Task 2: Hide other patients' names and details from time slot search results | _unassigned_ | Not Started | 1 |
| 334 | Task 3: Return a generic error for unauthorized requests so no PHI appears in error messages | _unassigned_ | Not Started | 0.5 |
| 335 | Task 4: Test by changing appointment and patient IDs in the URL while logged in as a different patient | _unassigned_ | Not Started | 1 |

### As a Patient, I want to log out of my account so that my information stays secure on shared devices.
**Priority:** High · **Sprint:** 2 · **Story points:** 1.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 337 | Task 1: Add a logout button to the Customer Portal header | _unassigned_ | Not Started | 0.5 |
| 338 | Task 2: Connect the logout button to a backend endpoint that invalidates the session/token | _unassigned_ | Not Started | 0.5 |
| 339 | Task 3: Test that the browser back button can't reopen private pages after logout | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want to cancel my appointment online so that the slot is freed and I'm not marked as a no-show
**Story points:** 3

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 341 | Task 1: Add a "Cancel" button with a confirmation prompt to each upcoming appointment | _unassigned_ | Not Started | 0.5 |
| 342 | Task 2: Build a backend endpoint to set the appointment status to cancelled and free the time slot | _unassigned_ | Not Started | 1 |
| 343 | Task 3: Exclude patient-cancelled appointments from no-show reporting | _unassigned_ | Not Started | 0.5 |
| 344 | Task 4: Update the provider's schedule when a patient cancels | _unassigned_ | Not Started | 0.5 |
| 345 | Task 5: Test that the freed slot shows up in search results again | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want a cancel/reschedule link in my reminder email so that I can change plans in one click.
**Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 347 | Task 1: Generate a secure, expiring link token for each reminder | _unassigned_ | Not Started | 1.5 |
| 348 | Task 2: Add cancel and reschedule links to the reminder email template | _unassigned_ | Not Started | 0.5 |
| 349 | Task 3: Build a landing page that opens the cancel/reschedule flow for that appointment | _unassigned_ | Not Started | 1.5 |
| 350 | Task 4: Test expired, reused, and tampered links | _unassigned_ | Not Started | 1 |

### As a Patient, I want reminder emails to show only the date, time, and location, not the reason for my visit, so that my health information stays private.
**Story points:** 2

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 352 | Task 1: Design reminder email template with only date, time, and location | _unassigned_ | Not Started | 0.5 |
| 353 | Task 2: Remove appointment type and reason for visit from the reminder email data | _unassigned_ | Not Started | 0.5 |
| 354 | Task 3: Review all patient-facing emails for PHI | _unassigned_ | Not Started | 0.5 |
| 355 | Task 4: Test sample reminders to confirm no visit reason or other PHI appears | _unassigned_ | Not Started | 0.5 |

### As a Patient, I want a confirmation email after booking to ensure my appointment is secured.
**Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 357 | Task 1: Design confirmation email template (date, time, and location only) | _unassigned_ | Not Started | 0.5 |
| 358 | Task 2: Trigger confirmation email from the booking endpoint for online and Receptionist bookings | _unassigned_ | Not Started | 1 |
| 359 | Task 3: Add cancel/reschedule links to the confirmation email | _unassigned_ | Not Started | 0.5 |
| 360 | Task 4: Test that one confirmation is sent per booking and that bad email addresses are handled | _unassigned_ | Not Started | 0.5 |

---
## Process Manager

### As a Process Manager, I want to create an account and log in securely so that I can access monitoring tools.
**Priority:** High · **Sprint:** 1 · **Story points:** 2

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 362 | Task 1: Add Process Manager role to account registration and login | _unassigned_ | Not Started | 0.5 |
| 363 | Task 2: Restrict monitoring tools in the Employee Dashboard to the Process Manager role | _unassigned_ | Not Started | 1 |
| 364 | Task 3: Test login and access to monitoring pages | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want to create, deactivate, or reassign staff accounts so that access stays current with staffing changes.
**Priority:** High · **Sprint:** 2 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 366 | Task 1: Build staff account management page to create, deactivate, or reassign accounts | _unassigned_ | Not Started | 2 |
| 367 | Task 2: Build backend endpoints to update account status and role | _unassigned_ | Not Started | 1.5 |
| 368 | Task 3: Test that deactivated accounts can no longer log in | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want to enforce password complexity so that the system meets basic security standards.
**Priority:** High · **Sprint:** 2 · **Story points:** 2

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 370 | Task 1: Add password rules (length, uppercase, number, symbol) to registration and password reset | _unassigned_ | Not Started | 1 |
| 371 | Task 2: Show password requirements and error messages on the form | _unassigned_ | Not Started | 0.5 |
| 372 | Task 3: Test that weak passwords are rejected | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want to monitor whether booking, reminder, and reporting processes are running correctly so that I can catch errors.
**Priority:** High · **Sprint:** 1 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 374 | Task 1: Log success or failure of booking, reminder, and reporting jobs | _unassigned_ | Not Started | 1.5 |
| 375 | Task 2: Build process status page in the Employee Dashboard | _unassigned_ | Not Started | 2 |
| 376 | Task 3: Test that a failed job shows up as an error on the status page | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want to be alerted if a batch of reminders fails to be sent so that I can intervene before patients miss appointments.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 378 | Task 1: Check reminder delivery status after each batch is sent | _unassigned_ | Not Started | 1 |
| 379 | Task 2: Send an email alert to the Process Manager when a batch fails | _unassigned_ | Not Started | 1 |
| 380 | Task 3: Test the alert with a simulated failed batch | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want to verify that role-based permissions are enforced so that the platform remains HIPAA compliant.
**Priority:** High · **Sprint:** 1 · **Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 382 | Task 1: Build a permissions table showing what each role can see and do | _unassigned_ | Not Started | 1 |
| 383 | Task 2: Test each role against pages and endpoints it shouldn't be able to access | _unassigned_ | Not Started | 1.5 |

### As a Process Manager, I want to confirm the system doesn't expose full medical records so that CareConnect stays within its defined scope.
**Priority:** High · **Sprint:** 1 · **Story points:** 1.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 385 | Task 1: Review data model to confirm only scheduling data is stored, not medical records | _unassigned_ | Not Started | 1 |
| 386 | Task 2: Test patient and staff views to confirm no medical record fields appear | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want staff and patient survey results delivered automatically so that I don't have to compile them manually.
**Priority:** Low · **Sprint:** 2 · **Story points:** 3

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 388 | Task 1: Build a scheduled job to compile staff and patient survey results | _unassigned_ | Not Started | 1.5 |
| 389 | Task 2: Email the survey summary to the Process Manager each week | _unassigned_ | Not Started | 1 |
| 390 | Task 3: Test that the summary is sent on schedule with the correct totals | _unassigned_ | Not Started | 0.5 |

### As a Process Manager, I want to log out of my account so that administrative access stays secure.
**Priority:** High · **Sprint:** 1 · **Story points:** 1

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 392 | Task 1: Add a logout button to the Employee Dashboard | _unassigned_ | Not Started | 0.5 |
| 393 | Task 2: Test that admin pages can't be reopened after logout | _unassigned_ | Not Started | 0.5 |

### As a process manager, I want to set when reminders are sent so that patients are reminded at the most useful time
**Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 395 | Task 1: Build reminder timing setting (how many hours before the appointment) | _unassigned_ | Not Started | 1 |
| 396 | Task 2: Update the reminder job to use the saved timing | _unassigned_ | Not Started | 1 |
| 397 | Task 3: Test that reminders are sent at the new time after the setting changes | _unassigned_ | Not Started | 0.5 |

---
## Physician Assistant

### As a Physician Assistant, I want to create an account and log in securely so that I can access my schedule.
**Priority:** High · **Sprint:** 1 · **Story points:** 7.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 400 | Task 1: Map out the database structure for mid-level staff accounts | _unassigned_ | Not Started | 1.5 |
| 401 | Task 2: Build the registration form screen | _unassigned_ | Not Started | 1 |
| 402 | Task 3: Write the code to save new sign-ups and securely scramble user passwords | _unassigned_ | Not Started | 2 |
| 403 | Task 4: Design the sign-in page layout | _unassigned_ | Not Started | 0.5 |
| 404 | Task 5: Write the code that logs users in and gives them a secure session token | _unassigned_ | Not Started | 2 |
| 405 | Task 6: Verify sign-in and sign-out request lifecycles | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want to reset my password if I forget it so that I can regain access to the platform.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 407 | Task 1: Build the "Forgot Password" screen | _unassigned_ | Not Started | 1 |
| 408 | Task 2: Write code to generate a password reset link and email it out | _unassigned_ | Not Started | 2 |
| 409 | Task 3: Build the page where users enter their new password using the link | _unassigned_ | Not Started | 1.5 |
| 410 | Task 4: Test that expired or fake reset links are blocked | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want to update my profile information so that my details stay current.
**Priority:** Low · **Sprint:** 2 · **Story points:** 2.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 412 | Task 1: Build the profile editing form | _unassigned_ | Not Started | 1 |
| 413 | Task 2: Write code to update profile details in the database | _unassigned_ | Not Started | 1 |
| 414 | Task 3: Add checks to make sure phone numbers and required fields are filled out correctly | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want to set and update my own availability so that patients can book with me directly.
**Priority:** High · **Sprint:** 1 · **Story points:** 7.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 416 | Task 1: Design the data structure for weekly availability (days, time slots, and limits) | _unassigned_ | Not Started | 1.5 |
| 417 | Task 2: Build the calendar interface for setting working hours | _unassigned_ | Not Started | 3 |
| 418 | Task 3: Write code to save availability changes to the database | _unassigned_ | Not Started | 1.5 |
| 419 | Task 4: Write logic to turn working hour rules into bookable time slots | _unassigned_ | Not Started | 1 |
| 420 | Task 5: Test that changing availability updates the calendar properly | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want my availability linked to my supervising Physician's schedule so that we can coordinate collaborative hours
**Priority:** Medium · **Sprint:** 1 · **Story points:** 6

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 422 | Task 1: Connect the database links between PA schedules and supervising physicians | _unassigned_ | Not Started | 1 |
| 423 | Task 2: Write validation code to cross-check working hours against the supervisor's schedule | _unassigned_ | Not Started | 2 |
| 424 | Task 3: Build a combined calendar view highlighting shared shifts | _unassigned_ | Not Started | 2 |
| 425 | Task 4: Test schedule alignment with various overlapping supervisor schedules | _unassigned_ | Not Started | 1 |

### As a Physician Assistant, I want to view my daily schedule with patient names and appointment types so that I can prepare for visits.
**Priority:** High · **Sprint:** 1 · **Story points:** 5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 427 | Task 1: Sketch out the daily agenda view layout. | _unassigned_ | Not Started | 1.5 |
| 428 | Task 2: Build backend queries to aggregate daily appointments assigned to the practitioner | _unassigned_ | Not Started | 1.5 |
| 429 | Task 3: Connect the screen to display patient names and visit reasons | _unassigned_ | Not Started | 1.5 |
| 430 | Task 4: Test performance against various schedule densities (busy, clear, and staggered days) | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want to be notified of schedule changes in real time so that I am aware of new or cancelled bookings.
**Priority:** High · **Sprint:** 1 · **Story points:** 3.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 432 | Task 1: Set up event triggers for when appointments are booked or cancelled. | _unassigned_ | Not Started | 1.5 |
| 433 | Task 2: Build popup alert banners for live screen updates. | _unassigned_ | Not Started | 1.5 |
| 434 | Task 3: Test that live alerts show up properly during simultaneous bookings. | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want to mark an appointment as completed, no-show, or cancelled so that reporting stays accurate.
**Priority:** High · **Sprint:** 1 · **Story points:** 3

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 436 | Task 1: Add a status tracking field to the appointment data model. | _unassigned_ | Not Started | 0.5 |
| 437 | Task 2: Build buttons on each appointment to change its status. | _unassigned_ | Not Started | 1 |
| 438 | Task 3: Write code to update appointment statuses in the database. | _unassigned_ | Not Started | 1 |
| 439 | Task 4: Validate that changed states correctly feed into analytical records | _unassigned_ | Not Started | 0.5 |

### As a Physician Assistant, I want to see which of my appointments require Physician co-sign so that I follow supervision rules correctly.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 441 | Task 1: Add a supervisor sign-off tag to mid-level appointment records. | _unassigned_ | Not Started | 0.5 |
| 442 | Task 2: Build visual warning badges for visits needing oversight. | _unassigned_ | Not Started | 1 |
| 443 | Task 3: Build the sign-off button and code to mark visits as approved. | _unassigned_ | Not Started | 2 |
| 444 | Task 4: Test that the flag only appears on PA visits and clears once signed off. | _unassigned_ | Not Started | 1 |

### As a Physician Assistant, I want to log out of my account so that patient data stays secure on shared devices.
**Priority:** High · **Sprint:** 1 · **Story points:** 1.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 446 | Task 1: Add a logout button to the navigation menu. | _unassigned_ | Not Started | 0.5 |
| 447 | Task 2: Write code to clear the user session when logging out. | _unassigned_ | Not Started | 0.5 |
| 448 | Task 3: Test that logging out completely blocks access to private pages. | _unassigned_ | Not Started | 0.5 |

---
## Receptionist

### As a Receptionist, I want to create an account and log in securely so that I can access the booking system.
**Priority:** High · **Sprint:** 1 · **Story points:** 7.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 461 | Task 1: Set up the database account type for front-desk staff | _unassigned_ | Not Started | 1.5 |
| 462 | Task 2: Build the staff sign-up form | _unassigned_ | Not Started | 1 |
| 463 | Task 3: Write code to securely register new staff accounts | _unassigned_ | Not Started | 2 |
| 464 | Task 4: Design the front-desk sign-in page | _unassigned_ | Not Started | 0.5 |
| 465 | Task 5: Write code to log staff in and handle session tokens | _unassigned_ | Not Started | 2 |
| 466 | Task 6: Test the staff login and logout process | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to reset my password if I forget it so that I can regain access quickly.
**Priority:** High · **Sprint:** 1 · **Story points:** 5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 468 | Task 1: Build the staff password recovery screen | _unassigned_ | Not Started | 1 |
| 469 | Task 2: Write code to generate reset tokens and send recovery emails | _unassigned_ | Not Started | 2 |
| 470 | Task 3: Build the page to accept a new password using the reset token | _unassigned_ | Not Started | 1.5 |
| 471 | Task 4: Test invalid and expired token handling | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to search availability across all physicians, PAs, and nurses at once so that I can offer patients the earliest open time slots.
**Priority:** Medium · **Sprint:** 2 · **Story points:** 6

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 473 | Task 1: Design a combined search query for all clinic staff schedules | _unassigned_ | Not Started | 1.5 |
| 474 | Task 2: Build a backend search endpoint to filter open slots across every provider | _unassigned_ | Not Started | 2 |
| 475 | Task 3: Create the front-desk master schedule search screen | _unassigned_ | Not Started | 2 |
| 476 | Task 4: Test search filters across multiple staff calendars simultaneously | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to book an appointment on a patient's behalf so that phone bookings are reserved.
**Priority:** High · **Sprint:** 1 · **Story points:** 5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 478 | Task 1: Build the phone booking form interface for front-desk staff | _unassigned_ | Not Started | 1.5 |
| 479 | Task 2: Write code to link phone bookings to patient profile records | _unassigned_ | Not Started | 2 |
| 480 | Task 3: Add double-booking protection rules for manual phone entries | _unassigned_ | Not Started | 1 |
| 481 | Task 4: Test confirmation workflows for bookings made over the phone | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to reschedule an existing appointment for a patient so that I can handle change requests over the phone.
**Priority:** Medium · **Sprint:** 1 · **Story points:** 4

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 483 | Task 1: Add a manual reschedule button to the staff view | _unassigned_ | Not Started | 0.5 |
| 484 | Task 2: Build a time slot picker screen for phone-in modifications | _unassigned_ | Not Started | 1.5 |
| 485 | Task 3: Write code to move the appointment time and free up the old slot | _unassigned_ | Not Started | 1.5 |
| 486 | Task 4: Test that the old slot becomes open again after rescheduling | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to search a patient's existing appointment so that I can answer their questions during a phone call.
**Priority:** Low · **Sprint:** 2 · **Story points:** 3

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 488 | Task 1: Build a quick-search screen to look up patients by name or phone number | _unassigned_ | Not Started | 1 |
| 489 | Task 2: Write code to filter past and upcoming client bookings | _unassigned_ | Not Started | 1.5 |
| 490 | Task 3: Test search speed with high volumes of records | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want a unified dashboard of all appointments across the clinic so that I can manage the day-to-day schedule.
**Priority:** High · **Sprint:** 1 · **Story points:** 6.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 492 | Task 1: Sketch out the master clinic-wide dashboard layout | _unassigned_ | Not Started | 1.5 |
| 493 | Task 2: Write code to pull daily appointment traffic for all providers | _unassigned_ | Not Started | 2 |
| 494 | Task 3: Connect dashboard components to show live clinic-wide metrics | _unassigned_ | Not Started | 2 |
| 495 | Task 4: Test dashboard performance under heavy use | _unassigned_ | Not Started | 1 |

### As a Receptionist, I want the system to prevent double-booking automatically so that I do not accidentally create conflicts.
**Priority:** High · **Sprint:** 1 · **Story points:** 4.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 497 | Task 1: Add database rules to block overlapping time slots | _unassigned_ | Not Started | 1 |
| 498 | Task 2: Write validation code to check slot availability before saving | _unassigned_ | Not Started | 2 |
| 499 | Task 3: Add error popups on the screen when a conflict is attempted | _unassigned_ | Not Started | 0.5 |
| 500 | Task 4: Test simultaneous booking attempts on the same slot | _unassigned_ | Not Started | 1 |

### As a Receptionist, I want to log out of my account so that patient information stays secure.
**Priority:** High · **Sprint:** 1 · **Story points:** 1.5

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 502 | Task 1: Add a logout button to the staff dashboard | _unassigned_ | Not Started | 0.5 |
| 503 | Task 2: Write code to invalidate staff session tokens upon logout | _unassigned_ | Not Started | 0.5 |
| 504 | Task 3: Test that staff pages cannot be viewed after logging out | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to cancel an appointment on a patient's behalf so that I can handle phone cancellations.
**Story points:** 2

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 506 | Task 1: Add a cancel button with a confirmation prompt to the staff booking view | _unassigned_ | Not Started | 0.5 |
| 507 | Task 2: Write code to set appointment status to "cancelled" and free up the time slot | _unassigned_ | Not Started | 1 |
| 508 | Task 3: Make sure staff cancellations update provider availability arrays properly | _unassigned_ | Not Started | 0.5 |

### As a Receptionist, I want to add a new patient's contact details when booking by phone so that they receive reminders too.
**Story points:** 3

| # | Task | Assignee | Status | Hours |
|---|------|----------|--------|-------|
| 510 | Task 1: Build a quick-add contact form inside the phone booking screen | _unassigned_ | Not Started | 1 |
| 511 | Task 2: Write code to create new patient profiles on the fly during phone bookings | _unassigned_ | Not Started | 1.5 |
| 512 | Task 3: Verify that new phone clients are successfully added to the automated reminder queue | _unassigned_ | Not Started | 0.5 |
