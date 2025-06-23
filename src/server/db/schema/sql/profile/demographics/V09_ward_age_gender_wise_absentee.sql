-- Check if acme_ward_age_gender_wise_absentee table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_gender_wise_absentee'
    ) THEN
        CREATE TABLE acme_ward_age_gender_wise_absentee (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group VARCHAR(100) NOT NULL,
            gender VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL CHECK (population >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_gender_wise_absentee) THEN
        INSERT INTO acme_ward_age_gender_wise_absentee (
            id, ward_number, age_group, gender, population
        )
        VALUES
        -- Ward 1 data
        (gen_random_uuid(), 1, 'AGE_0_4', 'MALE', 45),
        (gen_random_uuid(), 1, 'AGE_0_4', 'FEMALE', 40),
        (gen_random_uuid(), 1, 'AGE_5_9', 'MALE', 55),
        (gen_random_uuid(), 1, 'AGE_5_9', 'FEMALE', 50),
        (gen_random_uuid(), 1, 'AGE_10_14', 'MALE', 60),
        (gen_random_uuid(), 1, 'AGE_10_14', 'FEMALE', 58),
        (gen_random_uuid(), 1, 'AGE_15_19', 'MALE', 70),
        (gen_random_uuid(), 1, 'AGE_15_19', 'FEMALE', 65),
        (gen_random_uuid(), 1, 'AGE_20_24', 'MALE', 85),
        (gen_random_uuid(), 1, 'AGE_20_24', 'FEMALE', 80),
        (gen_random_uuid(), 1, 'AGE_20_24', 'OTHER', 5),
        (gen_random_uuid(), 1, 'AGE_25_29', 'MALE', 95),
        (gen_random_uuid(), 1, 'AGE_25_29', 'FEMALE', 90),
        (gen_random_uuid(), 1, 'AGE_30_34', 'MALE', 75),
        (gen_random_uuid(), 1, 'AGE_30_34', 'FEMALE', 70),
        (gen_random_uuid(), 1, 'AGE_35_39', 'MALE', 65),
        (gen_random_uuid(), 1, 'AGE_35_39', 'FEMALE', 60),
        (gen_random_uuid(), 1, 'AGE_40_44', 'MALE', 55),
        (gen_random_uuid(), 1, 'AGE_40_44', 'FEMALE', 50),
        (gen_random_uuid(), 1, 'AGE_45_49', 'MALE', 45),
        (gen_random_uuid(), 1, 'AGE_45_49', 'FEMALE', 40),
        (gen_random_uuid(), 1, 'AGE_50_AND_ABOVE', 'MALE', 35),
        (gen_random_uuid(), 1, 'AGE_50_AND_ABOVE', 'FEMALE', 30),
        
        -- Ward 2 data
        (gen_random_uuid(), 2, 'AGE_0_4', 'MALE', 40),
        (gen_random_uuid(), 2, 'AGE_0_4', 'FEMALE', 35),
        (gen_random_uuid(), 2, 'AGE_5_9', 'MALE', 50),
        (gen_random_uuid(), 2, 'AGE_5_9', 'FEMALE', 45),
        (gen_random_uuid(), 2, 'AGE_10_14', 'MALE', 55),
        (gen_random_uuid(), 2, 'AGE_10_14', 'FEMALE', 53),
        (gen_random_uuid(), 2, 'AGE_15_19', 'MALE', 65),
        (gen_random_uuid(), 2, 'AGE_15_19', 'FEMALE', 60),
        (gen_random_uuid(), 2, 'AGE_20_24', 'MALE', 80),
        (gen_random_uuid(), 2, 'AGE_20_24', 'FEMALE', 75),
        (gen_random_uuid(), 2, 'AGE_25_29', 'MALE', 90),
        (gen_random_uuid(), 2, 'AGE_25_29', 'FEMALE', 85),
        (gen_random_uuid(), 2, 'AGE_30_34', 'MALE', 70),
        (gen_random_uuid(), 2, 'AGE_30_34', 'FEMALE', 65),
        (gen_random_uuid(), 2, 'AGE_35_39', 'MALE', 60),
        (gen_random_uuid(), 2, 'AGE_35_39', 'FEMALE', 55),
        (gen_random_uuid(), 2, 'AGE_40_44', 'MALE', 50),
        (gen_random_uuid(), 2, 'AGE_40_44', 'FEMALE', 45),
        (gen_random_uuid(), 2, 'AGE_45_49', 'MALE', 40),
        (gen_random_uuid(), 2, 'AGE_45_49', 'FEMALE', 35),
        (gen_random_uuid(), 2, 'AGE_50_AND_ABOVE', 'MALE', 30),
        (gen_random_uuid(), 2, 'AGE_50_AND_ABOVE', 'FEMALE', 25),
        
        -- Ward 3 data
        (gen_random_uuid(), 3, 'AGE_0_4', 'MALE', 35),
        (gen_random_uuid(), 3, 'AGE_0_4', 'FEMALE', 30),
        (gen_random_uuid(), 3, 'AGE_5_9', 'MALE', 45),
        (gen_random_uuid(), 3, 'AGE_5_9', 'FEMALE', 40),
        (gen_random_uuid(), 3, 'AGE_10_14', 'MALE', 50),
        (gen_random_uuid(), 3, 'AGE_10_14', 'FEMALE', 48),
        (gen_random_uuid(), 3, 'AGE_15_19', 'MALE', 60),
        (gen_random_uuid(), 3, 'AGE_15_19', 'FEMALE', 55),
        (gen_random_uuid(), 3, 'AGE_15_19', 'OTHER', 8),
        (gen_random_uuid(), 3, 'AGE_20_24', 'MALE', 75),
        (gen_random_uuid(), 3, 'AGE_20_24', 'FEMALE', 70),
        (gen_random_uuid(), 3, 'AGE_25_29', 'MALE', 85),
        (gen_random_uuid(), 3, 'AGE_25_29', 'FEMALE', 80),
        (gen_random_uuid(), 3, 'AGE_30_34', 'MALE', 65),
        (gen_random_uuid(), 3, 'AGE_30_34', 'FEMALE', 60),
        (gen_random_uuid(), 3, 'AGE_35_39', 'MALE', 55),
        (gen_random_uuid(), 3, 'AGE_35_39', 'FEMALE', 50),
        (gen_random_uuid(), 3, 'AGE_40_44', 'MALE', 45),
        (gen_random_uuid(), 3, 'AGE_40_44', 'FEMALE', 40),
        (gen_random_uuid(), 3, 'AGE_45_49', 'MALE', 35),
        (gen_random_uuid(), 3, 'AGE_45_49', 'FEMALE', 30),
        (gen_random_uuid(), 3, 'AGE_50_AND_ABOVE', 'MALE', 25),
        (gen_random_uuid(), 3, 'AGE_50_AND_ABOVE', 'FEMALE', 20),
        
        -- Ward 4 data (additional data)
        (gen_random_uuid(), 4, 'AGE_0_4', 'MALE', 32),
        (gen_random_uuid(), 4, 'AGE_0_4', 'FEMALE', 28),
        (gen_random_uuid(), 4, 'AGE_5_9', 'MALE', 42),
        (gen_random_uuid(), 4, 'AGE_5_9', 'FEMALE', 38),
        (gen_random_uuid(), 4, 'AGE_10_14', 'MALE', 47),
        (gen_random_uuid(), 4, 'AGE_10_14', 'FEMALE', 45),
        (gen_random_uuid(), 4, 'AGE_15_19', 'MALE', 58),
        (gen_random_uuid(), 4, 'AGE_15_19', 'FEMALE', 52),
        (gen_random_uuid(), 4, 'AGE_20_24', 'MALE', 72),
        (gen_random_uuid(), 4, 'AGE_20_24', 'FEMALE', 68),
        
        -- Ward 5 data (additional data)
        (gen_random_uuid(), 5, 'AGE_0_4', 'MALE', 30),
        (gen_random_uuid(), 5, 'AGE_0_4', 'FEMALE', 25),
        (gen_random_uuid(), 5, 'AGE_5_9', 'MALE', 40),
        (gen_random_uuid(), 5, 'AGE_5_9', 'FEMALE', 35),
        (gen_random_uuid(), 5, 'AGE_10_14', 'MALE', 45),
        (gen_random_uuid(), 5, 'AGE_10_14', 'FEMALE', 42),
        (gen_random_uuid(), 5, 'AGE_15_19', 'MALE', 55),
        (gen_random_uuid(), 5, 'AGE_15_19', 'FEMALE', 50),
        (gen_random_uuid(), 5, 'AGE_20_24', 'MALE', 70),
        (gen_random_uuid(), 5, 'AGE_20_24', 'FEMALE', 65);
    END IF;
END
$$;