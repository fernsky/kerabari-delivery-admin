-- Check if acme_ward_wise_literacy_status table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_literacy_status'
    ) THEN
        CREATE TABLE acme_ward_wise_literacy_status (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            literacy_type VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_literacy_status) THEN
        INSERT INTO acme_ward_wise_literacy_status (
            id, ward_number, literacy_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'BOTH_READING_AND_WRITING', 3462),
        (gen_random_uuid(), 1, 'READING_ONLY', 6),
        (gen_random_uuid(), 1, 'ILLITERATE', 455),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'BOTH_READING_AND_WRITING', 8683),
        (gen_random_uuid(), 2, 'READING_ONLY', 42),
        (gen_random_uuid(), 2, 'ILLITERATE', 1347),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'BOTH_READING_AND_WRITING', 7153),
        (gen_random_uuid(), 3, 'READING_ONLY', 27),
        (gen_random_uuid(), 3, 'ILLITERATE', 978),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'BOTH_READING_AND_WRITING', 5212),
        (gen_random_uuid(), 4, 'READING_ONLY', 23),
        (gen_random_uuid(), 4, 'ILLITERATE', 1629),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'BOTH_READING_AND_WRITING', 3603),
        (gen_random_uuid(), 5, 'READING_ONLY', 159),
        (gen_random_uuid(), 5, 'ILLITERATE', 3191),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'BOTH_READING_AND_WRITING', 5485),
        (gen_random_uuid(), 6, 'READING_ONLY', 2),
        (gen_random_uuid(), 6, 'ILLITERATE', 2270),
        
        -- Ward 7
        (gen_random_uuid(), 7, 'BOTH_READING_AND_WRITING', 4970),
        (gen_random_uuid(), 7, 'READING_ONLY', 94),
        (gen_random_uuid(), 7, 'ILLITERATE', 4889),
        
        -- Ward 8
        (gen_random_uuid(), 8, 'BOTH_READING_AND_WRITING', 3393),
        (gen_random_uuid(), 8, 'READING_ONLY', 15),
        (gen_random_uuid(), 8, 'ILLITERATE', 4253);
    END IF;
END
$$;
