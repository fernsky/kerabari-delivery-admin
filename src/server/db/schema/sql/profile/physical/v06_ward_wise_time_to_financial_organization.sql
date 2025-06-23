-- Check if acme_ward_wise_time_to_financial_organization table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_time_to_financial_organization'
    ) THEN
        CREATE TABLE acme_ward_wise_time_to_financial_organization (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            time_to_financial_organization VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_financial_organization) THEN
--         INSERT INTO acme_ward_wise_time_to_financial_organization (
--             id, ward_number, time_to_financial_organization, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'UNDER_15_MIN', 390),
--         (gen_random_uuid(), 1, 'UNDER_30_MIN', 150),
--         (gen_random_uuid(), 1, 'UNDER_1_HOUR', 55),
--         (gen_random_uuid(), 1, '1_HOUR_OR_MORE', 15),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'UNDER_15_MIN', 375),
--         (gen_random_uuid(), 2, 'UNDER_30_MIN', 162),
--         (gen_random_uuid(), 2, 'UNDER_1_HOUR', 58),
--         (gen_random_uuid(), 2, '1_HOUR_OR_MORE', 18),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'UNDER_15_MIN', 320),
--         (gen_random_uuid(), 3, 'UNDER_30_MIN', 182),
--         (gen_random_uuid(), 3, 'UNDER_1_HOUR', 75),
--         (gen_random_uuid(), 3, '1_HOUR_OR_MORE', 28),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'UNDER_15_MIN', 380),
--         (gen_random_uuid(), 4, 'UNDER_30_MIN', 158),
--         (gen_random_uuid(), 4, 'UNDER_1_HOUR', 60),
--         (gen_random_uuid(), 4, 'HOUR_OR_MORE', 20),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'UNDER_15_MIN', 345),
--         (gen_random_uuid(), 5, 'UNDER_30_MIN', 170),
--         (gen_random_uuid(), 5, 'UNDER_1_HOUR', 65),
--         (gen_random_uuid(), 5, '1_HOUR_OR_MORE', 25);
--     END IF;
-- END
-- $$;