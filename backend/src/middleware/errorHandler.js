function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Generic error responses only — per CLAUDE.md's HIPAA constraint, no
// stack traces, query data, or patient details ever go in an error body.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;

  res.status(status).json({ error: message });
}

module.exports = { notFoundHandler, errorHandler };
