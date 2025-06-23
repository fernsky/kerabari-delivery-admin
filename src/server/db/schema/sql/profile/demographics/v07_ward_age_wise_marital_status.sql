-- Check if acme_ward_wise_marital_status table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_wise_marital_status'
    ) THEN
        CREATE TABLE acme_ward_age_wise_marital_status (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group VARCHAR(100) NOT NULL,
            marital_status VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            male_population INTEGER,
            female_population INTEGER,
            other_population INTEGER,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_wise_marital_status) THEN
        INSERT INTO acme_ward_age_wise_marital_status (
            id, ward_number, age_group, marital_status, population, male_population, female_population, other_population
        )
        VALUES
        -- Ward 1, AGE_BELOW_15
        (gen_random_uuid(), 1, 'AGE_BELOW_15', 'SINGLE', 980, 510, 470, 0),
        (gen_random_uuid(), 1, 'AGE_BELOW_15', 'MARRIED', 5, 1, 4, 0),
        (gen_random_uuid(), 1, 'AGE_BELOW_15', 'NOT_STATED', 2, 1, 1, 0),

        -- Ward 1, AGE_15_19
        (gen_random_uuid(), 1, 'AGE_15_19', 'SINGLE', 248, 130, 118, 0),
        (gen_random_uuid(), 1, 'AGE_15_19', 'MARRIED', 98, 38, 60, 0),
        (gen_random_uuid(), 1, 'AGE_15_19', 'SEPARATED', 3, 2, 1, 0),

        -- Ward 1, AGE_20_24
        (gen_random_uuid(), 1, 'AGE_20_24', 'SINGLE', 165, 91, 74, 0),
        (gen_random_uuid(), 1, 'AGE_20_24', 'MARRIED', 192, 82, 110, 0),
        (gen_random_uuid(), 1, 'AGE_20_24', 'SEPARATED', 7, 5, 2, 0),
        (gen_random_uuid(), 1, 'AGE_20_24', 'DIVORCED', 3, 1, 2, 0),

        -- Ward 1, AGE_25_29
        (gen_random_uuid(), 1, 'AGE_25_29', 'SINGLE', 90, 52, 38, 0),
        (gen_random_uuid(), 1, 'AGE_25_29', 'MARRIED', 250, 118, 132, 0),
        (gen_random_uuid(), 1, 'AGE_25_29', 'SEPARATED', 15, 10, 5, 0),
        (gen_random_uuid(), 1, 'AGE_25_29', 'DIVORCED', 5, 2, 3, 0),
        (gen_random_uuid(), 1, 'AGE_25_29', 'WIDOWED', 2, 0, 2, 0),

        -- Ward 1, AGE_30_34
        (gen_random_uuid(), 1, 'AGE_30_34', 'SINGLE', 62, 40, 22, 0),
        (gen_random_uuid(), 1, 'AGE_30_34', 'MARRIED', 275, 130, 145, 0),
        (gen_random_uuid(), 1, 'AGE_30_34', 'SEPARATED', 23, 16, 7, 0),
        (gen_random_uuid(), 1, 'AGE_30_34', 'DIVORCED', 8, 3, 5, 0),
        (gen_random_uuid(), 1, 'AGE_30_34', 'WIDOWED', 5, 1, 4, 0),
        (gen_random_uuid(), 1, 'AGE_30_34', 'SEPARATED', 3, 1, 2, 0),

        -- Ward 1, Middle Ages (35-59)
        (gen_random_uuid(), 1, 'AGE_35_39', 'SINGLE', 45, 28, 17, 0),
        (gen_random_uuid(), 1, 'AGE_35_39', 'MARRIED', 265, 145, 120, 0),
        (gen_random_uuid(), 1, 'AGE_35_39', 'SEPARATED', 35, 22, 13, 0),
        (gen_random_uuid(), 1, 'AGE_35_39', 'WIDOWED', 10, 2, 8, 0),
        (gen_random_uuid(), 1, 'AGE_35_39', 'DIVORCED', 12, 5, 7, 0),

        -- Ward 1, Older Ages (60+)
        (gen_random_uuid(), 1, 'AGE_60_64', 'SINGLE', 12, 7, 5, 0),
        (gen_random_uuid(), 1, 'AGE_60_64', 'MARRIED', 110, 65, 45, 0),
        (gen_random_uuid(), 1, 'AGE_60_64', 'WIDOWED', 28, 6, 22, 0),
        
        (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'MARRIED', 65, 40, 25, 0),
        (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'WIDOWED', 45, 10, 35, 0),

        -- Ward 2, AGE_BELOW_15
        (gen_random_uuid(), 2, 'AGE_BELOW_15', 'SINGLE', 1250, 640, 605, 5),
        (gen_random_uuid(), 2, 'AGE_BELOW_15', 'MARRIED', 8, 2, 6, 0),

        -- Ward 2, AGE_15_19
        (gen_random_uuid(), 2, 'AGE_15_19', 'SINGLE', 605, 320, 285, 0),
        (gen_random_uuid(), 2, 'AGE_15_19', 'MARRIED', 120, 42, 78, 0),
        (gen_random_uuid(), 2, 'AGE_15_19', 'SEPARATED', 5, 3, 2, 0),

        -- Ward 2, AGE_20_24
        (gen_random_uuid(), 2, 'AGE_20_24', 'SINGLE', 398, 245, 153, 0),
        (gen_random_uuid(), 2, 'AGE_20_24', 'MARRIED', 470, 195, 275, 0),
        (gen_random_uuid(), 2, 'AGE_20_24', 'SEPARATED', 15, 10, 5, 0),
        (gen_random_uuid(), 2, 'AGE_20_24', 'DIVORCED', 8, 2, 6, 0),
        (gen_random_uuid(), 2, 'AGE_20_24', 'WIDOWED', 5, 3, 2, 0),

        -- Ward 2, AGE_25_29 & AGE_30_34 combined
        (gen_random_uuid(), 2, 'AGE_25_29', 'SINGLE', 275, 175, 100, 0),
        (gen_random_uuid(), 2, 'AGE_25_29', 'MARRIED', 630, 290, 340, 0),
        (gen_random_uuid(), 2, 'AGE_25_29', 'SEPARATED', 42, 32, 10, 0),
        (gen_random_uuid(), 2, 'AGE_25_29', 'DIVORCED', 18, 8, 10, 0),
        (gen_random_uuid(), 2, 'AGE_25_29', 'WIDOWED', 10, 2, 8, 0),

        (gen_random_uuid(), 2, 'AGE_30_34', 'SINGLE', 185, 120, 65, 0),
        (gen_random_uuid(), 2, 'AGE_30_34', 'MARRIED', 710, 340, 370, 0),
        (gen_random_uuid(), 2, 'AGE_30_34', 'SEPARATED', 55, 37, 18, 0),
        (gen_random_uuid(), 2, 'AGE_30_34', 'DIVORCED', 20, 8, 12, 0),
        (gen_random_uuid(), 2, 'AGE_30_34', 'SEPARATED', 10, 4, 6, 0),
        (gen_random_uuid(), 2, 'AGE_30_34', 'WIDOWED', 15, 4, 11, 0),

        -- Ward 3, selected age groups
        (gen_random_uuid(), 3, 'AGE_BELOW_15', 'SINGLE', 915, 470, 445, 0),
        (gen_random_uuid(), 3, 'AGE_BELOW_15', 'MARRIED', 3, 1, 2, 0),
        
        (gen_random_uuid(), 3, 'AGE_15_19', 'SINGLE', 545, 280, 265, 0),
        (gen_random_uuid(), 3, 'AGE_15_19', 'MARRIED', 135, 50, 85, 0),
        (gen_random_uuid(), 3, 'AGE_15_19', 'SEPARATED', 4, 2, 2, 0),
        
        (gen_random_uuid(), 3, 'AGE_20_24', 'SINGLE', 365, 210, 155, 0),
        (gen_random_uuid(), 3, 'AGE_20_24', 'MARRIED', 390, 160, 230, 0),
        (gen_random_uuid(), 3, 'AGE_20_24', 'SEPARATED', 12, 8, 4, 0),
        
        -- Ward 4, selected age groups with more gender diversity
        (gen_random_uuid(), 4, 'AGE_15_19', 'SINGLE', 510, 260, 248, 2),
        (gen_random_uuid(), 4, 'AGE_15_19', 'MARRIED', 142, 58, 84, 0),
        
        (gen_random_uuid(), 4, 'AGE_20_24', 'SINGLE', 330, 180, 148, 2),
        (gen_random_uuid(), 4, 'AGE_20_24', 'MARRIED', 415, 180, 235, 0),
        (gen_random_uuid(), 4, 'AGE_20_24', 'SEPARATED', 18, 12, 6, 0),
        (gen_random_uuid(), 4, 'AGE_20_24', 'DIVORCED', 8, 5, 3, 0),
        
        (gen_random_uuid(), 4, 'AGE_25_29', 'SINGLE', 245, 152, 92, 1),
        (gen_random_uuid(), 4, 'AGE_25_29', 'MARRIED', 580, 270, 310, 0),
        (gen_random_uuid(), 4, 'AGE_25_29', 'SEPARATED', 38, 28, 10, 0),
        
        -- Ward 5, older age groups
        (gen_random_uuid(), 5, 'AGE_40_44', 'SINGLE', 35, 22, 13, 0),
        (gen_random_uuid(), 5, 'AGE_40_44', 'MARRIED', 390, 210, 180, 0),
        (gen_random_uuid(), 5, 'AGE_40_44', 'SEPARATED', 45, 35, 10, 0),
        (gen_random_uuid(), 5, 'AGE_40_44', 'WIDOWED', 18, 4, 14, 0),
        (gen_random_uuid(), 5, 'AGE_40_44', 'DIVORCED', 12, 5, 7, 0),
        
        (gen_random_uuid(), 5, 'AGE_50_54', 'SINGLE', 22, 15, 7, 0),
        (gen_random_uuid(), 5, 'AGE_50_54', 'MARRIED', 285, 168, 117, 0),
        (gen_random_uuid(), 5, 'AGE_50_54', 'SEPARATED', 42, 30, 12, 0),
        (gen_random_uuid(), 5, 'AGE_50_54', 'WIDOWED', 36, 8, 28, 0),
        
        (gen_random_uuid(), 5, 'AGE_65_69', 'SINGLE', 10, 6, 4, 0),
        (gen_random_uuid(), 5, 'AGE_65_69', 'MARRIED', 160, 90, 70, 0),
        (gen_random_uuid(), 5, 'AGE_65_69', 'SEPARATED', 25, 20, 5, 0),
        (gen_random_uuid(), 5, 'AGE_65_69', 'WIDOWED', 68, 16, 52, 0),
        
        (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'SINGLE', 5, 3, 2, 0),
        (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'MARRIED', 102, 70, 32, 0),
        (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'SEPARATED', 18, 15, 3, 0),
        (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'WIDOWED', 95, 28, 67, 0);
    END IF;
END
$$;