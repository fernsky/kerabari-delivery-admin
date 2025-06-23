-- Check if acme_ward_wise_house_map_passed table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_house_map_passed'
    ) THEN
        CREATE TABLE acme_ward_wise_house_map_passed (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            map_passed_status VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_house_map_passed) THEN
--         INSERT INTO acme_ward_wise_house_map_passed (
--             id, ward_number, map_passed_status, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'PASSED', 362),
--         (gen_random_uuid(), 1, 'ARCHIVED', 175),
--         (gen_random_uuid(), 1, 'NEITHER_PASSED_NOR_ARCHIVED', 84),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'PASSED', 395),
--         (gen_random_uuid(), 2, 'ARCHIVED', 158),
--         (gen_random_uuid(), 2, 'NEITHER_PASSED_NOR_ARCHIVED', 68),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'PASSED', 328),
--         (gen_random_uuid(), 3, 'ARCHIVED', 195),
--         (gen_random_uuid(), 3, 'NEITHER_PASSED_NOR_ARCHIVED', 96),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'PASSED', 378),
--         (gen_random_uuid(), 4, 'ARCHIVED', 168),
--         (gen_random_uuid(), 4, 'NEITHER_PASSED_NOR_ARCHIVED', 76),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'PASSED', 345),
--         (gen_random_uuid(), 5, 'ARCHIVED', 182),
--         (gen_random_uuid(), 5, 'NEITHER_PASSED_NOR_ARCHIVED', 88);
--     END IF;
-- END
-- $$;