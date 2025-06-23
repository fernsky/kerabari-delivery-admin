-- Check if acme_ward_wise_time_to_health_organization table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_time_to_health_organization'
    ) THEN
        CREATE TABLE acme_ward_wise_time_to_health_organization (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            time_to_health_organization VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_health_organization) THEN
        INSERT INTO acme_ward_wise_time_to_health_organization (
            id, ward_number, time_to_health_organization, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'UNDER_15_MIN', 243),
        (gen_random_uuid(), 1, 'UNDER_30_MIN', 376),
        (gen_random_uuid(), 1, '1_HOUR_OR_MORE', 291),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'UNDER_15_MIN', 1691),
        (gen_random_uuid(), 2, 'UNDER_30_MIN', 784),
        (gen_random_uuid(), 2, 'UNDER_1_HOUR', 134),
        (gen_random_uuid(), 2, '1_HOUR_OR_MORE', 2),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'UNDER_15_MIN', 1452),
        (gen_random_uuid(), 3, 'UNDER_30_MIN', 560),
        (gen_random_uuid(), 3, 'UNDER_1_HOUR', 47),
        (gen_random_uuid(), 3, '1_HOUR_OR_MORE', 2),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'UNDER_15_MIN', 1232),
        (gen_random_uuid(), 4, 'UNDER_30_MIN', 538),
        (gen_random_uuid(), 4, 'UNDER_1_HOUR', 55),
        (gen_random_uuid(), 4, '1_HOUR_OR_MORE', 7),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'UNDER_15_MIN', 876),
        (gen_random_uuid(), 5, 'UNDER_30_MIN', 564),
        (gen_random_uuid(), 5, 'UNDER_1_HOUR', 337),
        (gen_random_uuid(), 5, '1_HOUR_OR_MORE', 71),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'UNDER_15_MIN', 889),
        (gen_random_uuid(), 6, 'UNDER_30_MIN', 407),
        (gen_random_uuid(), 6, 'UNDER_1_HOUR', 442),
        (gen_random_uuid(), 6, '1_HOUR_OR_MORE', 233),
        
        -- Ward 7
        (gen_random_uuid(), 7, 'UNDER_15_MIN', 1023),
        (gen_random_uuid(), 7, 'UNDER_30_MIN', 1176),
        (gen_random_uuid(), 7, 'UNDER_1_HOUR', 203),
        (gen_random_uuid(), 7, '1_HOUR_OR_MORE', 5),
        
        -- Ward 8
        (gen_random_uuid(), 8, 'UNDER_15_MIN', 926),
        (gen_random_uuid(), 8, 'UNDER_30_MIN', 634),
        (gen_random_uuid(), 8, 'UNDER_1_HOUR', 251),
        (gen_random_uuid(), 8, '1_HOUR_OR_MORE', 79);
    END IF;
END
$$;