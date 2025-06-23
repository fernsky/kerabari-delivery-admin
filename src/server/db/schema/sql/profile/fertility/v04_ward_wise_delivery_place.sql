-- Check if acme_ward_wise_delivery_places table exists, if not create it
DO $$
BEGIN
    -- First create the enum type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'delivery_place_type'
    ) THEN
        CREATE TYPE delivery_place_type AS ENUM (
            'HOUSE',
            'GOVERNMENTAL_HEALTH_INSTITUTION',
            'PRIVATE_HEALTH_INSTITUTION',
            'OTHER'
        );
    END IF;

    -- Then create the table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_delivery_places'
    ) THEN
        CREATE TABLE acme_ward_wise_delivery_places (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            delivery_place delivery_place_type NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_delivery_places) THEN
        INSERT INTO acme_ward_wise_delivery_places (
            id, ward_number, delivery_place, population
        )
        VALUES
        -- Ward 1 data
        (gen_random_uuid(), 1, 'GOVERNMENTAL_HEALTH_INSTITUTION', 16),
        (gen_random_uuid(), 1, 'PRIVATE_HEALTH_INSTITUTION', 10),
        (gen_random_uuid(), 1, 'HOUSE', 1),
        
        -- Ward 2 data
        (gen_random_uuid(), 2, 'GOVERNMENTAL_HEALTH_INSTITUTION', 173),
        (gen_random_uuid(), 2, 'PRIVATE_HEALTH_INSTITUTION', 10),
        (gen_random_uuid(), 2, 'HOUSE', 34),
        (gen_random_uuid(), 2, 'OTHER', 1),
        
        -- Ward 3 data
        (gen_random_uuid(), 3, 'GOVERNMENTAL_HEALTH_INSTITUTION', 26),
        (gen_random_uuid(), 3, 'PRIVATE_HEALTH_INSTITUTION', 23),
        (gen_random_uuid(), 3, 'HOUSE', 1),
        (gen_random_uuid(), 3, 'OTHER', 1),
        
        -- Ward 4 data
        (gen_random_uuid(), 4, 'GOVERNMENTAL_HEALTH_INSTITUTION', 41),
        (gen_random_uuid(), 4, 'PRIVATE_HEALTH_INSTITUTION', 14),
        (gen_random_uuid(), 4, 'HOUSE', 7),
        
        -- Ward 5 data
        (gen_random_uuid(), 5, 'GOVERNMENTAL_HEALTH_INSTITUTION', 48),
        (gen_random_uuid(), 5, 'PRIVATE_HEALTH_INSTITUTION', 9),
        
        -- Ward 6 data
        (gen_random_uuid(), 6, 'GOVERNMENTAL_HEALTH_INSTITUTION', 31),
        (gen_random_uuid(), 6, 'PRIVATE_HEALTH_INSTITUTION', 73),
        (gen_random_uuid(), 6, 'HOUSE', 10),
        (gen_random_uuid(), 6, 'OTHER', 8),
        
        -- Ward 7 data
        (gen_random_uuid(), 7, 'GOVERNMENTAL_HEALTH_INSTITUTION', 141),
        (gen_random_uuid(), 7, 'PRIVATE_HEALTH_INSTITUTION', 7),
        (gen_random_uuid(), 7, 'HOUSE', 11),
        
        -- Ward 8 data
        (gen_random_uuid(), 8, 'GOVERNMENTAL_HEALTH_INSTITUTION', 46),
        (gen_random_uuid(), 8, 'PRIVATE_HEALTH_INSTITUTION', 6),
        (gen_random_uuid(), 8, 'HOUSE', 10),
        (gen_random_uuid(), 8, 'OTHER', 4);
    END IF;
END
$$;