-- Check if acme_municipality_wide_oil_seeds table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_oil_seeds'
    ) THEN
        CREATE TABLE acme_municipality_wide_oil_seeds (
            id VARCHAR(36) PRIMARY KEY,
            oil_seed VARCHAR(100) NOT NULL,
            production_in_tonnes DECIMAL(10, 2) NOT NULL,
            sales_in_tonnes DECIMAL(10, 2) NOT NULL,
            revenue_in_rs DECIMAL(14, 2) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_oil_seeds;
END
$$;

-- Insert data from the provided table
DO $$
BEGIN
    -- Mustard (तोरी/सरसोँ)
    INSERT INTO acme_municipality_wide_oil_seeds (id, oil_seed, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'MUSTARD', 202.06, 20.86, 2086000);
END
$$;