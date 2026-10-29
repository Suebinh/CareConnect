const IDENTIFYING_KEYS = new Set([
  'patient_id', 'patient_name', 'patient_email', 'patient_phone', 'patient_dob',
  'date_of_birth', 'email', 'phone', 'password_hash',
]);

// Last-line guard: the SQL view already excludes these, this catches mistakes.
async function stripIdentifiers(rows) {
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).filter(([key]) => !IDENTIFYING_KEYS.has(key)))
  );
}
module.exports = { stripIdentifiers };
