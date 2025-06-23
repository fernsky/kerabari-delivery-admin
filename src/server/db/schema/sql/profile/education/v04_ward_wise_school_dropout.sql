-- Check if acme_ward_wise_school_dropout table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_school_dropout'
    ) THEN
        CREATE TABLE acme_ward_wise_school_dropout (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            cause VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_school_dropout) THEN
        INSERT INTO acme_ward_wise_school_dropout (
            id, ward_number, cause, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'MARRIAGE', 155),
        (gen_random_uuid(), 1, 'HOUSE_HELP', 41),
        (gen_random_uuid(), 1, 'EMPLOYMENT', 49),
        (gen_random_uuid(), 1, 'UNWILLING_PARENTS', 6),
        (gen_random_uuid(), 1, 'WANTED_STUDY_COMPLETED', 105),
        (gen_random_uuid(), 1, 'EXPENSIVE', 2),
        (gen_random_uuid(), 1, 'OTHER', 65),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'MARRIAGE', 416),
        (gen_random_uuid(), 2, 'HOUSE_HELP', 105),
        (gen_random_uuid(), 2, 'EMPLOYMENT', 203),
        (gen_random_uuid(), 2, 'UNWILLING_PARENTS', 2),
        (gen_random_uuid(), 2, 'WANTED_STUDY_COMPLETED', 53),
        (gen_random_uuid(), 2, 'EXPENSIVE', 28),
        (gen_random_uuid(), 2, 'FAR', 4),
        (gen_random_uuid(), 2, 'OTHER', 128),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'MARRIAGE', 273),
        (gen_random_uuid(), 3, 'HOUSE_HELP', 43),
        (gen_random_uuid(), 3, 'EMPLOYMENT', 188),
        (gen_random_uuid(), 3, 'UNWILLING_PARENTS', 3),
        (gen_random_uuid(), 3, 'WANTED_STUDY_COMPLETED', 91),
        (gen_random_uuid(), 3, 'EXPENSIVE', 6),
        (gen_random_uuid(), 3, 'FAR', 3),
        (gen_random_uuid(), 3, 'LIMITED_SPACE', 2),
        (gen_random_uuid(), 3, 'OTHER', 184),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'MARRIAGE', 290),
        (gen_random_uuid(), 4, 'HOUSE_HELP', 44),
        (gen_random_uuid(), 4, 'EMPLOYMENT', 117),
        (gen_random_uuid(), 4, 'UNWILLING_PARENTS', 13),
        (gen_random_uuid(), 4, 'WANTED_STUDY_COMPLETED', 75),
        (gen_random_uuid(), 4, 'EXPENSIVE', 5),
        (gen_random_uuid(), 4, 'LIMITED_SPACE', 4),
        (gen_random_uuid(), 4, 'OTHER', 136),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'MARRIAGE', 144),
        (gen_random_uuid(), 5, 'HOUSE_HELP', 121),
        (gen_random_uuid(), 5, 'EMPLOYMENT', 295),
        (gen_random_uuid(), 5, 'UNWILLING_PARENTS', 44),
        (gen_random_uuid(), 5, 'WANTED_STUDY_COMPLETED', 2),
        (gen_random_uuid(), 5, 'EXPENSIVE', 10),
        (gen_random_uuid(), 5, 'FAR', 2),
        (gen_random_uuid(), 5, 'LIMITED_SPACE', 1),
        (gen_random_uuid(), 5, 'OTHER', 732),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'MARRIAGE', 382),
        (gen_random_uuid(), 6, 'HOUSE_HELP', 416),
        (gen_random_uuid(), 6, 'EMPLOYMENT', 12),
        (gen_random_uuid(), 6, 'UNWILLING_PARENTS', 34),
        (gen_random_uuid(), 6, 'WANTED_STUDY_COMPLETED', 14),
        (gen_random_uuid(), 6, 'EXPENSIVE', 25),
        (gen_random_uuid(), 6, 'FAR', 4),
        (gen_random_uuid(), 6, 'LIMITED_SPACE', 2),
        (gen_random_uuid(), 6, 'OTHER', 433),
        
        -- Ward 7
        (gen_random_uuid(), 7, 'MARRIAGE', 161),
        (gen_random_uuid(), 7, 'HOUSE_HELP', 174),
        (gen_random_uuid(), 7, 'EMPLOYMENT', 89),
        (gen_random_uuid(), 7, 'UNWILLING_PARENTS', 108),
        (gen_random_uuid(), 7, 'WANTED_STUDY_COMPLETED', 54),
        (gen_random_uuid(), 7, 'EXPENSIVE', 91),
        (gen_random_uuid(), 7, 'FAR', 6),
        (gen_random_uuid(), 7, 'OTHER', 1497),
        
        -- Ward 8
        (gen_random_uuid(), 8, 'MARRIAGE', 448),
        (gen_random_uuid(), 8, 'HOUSE_HELP', 350),
        (gen_random_uuid(), 8, 'EMPLOYMENT', 27),
        (gen_random_uuid(), 8, 'UNWILLING_PARENTS', 287),
        (gen_random_uuid(), 8, 'WANTED_STUDY_COMPLETED', 78),
        (gen_random_uuid(), 8, 'EXPENSIVE', 58),
        (gen_random_uuid(), 8, 'FAR', 76),
        (gen_random_uuid(), 8, 'LIMITED_SPACE', 6),
        (gen_random_uuid(), 8, 'OTHER', 700);
    END IF;
END
$$;
