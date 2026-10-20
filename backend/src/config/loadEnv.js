// .env holds vars the team manages by hand (JWT_SECRET, SMTP_*, PORT).
// .env.local holds whatever `neon deploy` pulls (DATABASE_URL, etc.) and
// gets overwritten every time that command runs, so it takes precedence.
require('dotenv').config();
require('dotenv').config({ path: '.env.local', override: true });
