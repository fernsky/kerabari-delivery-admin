-- Check if acme_ward_wise_households_loan_use table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_households_loan_use'
    ) THEN
        CREATE TABLE acme_ward_wise_households_loan_use (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            loan_use TEXT NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_households_loan_use) THEN
        INSERT INTO acme_ward_wise_households_loan_use (
            ward_number, loan_use, households
        )
        VALUES
        -- Ward 1
        (1, 'AGRICULTURE', 48),
        (1, 'BUSINESS', 65),
        (1, 'HOUSEHOLD_EXPENSES', 82),
        (1, 'FOREIGN_EMPLOYMENT', 35),
        (1, 'EDUCATION', 45),
        (1, 'HEALTH_TREATMENT', 38),
        (1, 'HOME_CONSTRUCTION', 55),
        (1, 'VEHICLE_PURCHASE', 22),
        (1, 'CEREMONY', 15),
        (1, 'OTHER', 10),
        
        -- Ward 2
        (2, 'AGRICULTURE', 55),
        (2, 'BUSINESS', 72),
        (2, 'HOUSEHOLD_EXPENSES', 90),
        (2, 'FOREIGN_EMPLOYMENT', 42),
        (2, 'EDUCATION', 52),
        (2, 'HEALTH_TREATMENT', 45),
        (2, 'HOME_CONSTRUCTION', 62),
        (2, 'VEHICLE_PURCHASE', 28),
        (2, 'CEREMONY', 18),
        (2, 'OTHER', 12),
        
        -- Ward 3
        (3, 'AGRICULTURE', 42),
        (3, 'BUSINESS', 58),
        (3, 'HOUSEHOLD_EXPENSES', 72),
        (3, 'FOREIGN_EMPLOYMENT', 30),
        (3, 'EDUCATION', 38),
        (3, 'HEALTH_TREATMENT', 32),
        (3, 'HOME_CONSTRUCTION', 48),
        (3, 'VEHICLE_PURCHASE', 18),
        (3, 'CEREMONY', 12),
        (3, 'OTHER', 8),
        
        -- Ward 4
        (4, 'AGRICULTURE', 52),
        (4, 'BUSINESS', 68),
        (4, 'HOUSEHOLD_EXPENSES', 85),
        (4, 'FOREIGN_EMPLOYMENT', 38),
        (4, 'EDUCATION', 48),
        (4, 'HEALTH_TREATMENT', 40),
        (4, 'HOME_CONSTRUCTION', 58),
        (4, 'VEHICLE_PURCHASE', 25),
        (4, 'CEREMONY', 16),
        (4, 'OTHER', 11),
        
        -- Ward 5
        (5, 'AGRICULTURE', 45),
        (5, 'BUSINESS', 62),
        (5, 'HOUSEHOLD_EXPENSES', 78),
        (5, 'FOREIGN_EMPLOYMENT', 32),
        (5, 'EDUCATION', 42),
        (5, 'HEALTH_TREATMENT', 35),
        (5, 'HOME_CONSTRUCTION', 52),
        (5, 'VEHICLE_PURCHASE', 20),
        (5, 'CEREMONY', 14),
        (5, 'OTHER', 9);
    END IF;
END
$$;