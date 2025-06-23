-- Check if acme_municipality_wide_fruits table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_fruits'
    ) THEN
        CREATE TABLE acme_municipality_wide_fruits (
            id VARCHAR(36) PRIMARY KEY,
            fruit_type VARCHAR(100) NOT NULL,
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
    DELETE FROM acme_municipality_wide_fruits;
END
$$;

-- Insert data from the provided table
DO $$
BEGIN
    -- Mango (आँप)
    INSERT INTO acme_municipality_wide_fruits (id, fruit_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'MANGO', 40.30, 15.85, 1585000);

    -- Jackfruit (रुखकटहर)
    INSERT INTO acme_municipality_wide_fruits (id, fruit_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'JACKFRUIT', 1.39, 0.68, 68000);
    
    -- Litchi (लिची)
    INSERT INTO acme_municipality_wide_fruits (id, fruit_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'LITCHI', 1.25, 0.78, 78000);
    
    -- Lemon (कागती)
    INSERT INTO acme_municipality_wide_fruits (id, fruit_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'LEMON', 0.90, 0.23, 23000);
END
$$;