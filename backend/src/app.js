const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

// Keep these last: unmatched routes, then errors.
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
