-- Check if acme_ward_wise_household_land_possessions table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_land_possessions'
    ) THEN
        CREATE TABLE acme_ward_wise_household_land_possessions (
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_land_possessions) THEN
        INSERT INTO acme_ward_wise_household_land_possessions (
            ward_number, households
        )
        VALUES
        (1, 210),
        (2, 245),
        (3, 180),
        (4, 225),
        (5, 195);
    END IF;
END
$$;