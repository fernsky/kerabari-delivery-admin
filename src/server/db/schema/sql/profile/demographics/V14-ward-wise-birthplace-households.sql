-- Check if acme_ward_wise_birthplace_households table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_birthplace_households'
    ) THEN
        CREATE TABLE acme_ward_wise_birthplace_households (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            birth_place VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_birthplace_households) THEN
        INSERT INTO acme_ward_wise_birthplace_households (
            id, ward_number, birth_place, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'SAME_MUNICIPALITY', 508),
        (gen_random_uuid(), 1, 'ANOTHER_DISTRICT', 359),
        (gen_random_uuid(), 1, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 12),
        (gen_random_uuid(), 1, 'ABROAD', 31),

        -- Ward 2
        (gen_random_uuid(), 2, 'SAME_MUNICIPALITY', 1450),
        (gen_random_uuid(), 2, 'ANOTHER_DISTRICT', 1080),
        (gen_random_uuid(), 2, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 60),
        (gen_random_uuid(), 2, 'ABROAD', 21),

        -- Ward 3
        (gen_random_uuid(), 3, 'SAME_MUNICIPALITY', 709),
        (gen_random_uuid(), 3, 'ANOTHER_DISTRICT', 1274),
        (gen_random_uuid(), 3, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 48),
        (gen_random_uuid(), 3, 'ABROAD', 30),

        -- Ward 4
        (gen_random_uuid(), 4, 'SAME_MUNICIPALITY', 1467),
        (gen_random_uuid(), 4, 'ANOTHER_DISTRICT', 323),
        (gen_random_uuid(), 4, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 28),
        (gen_random_uuid(), 4, 'ABROAD', 14),

        -- Ward 5
        (gen_random_uuid(), 5, 'SAME_MUNICIPALITY', 1829),
        (gen_random_uuid(), 5, 'ANOTHER_DISTRICT', 14),
        (gen_random_uuid(), 5, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 2),
        (gen_random_uuid(), 5, 'ABROAD', 3),

        -- Ward 6
        (gen_random_uuid(), 6, 'SAME_MUNICIPALITY', 785),
        (gen_random_uuid(), 6, 'ANOTHER_DISTRICT', 1069),
        (gen_random_uuid(), 6, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 94),
        (gen_random_uuid(), 6, 'ABROAD', 23),

        -- Ward 7
        (gen_random_uuid(), 7, 'SAME_MUNICIPALITY', 2354),
        (gen_random_uuid(), 7, 'ANOTHER_DISTRICT', 47),
        (gen_random_uuid(), 7, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 5),
        (gen_random_uuid(), 7, 'ABROAD', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'SAME_MUNICIPALITY', 1653),
        (gen_random_uuid(), 8, 'ANOTHER_DISTRICT', 30),
        (gen_random_uuid(), 8, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 205),
        (gen_random_uuid(), 8, 'ABROAD', 2);
    END IF;
END
$$;
