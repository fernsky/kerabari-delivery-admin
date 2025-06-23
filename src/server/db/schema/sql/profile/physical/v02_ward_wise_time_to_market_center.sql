-- Create table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_time_to_market_center'
    ) THEN
        CREATE TABLE acme_ward_wise_time_to_market_center (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            time_to_market_center VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_market_center) THEN
        INSERT INTO acme_ward_wise_time_to_market_center (
            id, ward_number, time_to_market_center, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'UNDER_15_MIN', 145),
        (gen_random_uuid(), 1, 'UNDER_30_MIN', 326),
        (gen_random_uuid(), 1, 'UNDER_1_HOUR', 145),
        (gen_random_uuid(), 1, '1_HOUR_OR_MORE', 294),

        -- Ward 2
        (gen_random_uuid(), 2, 'UNDER_15_MIN', 2015),
        (gen_random_uuid(), 2, 'UNDER_30_MIN', 426),
        (gen_random_uuid(), 2, 'UNDER_1_HOUR', 168),
        (gen_random_uuid(), 2, '1_HOUR_OR_MORE', 2),

        -- Ward 3
        (gen_random_uuid(), 3, 'UNDER_15_MIN', 1460),
        (gen_random_uuid(), 3, 'UNDER_30_MIN', 553),
        (gen_random_uuid(), 3, 'UNDER_1_HOUR', 44),
        (gen_random_uuid(), 3, '1_HOUR_OR_MORE', 4),

        -- Ward 4
        (gen_random_uuid(), 4, 'UNDER_15_MIN', 1147),
        (gen_random_uuid(), 4, 'UNDER_30_MIN', 624),
        (gen_random_uuid(), 4, 'UNDER_1_HOUR', 51),
        (gen_random_uuid(), 4, '1_HOUR_OR_MORE', 10),

        -- Ward 5
        (gen_random_uuid(), 5, 'UNDER_15_MIN', 640),
        (gen_random_uuid(), 5, 'UNDER_30_MIN', 693),
        (gen_random_uuid(), 5, 'UNDER_1_HOUR', 469),
        (gen_random_uuid(), 5, '1_HOUR_OR_MORE', 46),

        -- Ward 6
        (gen_random_uuid(), 6, 'UNDER_15_MIN', 190),
        (gen_random_uuid(), 6, 'UNDER_30_MIN', 1321),
        (gen_random_uuid(), 6, 'UNDER_1_HOUR', 286),
        (gen_random_uuid(), 6, '1_HOUR_OR_MORE', 174),

        -- Ward 7
        (gen_random_uuid(), 7, 'UNDER_15_MIN', 614),
        (gen_random_uuid(), 7, 'UNDER_30_MIN', 726),
        (gen_random_uuid(), 7, 'UNDER_1_HOUR', 1051),
        (gen_random_uuid(), 7, '1_HOUR_OR_MORE', 16),

        -- Ward 8
        (gen_random_uuid(), 8, 'UNDER_15_MIN', 1024),
        (gen_random_uuid(), 8, 'UNDER_30_MIN', 615),
        (gen_random_uuid(), 8, 'UNDER_1_HOUR', 178),
        (gen_random_uuid(), 8, '1_HOUR_OR_MORE', 73);
    END IF;
END
$$;
