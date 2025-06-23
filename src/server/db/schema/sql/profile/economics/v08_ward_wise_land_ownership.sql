-- Check if acme_ward_wise_land_ownership table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_land_ownership'
    ) THEN
        CREATE TABLE acme_ward_wise_land_ownership (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            land_ownership_type VARCHAR(50) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_ward_wise_land_ownership;
END
$$;

-- Insert real data from the provided table
DO $$
BEGIN
    -- Ward 1 data
    INSERT INTO acme_ward_wise_land_ownership (id, ward_number, land_ownership_type, households)
    VALUES
        (gen_random_uuid(), 1, 'PRIVATE', 854),
        (gen_random_uuid(), 1, 'GUTHI', 3),
        (gen_random_uuid(), 1, 'PUBLIC_EILANI', 38),
        (gen_random_uuid(), 1, 'VILLAGE_BLOCK', 2),
        (gen_random_uuid(), 1, 'OTHER', 13),

    -- Ward 2 data
        (gen_random_uuid(), 2, 'PRIVATE', 2535),
        (gen_random_uuid(), 2, 'GUTHI', 11),
        (gen_random_uuid(), 2, 'PUBLIC_EILANI', 44),
        (gen_random_uuid(), 2, 'VILLAGE_BLOCK', 2),
        (gen_random_uuid(), 2, 'OTHER', 19),

    -- Ward 3 data
        (gen_random_uuid(), 3, 'PRIVATE', 1942),
        (gen_random_uuid(), 3, 'GUTHI', 1),
        (gen_random_uuid(), 3, 'PUBLIC_EILANI', 57),
        (gen_random_uuid(), 3, 'VILLAGE_BLOCK', 23),
        (gen_random_uuid(), 3, 'OTHER', 38),

    -- Ward 4 data
        (gen_random_uuid(), 4, 'PRIVATE', 1794),
        (gen_random_uuid(), 4, 'PUBLIC_EILANI', 31),
        (gen_random_uuid(), 4, 'VILLAGE_BLOCK', 2),
        (gen_random_uuid(), 4, 'OTHER', 5),

    -- Ward 5 data
        (gen_random_uuid(), 5, 'PRIVATE', 1787),
        (gen_random_uuid(), 5, 'PUBLIC_EILANI', 33),
        (gen_random_uuid(), 5, 'VILLAGE_BLOCK', 18),
        (gen_random_uuid(), 5, 'OTHER', 10),

    -- Ward 6 data
        (gen_random_uuid(), 6, 'PRIVATE', 794),
        (gen_random_uuid(), 6, 'PUBLIC_EILANI', 1097),
        (gen_random_uuid(), 6, 'VILLAGE_BLOCK', 71),
        (gen_random_uuid(), 6, 'OTHER', 9),

    -- Ward 7 data
        (gen_random_uuid(), 7, 'PRIVATE', 2097),
        (gen_random_uuid(), 7, 'GUTHI', 11),
        (gen_random_uuid(), 7, 'PUBLIC_EILANI', 261),
        (gen_random_uuid(), 7, 'VILLAGE_BLOCK', 31),
        (gen_random_uuid(), 7, 'OTHER', 7),

    -- Ward 8 data
        (gen_random_uuid(), 8, 'PRIVATE', 1731),
        (gen_random_uuid(), 8, 'GUTHI', 20),
        (gen_random_uuid(), 8, 'PUBLIC_EILANI', 128),
        (gen_random_uuid(), 8, 'VILLAGE_BLOCK', 1),
        (gen_random_uuid(), 8, 'OTHER', 10);
END
$$;
