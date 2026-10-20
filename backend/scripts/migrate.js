// Applies every .sql file in src/db/migrations, in filename order, against
// DATABASE_URL. No psql required — just `npm run migrate`. Re-running is
// safe as long as migrations use CREATE TABLE/INDEX (not IF NOT EXISTS
// guarded yet, so don't run twice against the same already-migrated DB).
require('../src/config/loadEnv');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'src', 'db', 'migrations');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Applying ${file}...`);
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    await pool.query(sql);
  }

  console.log(`Applied ${files.length} migration(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
