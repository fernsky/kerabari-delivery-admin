-- Check if ward_wise_caste_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_caste_population'
    ) THEN
        CREATE TABLE acme_ward_wise_caste_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            caste_type VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_caste_population) THEN
        INSERT INTO acme_ward_wise_caste_population (
            id, ward_number, caste_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'CHHETRI', 438),
        (gen_random_uuid(), 1, 'KAMI', 766),
        (gen_random_uuid(), 1, 'MAGAR', 1997),
        (gen_random_uuid(), 1, 'BRAHMIN_HILL', 55),
        (gen_random_uuid(), 1, 'THAKURI', 229),
        (gen_random_uuid(), 1, 'YADAV', 3),
        (gen_random_uuid(), 1, 'THARU', 14),
        (gen_random_uuid(), 1, 'GURUNG', 402),
        (gen_random_uuid(), 1, 'DAMAI', 32),
        (gen_random_uuid(), 1, 'MUSLIM', 0),
        (gen_random_uuid(), 1, 'OTHER', 176),

        -- Ward 2
        (gen_random_uuid(), 2, 'CHHETRI', 3346),
        (gen_random_uuid(), 2, 'KAMI', 2226),
        (gen_random_uuid(), 2, 'MAGAR', 1370),
        (gen_random_uuid(), 2, 'BRAHMIN_HILL', 656),
        (gen_random_uuid(), 2, 'THAKURI', 886),
        (gen_random_uuid(), 2, 'YADAV', 9),
        (gen_random_uuid(), 2, 'THARU', 232),
        (gen_random_uuid(), 2, 'GURUNG', 265),
        (gen_random_uuid(), 2, 'DAMAI', 213),
        (gen_random_uuid(), 2, 'MUSLIM', 17),
        (gen_random_uuid(), 2, 'OTHER', 1324),

        -- Ward 3
        (gen_random_uuid(), 3, 'CHHETRI', 2589),
        (gen_random_uuid(), 3, 'KAMI', 859),
        (gen_random_uuid(), 3, 'MAGAR', 1752),
        (gen_random_uuid(), 3, 'BRAHMIN_HILL', 1413),
        (gen_random_uuid(), 3, 'THAKURI', 321),
        (gen_random_uuid(), 3, 'YADAV', 27),
        (gen_random_uuid(), 3, 'THARU', 150),
        (gen_random_uuid(), 3, 'GURUNG', 225),
        (gen_random_uuid(), 3, 'DAMAI', 140),
        (gen_random_uuid(), 3, 'MUSLIM', 133),
        (gen_random_uuid(), 3, 'OTHER', 872),

        -- Ward 4
        (gen_random_uuid(), 4, 'CHHETRI', 3189),
        (gen_random_uuid(), 4, 'KAMI', 1361),
        (gen_random_uuid(), 4, 'MAGAR', 831),
        (gen_random_uuid(), 4, 'BRAHMIN_HILL', 326),
        (gen_random_uuid(), 4, 'THAKURI', 230),
        (gen_random_uuid(), 4, 'YADAV', 6),
        (gen_random_uuid(), 4, 'THARU', 55),
        (gen_random_uuid(), 4, 'GURUNG', 111),
        (gen_random_uuid(), 4, 'DAMAI', 31),
        (gen_random_uuid(), 4, 'MUSLIM', 189),
        (gen_random_uuid(), 4, 'OTHER', 818),

        -- Ward 5
        (gen_random_uuid(), 5, 'CHHETRI', 277),
        (gen_random_uuid(), 5, 'KAMI', 9),
        (gen_random_uuid(), 5, 'MAGAR', 75),
        (gen_random_uuid(), 5, 'BRAHMIN_HILL', 106),
        (gen_random_uuid(), 5, 'THAKURI', 12),
        (gen_random_uuid(), 5, 'YADAV', 1196),
        (gen_random_uuid(), 5, 'THARU', 12),
        (gen_random_uuid(), 5, 'GURUNG', 13),
        (gen_random_uuid(), 5, 'DAMAI', 0),
        (gen_random_uuid(), 5, 'MUSLIM', 2991),
        (gen_random_uuid(), 5, 'OTHER', 2831),

        -- Ward 6
        (gen_random_uuid(), 6, 'CHHETRI', 912),
        (gen_random_uuid(), 6, 'KAMI', 1809),
        (gen_random_uuid(), 6, 'MAGAR', 626),
        (gen_random_uuid(), 6, 'BRAHMIN_HILL', 25),
        (gen_random_uuid(), 6, 'THAKURI', 309),
        (gen_random_uuid(), 6, 'YADAV', 41),
        (gen_random_uuid(), 6, 'THARU', 325),
        (gen_random_uuid(), 6, 'GURUNG', 38),
        (gen_random_uuid(), 6, 'DAMAI', 428),
        (gen_random_uuid(), 6, 'MUSLIM', 2234),
        (gen_random_uuid(), 6, 'OTHER', 1534),

        -- Ward 7
        (gen_random_uuid(), 7, 'CHHETRI', 635),
        (gen_random_uuid(), 7, 'KAMI', 78),
        (gen_random_uuid(), 7, 'MAGAR', 447),
        (gen_random_uuid(), 7, 'BRAHMIN_HILL', 282),
        (gen_random_uuid(), 7, 'THAKURI', 107),
        (gen_random_uuid(), 7, 'YADAV', 955),
        (gen_random_uuid(), 7, 'THARU', 88),
        (gen_random_uuid(), 7, 'GURUNG', 268),
        (gen_random_uuid(), 7, 'DAMAI', 99),
        (gen_random_uuid(), 7, 'MUSLIM', 3859),
        (gen_random_uuid(), 7, 'OTHER', 3768),

        -- Ward 8
        (gen_random_uuid(), 8, 'CHHETRI', 1015),
        (gen_random_uuid(), 8, 'KAMI', 394),
        (gen_random_uuid(), 8, 'MAGAR', 156),
        (gen_random_uuid(), 8, 'BRAHMIN_HILL', 270),
        (gen_random_uuid(), 8, 'THAKURI', 234),
        (gen_random_uuid(), 8, 'YADAV', 89),
        (gen_random_uuid(), 8, 'THARU', 831),
        (gen_random_uuid(), 8, 'GURUNG', 0),
        (gen_random_uuid(), 8, 'DAMAI', 46),
        (gen_random_uuid(), 8, 'MUSLIM', 4771),
        (gen_random_uuid(), 8, 'OTHER', 429);
    END IF;
END
$$;
