-- Generated SQL script
-- Date: 2025-05-27 12:59:46

-- Create religion type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'religion_type_enum') THEN
        CREATE TYPE religion_type_enum AS ENUM (
            'HINDU', 'ISLAM', 'CHRISTIAN', 'BUDDHIST', 'SIKH', 'BAHAI', 'BON',
            'JAIN', 'KIRANT', 'NATURE', 'OTHER'
        );
    END IF;
END
$$;

-- Check if acme_ward_wise_religion_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_religion_population'
    ) THEN
        CREATE TABLE acme_ward_wise_religion_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            religion_type religion_type_enum NOT NULL,
            population INTEGER,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert data only if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_religion_population) THEN
        -- Ward 1
        INSERT INTO acme_ward_wise_religion_population 
        (id, ward_number, religion_type, population, updated_at, created_at)
        VALUES 
        (gen_random_uuid(), 1, 'BUDDHIST', 48, NOW(), NOW()),
        (gen_random_uuid(), 1, 'CHRISTIAN', 111, NOW(), NOW()),
        (gen_random_uuid(), 1, 'HINDU', 3950, NOW(), NOW()),
        (gen_random_uuid(), 1, 'OTHER', 3, NOW(), NOW()),

        -- Ward 2
        (gen_random_uuid(), 2, 'BUDDHIST', 212, NOW(), NOW()),
        (gen_random_uuid(), 2, 'CHRISTIAN', 453, NOW(), NOW()),
        (gen_random_uuid(), 2, 'HINDU', 9795, NOW(), NOW()),
        (gen_random_uuid(), 2, 'ISLAM', 34, NOW(), NOW()),
        (gen_random_uuid(), 2, 'OTHER', 7, NOW(), NOW()),
        (gen_random_uuid(), 2, 'SIKH', 43, NOW(), NOW()),

        -- Ward 3
        (gen_random_uuid(), 3, 'BUDDHIST', 47, NOW(), NOW()),
        (gen_random_uuid(), 3, 'CHRISTIAN', 285, NOW(), NOW()),
        (gen_random_uuid(), 3, 'HINDU', 8024, NOW(), NOW()),
        (gen_random_uuid(), 3, 'ISLAM', 123, NOW(), NOW()),
        (gen_random_uuid(), 3, 'OTHER', 2, NOW(), NOW()),

        -- Ward 4
        (gen_random_uuid(), 4, 'BUDDHIST', 21, NOW(), NOW()),
        (gen_random_uuid(), 4, 'CHRISTIAN', 329, NOW(), NOW()),
        (gen_random_uuid(), 4, 'HINDU', 6620, NOW(), NOW()),
        (gen_random_uuid(), 4, 'ISLAM', 177, NOW(), NOW()),
        (gen_random_uuid(), 4, 'OTHER', 0, NOW(), NOW()),

        -- Ward 5
        (gen_random_uuid(), 5, 'BUDDHIST', 17, NOW(), NOW()),
        (gen_random_uuid(), 5, 'CHRISTIAN', 9, NOW(), NOW()),
        (gen_random_uuid(), 5, 'HINDU', 4493, NOW(), NOW()),
        (gen_random_uuid(), 5, 'ISLAM', 3000, NOW(), NOW()),
        (gen_random_uuid(), 5, 'OTHER', 3, NOW(), NOW()),

        -- Ward 6
        (gen_random_uuid(), 6, 'BUDDHIST', 12, NOW(), NOW()),
        (gen_random_uuid(), 6, 'CHRISTIAN', 1051, NOW(), NOW()),
        (gen_random_uuid(), 6, 'HINDU', 4980, NOW(), NOW()),
        (gen_random_uuid(), 6, 'ISLAM', 2237, NOW(), NOW()),
        (gen_random_uuid(), 6, 'OTHER', 1, NOW(), NOW()),

        -- Ward 7
        (gen_random_uuid(), 7, 'BUDDHIST', 61, NOW(), NOW()),
        (gen_random_uuid(), 7, 'CHRISTIAN', 93, NOW(), NOW()),
        (gen_random_uuid(), 7, 'HINDU', 5847, NOW(), NOW()),
        (gen_random_uuid(), 7, 'ISLAM', 4574, NOW(), NOW()),
        (gen_random_uuid(), 7, 'OTHER', 2, NOW(), NOW()),
        (gen_random_uuid(), 7, 'SIKH', 9, NOW(), NOW()),

        -- Ward 8
        (gen_random_uuid(), 8, 'CHRISTIAN', 85, NOW(), NOW()),
        (gen_random_uuid(), 8, 'HINDU', 3425, NOW(), NOW()),
        (gen_random_uuid(), 8, 'ISLAM', 4725, NOW(), NOW()),
        (gen_random_uuid(), 8, 'OTHER', 0, NOW(), NOW());
    END IF;
END
$$;
