-- Patient merge support. Run after backing up the database.
-- Apply to each clinic prefix used by the application.

ALTER TABLE qcui_patient
  ADD COLUMN merge_status ENUM('active', 'merged') NOT NULL DEFAULT 'active',
  ADD COLUMN merged_into_id INT UNSIGNED NULL,
  ADD COLUMN merged_at DATETIME NULL,
  ADD INDEX idx_qcui_patient_merge_status (merge_status),
  ADD INDEX idx_qcui_patient_merged_into (merged_into_id);

ALTER TABLE test_patient
  ADD COLUMN merge_status ENUM('active', 'merged') NOT NULL DEFAULT 'active',
  ADD COLUMN merged_into_id INT UNSIGNED NULL,
  ADD COLUMN merged_at DATETIME NULL,
  ADD INDEX idx_test_patient_merge_status (merge_status),
  ADD INDEX idx_test_patient_merged_into (merged_into_id);

CREATE TABLE qcui_patient_merge_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_patient_id INT UNSIGNED NOT NULL,
  target_patient_id INT UNSIGNED NOT NULL,
  source_snapshot JSON NOT NULL,
  target_snapshot JSON NOT NULL,
  moved_orders INT UNSIGNED NOT NULL DEFAULT 0,
  moved_gaofang INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_qcui_patient_merge_source (source_patient_id),
  KEY idx_qcui_patient_merge_target (target_patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE test_patient_merge_log LIKE qcui_patient_merge_log;
ALTER TABLE test_patient_merge_log
  DROP KEY idx_qcui_patient_merge_source,
  DROP KEY idx_qcui_patient_merge_target,
  ADD KEY idx_test_patient_merge_source (source_patient_id),
  ADD KEY idx_test_patient_merge_target (target_patient_id);
