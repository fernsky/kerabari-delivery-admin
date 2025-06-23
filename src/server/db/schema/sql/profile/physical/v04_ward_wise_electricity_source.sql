-- Check if acme_ward_wise_electricity_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_electricity_source'
    ) THEN
        CREATE TABLE acme_ward_wise_electricity_source (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            electricity_source VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_electricity_source) THEN
        INSERT INTO acme_ward_wise_electricity_source (
            id, ward_number, electricity_source, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'ELECTRICITY', 909),
        (gen_random_uuid(), 1, 'KEROSENE', 1),
        -- Ward 2
        (gen_random_uuid(), 2, 'ELECTRICITY', 2599),
        (gen_random_uuid(), 2, 'SOLAR', 3),
        (gen_random_uuid(), 2, 'KEROSENE', 7),
        (gen_random_uuid(), 2, 'OTHER', 2),
        -- Ward 3
        (gen_random_uuid(), 3, 'ELECTRICITY', 2049),
        (gen_random_uuid(), 3, 'SOLAR', 11),
        (gen_random_uuid(), 3, 'BIOGAS', 1),
        -- Ward 4
        (gen_random_uuid(), 4, 'ELECTRICITY', 1827),
        (gen_random_uuid(), 4, 'SOLAR', 2),
        (gen_random_uuid(), 4, 'KEROSENE', 1),
        (gen_random_uuid(), 4, 'OTHER', 2),
        -- Ward 5
        (gen_random_uuid(), 5, 'ELECTRICITY', 1832),
        (gen_random_uuid(), 5, 'SOLAR', 1),
        (gen_random_uuid(), 5, 'KEROSENE', 7),
        (gen_random_uuid(), 5, 'OTHER', 8),
        -- Ward 6
        (gen_random_uuid(), 6, 'ELECTRICITY', 1963),
        (gen_random_uuid(), 6, 'KEROSENE', 4),
        (gen_random_uuid(), 6, 'OTHER', 4),
        -- Ward 7
        (gen_random_uuid(), 7, 'ELECTRICITY', 2237),
        (gen_random_uuid(), 7, 'SOLAR', 102),
        (gen_random_uuid(), 7, 'KEROSENE', 65),
        (gen_random_uuid(), 7, 'BIOGAS', 3),
        -- Ward 8
        (gen_random_uuid(), 8, 'ELECTRICITY', 1505),
        (gen_random_uuid(), 8, 'SOLAR', 276),
        (gen_random_uuid(), 8, 'KEROSENE', 88),
        (gen_random_uuid(), 8, 'OTHER', 12),
        (gen_random_uuid(), 8, 'BIOGAS', 9);
    END IF;
END
$$;
