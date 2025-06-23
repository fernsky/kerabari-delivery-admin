-- Check if acme_municipality_wide_animal_products table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_animal_products'
    ) THEN
        CREATE TABLE acme_municipality_wide_animal_products (
            id VARCHAR(36) PRIMARY KEY,
            animal_product VARCHAR(100) NOT NULL,
            production_amount DECIMAL(14, 2) NOT NULL,
            sales_amount DECIMAL(14, 2) NOT NULL,
            revenue_in_rs DECIMAL(14, 2) NOT NULL,
            measurement_unit VARCHAR(50) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_animal_products;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    -- Milk (दुध)
    INSERT INTO acme_municipality_wide_animal_products (id, animal_product, production_amount, sales_amount, revenue_in_rs, measurement_unit)
    VALUES (gen_random_uuid(), 'MILK', 3110, 2119, 84760000, 'टन');

    -- Milk Products (दुधजन्य वस्तु)
    INSERT INTO acme_municipality_wide_animal_products (id, animal_product, production_amount, sales_amount, revenue_in_rs, measurement_unit)
    VALUES (gen_random_uuid(), 'MILK_PRODUCT', 54.51, 20.23, 7673400.84, 'टन');
    
    -- Meat (मासु)
    INSERT INTO acme_municipality_wide_animal_products (id, animal_product, production_amount, sales_amount, revenue_in_rs, measurement_unit)
    VALUES (gen_random_uuid(), 'MEAT', 724.56, 310.18, 62036000, 'टन');
    
    -- Eggs (अण्डा)
    INSERT INTO acme_municipality_wide_animal_products (id, animal_product, production_amount, sales_amount, revenue_in_rs, measurement_unit)
    VALUES (gen_random_uuid(), 'EGG', 37082.00, 23060.00, 184480, 'संख्या');
END
$$;