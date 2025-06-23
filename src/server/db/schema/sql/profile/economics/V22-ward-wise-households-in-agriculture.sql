-- Check if acme_ward_wise_households_in_agriculture table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_households_in_agriculture'
    ) THEN
        CREATE TABLE acme_ward_wise_households_in_agriculture (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            involved_in_agriculture INTEGER NOT NULL DEFAULT 0 CHECK (involved_in_agriculture >= 0),
            non_involved_in_agriculture INTEGER NOT NULL DEFAULT 0 CHECK (non_involved_in_agriculture >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_households_in_agriculture) THEN
        -- Ward-wise data
        INSERT INTO acme_ward_wise_households_in_agriculture (ward_number, involved_in_agriculture, non_involved_in_agriculture) VALUES
        (1, 445, 465),
        (2, 980, 1631),
        (3, 812, 1249),
        (4, 355, 1477),
        (5, 60, 1788),
        (6, 810, 1161),
        (7, 778, 1629),
        (8, 284, 1606);

        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_ward_wise_households_in_agriculture_ward_number 
        ON acme_ward_wise_households_in_agriculture(ward_number);
    END IF;
END
$$;

-- Add comments for documentation
COMMENT ON TABLE acme_ward_wise_households_in_agriculture IS 'Stores ward-wise data on households involved in agriculture for Khajura Rural Municipality';
COMMENT ON COLUMN acme_ward_wise_households_in_agriculture.ward_number IS 'Ward number (1-8)';
COMMENT ON COLUMN acme_ward_wise_households_in_agriculture.involved_in_agriculture IS 'Number of households involved in agriculture or animal husbandry in the ward';
COMMENT ON COLUMN acme_ward_wise_households_in_agriculture.non_involved_in_agriculture IS 'Number of households not involved in agriculture or animal husbandry in the ward';
