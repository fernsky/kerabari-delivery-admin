-- Check if acme_ward_age_gender_wise_first_marriage_age table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_gender_wise_first_marriage_age'
    ) THEN
        CREATE TABLE acme_ward_age_gender_wise_first_marriage_age (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            first_marriage_age_group VARCHAR(100) NOT NULL,
            gender VARCHAR(50) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_age_gender_wise_first_marriage_age) THEN
--         INSERT INTO acme_ward_age_gender_wise_first_marriage_age (
--             id, ward_number, first_marriage_age_group, gender, population
--         )
--         VALUES
--         -- Ward 1, Male
--         (gen_random_uuid(), 1, 'AGE_0_14', 'MALE', 12),
--         (gen_random_uuid(), 1, 'AGE_15_19', 'MALE', 45),
--         (gen_random_uuid(), 1, 'AGE_20_24', 'MALE', 158),
--         (gen_random_uuid(), 1, 'AGE_25_29', 'MALE', 132),
--         (gen_random_uuid(), 1, 'AGE_30_34', 'MALE', 89),
--         (gen_random_uuid(), 1, 'AGE_35_39', 'MALE', 62),
--         (gen_random_uuid(), 1, 'AGE_40_44', 'MALE', 38),
--         (gen_random_uuid(), 1, 'AGE_45_49', 'MALE', 25),
--         (gen_random_uuid(), 1, 'AGE_50_54', 'MALE', 18),
--         (gen_random_uuid(), 1, 'AGE_55_59', 'MALE', 10),
--         (gen_random_uuid(), 1, 'AGE_60_AND_ABOVE', 'MALE', 8),
--         -- Ward 1, Female
--         (gen_random_uuid(), 1, 'AGE_0_14', 'FEMALE', 18),
--         (gen_random_uuid(), 1, 'AGE_15_19', 'FEMALE', 68),
--         (gen_random_uuid(), 1, 'AGE_20_24', 'FEMALE', 142),
--         (gen_random_uuid(), 1, 'AGE_25_29', 'FEMALE', 108),
--         (gen_random_uuid(), 1, 'AGE_30_34', 'FEMALE', 72),
--         (gen_random_uuid(), 1, 'AGE_35_39', 'FEMALE', 48),
--         (gen_random_uuid(), 1, 'AGE_40_44', 'FEMALE', 32),
--         (gen_random_uuid(), 1, 'AGE_45_49', 'FEMALE', 22),
--         (gen_random_uuid(), 1, 'AGE_50_54', 'FEMALE', 15),
--         (gen_random_uuid(), 1, 'AGE_55_59', 'FEMALE', 9),
--         (gen_random_uuid(), 1, 'AGE_60_AND_ABOVE', 'FEMALE', 6),
--         -- Ward 1, Other
--         (gen_random_uuid(), 1, 'AGE_0_14', 'OTHER', 0),
--         (gen_random_uuid(), 1, 'AGE_15_19', 'OTHER', 1),
--         (gen_random_uuid(), 1, 'AGE_20_24', 'OTHER', 3),
--         (gen_random_uuid(), 1, 'AGE_25_29', 'OTHER', 2),
--         (gen_random_uuid(), 1, 'AGE_30_34', 'OTHER', 2),
--         (gen_random_uuid(), 1, 'AGE_35_39', 'OTHER', 1),
--         (gen_random_uuid(), 1, 'AGE_40_44', 'OTHER', 1),
--         (gen_random_uuid(), 1, 'AGE_45_49', 'OTHER', 1),
--         (gen_random_uuid(), 1, 'AGE_50_54', 'OTHER', 0),
--         (gen_random_uuid(), 1, 'AGE_55_59', 'OTHER', 0),
--         (gen_random_uuid(), 1, 'AGE_60_AND_ABOVE', 'OTHER', 0),
--         -- Ward 2, Male
--         (gen_random_uuid(), 2, 'AGE_0_14', 'MALE', 14),
--         (gen_random_uuid(), 2, 'AGE_15_19', 'MALE', 42),
--         (gen_random_uuid(), 2, 'AGE_20_24', 'MALE', 165),
--         (gen_random_uuid(), 2, 'AGE_25_29', 'MALE', 128),
--         (gen_random_uuid(), 2, 'AGE_30_34', 'MALE', 92),
--         (gen_random_uuid(), 2, 'AGE_35_39', 'MALE', 58),
--         (gen_random_uuid(), 2, 'AGE_40_44', 'MALE', 42),
--         (gen_random_uuid(), 2, 'AGE_45_49', 'MALE', 28),
--         (gen_random_uuid(), 2, 'AGE_50_54', 'MALE', 16),
--         (gen_random_uuid(), 2, 'AGE_55_59', 'MALE', 12),
--         (gen_random_uuid(), 2, 'AGE_60_AND_ABOVE', 'MALE', 7),
--         -- Ward 2, Female
--         (gen_random_uuid(), 2, 'AGE_0_14', 'FEMALE', 22),
--         (gen_random_uuid(), 2, 'AGE_15_19', 'FEMALE', 72),
--         (gen_random_uuid(), 2, 'AGE_20_24', 'FEMALE', 138),
--         (gen_random_uuid(), 2, 'AGE_25_29', 'FEMALE', 112),
--         (gen_random_uuid(), 2, 'AGE_30_34', 'FEMALE', 78),
--         (gen_random_uuid(), 2, 'AGE_35_39', 'FEMALE', 52),
--         (gen_random_uuid(), 2, 'AGE_40_44', 'FEMALE', 35),
--         (gen_random_uuid(), 2, 'AGE_45_49', 'FEMALE', 24),
--         (gen_random_uuid(), 2, 'AGE_50_54', 'FEMALE', 18),
--         (gen_random_uuid(), 2, 'AGE_55_59', 'FEMALE', 11),
--         (gen_random_uuid(), 2, 'AGE_60_AND_ABOVE', 'FEMALE', 7),
--         -- Ward 2, Other
--         (gen_random_uuid(), 2, 'AGE_0_14', 'OTHER', 0),
--         (gen_random_uuid(), 2, 'AGE_15_19', 'OTHER', 2),
--         (gen_random_uuid(), 2, 'AGE_20_24', 'OTHER', 4),
--         (gen_random_uuid(), 2, 'AGE_25_29', 'OTHER', 3),
--         (gen_random_uuid(), 2, 'AGE_30_34', 'OTHER', 2),
--         (gen_random_uuid(), 2, 'AGE_35_39', 'OTHER', 1),
--         (gen_random_uuid(), 2, 'AGE_40_44', 'OTHER', 1),
--         (gen_random_uuid(), 2, 'AGE_45_49', 'OTHER', 0),
--         (gen_random_uuid(), 2, 'AGE_50_54', 'OTHER', 0),
--         (gen_random_uuid(), 2, 'AGE_55_59', 'OTHER', 0),
--         (gen_random_uuid(), 2, 'AGE_60_AND_ABOVE', 'OTHER', 0),
--         -- Ward 3, Male
--         (gen_random_uuid(), 3, 'AGE_0_14', 'MALE', 16),
--         (gen_random_uuid(), 3, 'AGE_15_19', 'MALE', 48),
--         (gen_random_uuid(), 3, 'AGE_20_24', 'MALE', 172),
--         (gen_random_uuid(), 3, 'AGE_25_29', 'MALE', 125),
--         (gen_random_uuid(), 3, 'AGE_30_34', 'MALE', 96),
--         (gen_random_uuid(), 3, 'AGE_35_39', 'MALE', 65),
--         (gen_random_uuid(), 3, 'AGE_40_44', 'MALE', 45),
--         (gen_random_uuid(), 3, 'AGE_45_49', 'MALE', 32),
--         (gen_random_uuid(), 3, 'AGE_50_54', 'MALE', 21),
--         (gen_random_uuid(), 3, 'AGE_55_59', 'MALE', 14),
--         (gen_random_uuid(), 3, 'AGE_60_AND_ABOVE', 'MALE', 9),
--         -- Ward 3, Female
--         (gen_random_uuid(), 3, 'AGE_0_14', 'FEMALE', 25),
--         (gen_random_uuid(), 3, 'AGE_15_19', 'FEMALE', 78),
--         (gen_random_uuid(), 3, 'AGE_20_24', 'FEMALE', 145),
--         (gen_random_uuid(), 3, 'AGE_25_29', 'FEMALE', 118),
--         (gen_random_uuid(), 3, 'AGE_30_34', 'FEMALE', 82),
--         (gen_random_uuid(), 3, 'AGE_35_39', 'FEMALE', 56),
--         (gen_random_uuid(), 3, 'AGE_40_44', 'FEMALE', 38),
--         (gen_random_uuid(), 3, 'AGE_45_49', 'FEMALE', 26),
--         (gen_random_uuid(), 3, 'AGE_50_54', 'FEMALE', 19),
--         (gen_random_uuid(), 3, 'AGE_55_59', 'FEMALE', 12),
--         (gen_random_uuid(), 3, 'AGE_60_AND_ABOVE', 'FEMALE', 8),
--         -- Ward 3, Other
--         (gen_random_uuid(), 3, 'AGE_0_14', 'OTHER', 0),
--         (gen_random_uuid(), 3, 'AGE_15_19', 'OTHER', 2),
--         (gen_random_uuid(), 3, 'AGE_20_24', 'OTHER', 5),
--         (gen_random_uuid(), 3, 'AGE_25_29', 'OTHER', 3),
--         (gen_random_uuid(), 3, 'AGE_30_34', 'OTHER', 2),
--         (gen_random_uuid(), 3, 'AGE_35_39', 'OTHER', 2),
--         (gen_random_uuid(), 3, 'AGE_40_44', 'OTHER', 1),
--         (gen_random_uuid(), 3, 'AGE_45_49', 'OTHER', 1),
--         (gen_random_uuid(), 3, 'AGE_50_54', 'OTHER', 0),
--         (gen_random_uuid(), 3, 'AGE_55_59', 'OTHER', 0),
--         (gen_random_uuid(), 3, 'AGE_60_AND_ABOVE', 'OTHER', 0);
--     END IF;
-- END
-- $$;