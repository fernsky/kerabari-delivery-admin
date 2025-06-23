-- Check if acme_ward_wise_mother_tongue_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_mother_tongue_population'
    ) THEN
        -- Create enum type for language types if not exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'language_type_enum'
        ) THEN
            CREATE TYPE language_type_enum AS ENUM (
                'NEPALI', 'MAITHILI', 'BHOJPURI', 'THARU', 'TAMANG', 
                'NEWARI', 'MAGAR', 'BAJJIKA', 'URDU', 'HINDI', 
                'LIMBU', 'RAI', 'GURUNG', 'SHERPA', 'DOTELI', 
                'AWADI', 'OTHER'
            );
        END IF;

        CREATE TABLE acme_ward_wise_mother_tongue_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            language_type language_type_enum NOT NULL,
            population INTEGER,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_mother_tongue_population) THEN
        INSERT INTO acme_ward_wise_mother_tongue_population (
            id, ward_number, language_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'NEPALI', 4016),
        (gen_random_uuid(), 1, 'THARU', 6),
        (gen_random_uuid(), 1, 'MAGAR', 58),
        (gen_random_uuid(), 1, 'HINDI', 27),
        (gen_random_uuid(), 1, 'OTHER', 5),

        -- Ward 2
        (gen_random_uuid(), 2, 'NEPALI', 10112),
        (gen_random_uuid(), 2, 'AWADI', 39),
        (gen_random_uuid(), 2, 'THARU', 93),
        (gen_random_uuid(), 2, 'MAGAR', 158),
        (gen_random_uuid(), 2, 'TAMANG', 35),
        (gen_random_uuid(), 2, 'OTHER', 107),

        -- Ward 3
        (gen_random_uuid(), 3, 'NEPALI', 8212),
        (gen_random_uuid(), 3, 'AWADI', 154),
        (gen_random_uuid(), 3, 'THARU', 30),
        (gen_random_uuid(), 3, 'MAGAR', 12),
        (gen_random_uuid(), 3, 'HINDI', 30),
        (gen_random_uuid(), 3, 'URDU', 8),
        (gen_random_uuid(), 3, 'TAMANG', 17),
        (gen_random_uuid(), 3, 'OTHER', 18),

        -- Ward 4
        (gen_random_uuid(), 4, 'NEPALI', 6910),
        (gen_random_uuid(), 4, 'AWADI', 168),
        (gen_random_uuid(), 4, 'THARU', 14),
        (gen_random_uuid(), 4, 'MAGAR', 7),
        (gen_random_uuid(), 4, 'OTHER', 12), -- Changed from KHASH
        (gen_random_uuid(), 4, 'URDU', 28),
        (gen_random_uuid(), 4, 'OTHER', 8),

        -- Ward 5
        (gen_random_uuid(), 5, 'NEPALI', 728),
        (gen_random_uuid(), 5, 'AWADI', 6776),
        (gen_random_uuid(), 5, 'THARU', 6),
        (gen_random_uuid(), 5, 'URDU', 8),
        (gen_random_uuid(), 5, 'OTHER', 4),

        -- Ward 6
        (gen_random_uuid(), 6, 'NEPALI', 5209),
        (gen_random_uuid(), 6, 'AWADI', 2829),
        (gen_random_uuid(), 6, 'THARU', 105),
        (gen_random_uuid(), 6, 'MAGAR', 32),
        (gen_random_uuid(), 6, 'OTHER', 60), -- Changed from KHASH
        (gen_random_uuid(), 6, 'URDU', 4),
        (gen_random_uuid(), 6, 'OTHER', 42),

        -- Ward 7
        (gen_random_uuid(), 7, 'NEPALI', 2566),
        (gen_random_uuid(), 7, 'AWADI', 7881),
        (gen_random_uuid(), 7, 'THARU', 84),
        (gen_random_uuid(), 7, 'MAGAR', 12),
        (gen_random_uuid(), 7, 'HINDI', 16),
        (gen_random_uuid(), 7, 'URDU', 22),
        (gen_random_uuid(), 7, 'OTHER', 5),

        -- Ward 8
        (gen_random_uuid(), 8, 'NEPALI', 3933),
        (gen_random_uuid(), 8, 'AWADI', 3687),
        (gen_random_uuid(), 8, 'THARU', 577),
        (gen_random_uuid(), 8, 'MAGAR', 10),
        (gen_random_uuid(), 8, 'OTHER', 7), -- Changed from KHASH
        (gen_random_uuid(), 8, 'OTHER', 21);
    END IF;
END
$$;
