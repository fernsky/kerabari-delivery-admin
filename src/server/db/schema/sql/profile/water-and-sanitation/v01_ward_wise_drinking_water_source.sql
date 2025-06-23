-- Check if acme_ward_wise_drinking_water_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_drinking_water_source'
    ) THEN
        CREATE TABLE acme_ward_wise_drinking_water_source (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            drinking_water_source VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_drinking_water_source) THEN
        INSERT INTO acme_ward_wise_drinking_water_source (
            id, ward_number, drinking_water_source, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'AQUIFIER_MOOL', 15),
        (gen_random_uuid(), 1, 'TUBEWELL', 877),
        (gen_random_uuid(), 1, 'TAP_INSIDE_HOUSE', 3),
        (gen_random_uuid(), 1, 'TAP_OUTSIDE_HOUSE', 1),
        (gen_random_uuid(), 1, 'JAR', 14),
        -- Ward 2
        (gen_random_uuid(), 2, 'AQUIFIER_MOOL', 218),
        (gen_random_uuid(), 2, 'TUBEWELL', 628),
        (gen_random_uuid(), 2, 'TAP_INSIDE_HOUSE', 1142),
        (gen_random_uuid(), 2, 'TAP_OUTSIDE_HOUSE', 505),
        (gen_random_uuid(), 2, 'JAR', 108),
        (gen_random_uuid(), 2, 'OTHER', 4),
        (gen_random_uuid(), 2, 'RIVER', 6),
        -- Ward 3
        (gen_random_uuid(), 3, 'AQUIFIER_MOOL', 357),
        (gen_random_uuid(), 3, 'TUBEWELL', 115),
        (gen_random_uuid(), 3, 'TAP_INSIDE_HOUSE', 493),
        (gen_random_uuid(), 3, 'TAP_OUTSIDE_HOUSE', 846),
        (gen_random_uuid(), 3, 'JAR', 143),
        (gen_random_uuid(), 3, 'OTHER', 106),
        (gen_random_uuid(), 3, 'RIVER', 1),
        -- Ward 4
        (gen_random_uuid(), 4, 'AQUIFIER_MOOL', 915),
        (gen_random_uuid(), 4, 'TUBEWELL', 33),
        (gen_random_uuid(), 4, 'TAP_INSIDE_HOUSE', 147),
        (gen_random_uuid(), 4, 'TAP_OUTSIDE_HOUSE', 717),
        (gen_random_uuid(), 4, 'JAR', 20),
        -- Ward 5
        (gen_random_uuid(), 5, 'AQUIFIER_MOOL', 1742),
        (gen_random_uuid(), 5, 'TUBEWELL', 11),
        (gen_random_uuid(), 5, 'TAP_INSIDE_HOUSE', 58),
        (gen_random_uuid(), 5, 'TAP_OUTSIDE_HOUSE', 28),
        (gen_random_uuid(), 5, 'JAR', 6),
        (gen_random_uuid(), 5, 'OTHER', 2),
        (gen_random_uuid(), 5, 'RIVER', 1),
        -- Ward 6
        (gen_random_uuid(), 6, 'AQUIFIER_MOOL', 302),
        (gen_random_uuid(), 6, 'TUBEWELL', 1606),
        (gen_random_uuid(), 6, 'TAP_INSIDE_HOUSE', 23),
        (gen_random_uuid(), 6, 'TAP_OUTSIDE_HOUSE', 38),
        (gen_random_uuid(), 6, 'OTHER', 1),
        (gen_random_uuid(), 6, 'COVERED_WELL', 1),
        -- Ward 7
        (gen_random_uuid(), 7, 'AQUIFIER_MOOL', 1557),
        (gen_random_uuid(), 7, 'TUBEWELL', 19),
        (gen_random_uuid(), 7, 'TAP_INSIDE_HOUSE', 554),
        (gen_random_uuid(), 7, 'TAP_OUTSIDE_HOUSE', 255),
        (gen_random_uuid(), 7, 'JAR', 1),
        (gen_random_uuid(), 7, 'OTHER', 6),
        (gen_random_uuid(), 7, 'RIVER', 10),
        (gen_random_uuid(), 7, 'COVERED_WELL', 3),
        (gen_random_uuid(), 7, 'OPEN_WELL', 2),
        -- Ward 8
        (gen_random_uuid(), 8, 'AQUIFIER_MOOL', 764),
        (gen_random_uuid(), 8, 'TUBEWELL', 33),
        (gen_random_uuid(), 8, 'TAP_INSIDE_HOUSE', 677),
        (gen_random_uuid(), 8, 'TAP_OUTSIDE_HOUSE', 390),
        (gen_random_uuid(), 8, 'JAR', 1),
        (gen_random_uuid(), 8, 'OTHER', 18),
        (gen_random_uuid(), 8, 'RIVER', 2),
        (gen_random_uuid(), 8, 'COVERED_WELL', 4),
        (gen_random_uuid(), 8, 'OPEN_WELL', 1);
    END IF;
END
$$;
