-- Check if acme_ward_wise_irrigated_area table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_irrigated_area'
    ) THEN
        CREATE TABLE acme_ward_wise_irrigated_area (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            irrigated_area_hectares DECIMAL(10, 2) NOT NULL,
            unirrigated_area_hectares DECIMAL(10, 2) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_ward_wise_irrigated_area;
END
$$;

-- Insert real data from the provided table
DO $$
BEGIN
    -- Ward 1 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 1, 134.58, 116.84);

    -- Ward 2 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 2, 180.54, 215.72);

    -- Ward 3 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 3, 68.24, 97.13);

    -- Ward 4 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 4, 21.74, 63.88);

    -- Ward 5 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 5, 57.37, 750.83);

    -- Ward 6 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 6, 154.39, 201.86);

    -- Ward 7 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 7, 44.39, 2190.51);

    -- Ward 8 data
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 8, 53.81, 364.11);

    -- Total data (for reference/summary)
    INSERT INTO acme_ward_wise_irrigated_area (id, ward_number, irrigated_area_hectares, unirrigated_area_hectares)
    VALUES
        (gen_random_uuid(), 9, 715.06, 4000.88);
END
$$;
