const PHONE_RE = /^\+?[0-9\s().-]{10,15}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const phoneProblem = (phone) => (PHONE_RE.test(phone) ? null : 'Enter a valid phone number');
const passwordProblem = (pw) =>
  typeof pw === 'string' && pw.length >= 8 ? null : 'Password must be at least 8 characters';

function isValidDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
module.exports = { phoneProblem, passwordProblem, isValidDate };
