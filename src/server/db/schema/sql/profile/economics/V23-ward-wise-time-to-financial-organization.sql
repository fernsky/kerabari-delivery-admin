-- Check if acme_ward_wise_time_to_financial_organization table exists, if not create it
DO $$
BEGIN
    -- Create enum type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'acme_time_to_financial_organization_type_enum'
    ) THEN
        CREATE TYPE acme_time_to_financial_organization_type_enum AS ENUM (
            'UNDER_15_MIN',
            'UNDER_30_MIN',
            'UNDER_1_HOUR',
            '1_HOUR_OR_MORE'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_time_to_financial_organization'
    ) THEN
        CREATE TABLE acme_ward_wise_time_to_financial_organization (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            time_to_financial_organization_type acme_time_to_financial_organization_type_enum NOT NULL,
            households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_financial_organization) THEN
        -- Ward 1 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (1, 'UNDER_15_MIN', 220),
        (1, 'UNDER_30_MIN', 402),
        (1, 'UNDER_1_HOUR', 1),
        (1, '1_HOUR_OR_MORE', 287);

        -- Ward 2 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (2, 'UNDER_15_MIN', 1506),
        (2, 'UNDER_30_MIN', 931),
        (2, 'UNDER_1_HOUR', 165),
        (2, '1_HOUR_OR_MORE', 9);

        -- Ward 3 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (3, 'UNDER_15_MIN', 1262),
        (3, 'UNDER_30_MIN', 746),
        (3, 'UNDER_1_HOUR', 50),
        (3, '1_HOUR_OR_MORE', 3);

        -- Ward 4 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (4, 'UNDER_15_MIN', 1094),
        (4, 'UNDER_30_MIN', 673),
        (4, 'UNDER_1_HOUR', 52),
        (4, '1_HOUR_OR_MORE', 13);

        -- Ward 5 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (5, 'UNDER_15_MIN', 823),
        (5, 'UNDER_30_MIN', 350),
        (5, 'UNDER_1_HOUR', 598),
        (5, '1_HOUR_OR_MORE', 77);

        -- Ward 6 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (6, 'UNDER_15_MIN', 203),
        (6, 'UNDER_30_MIN', 756),
        (6, 'UNDER_1_HOUR', 524),
        (6, '1_HOUR_OR_MORE', 488);

        -- Ward 7 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (7, 'UNDER_15_MIN', 648),
        (7, 'UNDER_30_MIN', 628),
        (7, 'UNDER_1_HOUR', 1075),
        (7, '1_HOUR_OR_MORE', 56);

        -- Ward 8 data
        INSERT INTO acme_ward_wise_time_to_financial_organization 
        (ward_number, time_to_financial_organization_type, households) VALUES
        (8, 'UNDER_15_MIN', 826),
        (8, 'UNDER_30_MIN', 797),
        (8, 'UNDER_1_HOUR', 207),
        (8, '1_HOUR_OR_MORE', 60);

        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_ward_wise_time_to_financial_org_ward_number 
        ON acme_ward_wise_time_to_financial_organization(ward_number);

        CREATE INDEX IF NOT EXISTS idx_ward_wise_time_to_financial_org_type 
        ON acme_ward_wise_time_to_financial_organization(time_to_financial_organization_type);
    END IF;
END
$$;

-- Add comments for documentation
COMMENT ON TABLE acme_ward_wise_time_to_financial_organization IS 'Stores ward-wise data on time taken to reach financial organizations for Khajura Rural Municipality';
COMMENT ON COLUMN acme_ward_wise_time_to_financial_organization.ward_number IS 'Ward number (1-8)';
COMMENT ON COLUMN acme_ward_wise_time_to_financial_organization.time_to_financial_organization_type IS 'Type of time category to reach financial organization';
COMMENT ON COLUMN acme_ward_wise_time_to_financial_organization.households IS 'Number of households in this ward with this time category';
