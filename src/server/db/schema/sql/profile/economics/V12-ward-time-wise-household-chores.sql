-- Check if acme_ward_time_wise_household_chores table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_time_wise_household_chores'
    ) THEN
        CREATE TABLE acme_ward_time_wise_household_chores (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            time_spent TEXT NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_time_wise_household_chores) THEN
        INSERT INTO acme_ward_time_wise_household_chores (
            ward_number, time_spent, population
        )
        VALUES
        -- Ward 1 data
        (1, 'LESS_THAN_1_HOUR', 120),
        (1, 'HOURS_1_TO_3', 245),
        (1, 'HOURS_4_TO_6', 310),
        (1, 'HOURS_7_TO_9', 175),
        (1, 'HOURS_10_TO_12', 98),
        (1, 'MORE_THAN_12_HOURS', 52),
        
        -- Ward 2 data
        (2, 'LESS_THAN_1_HOUR', 135),
        (2, 'HOURS_1_TO_3', 260),
        (2, 'HOURS_4_TO_6', 320),
        (2, 'HOURS_7_TO_9', 180),
        (2, 'HOURS_10_TO_12', 105),
        (2, 'MORE_THAN_12_HOURS', 60),
        
        -- Ward 3 data
        (3, 'LESS_THAN_1_HOUR', 110),
        (3, 'HOURS_1_TO_3', 230),
        (3, 'HOURS_4_TO_6', 290),
        (3, 'HOURS_7_TO_9', 165),
        (3, 'HOURS_10_TO_12', 85),
        (3, 'MORE_THAN_12_HOURS', 45),
        
        -- Ward 4 data
        (4, 'LESS_THAN_1_HOUR', 125),
        (4, 'HOURS_1_TO_3', 250),
        (4, 'HOURS_4_TO_6', 305),
        (4, 'HOURS_7_TO_9', 170),
        (4, 'HOURS_10_TO_12', 95),
        (4, 'MORE_THAN_12_HOURS', 55),
        
        -- Ward 5 data
        (5, 'LESS_THAN_1_HOUR', 115),
        (5, 'HOURS_1_TO_3', 235),
        (5, 'HOURS_4_TO_6', 295),
        (5, 'HOURS_7_TO_9', 160),
        (5, 'HOURS_10_TO_12', 90),
        (5, 'MORE_THAN_12_HOURS', 50);
    END IF;
END
$$;