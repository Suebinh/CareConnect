// Finds due reminders and sends them (sprint log #298-302). CLAUDE.md
// notes the team's plan is to build the actual sending via a Claude
// Code agent rather than a plain cron job — this function is the
// interface either approach calls into, so swapping the trigger later
// (node-cron here vs. an agent invoking it) doesn't change the logic.

async function runReminderBatch() {
  // TODO:
  // 1. const due = await reminderModel.findDue(new Date())
  // 2. for each: emailService.sendAppointmentReminder(...), then
  //    reminderModel.markDelivered(id, 'sent' | 'failed')
  // 3. log success/failure per CLAUDE.md monitoring requirement
  //    (sprint log #374)
  // 4. if failures exceed a threshold, emailService.sendFailedBatchAlert(...)
  //    (sprint log #378-379)
  throw new Error('Not implemented: reminderJob.runReminderBatch');
}

module.exports = { runReminderBatch };
