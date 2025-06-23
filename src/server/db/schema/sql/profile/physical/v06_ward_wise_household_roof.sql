-- Check if acme_ward_wise_household_roof table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_roof'
    ) THEN
        CREATE TABLE acme_ward_wise_household_roof (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            roof_type VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_roof) THEN
--         INSERT INTO acme_ward_wise_household_roof (
--             id, ward_number, roof_type, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'CEMENT', 312),
--         (gen_random_uuid(), 1, 'TIN', 215),
--         (gen_random_uuid(), 1, 'TILE', 85),
--         (gen_random_uuid(), 1, 'STRAW', 32),
--         (gen_random_uuid(), 1, 'WOOD', 45),
--         (gen_random_uuid(), 1, 'STONE', 28),
--         (gen_random_uuid(), 1, 'OTHER', 15),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'CEMENT', 345),
--         (gen_random_uuid(), 2, 'TIN', 235),
--         (gen_random_uuid(), 2, 'TILE', 72),
--         (gen_random_uuid(), 2, 'STRAW', 28),
--         (gen_random_uuid(), 2, 'WOOD', 40),
--         (gen_random_uuid(), 2, 'STONE', 25),
--         (gen_random_uuid(), 2, 'OTHER', 12),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'CEMENT', 280),
--         (gen_random_uuid(), 3, 'TIN', 245),
--         (gen_random_uuid(), 3, 'TILE', 95),
--         (gen_random_uuid(), 3, 'STRAW', 48),
--         (gen_random_uuid(), 3, 'WOOD', 55),
--         (gen_random_uuid(), 3, 'STONE', 35),
--         (gen_random_uuid(), 3, 'OTHER', 20),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'CEMENT', 325),
--         (gen_random_uuid(), 4, 'TIN', 225),
--         (gen_random_uuid(), 4, 'TILE', 78),
--         (gen_random_uuid(), 4, 'STRAW', 35),
--         (gen_random_uuid(), 4, 'WOOD', 42),
--         (gen_random_uuid(), 4, 'STONE', 30),
--         (gen_random_uuid(), 4, 'OTHER', 18),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'CEMENT', 290),
--         (gen_random_uuid(), 5, 'TIN', 240),
--         (gen_random_uuid(), 5, 'TILE', 88),
--         (gen_random_uuid(), 5, 'STRAW', 42),
--         (gen_random_uuid(), 5, 'WOOD', 48),
--         (gen_random_uuid(), 5, 'STONE', 32),
--         (gen_random_uuid(), 5, 'OTHER', 16);
--     END IF;
-- END
-- $$;