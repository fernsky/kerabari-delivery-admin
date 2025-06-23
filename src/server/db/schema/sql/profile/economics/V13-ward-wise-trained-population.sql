-- Check if acme_ward_wise_trained_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_trained_population'
    ) THEN
        CREATE TABLE acme_ward_wise_trained_population (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            trained_population INTEGER NOT NULL DEFAULT 0 CHECK (trained_population >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_trained_population) THEN
        INSERT INTO acme_ward_wise_trained_population (
            ward_number, trained_population
        )
        VALUES
        (1, 325),
        (2, 410),
        (3, 280),
        (4, 345),
        (5, 298);
    END IF;
END
$$;