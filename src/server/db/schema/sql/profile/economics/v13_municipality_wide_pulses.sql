-- Check if acme_municipality_wide_pulses table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_pulses'
    ) THEN
        CREATE TABLE acme_municipality_wide_pulses (
            id VARCHAR(36) PRIMARY KEY,
            pulse VARCHAR(100) NOT NULL,
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
    DELETE FROM acme_municipality_wide_pulses;
END
$$;

-- Insert data from the provided table
DO $$
BEGIN
    -- Lentil (मसुरो)
    INSERT INTO acme_municipality_wide_pulses (id, pulse, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'LENTIL', 150.28, 22.69, 19836960);

    -- Chickpea (चना)
    INSERT INTO acme_municipality_wide_pulses (id, pulse, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'CHICKPEA', 63.96, 10.14, 8442720);

    -- Pea (केराउ)
    INSERT INTO acme_municipality_wide_pulses (id, pulse, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'PEA', 9.46, 3.22, 1248720);

    -- Pigeon Pea (रहर)
    INSERT INTO acme_municipality_wide_pulses (id, pulse, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'PIGEON_PEA', 8.69, 1.69, 1147080);

    -- Black Gram (मास)
    INSERT INTO acme_municipality_wide_pulses (id, pulse, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES
        (gen_random_uuid(), 'BLACK_GRAM', 6.4, 1.42, 844800);
END
$$;