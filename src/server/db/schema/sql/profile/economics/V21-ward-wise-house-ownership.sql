-- Check if acme_ward_wise_house_ownership table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_house_ownership'
    ) THEN
        -- Create ownership type enum if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'ownership_type_enum'
        ) THEN
            CREATE TYPE ownership_type_enum AS ENUM ('PRIVATE', 'RENT', 'INSTITUTIONAL', 'OTHER');
        END IF;

        CREATE TABLE acme_ward_wise_house_ownership (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            ownership_type ownership_type_enum NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_house_ownership) THEN
        -- Ward 1
        INSERT INTO acme_ward_wise_house_ownership (ward_number, ownership_type, households) VALUES
        (1, 'PRIVATE', 847), (1, 'RENT', 35), (1, 'INSTITUTIONAL', 2), (1, 'OTHER', 26),
        -- Ward 2
        (2, 'PRIVATE', 2470), (2, 'RENT', 128), (2, 'INSTITUTIONAL', 4), (2, 'OTHER', 9),
        -- Ward 3
        (3, 'PRIVATE', 1819), (3, 'RENT', 236), (3, 'INSTITUTIONAL', 3), (3, 'OTHER', 3),
        -- Ward 4
        (4, 'PRIVATE', 1792), (4, 'RENT', 32), (4, 'INSTITUTIONAL', 2), (4, 'OTHER', 6),
        -- Ward 5
        (5, 'PRIVATE', 1815), (5, 'RENT', 13), (5, 'INSTITUTIONAL', 0), (5, 'OTHER', 20),
        -- Ward 6
        (6, 'PRIVATE', 1944), (6, 'RENT', 10), (6, 'INSTITUTIONAL', 3), (6, 'OTHER', 14),
        -- Ward 7
        (7, 'PRIVATE', 2377), (7, 'RENT', 24), (7, 'INSTITUTIONAL', 1), (7, 'OTHER', 5),
        -- Ward 8
        (8, 'PRIVATE', 1868), (8, 'RENT', 17), (8, 'INSTITUTIONAL', 0), (8, 'OTHER', 5);

        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_ward_wise_house_ownership_ward_number ON acme_ward_wise_house_ownership(ward_number);
        CREATE INDEX IF NOT EXISTS idx_ward_wise_house_ownership_type ON acme_ward_wise_house_ownership(ownership_type);
    END IF;
END
$$;

-- Add comments for documentation
COMMENT ON TABLE acme_ward_wise_house_ownership IS 'Stores ward-wise house ownership data for Khajura Rural Municipality';
COMMENT ON COLUMN acme_ward_wise_house_ownership.ward_number IS 'Ward number (1-8)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.ownership_type IS 'Type of house ownership (PRIVATE, RENT, INSTITUTIONAL, OTHER)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.households IS 'Number of households with this type of ownership in the ward';
