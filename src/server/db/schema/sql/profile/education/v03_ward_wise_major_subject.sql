-- Check if acme_ward_wise_major_subject table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_major_subject'
    ) THEN
        CREATE TABLE acme_ward_wise_major_subject (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            subject_type VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_major_subject) THEN
--         INSERT INTO acme_ward_wise_major_subject (
--             id, ward_number, subject_type, population
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'MANAGEMENT', 450),
--         (gen_random_uuid(), 1, 'SCIENCE', 380),
--         (gen_random_uuid(), 1, 'EDUCATION', 320),
--         (gen_random_uuid(), 1, 'HUMANITIES', 290),
--         (gen_random_uuid(), 1, 'INFORMATION_TECHNOLOGY', 270),
--         (gen_random_uuid(), 1, 'ENGLISH', 230),
--         (gen_random_uuid(), 1, 'MEDICINE', 180),
--         (gen_random_uuid(), 1, 'ENGINEERING', 165),
--         (gen_random_uuid(), 1, 'COMMERCE', 155),
--         (gen_random_uuid(), 1, 'SOCIAL_SCIENCES', 135),
--         (gen_random_uuid(), 1, 'ECONOMICS', 120),
--         (gen_random_uuid(), 1, 'OTHER', 95),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'MANAGEMENT', 420),
--         (gen_random_uuid(), 2, 'SCIENCE', 350),
--         (gen_random_uuid(), 2, 'EDUCATION', 290),
--         (gen_random_uuid(), 2, 'HUMANITIES', 260),
--         (gen_random_uuid(), 2, 'INFORMATION_TECHNOLOGY', 245),
--         (gen_random_uuid(), 2, 'ENGLISH', 210),
--         (gen_random_uuid(), 2, 'MEDICINE', 160),
--         (gen_random_uuid(), 2, 'ENGINEERING', 145),
--         (gen_random_uuid(), 2, 'COMMERCE', 135),
--         (gen_random_uuid(), 2, 'SOCIAL_SCIENCES', 120),
--         (gen_random_uuid(), 2, 'ECONOMICS', 110),
--         (gen_random_uuid(), 2, 'NEPALI', 90),
--         (gen_random_uuid(), 2, 'OTHER', 85),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'MANAGEMENT', 380),
--         (gen_random_uuid(), 3, 'SCIENCE', 320),
--         (gen_random_uuid(), 3, 'EDUCATION', 270),
--         (gen_random_uuid(), 3, 'HUMANITIES', 235),
--         (gen_random_uuid(), 3, 'INFORMATION_TECHNOLOGY', 220),
--         (gen_random_uuid(), 3, 'ENGLISH', 190),
--         (gen_random_uuid(), 3, 'MEDICINE', 140),
--         (gen_random_uuid(), 3, 'ENGINEERING', 130),
--         (gen_random_uuid(), 3, 'COMMERCE', 120),
--         (gen_random_uuid(), 3, 'SOCIAL_SCIENCES', 110),
--         (gen_random_uuid(), 3, 'ECONOMICS', 100),
--         (gen_random_uuid(), 3, 'RURAL_DEVELOPMENT', 85),
--         (gen_random_uuid(), 3, 'OTHER', 75),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'MANAGEMENT', 410),
--         (gen_random_uuid(), 4, 'SCIENCE', 335),
--         (gen_random_uuid(), 4, 'EDUCATION', 285),
--         (gen_random_uuid(), 4, 'HUMANITIES', 250),
--         (gen_random_uuid(), 4, 'INFORMATION_TECHNOLOGY', 240),
--         (gen_random_uuid(), 4, 'ENGLISH', 205),
--         (gen_random_uuid(), 4, 'MEDICINE', 155),
--         (gen_random_uuid(), 4, 'ENGINEERING', 140),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'MANAGEMENT', 360),
--         (gen_random_uuid(), 5, 'SCIENCE', 310),
--         (gen_random_uuid(), 5, 'EDUCATION', 260),
--         (gen_random_uuid(), 5, 'HUMANITIES', 230),
--         (gen_random_uuid(), 5, 'INFORMATION_TECHNOLOGY', 210),
--         (gen_random_uuid(), 5, 'ENGLISH', 180),
--         (gen_random_uuid(), 5, 'MEDICINE', 135),
--         (gen_random_uuid(), 5, 'ENGINEERING', 125);
--     END IF;
-- END
-- $$;