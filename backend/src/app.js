const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

// Local dev: also serve the frontend so one server (http://localhost:4000) runs the whole app.
// Only the frontend files are exposed, never backend/ (it holds .env secrets).
// GitHub Pages hosts the frontend in production, so this is skipped there.
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  const root = path.join(__dirname, '..', '..');
  const noCache = { etag: false, lastModified: false, setHeaders: (res) => res.set('Cache-Control', 'no-store') };
  const sendFile = (file) => (req, res) => res.set('Cache-Control', 'no-store').sendFile(path.join(root, file));
  app.get(['/', '/index.html'], sendFile('index.html'));
  app.get('/logo.svg', sendFile('logo.svg'));
  for (const dir of ['pages', 'js', 'css']) app.use('/' + dir, express.static(path.join(root, dir), noCache));
}

// Keep these last: unmatched routes, then errors.
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
