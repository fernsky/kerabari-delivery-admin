-- Check if acme_ward_wise_disability_cause table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_disability_cause'
    ) THEN
        CREATE TABLE acme_ward_wise_disability_cause (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            disability_cause VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL CHECK (population >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert updated seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_disability_cause) THEN
        INSERT INTO acme_ward_wise_disability_cause (
            id, ward_number, disability_cause, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'DISEASE', 10),
        (gen_random_uuid(), 1, 'ACCIDENT', 22),
        (gen_random_uuid(), 1, 'CONGENITAL', 28),

        -- Ward 2
        (gen_random_uuid(), 2, 'DISEASE', 66),
        (gen_random_uuid(), 2, 'ACCIDENT', 38),
        (gen_random_uuid(), 2, 'CONGENITAL', 57),
        (gen_random_uuid(), 2, 'MALNUTRITION', 6),
        (gen_random_uuid(), 2, 'CONFLICT', 3),

        -- Ward 3
        (gen_random_uuid(), 3, 'DISEASE', 29),
        (gen_random_uuid(), 3, 'ACCIDENT', 9),
        (gen_random_uuid(), 3, 'CONGENITAL', 41),
        (gen_random_uuid(), 3, 'CONFLICT', 1),

        -- Ward 4
        (gen_random_uuid(), 4, 'DISEASE', 12),
        (gen_random_uuid(), 4, 'ACCIDENT', 12),
        (gen_random_uuid(), 4, 'CONGENITAL', 9),

        -- Ward 5
        (gen_random_uuid(), 5, 'DISEASE', 2),
        (gen_random_uuid(), 5, 'ACCIDENT', 3),
        (gen_random_uuid(), 5, 'CONGENITAL', 16),

        -- Ward 6
        (gen_random_uuid(), 6, 'DISEASE', 32),
        (gen_random_uuid(), 6, 'ACCIDENT', 17),
        (gen_random_uuid(), 6, 'CONGENITAL', 41),

        -- Ward 7
        (gen_random_uuid(), 7, 'DISEASE', 10),
        (gen_random_uuid(), 7, 'ACCIDENT', 11),
        (gen_random_uuid(), 7, 'CONGENITAL', 19),
        (gen_random_uuid(), 7, 'MALNUTRITION', 1),
        (gen_random_uuid(), 7, 'CONFLICT', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'DISEASE', 5),
        (gen_random_uuid(), 8, 'ACCIDENT', 7),
        (gen_random_uuid(), 8, 'CONGENITAL', 22);
    END IF;
END
$$;
