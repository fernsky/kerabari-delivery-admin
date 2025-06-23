-- Check if acme_municipality_wide_food_crops table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_food_crops'
    ) THEN
        CREATE TABLE acme_municipality_wide_food_crops (
            id VARCHAR(36) PRIMARY KEY,
            food_crop VARCHAR(100) NOT NULL,
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
    DELETE FROM acme_municipality_wide_food_crops;
END
$$;

-- Insert data from the provided table
DO $$
BEGIN
    -- Paddy (Rice)
    INSERT INTO acme_municipality_wide_food_crops (id, food_crop, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'PADDY', 7967.85, 1465.17, 128934960);

    -- Corn
    INSERT INTO acme_municipality_wide_food_crops (id, food_crop, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'CORN', 2187.79, 582.81, 51287280);

    -- Wheat
    INSERT INTO acme_municipality_wide_food_crops (id, food_crop, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'WHEAT', 91.58, 13.07, 1150160);

    -- Barley
    INSERT INTO acme_municipality_wide_food_crops (id, food_crop, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'BARLEY', 8.32, 2.24, 197120);
END
$$;