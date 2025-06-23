-- Check if acme_ward_wise_cooking_fuel table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_cooking_fuel'
    ) THEN
        CREATE TABLE acme_ward_wise_cooking_fuel (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            cooking_fuel VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- Insert ward-wise cooking fuel data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_cooking_fuel) THEN
        INSERT INTO acme_ward_wise_cooking_fuel (
            id, ward_number, cooking_fuel, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'LP_GAS', 558),
        (gen_random_uuid(), 1, 'WOOD', 332),
        (gen_random_uuid(), 1, 'ELECTRICITY', 4),
        (gen_random_uuid(), 1, 'BIOGAS', 15),
        (gen_random_uuid(), 1, 'KEROSENE', 1),
        -- Ward 2
        (gen_random_uuid(), 2, 'LP_GAS', 1907),
        (gen_random_uuid(), 2, 'WOOD', 366),
        (gen_random_uuid(), 2, 'ELECTRICITY', 3),
        (gen_random_uuid(), 2, 'BIOGAS', 329),
        (gen_random_uuid(), 2, 'KEROSENE', 2),
        (gen_random_uuid(), 2, 'DUNGCAKE', 4),
        -- Ward 3
        (gen_random_uuid(), 3, 'LP_GAS', 1857),
        (gen_random_uuid(), 3, 'WOOD', 91),
        (gen_random_uuid(), 3, 'BIOGAS', 105),
        (gen_random_uuid(), 3, 'KEROSENE', 7),
        (gen_random_uuid(), 3, 'DUNGCAKE', 1),
        -- Ward 4
        (gen_random_uuid(), 4, 'LP_GAS', 1712),
        (gen_random_uuid(), 4, 'WOOD', 93),
        (gen_random_uuid(), 4, 'ELECTRICITY', 3),
        (gen_random_uuid(), 4, 'BIOGAS', 19),
        (gen_random_uuid(), 4, 'KEROSENE', 1),
        (gen_random_uuid(), 4, 'DUNGCAKE', 4),
        -- Ward 5
        (gen_random_uuid(), 5, 'LP_GAS', 130),
        (gen_random_uuid(), 5, 'WOOD', 1691),
        (gen_random_uuid(), 5, 'BIOGAS', 22),
        (gen_random_uuid(), 5, 'KEROSENE', 1),
        (gen_random_uuid(), 5, 'DUNGCAKE', 3),
        (gen_random_uuid(), 5, 'OTHER', 1),
        -- Ward 6
        (gen_random_uuid(), 6, 'LP_GAS', 636),
        (gen_random_uuid(), 6, 'WOOD', 1322),
        (gen_random_uuid(), 6, 'ELECTRICITY', 1),
        (gen_random_uuid(), 6, 'BIOGAS', 12),
        -- Ward 7
        (gen_random_uuid(), 7, 'LP_GAS', 335),
        (gen_random_uuid(), 7, 'WOOD', 1757),
        (gen_random_uuid(), 7, 'ELECTRICITY', 13),
        (gen_random_uuid(), 7, 'BIOGAS', 11),
        (gen_random_uuid(), 7, 'KEROSENE', 104),
        (gen_random_uuid(), 7, 'DUNGCAKE', 185),
        (gen_random_uuid(), 7, 'OTHER', 2),
        -- Ward 8
        (gen_random_uuid(), 8, 'LP_GAS', 454),
        (gen_random_uuid(), 8, 'WOOD', 947),
        (gen_random_uuid(), 8, 'ELECTRICITY', 62),
        (gen_random_uuid(), 8, 'BIOGAS', 74),
        (gen_random_uuid(), 8, 'KEROSENE', 223),
        (gen_random_uuid(), 8, 'DUNGCAKE', 129),
        (gen_random_uuid(), 8, 'OTHER', 1);
    END IF;
END
$$;
