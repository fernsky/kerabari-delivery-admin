-- Check if acme_ward_age_wise_first_child_birth_age table exists, if not create it
DO $$
BEGIN
    -- First create the enum type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'first_child_birth_age_group'
    ) THEN
        CREATE TYPE first_child_birth_age_group AS ENUM (
            'AGE_15_19',
            'AGE_20_24',
            'AGE_25_29',
            'AGE_30_34',
            'AGE_35_39',
            'AGE_40_44',
            'AGE_45_49'
        );
    END IF;

    -- Then create the table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_wise_first_child_birth_age'
    ) THEN
        CREATE TABLE acme_ward_age_wise_first_child_birth_age (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            first_child_birth_age_group first_child_birth_age_group NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(ward_number, first_child_birth_age_group)
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_age_wise_first_child_birth_age) THEN
--         INSERT INTO acme_ward_age_wise_first_child_birth_age (
--             id, ward_number, first_child_birth_age_group, population
--         )
--         VALUES
--         -- Ward 1 data
--         (gen_random_uuid(), 1, 'AGE_15_19', 32),
--         (gen_random_uuid(), 1, 'AGE_20_24', 87),
--         (gen_random_uuid(), 1, 'AGE_25_29', 45),
--         (gen_random_uuid(), 1, 'AGE_30_34', 21),
--         (gen_random_uuid(), 1, 'AGE_35_39', 12),
--         (gen_random_uuid(), 1, 'AGE_40_44', 5),
--         (gen_random_uuid(), 1, 'AGE_45_49', 2),
--         -- Ward 2 data
--         (gen_random_uuid(), 2, 'AGE_15_19', 28),
--         (gen_random_uuid(), 2, 'AGE_20_24', 92),
--         (gen_random_uuid(), 2, 'AGE_25_29', 51),
--         (gen_random_uuid(), 2, 'AGE_30_34', 24),
--         (gen_random_uuid(), 2, 'AGE_35_39', 10),
--         (gen_random_uuid(), 2, 'AGE_40_44', 4),
--         (gen_random_uuid(), 2, 'AGE_45_49', 1),
--         -- Ward 3 data
--         (gen_random_uuid(), 3, 'AGE_15_19', 25),
--         (gen_random_uuid(), 3, 'AGE_20_24', 83),
--         (gen_random_uuid(), 3, 'AGE_25_29', 49),
--         (gen_random_uuid(), 3, 'AGE_30_34', 26),
--         (gen_random_uuid(), 3, 'AGE_35_39', 15),
--         (gen_random_uuid(), 3, 'AGE_40_44', 6),
--         (gen_random_uuid(), 3, 'AGE_45_49', 3),
--         -- Ward 4 data
--         (gen_random_uuid(), 4, 'AGE_15_19', 35),
--         (gen_random_uuid(), 4, 'AGE_20_24', 95),
--         (gen_random_uuid(), 4, 'AGE_25_29', 54),
--         (gen_random_uuid(), 4, 'AGE_30_34', 29),
--         (gen_random_uuid(), 4, 'AGE_35_39', 14),
--         (gen_random_uuid(), 4, 'AGE_40_44', 7),
--         (gen_random_uuid(), 4, 'AGE_45_49', 2),
--         -- Ward 5 data
--         (gen_random_uuid(), 5, 'AGE_15_19', 27),
--         (gen_random_uuid(), 5, 'AGE_20_24', 89),
--         (gen_random_uuid(), 5, 'AGE_25_29', 58),
--         (gen_random_uuid(), 5, 'AGE_30_34', 25),
--         (gen_random_uuid(), 5, 'AGE_35_39', 13),
--         (gen_random_uuid(), 5, 'AGE_40_44', 5),
--         (gen_random_uuid(), 5, 'AGE_45_49', 2),
--         -- Ward 6 data
--         (gen_random_uuid(), 6, 'AGE_15_19', 30),
--         (gen_random_uuid(), 6, 'AGE_20_24', 81),
--         (gen_random_uuid(), 6, 'AGE_25_29', 47),
--         (gen_random_uuid(), 6, 'AGE_30_34', 22),
--         (gen_random_uuid(), 6, 'AGE_35_39', 11),
--         (gen_random_uuid(), 6, 'AGE_40_44', 4),
--         (gen_random_uuid(), 6, 'AGE_45_49', 3),
--         -- Ward 7 data
--         (gen_random_uuid(), 7, 'AGE_15_19', 33),
--         (gen_random_uuid(), 7, 'AGE_20_24', 90),
--         (gen_random_uuid(), 7, 'AGE_25_29', 50),
--         (gen_random_uuid(), 7, 'AGE_30_34', 28),
--         (gen_random_uuid(), 7, 'AGE_35_39', 16),
--         (gen_random_uuid(), 7, 'AGE_40_44', 6),
--         (gen_random_uuid(), 7, 'AGE_45_49', 2);
--     END IF;
-- END
-- $$;