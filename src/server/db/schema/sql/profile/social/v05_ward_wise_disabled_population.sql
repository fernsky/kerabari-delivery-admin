-- Check if acme_ward_wise_disabled_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_disabled_population'
    ) THEN
        CREATE TABLE acme_ward_wise_disabled_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            disabled_population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_disabled_population) THEN
--         INSERT INTO acme_ward_wise_disabled_population (
--             id, ward_number, disabled_population
--         )
--         VALUES
--         -- Sample data for wards 1-5
--         (gen_random_uuid(), 1, 85),
--         (gen_random_uuid(), 2, 72),
--         (gen_random_uuid(), 3, 96),
--         (gen_random_uuid(), 4, 68),
--         (gen_random_uuid(), 5, 79),
--         (gen_random_uuid(), 6, 63),
--         (gen_random_uuid(), 7, 87),
--         (gen_random_uuid(), 8, 74),
--         (gen_random_uuid(), 9, 91),
--         (gen_random_uuid(), 10, 82);
--     END IF;
-- END
-- $$;