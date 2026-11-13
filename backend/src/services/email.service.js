const fs = require('fs');
const os = require('os');
const path = require('path');
const nodemailer = require('nodemailer');
const { renderEmail, renderReminderEmail, siteUrl } = require('./emailTemplate');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// IMPORTANT (CLAUDE.md HIPAA constraint): patient emails may only ever
// include date, time, and location — never the appointment type or reason
// for visit (sprint log #351-354). Every patient email goes through
// emailTemplate.renderEmail so they all share the site's branding.

// Reserved / fake domains used by seed and test data. Never actually send to
// these: it would bounce and can get a real mailbox (e.g. Gmail) rate-limited.
const TEST_DOMAIN_RE = /@(?:[^@\s]+\.)?(?:example\.(?:com|org|net)|[^@\s]+\.(?:test|invalid|example|localhost))$/i;
const isTestAddress = (email) => TEST_DOMAIN_RE.test(String(email || '').trim());

// Where HTML previews go when no SMTP server is configured (open them in a browser).
const PREVIEW_DIR = process.env.EMAIL_PREVIEW_DIR || path.join(os.tmpdir(), 'careconnect-emails');

// Returns 'sent' | 'skipped'. Throws if the SMTP server rejects the message.
async function deliver({ to, subject, html, text }) {
  const message = { from: process.env.EMAIL_FROM, to, subject, html, text };

  if (!process.env.SMTP_HOST) {
    // Dev mode: print it and save the HTML so the branded version can be viewed.
    let previewPath = '';
    try {
      fs.mkdirSync(PREVIEW_DIR, { recursive: true });
      const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      previewPath = path.join(PREVIEW_DIR, `${Date.now()}-${slug}.html`);
      fs.writeFileSync(previewPath, html);
    } catch (e) { previewPath = '(preview not saved)'; }
    console.log(`\n[DEV EMAIL - no SMTP configured]\nTo: ${to}\n${subject}\n${text}\nHTML preview: ${previewPath}\n`);
    return 'sent';
  }
  if (isTestAddress(to)) {
    console.log(`[email] skipped test address (${subject})`);
    return 'skipped';
  }
  await transporter.sendMail(message);
  return 'sent';
}

async function sendPasswordReset(to, resetLink) {
  const { html, text } = renderEmail({
    preheader: 'Use this link within 60 minutes to choose a new password.',
    eyebrow: 'Account',
    heading: 'Reset your password',
    intro: 'We received a request to reset your CareConnect password. This link works once and expires in 60 minutes.',
    cta: { label: 'Choose a new password', url: resetLink },
    note: "If you didn't ask for this, you can ignore this email. Your password won't change.",
  });
  return deliver({ to, subject: 'Reset your CareConnect password', html, text });
}

// Reminder (sprint log #300, #347-349, #352-353), "1b" design in emailTemplate.renderReminderEmail.
// Date, time, and location only, never the visit type or reason.
const { CLINIC_TZ, CLINIC_LOCATION, CLINIC_PHONE } = require('../config/clinic');

// "Tomorrow" / "In 1 week" / "In 3 days" / "Today", by clinic calendar days.
function relativeDay(startAt, now = new Date()) {
  const ymd = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
  const days = Math.round((Date.parse(ymd(startAt)) - Date.parse(ymd(now))) / 864e5);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days % 7 === 0) return `In ${days / 7} week${days === 7 ? '' : 's'}`;
  return `In ${days} days`;
}

function telHref(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return 'tel:' + (digits.length === 10 ? '+1' + digits : digits);
}

// details: { startAt, links: {confirm, reschedule, cancel, calendar}, stopUrl }
function reminderEmail({ startAt, links, stopUrl }) {
  const d = new Date(startAt);
  const part = (opts) => d.toLocaleString('en-US', { timeZone: CLINIC_TZ, ...opts });
  const month = part({ month: 'short' });
  const day = part({ day: 'numeric' });
  const weekday = part({ weekday: 'short' });
  const time = part({ hour: 'numeric', minute: '2-digit' });
  const badge = relativeDay(d);
  const when = badge.toLowerCase(); // "tomorrow", "in 1 week", "today"
  const { html, text } = renderReminderEmail({
    preheader: `${weekday}, ${month} ${day} at ${time}. Tap to confirm, reschedule, or cancel.`,
    badge,
    heading: `Your appointment is ${when}`,
    month, day, weekday, time,
    location: CLINIC_LOCATION,
    links,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_LOCATION)}`,
    phone: CLINIC_PHONE,
    phoneHref: telHref(CLINIC_PHONE),
    stopUrl,
  });
  return { subject: `Appointment ${when}: ${weekday}, ${month} ${day}, ${time}. Please confirm`, html, text };
}

async function sendAppointmentReminder(to, details) {
  return deliver({ to, ...reminderEmail(details) });
}

// Sample reminder for the settings page: a made-up 10:30 AM (clinic time)
// appointment on the day `hoursBefore` from now, placeholder links. No real patient.
function previewAppointmentReminder(hoursBefore) {
  const ymd = new Date(Date.now() + hoursBefore * 3_600_000).toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
  const guess = new Date(`${ymd}T10:30:00Z`);
  const inTz = new Date(guess.toLocaleString('en-US', { timeZone: CLINIC_TZ }));
  const inUtc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }));
  const startAt = new Date(guess.getTime() + (inUtc - inTz)); // 10:30 wall-clock in the clinic's zone
  const base = `${siteUrl()}/pages/appointment-link.html?t=preview&a=`;
  const links = { confirm: base + 'confirm', reschedule: base + 'reschedule', cancel: base + 'cancel', calendar: base + 'calendar' };
  return reminderEmail({ startAt, links, stopUrl: `${siteUrl()}/pages/stop-reminders.html?u=0&s=preview` });
}

// Confirmation (sprint log #357-358). Cancel/reschedule links (#359) not built yet.
async function sendBookingConfirmation(to, { date, time, location }) {
  const { html, text } = renderEmail({
    preheader: `${date} at ${time}`,
    eyebrow: 'Booking confirmed',
    heading: "You're all set",
    intro: 'Your appointment is booked. Here are the details.',
    details: [
      { label: 'Date', value: date },
      { label: 'Time', value: time },
      { label: 'Location', value: location },
    ],
    cta: { label: 'View my appointments', url: `${siteUrl()}/pages/patient-login.html` },
    note: 'Need to change it? Log in to CareConnect or call the front desk.',
  });
  return deliver({ to, subject: 'Your CareConnect appointment is booked', html, text });
}

// Waitlist: an earlier slot opened.
async function sendWaitlistOpening(to, { date, time, location, bookLink }) {
  const { html, text } = renderEmail({
    preheader: `${date} at ${time} just opened up`,
    eyebrow: 'Waitlist',
    heading: 'An earlier time just opened up',
    intro: 'A time inside your waitlist window is now free. Other patients on the waitlist were told too, so it goes to whoever books first.',
    details: [
      { label: 'Date', value: date },
      { label: 'Time', value: time },
      { label: 'Location', value: location },
    ],
    cta: { label: 'Log in to book it', url: bookLink },
    note: "You're still on the waitlist. You can leave it any time from your CareConnect account.",
  });
  return deliver({ to, subject: 'An earlier CareConnect appointment just opened up', html, text });
}

// Staff alert (sprint log #378-379). Counts only, no patient details.
async function sendFailedBatchAlert(to, { jobName, failureCount, sentCount }) {
  const { html, text } = renderEmail({
    preheader: `${failureCount} reminder(s) failed to send`,
    eyebrow: 'Process alert',
    heading: 'Some reminders failed to send',
    intro: `The latest ${jobName} run could not deliver ${failureCount} email(s) (${sentCount} sent). Patients in that batch may not get their reminder.`,
    cta: { label: 'Open reminder settings', url: `${siteUrl()}/pages/reminder-settings.html` },
    note: 'Failed reminders are listed as "failed" and are not retried automatically. Check the email server settings.',
    footer: 'You are receiving this because you manage CareConnect appointment reminders.',
  });
  return deliver({ to, subject: `CareConnect alert: ${failureCount} reminder(s) failed`, html, text });
}

module.exports = {
  transporter,
  isTestAddress,
  sendPasswordReset,
  sendAppointmentReminder,
  previewAppointmentReminder,
  reminderEmail,
  sendBookingConfirmation,
  sendWaitlistOpening,
  sendFailedBatchAlert,
};
