require('./src/config/loadEnv');
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`CareConnect backend listening on port ${PORT}`);
});

// Appointment reminders: checks every minute, but only sends when a Process
// Manager has turned reminders on (off by default). REMINDER_SCHEDULER=off disables the timer.
require('./src/jobs/reminderJob').startReminderScheduler();
