--DUMMY DATA
-- Check if acme_ward_age_gender_wise_married_age table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_gender_wise_married_age'
    ) THEN
        CREATE TABLE acme_ward_age_gender_wise_married_age (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group VARCHAR(100) NOT NULL,
            gender VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_gender_wise_married_age) THEN
        INSERT INTO acme_ward_age_gender_wise_married_age (
            id, ward_number, age_group, gender, population
        )
        VALUES
        -- Ward 1 data
        (gen_random_uuid(), 1, 'AGE_BELOW_15', 'MALE', 120),
        (gen_random_uuid(), 1, 'AGE_BELOW_15', 'FEMALE', 110),
        (gen_random_uuid(), 1, 'AGE_BELOW_15', 'OTHER', 10),
        (gen_random_uuid(), 1, 'AGE_15_19', 'MALE', 180),
        (gen_random_uuid(), 1, 'AGE_15_19', 'FEMALE', 190),
        (gen_random_uuid(), 1, 'AGE_20_24', 'MALE', 210),
        (gen_random_uuid(), 1, 'AGE_20_24', 'FEMALE', 230),
        (gen_random_uuid(), 1, 'AGE_25_29', 'MALE', 280),
        (gen_random_uuid(), 1, 'AGE_25_29', 'FEMALE', 290),
        (gen_random_uuid(), 1, 'AGE_30_34', 'MALE', 240),
        (gen_random_uuid(), 1, 'AGE_30_34', 'FEMALE', 250),
        (gen_random_uuid(), 1, 'AGE_35_39', 'MALE', 180),
        (gen_random_uuid(), 1, 'AGE_35_39', 'FEMALE', 170),
        (gen_random_uuid(), 1, 'AGE_40_AND_ABOVE', 'MALE', 150),
        (gen_random_uuid(), 1, 'AGE_40_AND_ABOVE', 'FEMALE', 140),
        
        -- Ward 2 data
        (gen_random_uuid(), 2, 'AGE_BELOW_15', 'MALE', 100),
        (gen_random_uuid(), 2, 'AGE_BELOW_15', 'FEMALE', 105),
        (gen_random_uuid(), 2, 'AGE_15_19', 'MALE', 165),
        (gen_random_uuid(), 2, 'AGE_15_19', 'FEMALE', 175),
        (gen_random_uuid(), 2, 'AGE_20_24', 'MALE', 195),
        (gen_random_uuid(), 2, 'AGE_20_24', 'FEMALE', 205),
        (gen_random_uuid(), 2, 'AGE_25_29', 'MALE', 235),
        (gen_random_uuid(), 2, 'AGE_25_29', 'FEMALE', 245),
        (gen_random_uuid(), 2, 'AGE_30_34', 'MALE', 215),
        (gen_random_uuid(), 2, 'AGE_30_34', 'FEMALE', 225),
        (gen_random_uuid(), 2, 'AGE_35_39', 'MALE', 155),
        (gen_random_uuid(), 2, 'AGE_35_39', 'FEMALE', 145),
        (gen_random_uuid(), 2, 'AGE_40_AND_ABOVE', 'MALE', 135),
        (gen_random_uuid(), 2, 'AGE_40_AND_ABOVE', 'FEMALE', 125),
        
        -- Ward 3 data
        (gen_random_uuid(), 3, 'AGE_BELOW_15', 'MALE', 90),
        (gen_random_uuid(), 3, 'AGE_BELOW_15', 'FEMALE', 95),
        (gen_random_uuid(), 3, 'AGE_15_19', 'MALE', 140),
        (gen_random_uuid(), 3, 'AGE_15_19', 'FEMALE', 150),
        (gen_random_uuid(), 3, 'AGE_20_24', 'MALE', 180),
        (gen_random_uuid(), 3, 'AGE_20_24', 'FEMALE', 190),
        (gen_random_uuid(), 3, 'AGE_20_24', 'OTHER', 15),
        (gen_random_uuid(), 3, 'AGE_25_29', 'MALE', 200),
        (gen_random_uuid(), 3, 'AGE_25_29', 'FEMALE', 210),
        (gen_random_uuid(), 3, 'AGE_30_34', 'MALE', 170),
        (gen_random_uuid(), 3, 'AGE_30_34', 'FEMALE', 180),
        (gen_random_uuid(), 3, 'AGE_35_39', 'MALE', 130),
        (gen_random_uuid(), 3, 'AGE_35_39', 'FEMALE', 120),
        (gen_random_uuid(), 3, 'AGE_40_AND_ABOVE', 'MALE', 110),
        (gen_random_uuid(), 3, 'AGE_40_AND_ABOVE', 'FEMALE', 100),
        
        -- Additional wards (4-8) for more comprehensive data
        (gen_random_uuid(), 4, 'AGE_BELOW_15', 'MALE', 85),
        (gen_random_uuid(), 4, 'AGE_BELOW_15', 'FEMALE', 92),
        (gen_random_uuid(), 4, 'AGE_15_19', 'MALE', 145),
        (gen_random_uuid(), 4, 'AGE_15_19', 'FEMALE', 158),
        (gen_random_uuid(), 4, 'AGE_20_24', 'MALE', 188),
        (gen_random_uuid(), 4, 'AGE_20_24', 'FEMALE', 198),
        (gen_random_uuid(), 4, 'AGE_25_29', 'MALE', 217),
        (gen_random_uuid(), 4, 'AGE_25_29', 'FEMALE', 228),
        
        (gen_random_uuid(), 5, 'AGE_BELOW_15', 'MALE', 78),
        (gen_random_uuid(), 5, 'AGE_BELOW_15', 'FEMALE', 82),
        (gen_random_uuid(), 5, 'AGE_15_19', 'MALE', 132),
        (gen_random_uuid(), 5, 'AGE_15_19', 'FEMALE', 142),
        (gen_random_uuid(), 5, 'AGE_20_24', 'MALE', 175),
        (gen_random_uuid(), 5, 'AGE_20_24', 'FEMALE', 185),
        (gen_random_uuid(), 5, 'AGE_25_29', 'MALE', 205),
        (gen_random_uuid(), 5, 'AGE_25_29', 'FEMALE', 213);
    END IF;
END
$$;