-- Check if acme_ward_age_gender_wise_economically_active_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_gender_wise_economically_active_population'
    ) THEN
        CREATE TABLE acme_ward_age_gender_wise_economically_active_population (
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_gender_wise_economically_active_population) THEN
        INSERT INTO acme_ward_age_gender_wise_economically_active_population (
            id, ward_number, age_group, gender, population
        )
        VALUES
        -- Ward 1 data
        (gen_random_uuid(), 1, 'AGE_0_TO_14', 'MALE', 150),
        (gen_random_uuid(), 1, 'AGE_0_TO_14', 'FEMALE', 145),
        (gen_random_uuid(), 1, 'AGE_0_TO_14', 'OTHER', 5),
        (gen_random_uuid(), 1, 'AGE_15_TO_59', 'MALE', 450),
        (gen_random_uuid(), 1, 'AGE_15_TO_59', 'FEMALE', 425),
        (gen_random_uuid(), 1, 'AGE_15_TO_59', 'OTHER', 15),
        (gen_random_uuid(), 1, 'AGE_60_PLUS', 'MALE', 85),
        (gen_random_uuid(), 1, 'AGE_60_PLUS', 'FEMALE', 95),
        (gen_random_uuid(), 1, 'AGE_60_PLUS', 'OTHER', 5),
        
        -- Ward 2 data
        (gen_random_uuid(), 2, 'AGE_0_TO_14', 'MALE', 180),
        (gen_random_uuid(), 2, 'AGE_0_TO_14', 'FEMALE', 175),
        (gen_random_uuid(), 2, 'AGE_0_TO_14', 'OTHER', 8),
        (gen_random_uuid(), 2, 'AGE_15_TO_59', 'MALE', 520),
        (gen_random_uuid(), 2, 'AGE_15_TO_59', 'FEMALE', 510),
        (gen_random_uuid(), 2, 'AGE_15_TO_59', 'OTHER', 20),
        (gen_random_uuid(), 2, 'AGE_60_PLUS', 'MALE', 95),
        (gen_random_uuid(), 2, 'AGE_60_PLUS', 'FEMALE', 105),
        (gen_random_uuid(), 2, 'AGE_60_PLUS', 'OTHER', 7),
        
        -- Ward 3 data
        (gen_random_uuid(), 3, 'AGE_0_TO_14', 'MALE', 165),
        (gen_random_uuid(), 3, 'AGE_0_TO_14', 'FEMALE', 160),
        (gen_random_uuid(), 3, 'AGE_0_TO_14', 'OTHER', 6),
        (gen_random_uuid(), 3, 'AGE_15_TO_59', 'MALE', 480),
        (gen_random_uuid(), 3, 'AGE_15_TO_59', 'FEMALE', 465),
        (gen_random_uuid(), 3, 'AGE_15_TO_59', 'OTHER', 18),
        (gen_random_uuid(), 3, 'AGE_60_PLUS', 'MALE', 90),
        (gen_random_uuid(), 3, 'AGE_60_PLUS', 'FEMALE', 100),
        (gen_random_uuid(), 3, 'AGE_60_PLUS', 'OTHER', 6),
        
        -- Ward 4 data
        (gen_random_uuid(), 4, 'AGE_0_TO_14', 'MALE', 140),
        (gen_random_uuid(), 4, 'AGE_0_TO_14', 'FEMALE', 135),
        (gen_random_uuid(), 4, 'AGE_0_TO_14', 'OTHER', 4),
        (gen_random_uuid(), 4, 'AGE_15_TO_59', 'MALE', 410),
        (gen_random_uuid(), 4, 'AGE_15_TO_59', 'FEMALE', 390),
        (gen_random_uuid(), 4, 'AGE_15_TO_59', 'OTHER', 12),
        (gen_random_uuid(), 4, 'AGE_60_PLUS', 'MALE', 80),
        (gen_random_uuid(), 4, 'AGE_60_PLUS', 'FEMALE', 90),
        (gen_random_uuid(), 4, 'AGE_60_PLUS', 'OTHER', 3),
        
        -- Ward 5 data
        (gen_random_uuid(), 5, 'AGE_0_TO_14', 'MALE', 155),
        (gen_random_uuid(), 5, 'AGE_0_TO_14', 'FEMALE', 150),
        (gen_random_uuid(), 5, 'AGE_0_TO_14', 'OTHER', 5),
        (gen_random_uuid(), 5, 'AGE_15_TO_59', 'MALE', 440),
        (gen_random_uuid(), 5, 'AGE_15_TO_59', 'FEMALE', 430),
        (gen_random_uuid(), 5, 'AGE_15_TO_59', 'OTHER', 15),
        (gen_random_uuid(), 5, 'AGE_60_PLUS', 'MALE', 85),
        (gen_random_uuid(), 5, 'AGE_60_PLUS', 'FEMALE', 95),
        (gen_random_uuid(), 5, 'AGE_60_PLUS', 'OTHER', 4);
    END IF;
END
$$;