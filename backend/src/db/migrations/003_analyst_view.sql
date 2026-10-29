-- De-identified view for the Data Analyst role (sprint log #228-230).
-- No patient id, name, email, phone, or date of birth. Safe to re-run.
CREATE OR REPLACE VIEW analyst_appointments AS
SELECT a.id,
       a.start_at,
       a.end_at,
       a.status,
       a.booked_by,
       a.requires_sign_off,
       a.created_at,
       a.provider_id,
       p.name AS provider_name,
       p.specialty AS provider_specialty,
       t.name AS appointment_type
FROM appointments a
JOIN accounts p ON p.id = a.provider_id
JOIN appointment_types t ON t.id = a.appointment_type_id;
