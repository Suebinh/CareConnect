// Applies ONE migration file (npm run migrate re-runs everything and fails on existing tables).
require('../src/config/loadEnv');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const name = process.argv[2];
if (!name) { console.error('Usage: node scripts/apply-migration.js 003_analyst_view.sql'); process.exit(1); }

(async () => {
  const file = path.join(__dirname, '..', 'src', 'db', 'migrations', path.basename(name));
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(fs.readFileSync(file, 'utf8'));
  console.log(`Applied ${path.basename(name)}`);
  await pool.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
