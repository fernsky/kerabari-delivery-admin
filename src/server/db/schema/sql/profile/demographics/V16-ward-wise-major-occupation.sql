-- Check if acme_ward_wise_major_occupation table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_major_occupation'
    ) THEN
        CREATE TABLE acme_ward_wise_major_occupation (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            occupation TEXT NOT NULL,
            population INTEGER NOT NULL DEFAULT 0 CHECK (population >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_major_occupation) THEN
        INSERT INTO acme_ward_wise_major_occupation (
            ward_number, occupation, population
        )
        VALUES
        -- Ward 1
        (1, 'FOREIGN_EMPLOYMENT', 348),
        (1, 'DAILY_WAGE', 147),
        (1, 'HOUSEHOLD_WORK', 4),
        (1, 'INDUSTRY_WORK', 21),
        (1, 'STUDENT', 8),
        (1, 'GOVERNMENT_SERVICE', 126),
        (1, 'OTHERS', 76),
        (1, 'NON_GOVERNMENT_SERVICE', 120),
        (1, 'BUSINESS', 80),
        (1, 'SELF_EMPLOYED', 8),
        (1, 'ANIMAL_HUSBANDRY', 6),
        (1, 'UNEMPLOYED', 11),
        
        -- Ward 2
        (2, 'FOREIGN_EMPLOYMENT', 1279),
        (2, 'DAILY_WAGE', 604),
        (2, 'HOUSEHOLD_WORK', 406),
        (2, 'INDUSTRY_WORK', 800),
        (2, 'STUDENT', 180),
        (2, 'GOVERNMENT_SERVICE', 301),
        (2, 'OTHERS', 226),
        (2, 'NON_GOVERNMENT_SERVICE', 271),
        (2, 'BUSINESS', 248),
        (2, 'SELF_EMPLOYED', 29),
        (2, 'ANIMAL_HUSBANDRY', 143),
        (2, 'UNEMPLOYED', 65),
        
        -- Ward 3
        (3, 'FOREIGN_EMPLOYMENT', 707),
        (3, 'DAILY_WAGE', 479),
        (3, 'HOUSEHOLD_WORK', 715),
        (3, 'INDUSTRY_WORK', 191),
        (3, 'STUDENT', 336),
        (3, 'GOVERNMENT_SERVICE', 338),
        (3, 'OTHERS', 159),
        (3, 'NON_GOVERNMENT_SERVICE', 276),
        (3, 'BUSINESS', 350),
        (3, 'SELF_EMPLOYED', 87),
        (3, 'ANIMAL_HUSBANDRY', 29),
        (3, 'UNEMPLOYED', 7),
        
        -- Ward 4
        (4, 'FOREIGN_EMPLOYMENT', 1032),
        (4, 'DAILY_WAGE', 210),
        (4, 'HOUSEHOLD_WORK', 657),
        (4, 'INDUSTRY_WORK', 341),
        (4, 'STUDENT', 394),
        (4, 'GOVERNMENT_SERVICE', 190),
        (4, 'OTHERS', 89),
        (4, 'NON_GOVERNMENT_SERVICE', 105),
        (4, 'BUSINESS', 106),
        (4, 'SELF_EMPLOYED', 96),
        (4, 'ANIMAL_HUSBANDRY', 15),
        (4, 'UNEMPLOYED', 16),
        
        -- Ward 5
        (5, 'FOREIGN_EMPLOYMENT', 189),
        (5, 'DAILY_WAGE', 1358),
        (5, 'HOUSEHOLD_WORK', 504),
        (5, 'INDUSTRY_WORK', 83),
        (5, 'STUDENT', 309),
        (5, 'GOVERNMENT_SERVICE', 52),
        (5, 'OTHERS', 226),
        (5, 'NON_GOVERNMENT_SERVICE', 19),
        (5, 'BUSINESS', 25),
        (5, 'SELF_EMPLOYED', 66),
        (5, 'ANIMAL_HUSBANDRY', 25),
        (5, 'UNEMPLOYED', 22),
        
        -- Ward 6
        (6, 'FOREIGN_EMPLOYMENT', 1007),
        (6, 'DAILY_WAGE', 817),
        (6, 'HOUSEHOLD_WORK', 595),
        (6, 'INDUSTRY_WORK', 309),
        (6, 'STUDENT', 498),
        (6, 'GOVERNMENT_SERVICE', 86),
        (6, 'OTHERS', 111),
        (6, 'NON_GOVERNMENT_SERVICE', 83),
        (6, 'BUSINESS', 157),
        (6, 'SELF_EMPLOYED', 10),
        (6, 'ANIMAL_HUSBANDRY', 14),
        (6, 'UNEMPLOYED', 7),
        
        -- Ward 7
        (7, 'FOREIGN_EMPLOYMENT', 420),
        (7, 'DAILY_WAGE', 853),
        (7, 'HOUSEHOLD_WORK', 56),
        (7, 'INDUSTRY_WORK', 187),
        (7, 'STUDENT', 27),
        (7, 'GOVERNMENT_SERVICE', 96),
        (7, 'OTHERS', 206),
        (7, 'NON_GOVERNMENT_SERVICE', 183),
        (7, 'BUSINESS', 28),
        (7, 'SELF_EMPLOYED', 71),
        (7, 'ANIMAL_HUSBANDRY', 27),
        (7, 'UNEMPLOYED', 7),
        
        -- Ward 8
        (8, 'FOREIGN_EMPLOYMENT', 366),
        (8, 'DAILY_WAGE', 425),
        (8, 'HOUSEHOLD_WORK', 293),
        (8, 'INDUSTRY_WORK', 104),
        (8, 'STUDENT', 83),
        (8, 'GOVERNMENT_SERVICE', 54),
        (8, 'OTHERS', 115),
        (8, 'NON_GOVERNMENT_SERVICE', 60),
        (8, 'BUSINESS', 28),
        (8, 'SELF_EMPLOYED', 46),
        (8, 'ANIMAL_HUSBANDRY', 16),
        (8, 'UNEMPLOYED', 9);
    END IF;
END
$$;