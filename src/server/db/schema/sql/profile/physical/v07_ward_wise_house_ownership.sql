-- Check if acme_ward_wise_house_ownership table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_house_ownership'
    ) THEN
        CREATE TABLE acme_ward_wise_house_ownership (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            ownership_type VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_house_ownership) THEN
--         INSERT INTO acme_ward_wise_house_ownership (
--             id, ward_number, ownership_type, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'PRIVATE', 475),
--         (gen_random_uuid(), 1, 'RENT', 95),
--         (gen_random_uuid(), 1, 'INSTITUTIONAL', 28),
--         (gen_random_uuid(), 1, 'OTHER', 12),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'PRIVATE', 492),
--         (gen_random_uuid(), 2, 'RENT', 88),
--         (gen_random_uuid(), 2, 'INSTITUTIONAL', 24),
--         (gen_random_uuid(), 2, 'OTHER', 10),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'PRIVATE', 428),
--         (gen_random_uuid(), 3, 'RENT', 112),
--         (gen_random_uuid(), 3, 'INSTITUTIONAL', 32),
--         (gen_random_uuid(), 3, 'OTHER', 18),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'PRIVATE', 462),
--         (gen_random_uuid(), 4, 'RENT', 102),
--         (gen_random_uuid(), 4, 'INSTITUTIONAL', 30),
--         (gen_random_uuid(), 4, 'OTHER', 15),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'PRIVATE', 445),
--         (gen_random_uuid(), 5, 'RENT', 105),
--         (gen_random_uuid(), 5, 'INSTITUTIONAL', 35),
--         (gen_random_uuid(), 5, 'OTHER', 20);
--     END IF;
-- END
-- $$;