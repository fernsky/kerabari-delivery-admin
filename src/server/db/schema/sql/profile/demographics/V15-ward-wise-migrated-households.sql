-- Check if acme_ward_wise_migrated_households table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_migrated_households'
    ) THEN
        CREATE TABLE acme_ward_wise_migrated_households (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            migrated_from VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL CHECK (households >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert updated seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_migrated_households) THEN
        INSERT INTO acme_ward_wise_migrated_households (
            id, ward_number, migrated_from, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'ANOTHER_DISTRICT', 384),
        (gen_random_uuid(), 1, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 7),
        (gen_random_uuid(), 1, 'ABROAD', 11),

        -- Ward 2
        (gen_random_uuid(), 2, 'ANOTHER_DISTRICT', 1105),
        (gen_random_uuid(), 2, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 37),
        (gen_random_uuid(), 2, 'ABROAD', 19),

        -- Ward 3
        (gen_random_uuid(), 3, 'ANOTHER_DISTRICT', 1293),
        (gen_random_uuid(), 3, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 35),
        (gen_random_uuid(), 3, 'ABROAD', 24),

        -- Ward 4
        (gen_random_uuid(), 4, 'ANOTHER_DISTRICT', 340),
        (gen_random_uuid(), 4, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 16),
        (gen_random_uuid(), 4, 'ABROAD', 9),

        -- Ward 5
        (gen_random_uuid(), 5, 'ANOTHER_DISTRICT', 15),
        (gen_random_uuid(), 5, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 2),
        (gen_random_uuid(), 5, 'ABROAD', 2),

        -- Ward 6
        (gen_random_uuid(), 6, 'ANOTHER_DISTRICT', 1056),
        (gen_random_uuid(), 6, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 129),
        (gen_random_uuid(), 6, 'ABROAD', 1),

        -- Ward 7
        (gen_random_uuid(), 7, 'ANOTHER_DISTRICT', 48),
        (gen_random_uuid(), 7, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 4),
        (gen_random_uuid(), 7, 'ABROAD', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'ANOTHER_DISTRICT', 35),
        (gen_random_uuid(), 8, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 201),
        (gen_random_uuid(), 8, 'ABROAD', 1);
    END IF;
END
$$;
