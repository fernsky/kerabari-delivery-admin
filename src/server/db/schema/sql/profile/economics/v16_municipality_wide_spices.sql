-- Check if acme_municipality_wide_spices table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_spices'
    ) THEN
        CREATE TABLE acme_municipality_wide_spices (
            id VARCHAR(36) PRIMARY KEY,
            spice_type VARCHAR(100) NOT NULL,
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
    DELETE FROM acme_municipality_wide_spices;
END
$$;

-- Insert data from the provided table
DO $$
BEGIN
    -- Garlic (लसुन)
    INSERT INTO acme_municipality_wide_spices (id, spice_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'GARLIC', 17.63, 3.07, 399100);

    -- Chili Pepper (खुर्सानी)
    INSERT INTO acme_municipality_wide_spices (id, spice_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CHILI_PEPPER', 2.83, 1.53, 198900);
    
    -- Coriander (धनिया)
    INSERT INTO acme_municipality_wide_spices (id, spice_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CORIANDER', 0.81, 0.23, 29900);
END
$$;