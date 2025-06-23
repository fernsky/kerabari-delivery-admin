-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Using existing age_group enum type from V04_ward_age_wise_population.sql
-- Using existing gender enum type from previous migrations

-- Create ward_age_gender_wise_deceased_population table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_gender_wise_deceased_population') THEN
        CREATE TABLE acme_ward_age_gender_wise_deceased_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group age_group NOT NULL,
            gender gender NOT NULL,
            deceased_population INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes for faster lookups
        CREATE INDEX idx_deceased_ward_age_gender ON acme_ward_age_gender_wise_deceased_population(ward_number, age_group, gender);
    END IF;
END
$$;

-- Insert real ward-wise age deceased population data based on provided information
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_gender_wise_deceased_population WHERE ward_number = 1 LIMIT 1) THEN
        -- Ward 1 data
        INSERT INTO acme_ward_age_gender_wise_deceased_population (id, ward_number, age_group, gender, deceased_population)
        VALUES
            -- Ward 1 Male data
            (gen_random_uuid(), 1, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_30_34', 'MALE', 2),
            (gen_random_uuid(), 1, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 1, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_45_49', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_50_54', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_55_59', 'MALE', 1),
            (gen_random_uuid(), 1, 'AGE_60_64', 'MALE', 1),
            (gen_random_uuid(), 1, 'AGE_65_69', 'MALE', 0),
            (gen_random_uuid(), 1, 'AGE_70_74', 'MALE', 1),
            (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'MALE', 9), -- Sum of 75-79(4) + 80-84(4) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(0)

            -- Ward 1 Female data
            (gen_random_uuid(), 1, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_30_34', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_35_39', 'FEMALE', 1),
            (gen_random_uuid(), 1, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_60_64', 'FEMALE', 1),
            (gen_random_uuid(), 1, 'AGE_65_69', 'FEMALE', 2),
            (gen_random_uuid(), 1, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'FEMALE', 6), -- Sum of 75-79(3) + 80-84(2) + 85-89(0) + 90-94(1) + 95-99(0) + 100+(0)

            -- Ward 2 Male data
            (gen_random_uuid(), 2, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_25_29', 'MALE', 1),
            (gen_random_uuid(), 2, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 2, 'AGE_40_44', 'MALE', 1),
            (gen_random_uuid(), 2, 'AGE_45_49', 'MALE', 2),
            (gen_random_uuid(), 2, 'AGE_50_54', 'MALE', 5),
            (gen_random_uuid(), 2, 'AGE_55_59', 'MALE', 1),
            (gen_random_uuid(), 2, 'AGE_60_64', 'MALE', 2),
            (gen_random_uuid(), 2, 'AGE_65_69', 'MALE', 0),
            (gen_random_uuid(), 2, 'AGE_70_74', 'MALE', 1),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'MALE', 8), -- Sum of 75-79(2) + 80-84(3) + 85-89(0) + 90-94(1) + 95-99(2) + 100+(0)

            -- Ward 2 Female data
            (gen_random_uuid(), 2, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_25_29', 'FEMALE', 1),
            (gen_random_uuid(), 2, 'AGE_30_34', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_40_44', 'FEMALE', 2),
            (gen_random_uuid(), 2, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_50_54', 'FEMALE', 3),
            (gen_random_uuid(), 2, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 2, 'AGE_60_64', 'FEMALE', 3),
            (gen_random_uuid(), 2, 'AGE_65_69', 'FEMALE', 7),
            (gen_random_uuid(), 2, 'AGE_70_74', 'FEMALE', 10),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'FEMALE', 8), -- Sum of 75-79(1) + 80-84(3) + 85-89(2) + 90-94(2) + 95-99(0) + 100+(0)

            -- Ward 3 Male data
            (gen_random_uuid(), 3, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_30_34', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_40_44', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_45_49', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_65_69', 'MALE', 5),
            (gen_random_uuid(), 3, 'AGE_70_74', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_75_AND_ABOVE', 'MALE', 1), -- Sum of 75-79(0) + 80-84(1) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 3 Female data
            (gen_random_uuid(), 3, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_30_34', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_60_64', 'FEMALE', 3),
            (gen_random_uuid(), 3, 'AGE_65_69', 'FEMALE', 1),
            (gen_random_uuid(), 3, 'AGE_70_74', 'FEMALE', 3),
            (gen_random_uuid(), 3, 'AGE_75_AND_ABOVE', 'FEMALE', 1), -- Sum of 75-79(0) + 80-84(1) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 4 Male data
            (gen_random_uuid(), 4, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_10_14', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_20_24', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_35_39', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_45_49', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_50_54', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_55_59', 'MALE', 4),
            (gen_random_uuid(), 4, 'AGE_60_64', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_65_69', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_70_74', 'MALE', 4),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'MALE', 3), -- Sum of 75-79(1) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(1)

            -- Ward 4 Female data
            (gen_random_uuid(), 4, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_25_29', 'FEMALE', 2),
            (gen_random_uuid(), 4, 'AGE_30_34', 'FEMALE', 2),
            (gen_random_uuid(), 4, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_60_64', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_65_69', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'FEMALE', 0), -- Sum of 75-79(0) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 5 Male data
            (gen_random_uuid(), 5, 'AGE_0_4', 'MALE', 5),
            (gen_random_uuid(), 5, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 5, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_45_49', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_50_54', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_65_69', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_70_74', 'MALE', 2),
            (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'MALE', 3), -- Sum of 75-79(0) + 80-84(1) + 85-89(0) + 90-94(2) + 95-99(0) + 100+(0)

            -- Ward 5 Female data
            (gen_random_uuid(), 5, 'AGE_0_4', 'FEMALE', 3),
            (gen_random_uuid(), 5, 'AGE_5_9', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_30_34', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_40_44', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_50_54', 'FEMALE', 2),
            (gen_random_uuid(), 5, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_60_64', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_65_69', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'FEMALE', 2), -- Sum of 75-79(0) + 80-84(0) + 85-89(0) + 90-94(1) + 95-99(0) + 100+(1)

            -- Ward 6 Male data
            (gen_random_uuid(), 6, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_5_9', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_10_14', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_20_24', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_25_29', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_45_49', 'MALE', 2),
            (gen_random_uuid(), 6, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_55_59', 'MALE', 2),
            (gen_random_uuid(), 6, 'AGE_60_64', 'MALE', 3),
            (gen_random_uuid(), 6, 'AGE_65_69', 'MALE', 3),
            (gen_random_uuid(), 6, 'AGE_70_74', 'MALE', 5),
            (gen_random_uuid(), 6, 'AGE_75_AND_ABOVE', 'MALE', 3), -- Sum of 75-79(0) + 80-84(3) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 6 Female data
            (gen_random_uuid(), 6, 'AGE_0_4', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_30_34', 'FEMALE', 2),
            (gen_random_uuid(), 6, 'AGE_35_39', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_40_44', 'FEMALE', 2),
            (gen_random_uuid(), 6, 'AGE_45_49', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_50_54', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_55_59', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_60_64', 'FEMALE', 3),
            (gen_random_uuid(), 6, 'AGE_65_69', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_70_74', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_75_AND_ABOVE', 'FEMALE', 4), -- Sum of 75-79(2) + 80-84(1) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(0)

            -- Ward 7 Male data
            (gen_random_uuid(), 7, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_15_19', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_30_34', 'MALE', 2),
            (gen_random_uuid(), 7, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_45_49', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_65_69', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_70_74', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_75_AND_ABOVE', 'MALE', 5), -- Sum of 75-79(1) + 80-84(1) + 85-89(2) + 90-94(0) + 95-99(0) + 100+(1)

            -- Ward 7 Female data
            (gen_random_uuid(), 7, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_30_34', 'FEMALE', 1),
            (gen_random_uuid(), 7, 'AGE_35_39', 'FEMALE', 1),
            (gen_random_uuid(), 7, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_50_54', 'FEMALE', 1),
            (gen_random_uuid(), 7, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_60_64', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_65_69', 'FEMALE', 3),
            (gen_random_uuid(), 7, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_75_AND_ABOVE', 'FEMALE', 2), -- Sum of 75-79(0) + 80-84(0) + 85-89(1) + 90-94(0) + 95-99(0) + 100+(1)

            -- Ward 8 Male data
            (gen_random_uuid(), 8, 'AGE_0_4', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_45_49', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_65_69', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_70_74', 'MALE', 2),
            (gen_random_uuid(), 8, 'AGE_75_AND_ABOVE', 'MALE', 2), -- Sum of 75-79(0) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(1)

            -- Ward 8 Female data
            (gen_random_uuid(), 8, 'AGE_0_4', 'FEMALE', 1),
            (gen_random_uuid(), 8, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_10_14', 'FEMALE', 1),
            (gen_random_uuid(), 8, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_30_34', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_40_44', 'FEMALE', 2),
            (gen_random_uuid(), 8, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_60_64', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_65_69', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_70_74', 'FEMALE', 1),
            (gen_random_uuid(), 8, 'AGE_75_AND_ABOVE', 'FEMALE', 1); -- Sum of 75-79(1) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

        RAISE NOTICE 'Ward age gender wise deceased population data inserted successfully';
    ELSE
        RAISE NOTICE 'Ward age gender wise deceased population data already exists, skipping insertion';
    END IF;
END
$$;
