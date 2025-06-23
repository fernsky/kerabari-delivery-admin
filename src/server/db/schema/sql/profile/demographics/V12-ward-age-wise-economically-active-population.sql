-- Check if acme_ward_age_wise_economically_active_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_wise_economically_active_population'
    ) THEN
        CREATE TABLE acme_ward_age_wise_economically_active_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_wise_economically_active_population) THEN
        INSERT INTO acme_ward_age_wise_economically_active_population (
            id, ward_number, age_group, population
        )
        VALUES
        -- Ward 1 data
        (gen_random_uuid(), 1, 'AGE_0_TO_14', 917),
        (gen_random_uuid(), 1, 'AGE_15_TO_59', 2729),
        (gen_random_uuid(), 1, 'AGE_60_PLUS', 466),
        
        -- Ward 2 data
        (gen_random_uuid(), 2, 'AGE_0_TO_14', 2350),
        (gen_random_uuid(), 2, 'AGE_15_TO_59', 7114),
        (gen_random_uuid(), 2, 'AGE_60_PLUS', 1080),
        
        -- Ward 3 data
        (gen_random_uuid(), 3, 'AGE_0_TO_14', 1798),
        (gen_random_uuid(), 3, 'AGE_15_TO_59', 5776),
        (gen_random_uuid(), 3, 'AGE_60_PLUS', 907),
        
        -- Ward 4 data
        (gen_random_uuid(), 4, 'AGE_0_TO_14', 1471),
        (gen_random_uuid(), 4, 'AGE_15_TO_59', 5046),
        (gen_random_uuid(), 4, 'AGE_60_PLUS', 630),
        
        -- Ward 5 data
        (gen_random_uuid(), 5, 'AGE_0_TO_14', 2395),
        (gen_random_uuid(), 5, 'AGE_15_TO_59', 4646),
        (gen_random_uuid(), 5, 'AGE_60_PLUS', 481),
        
        -- Ward 6 data
        (gen_random_uuid(), 6, 'AGE_0_TO_14', 2604),
        (gen_random_uuid(), 6, 'AGE_15_TO_59', 5104),
        (gen_random_uuid(), 6, 'AGE_60_PLUS', 573),
        
        -- Ward 7 data
        (gen_random_uuid(), 7, 'AGE_0_TO_14', 2905),
        (gen_random_uuid(), 7, 'AGE_15_TO_59', 6758),
        (gen_random_uuid(), 7, 'AGE_60_PLUS', 923),
        
        -- Ward 8 data
        (gen_random_uuid(), 8, 'AGE_0_TO_14', 2027),
        (gen_random_uuid(), 8, 'AGE_15_TO_59', 5524),
        (gen_random_uuid(), 8, 'AGE_60_PLUS', 684);
    END IF;
END
$$;
