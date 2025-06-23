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
--         (gen_random_uuid(), 1, 'BLACK_TOPPED', 385),
--         (gen_random_uuid(), 1, 'GRAVELED', 156),
--         (gen_random_uuid(), 1, 'DIRT', 78),
--         (gen_random_uuid(), 1, 'GORETO', 42),
--         (gen_random_uuid(), 1, 'OTHER', 24),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'BLACK_TOPPED', 425),
--         (gen_random_uuid(), 2, 'GRAVELED', 145),
--         (gen_random_uuid(), 2, 'DIRT', 65),
--         (gen_random_uuid(), 2, 'GORETO', 38),
--         (gen_random_uuid(), 2, 'OTHER', 18),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'BLACK_TOPPED', 325),
--         (gen_random_uuid(), 3, 'GRAVELED', 178),
--         (gen_random_uuid(), 3, 'DIRT', 95),
--         (gen_random_uuid(), 3, 'GORETO', 52),
--         (gen_random_uuid(), 3, 'OTHER', 31),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'BLACK_TOPPED', 405),
--         (gen_random_uuid(), 4, 'GRAVELED', 152),
--         (gen_random_uuid(), 4, 'DIRT', 70),
--         (gen_random_uuid(), 4, 'GORETO', 40),
--         (gen_random_uuid(), 4, 'OTHER', 22),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'BLACK_TOPPED', 360),
--         (gen_random_uuid(), 5, 'GRAVELED', 165),
--         (gen_random_uuid(), 5, 'DIRT', 85),
--         (gen_random_uuid(), 5, 'GORETO', 48),
--         (gen_random_uuid(), 5, 'OTHER', 27);
--     END IF;
-- END
-- $$;