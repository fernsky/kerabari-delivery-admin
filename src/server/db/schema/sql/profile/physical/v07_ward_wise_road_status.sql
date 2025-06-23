-- Check if acme_ward_wise_road_status table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_road_status'
    ) THEN
        CREATE TABLE acme_ward_wise_road_status (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            road_status VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_road_status) THEN
--         INSERT INTO acme_ward_wise_road_status (
--             id, ward_number, road_status, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'BLACK_TOPPED', 320),
--         (gen_random_uuid(), 1, 'GRAVELED', 185),
--         (gen_random_uuid(), 1, 'DIRT', 95),
--         (gen_random_uuid(), 1, 'GORETO', 35),
--         (gen_random_uuid(), 1, 'OTHER', 15),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'BLACK_TOPPED', 340),
--         (gen_random_uuid(), 2, 'GRAVELED', 170),
--         (gen_random_uuid(), 2, 'DIRT', 85),
--         (gen_random_uuid(), 2, 'GORETO', 30),
--         (gen_random_uuid(), 2, 'OTHER', 12),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'BLACK_TOPPED', 280),
--         (gen_random_uuid(), 3, 'GRAVELED', 210),
--         (gen_random_uuid(), 3, 'DIRT', 115),
--         (gen_random_uuid(), 3, 'GORETO', 45),
--         (gen_random_uuid(), 3, 'OTHER', 20),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'BLACK_TOPPED', 335),
--         (gen_random_uuid(), 4, 'GRAVELED', 175),
--         (gen_random_uuid(), 4, 'DIRT', 90),
--         (gen_random_uuid(), 4, 'GORETO', 32),
--         (gen_random_uuid(), 4, 'OTHER', 14),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'BLACK_TOPPED', 310),
--         (gen_random_uuid(), 5, 'GRAVELED', 190),
--         (gen_random_uuid(), 5, 'DIRT', 100),
--         (gen_random_uuid(), 5, 'GORETO', 40),
--         (gen_random_uuid(), 5, 'OTHER', 18);
--     END IF;
-- END
-- $$;