-- Run after backing up the database. Apply once to every clinic's patient/order tables.
-- For additional clinic prefixes, replace qcui_ and test_ before execution.

ALTER TABLE qcui_patient
  ADD INDEX idx_qcui_patient_name (name),
  ADD INDEX idx_qcui_patient_phone (phone);

ALTER TABLE qcui_ordlist
  ADD INDEX idx_qcui_ordlist_patient_id (patient_id),
  ADD INDEX idx_qcui_ordlist_date_id (date, id);

ALTER TABLE test_patient
  ADD INDEX idx_test_patient_name (name),
  ADD INDEX idx_test_patient_phone (phone);

ALTER TABLE test_ordlist
  ADD INDEX idx_test_ordlist_patient_id (patient_id),
  ADD INDEX idx_test_ordlist_date_id (date, id);

-- If an index already exists, omit that index clause before running the statement.
-- Do not add UNIQUE(name): same-name patients are valid until manually merged.
