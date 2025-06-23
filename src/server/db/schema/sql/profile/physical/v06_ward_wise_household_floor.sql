-- Check if acme_ward_wise_household_floor table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_floor'
    ) THEN
        CREATE TABLE acme_ward_wise_household_floor (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            floor_type VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_floor) THEN
--         INSERT INTO acme_ward_wise_household_floor (
--             id, ward_number, floor_type, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'CONCRETE', 285),
--         (gen_random_uuid(), 1, 'MUD', 120),
--         (gen_random_uuid(), 1, 'WOOD', 95),
--         (gen_random_uuid(), 1, 'BRICK', 145),
--         (gen_random_uuid(), 1, 'TILE', 78),
--         (gen_random_uuid(), 1, 'OTHER', 32),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'CONCRETE', 310),
--         (gen_random_uuid(), 2, 'MUD', 105),
--         (gen_random_uuid(), 2, 'WOOD', 90),
--         (gen_random_uuid(), 2, 'BRICK', 165),
--         (gen_random_uuid(), 2, 'TILE', 85),
--         (gen_random_uuid(), 2, 'OTHER', 28),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'CONCRETE', 240),
--         (gen_random_uuid(), 3, 'MUD', 160),
--         (gen_random_uuid(), 3, 'WOOD', 110),
--         (gen_random_uuid(), 3, 'BRICK', 120),
--         (gen_random_uuid(), 3, 'TILE', 65),
--         (gen_random_uuid(), 3, 'OTHER', 42),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'CONCRETE', 295),
--         (gen_random_uuid(), 4, 'MUD', 125),
--         (gen_random_uuid(), 4, 'WOOD', 85),
--         (gen_random_uuid(), 4, 'BRICK', 155),
--         (gen_random_uuid(), 4, 'TILE', 90),
--         (gen_random_uuid(), 4, 'OTHER', 35),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'CONCRETE', 270),
--         (gen_random_uuid(), 5, 'MUD', 145),
--         (gen_random_uuid(), 5, 'WOOD', 105),
--         (gen_random_uuid(), 5, 'BRICK', 130),
--         (gen_random_uuid(), 5, 'TILE', 70),
--         (gen_random_uuid(), 5, 'OTHER', 38);
--     END IF;
-- END
-- $$;