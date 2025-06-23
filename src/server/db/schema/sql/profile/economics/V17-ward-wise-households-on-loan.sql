-- Check if acme_ward_wise_households_on_loan table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_households_on_loan'
    ) THEN
        CREATE TABLE acme_ward_wise_households_on_loan (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_households_on_loan) THEN
        INSERT INTO acme_ward_wise_households_on_loan (
            ward_number, households
        )
        VALUES
        (1, 285),
        (2, 320),
        (3, 245),
        (4, 305),
        (5, 270);
    END IF;
END
$$;