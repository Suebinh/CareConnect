# CareConnect
IS 495 Group 6 website for CareConnect

# 🎀 CareConnect Website 🎀
*✧ A little corner of the internet for clinic booking: an online clinic booking system with email appointment reminders. Shared HTML/CSS/JS code for the patient portal and staff dashboards.
✧*

Front-end code for **CareConnect**, an online clinic booking system that lets patients book appointments and receive email reminders, and gives clinic staff tools to manage schedules and reporting.

🩷 **Live site:** https://<owner>.github.io/careconnect-site/
---

## 🕊️ Front End vs. Back End 🕊️
Our work is split into **front end** (what users see and click, built in HTML/CSS/JS in this repo) and **back end** (data, logic, and security behind the scenes). Each task in the product backlog falls under one of these.

### 🌸 Front End
| Area | Examples from the backlog |
|------|---------------------------|
| **Accounts and login** | Registration forms (with role selection), login pages, "Forgot Password" form, reset password page, logout buttons, password requirement messages |
| **Profiles** | Profile edit form |
| **Schedules** | Daily schedule views (patient name and appointment type), combined provider schedule, receptionist master schedule, clinic-wide dashboard |
| **Availability** | Weekly availability setting UI, "block time off" date/time picker, appointment duration settings |
| **Booking** | Search UI with filters (physician, date, specialty), booking UI, reschedule and cancel buttons with confirmation prompts, "My Appointments" page, phone booking form |
| **Status and sign-off** | Status controls (completed, no-show, cancelled), sign-off badges and buttons, visit notes UI |
| **Alerts and messages** | Real-time popup banners, conflict warnings, booking success and error messages, empty-state messages |
| **Reporting** | Appointments-per-week chart, no-show report with breakdown selector, raw data table, survey results view, export buttons (PDF/CSV) |
| **Admin tools** | Staff account management page, process status page, permissions display |

### 🍒 Back End
| Area | Examples from the backlog |
|------|---------------------------|
| **Data models** | Accounts, roles, Physician-to-PA/Nurse relationships, appointments (status, "booked by," sign-off flag), availability rules, appointment types and durations, visit notes, reminders, survey results |
| **Authentication and security** | Registration with password hashing, login with session/token handling, logout (invalidate token), password reset tokens and emails, password complexity rules, account lockout, session timeout, email verification |
| **Access control (HIPAA)** | Role-based access rules, scoping patient data to the session ID, generic error messages with no PHI, de-identified data view for analysts |
| **Scheduling logic** | Recurring availability to bookable slots, conflict and double-booking checks, blocked time exclusion, slot release on cancel/reschedule |
| **API endpoints** | Profile update, fetch daily schedules, fetch supervised staff schedules, search open slots, book/reschedule/cancel, update appointment status, sign-off, save notes, save duration settings |
| **Email and jobs** | Reminder scheduling and sending, delivery status logging, confirmation emails, secure expiring cancel/reschedule links, failed-batch alerts, weekly survey summary, reminder timing setting |
| **Reporting queries** | Weekly booking counts, no-show rate calculations, raw appointment data retrieval, survey aggregation, export generation |
| **Monitoring** | Logging success/failure of booking, reminder, and reporting jobs |

### 🤍 Shared
- **Testing:** the person who builds a feature tests it end to end (front end and back end together).
- **Connecting the two:** front end pages call back end endpoints, so agree on endpoint names and data formats before building (for example, `POST /api/login` returns a token).

> **Note:** GitHub Pages only hosts static files, so this repo's HTML/CSS/JS is the front end. Back end code lives in the `backend/` folder and runs separately (or is mocked for the class prototype).

---

## 🎀 Folder Structure 🎀
```
careconnect-site/
├── index.html        # Homepage
├── pages/            # One HTML file per front end page
├── css/              # Stylesheets
├── js/               # Front end scripts
├── images/           # Images and assets
├── backend/          # Back end code (endpoints, jobs, database setup)
└── README.md
```

Name files in lowercase with hyphens (`patient-login.html`, not `Patient Login.html`).

---

## 💌 One-Time Setup 💌
1. Accept the collaborator invitation from your email or at `https://github.com/<owner>/careconnect-site/invitations`.
2. Install [Git](https://git-scm.com/downloads) (or use [GitHub Desktop](https://desktop.github.com/) if you prefer a visual tool).
3. Tell Git who you are:
```
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
```
4. Clone the repo:
```
   git clone https://github.com/<owner>/careconnect-site.git
   cd careconnect-site
```

---

## 🧸 How to Commit and Push Your Work 🧸
Follow these steps every time you work on the site.

**1. Get the latest code** 🌷
```
git checkout main
git pull origin main
```

**2. Create your own branch** 🎀
```
git checkout -b your-name/feature-name
```
Example: `git checkout -b suebin/nurse-schedule-page`

**3. Make your changes** in your editor, then check what changed: ✨
```
git status
```

**4. Stage your changes** 🤍
```
git add .
```
Or stage specific files: `git add pages/nurse-schedule.html`

**5. Commit with a clear message** 💭
```
git commit -m "Add nurse daily schedule page"
```

**6. Push your branch** 🕊️
```
git push origin your-name/feature-name
```

**7. Open a Pull Request (PR)** 💌
- Go to the repo on GitHub and click **Compare & pull request**.
- Add a short description of what you changed.
- Request a teammate to review it.
- Once approved, click **Merge pull request**.

**8. Clean up after merging** 🧼
```
git checkout main
git pull origin main
git branch -d your-name/feature-name
```

---

## 🩰 Commit Message Guidelines 🩰
- Write in present tense and start with a verb: `Add`, `Fix`, `Update`, `Remove`.
- Keep it under about 70 characters.
- Describe what changed, not how.

| Good 🤍 | Bad 🥀 |
|------|-----|
| `Add patient login page` | `stuff` |
| `Fix broken link in nav bar` | `fixed it` |
| `Update reminder email template` | `changes` |

Commit small and often. Many small commits are easier to review and undo than one huge one.

---

## 🍰 Rules for the Team 🍰
1. **Never push directly to `main`.** Use a branch and a pull request.
2. **Always `git pull` before you start working** and before you push.
3. **Work on your own pages or files when possible** to avoid conflicts.
4. **Never commit sensitive data:** no real patient information, passwords, API keys, or tokens. This site is public.
5. **Don't commit junk files** such as `.DS_Store`, `node_modules/`, or personal notes.
6. **Review each other's PRs** within 24 hours so no one is blocked.
7. **Test before you push.** Open your HTML file in a browser and click through it.

---

## 🥀 Fixing Merge Conflicts 🥀
A conflict happens when two people edit the same lines. If Git reports one:

1. Run `git status` to see which files conflict.
2. Open each file and look for conflict markers:
```
   <<<<<<< HEAD
   your version
   =======
   their version
   >>>>>>> main
```
3. Decide what to keep, then delete the three marker lines.
4. Save the file, then:
```
   git add .
   git commit -m "Resolve merge conflict in <filename>"
   git push
```

If you get stuck, ask a teammate before forcing anything. **Never use `git push --force` on `main`.**

---

## 📖 Quick Command Reference 📖
| Task | Command |
|------|---------|
| See current status | `git status` |
| Get latest changes | `git pull origin main` |
| Create a new branch | `git checkout -b branch-name` |
| Switch branches | `git checkout branch-name` |
| Stage all changes | `git add .` |
| Commit | `git commit -m "message"` |
| Push a branch | `git push origin branch-name` |
| See recent history | `git log --oneline` |
| Undo unstaged changes to a file | `git checkout -- filename` |

---

## ✨ Seeing Your Changes Live ✨
The site is hosted with GitHub Pages and redeploys automatically after changes are merged into `main`. This usually takes **1 to 2 minutes**. Check progress under the **Actions** tab. If you don't see your update, do a hard refresh (`Ctrl+Shift+R` on Windows, `Cmd+Shift+R` on Mac).

---

## 🌷 Notes 🌷
- This is a class prototype. GitHub Pages hosts static files only (HTML, CSS, JS), so backend features like login and databases are mocked or handled separately.
- Questions or problems? Message the team chat or contact <Suebin>.

*made with 🎀 by the CareConnect team*
