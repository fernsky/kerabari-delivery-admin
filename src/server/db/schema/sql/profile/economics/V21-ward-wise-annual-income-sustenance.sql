-- Check if acme_ward_wise_annual_income_sustenance table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_annual_income_sustenance'
    ) THEN
        CREATE TABLE acme_ward_wise_annual_income_sustenance (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            months_sustained TEXT NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_annual_income_sustenance) THEN
        INSERT INTO acme_ward_wise_annual_income_sustenance (
            ward_number, months_sustained, households
        )
        VALUES
        -- Ward 1
        (1, 'UPTO_THREE_MONTHS', 68),
        (1, 'THREE_TO_SIX_MONTHS', 95),
        (1, 'SIX_TO_NINE_MONTHS', 120),
        (1, 'TWELVE_MONTHS', 148),
        
        -- Ward 2
        (2, 'UPTO_THREE_MONTHS', 75),
        (2, 'THREE_TO_SIX_MONTHS', 105),
        (2, 'SIX_TO_NINE_MONTHS', 135),
        (2, 'TWELVE_MONTHS', 162),
        
        -- Ward 3
        (3, 'UPTO_THREE_MONTHS', 58),
        (3, 'THREE_TO_SIX_MONTHS', 82),
        (3, 'SIX_TO_NINE_MONTHS', 98),
        (3, 'TWELVE_MONTHS', 125),
        
        -- Ward 4
        (4, 'UPTO_THREE_MONTHS', 72),
        (4, 'THREE_TO_SIX_MONTHS', 98),
        (4, 'SIX_TO_NINE_MONTHS', 128),
        (4, 'TWELVE_MONTHS', 155),
        
        -- Ward 5
        (5, 'UPTO_THREE_MONTHS', 65),
        (5, 'THREE_TO_SIX_MONTHS', 88),
        (5, 'SIX_TO_NINE_MONTHS', 110),
        (5, 'TWELVE_MONTHS', 135);
    END IF;
END
$$;