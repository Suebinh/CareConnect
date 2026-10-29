const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// IMPORTANT (CLAUDE.md HIPAA constraint): reminder and confirmation
// emails may only ever include date, time, and location — never the
// appointment type or reason for visit (sprint log #351-354).

// With no SMTP_HOST set, the email prints in the back end terminal (handy for demos).
async function sendPasswordReset(to, resetLink) {
  const message = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your CareConnect password',
    text:
      'We received a request to reset your CareConnect password.\n\n' +
      `Use this link within 60 minutes:\n${resetLink}\n\n` +
      "If you didn't ask for this, you can ignore this email.",
  };
  if (!process.env.SMTP_HOST) {
    console.log(`\n[DEV EMAIL - no SMTP configured]\nTo: ${to}\n${message.subject}\n${message.text}\n`);
    return;
  }
  await transporter.sendMail(message);
}

async function sendAppointmentReminder(to, { date, time, location, cancelLink, rescheduleLink }) {
  throw new Error('Not implemented: email.service.sendAppointmentReminder');
}

async function sendBookingConfirmation(to, { date, time, location, cancelLink, rescheduleLink }) {
  throw new Error('Not implemented: email.service.sendBookingConfirmation');
}

async function sendFailedBatchAlert(to, { jobName, failureCount }) {
  throw new Error('Not implemented: email.service.sendFailedBatchAlert');
}

module.exports = {
  transporter,
  sendPasswordReset,
  sendAppointmentReminder,
  sendBookingConfirmation,
  sendFailedBatchAlert,
};
