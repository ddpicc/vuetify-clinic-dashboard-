1. 使用你提供的 Zeabur 连接参数连接 `zeabur` 数据库，先执行只读检查：列出表、统计关键表数量，并确认目标库是否为空。若发现已有业务表或数据，立即停止，不覆盖现有内容。
2. 在本地对 `/Users/qc3/Downloads/mydbs_2026-08-29_20-50-51_mysql_data_Blu6k.sql` 做导入前检查，确认它是完整 MySQL 5.6 备份且包含 `myDbs_user`、`qcui_` 和 `test_` 数据。
3. 若目标库为空，通过加密连接参数直接导入备份。导入前不执行 `clinicdb.sql`，避免使用其破坏性 `DROP DATABASE` 重建逻辑。
4. 执行兼容 MySQL 5.6/8.0 的增量迁移：给 `qcui_patient`/`test_patient` 增加合并状态字段和索引；将 `test_patient.id`、两套 `gaofang.patient_id` 扩展为 `INT UNSIGNED`；新增 `qcui_patient_merge_log` 和 `test_patient_merge_log`，审计快照使用 `TEXT` 而非 JSON。
5. 对导入后的关键结构和数据做验证：患者/处方/膏方行数、最大患者 ID、`patient_id` 字段类型、合并字段、审计表、孤儿处方数量、`patient_id=65535` 数量。只清理结构，不执行任何患者合并或历史业务数据改写。
6. 把导入和迁移的实际结果、任何兼容性问题以及后续前后端部署所需的 Zeabur 环境变量报告给你。