-- Check if acme_ward_wise_household_income_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_income_source'
    ) THEN
        CREATE TABLE acme_ward_wise_household_income_source (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            income_source TEXT NOT NULL,
            households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_income_source) THEN
        INSERT INTO acme_ward_wise_household_income_source (
            ward_number, income_source, households
        )
        VALUES
        -- Ward 1
        (1, 'JOB', 85),
        (1, 'AGRICULTURE', 120),
        (1, 'BUSINESS', 75),
        (1, 'INDUSTRY', 25),
        (1, 'FOREIGN_EMPLOYMENT', 60),
        (1, 'LABOUR', 45),
        (1, 'OTHER', 20),
        
        -- Ward 2
        (2, 'JOB', 98),
        (2, 'AGRICULTURE', 135),
        (2, 'BUSINESS', 88),
        (2, 'INDUSTRY', 32),
        (2, 'FOREIGN_EMPLOYMENT', 72),
        (2, 'LABOUR', 52),
        (2, 'OTHER', 25),
        
        -- Ward 3
        (3, 'JOB', 72),
        (3, 'AGRICULTURE', 105),
        (3, 'BUSINESS', 62),
        (3, 'INDUSTRY', 20),
        (3, 'FOREIGN_EMPLOYMENT', 48),
        (3, 'LABOUR', 38),
        (3, 'OTHER', 15),
        
        -- Ward 4
        (4, 'JOB', 90),
        (4, 'AGRICULTURE', 125),
        (4, 'BUSINESS', 80),
        (4, 'INDUSTRY', 28),
        (4, 'FOREIGN_EMPLOYMENT', 65),
        (4, 'LABOUR', 48),
        (4, 'OTHER', 22),
        
        -- Ward 5
        (5, 'JOB', 78),
        (5, 'AGRICULTURE', 112),
        (5, 'BUSINESS', 68),
        (5, 'INDUSTRY', 22),
        (5, 'FOREIGN_EMPLOYMENT', 55),
        (5, 'LABOUR', 42),
        (5, 'OTHER', 18);
    END IF;
END
$$;