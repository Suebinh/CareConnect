const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// IMPORTANT (CLAUDE.md HIPAA constraint): reminder and confirmation
// emails may only ever include date, time, and location — never the
// appointment type or reason for visit (sprint log #351-354).

async function sendPasswordReset(to, resetLink) {
  // TODO: render a password-reset email template, send via transporter
  throw new Error('Not implemented: email.service.sendPasswordReset');
}

async function sendAppointmentReminder(to, { date, time, location, cancelLink, rescheduleLink }) {
  // TODO: render reminder template (date/time/location + secure
  // expiring cancel/reschedule links — sprint log #347-348), send
  throw new Error('Not implemented: email.service.sendAppointmentReminder');
}

async function sendBookingConfirmation(to, { date, time, location, cancelLink, rescheduleLink }) {
  // TODO: render confirmation template, send (sprint log #357-359)
  throw new Error('Not implemented: email.service.sendBookingConfirmation');
}

async function sendFailedBatchAlert(to, { jobName, failureCount }) {
  // TODO: alert Process Manager when a reminder batch fails (sprint log #379)
  throw new Error('Not implemented: email.service.sendFailedBatchAlert');
}

module.exports = {
  transporter,
  sendPasswordReset,
  sendAppointmentReminder,
  sendBookingConfirmation,
  sendFailedBatchAlert,
};
