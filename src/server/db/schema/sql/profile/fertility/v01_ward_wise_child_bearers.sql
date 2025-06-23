-- Check if acme_ward_wise_child_bearers table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_child_bearers'
    ) THEN
        CREATE TABLE acme_ward_wise_child_bearers (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL UNIQUE,
            age_15_to_49_child_bearers INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_child_bearers) THEN
--         INSERT INTO acme_ward_wise_child_bearers (
--             id, ward_number, age_15_to_49_child_bearers
--         )
--         VALUES
--         (gen_random_uuid(), 1, 254),
--         (gen_random_uuid(), 2, 308),
--         (gen_random_uuid(), 3, 189),
--         (gen_random_uuid(), 4, 276),
--         (gen_random_uuid(), 5, 215),
--         (gen_random_uuid(), 6, 198),
--         (gen_random_uuid(), 7, 267),
--         (gen_random_uuid(), 8, 301),
--         (gen_random_uuid(), 9, 235),
--         (gen_random_uuid(), 10, 278),
--         (gen_random_uuid(), 11, 243),
--         (gen_random_uuid(), 12, 187),
--         (gen_random_uuid(), 13, 312);
--     END IF;
-- END
-- $$;