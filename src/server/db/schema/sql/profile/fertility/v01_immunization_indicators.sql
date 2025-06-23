-- Check if acme_immunization_indicators table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_immunization_indicators'
    ) THEN
        CREATE TABLE acme_immunization_indicators (
            id VARCHAR(36) PRIMARY KEY,
            indicator VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            value REAL NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_immunization_indicators) THEN
--         INSERT INTO acme_immunization_indicators (
--             id, indicator, year, value
--         )
--         VALUES
--         -- 2022 Data
--         (gen_random_uuid(), 'BCG_UNDER_ONE', 2022, 98.5),
--         (gen_random_uuid(), 'DPT_HEP_B_HIB3_UNDER_ONE', 2022, 92.3),
--         (gen_random_uuid(), 'MEASLES_RATE', 2022, 3.2),
--         (gen_random_uuid(), 'FULLY_IMMUNIZED_NIP', 2022, 88.7),
--         (gen_random_uuid(), 'INSTITUTIONAL_DELIVERIES', 2022, 75.4),
--         (gen_random_uuid(), 'FOUR_ANC_VISITS', 2022, 70.8),
--         (gen_random_uuid(), 'OPV3_UNDER_ONE', 2022, 91.2),
--         (gen_random_uuid(), 'MR1', 2022, 90.5),
--         (gen_random_uuid(), 'OPV_WASTAGE', 2022, 12.7),
--         (gen_random_uuid(), 'BCG_WASTAGE', 2022, 30.5),
--         -- 2023 Data
--         (gen_random_uuid(), 'BCG_UNDER_ONE', 2023, 99.1),
--         (gen_random_uuid(), 'DPT_HEP_B_HIB3_UNDER_ONE', 2023, 93.8),
--         (gen_random_uuid(), 'MEASLES_RATE', 2023, 2.8),
--         (gen_random_uuid(), 'FULLY_IMMUNIZED_NIP', 2023, 90.2),
--         (gen_random_uuid(), 'INSTITUTIONAL_DELIVERIES', 2023, 78.6),
--         (gen_random_uuid(), 'FOUR_ANC_VISITS', 2023, 73.5),
--         (gen_random_uuid(), 'OPV3_UNDER_ONE', 2023, 92.7),
--         (gen_random_uuid(), 'MR1', 2023, 91.8),
--         (gen_random_uuid(), 'OPV_WASTAGE', 2023, 11.3),
--         (gen_random_uuid(), 'BCG_WASTAGE', 2023, 28.2),
--         -- 2024 Data
--         (gen_random_uuid(), 'BCG_UNDER_ONE', 2024, 99.4),
--         (gen_random_uuid(), 'DPT_HEP_B_HIB3_UNDER_ONE', 2024, 94.5),
--         (gen_random_uuid(), 'MEASLES_RATE', 2024, 2.5),
--         (gen_random_uuid(), 'FULLY_IMMUNIZED_NIP', 2024, 91.8),
--         (gen_random_uuid(), 'INSTITUTIONAL_DELIVERIES', 2024, 81.2),
--         (gen_random_uuid(), 'FOUR_ANC_VISITS', 2024, 75.9),
--         (gen_random_uuid(), 'OPV3_UNDER_ONE', 2024, 93.6),
--         (gen_random_uuid(), 'MR1', 2024, 92.4),
--         (gen_random_uuid(), 'OPV_WASTAGE', 2024, 10.8),
--         (gen_random_uuid(), 'BCG_WASTAGE', 2024, 26.7);
--     END IF;
-- END
-- $$;