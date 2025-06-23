-- Check if acme_ward_wise_financial_accounts table exists, if not create it
DO $$
BEGIN
    -- Create enum type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'acme_financial_account_type_enum'
    ) THEN
        CREATE TYPE acme_financial_account_type_enum AS ENUM (
            'BANK',
            'FINANCE',
            'MICRO_FINANCE',
            'COOPERATIVE',
            'NONE'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_financial_accounts'
    ) THEN
        CREATE TABLE acme_ward_wise_financial_accounts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            financial_account_type acme_financial_account_type_enum NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_financial_accounts) THEN
        -- Ward 1 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (1, 'NONE', 191),
        (1, 'BANK', 714),
        (1, 'COOPERATIVE', 24),
        (1, 'FINANCE', 8),
        (1, 'MICRO_FINANCE', 4);

        -- Ward 2 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (2, 'NONE', 361),
        (2, 'BANK', 1953),
        (2, 'COOPERATIVE', 280),
        (2, 'FINANCE', 91),
        (2, 'MICRO_FINANCE', 331);

        -- Ward 3 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (3, 'NONE', 255),
        (3, 'BANK', 1772),
        (3, 'COOPERATIVE', 41),
        (3, 'FINANCE', 33),
        (3, 'MICRO_FINANCE', 48);

        -- Ward 4 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (4, 'NONE', 833),
        (4, 'BANK', 940),
        (4, 'COOPERATIVE', 189),
        (4, 'FINANCE', 222),
        (4, 'MICRO_FINANCE', 149);

        -- Ward 5 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (5, 'NONE', 692),
        (5, 'BANK', 694),
        (5, 'COOPERATIVE', 162),
        (5, 'FINANCE', 212),
        (5, 'MICRO_FINANCE', 168);

        -- Ward 6 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (6, 'NONE', 943),
        (6, 'BANK', 645),
        (6, 'COOPERATIVE', 12),
        (6, 'FINANCE', 43),
        (6, 'MICRO_FINANCE', 340);

        -- Ward 7 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (7, 'NONE', 928),
        (7, 'BANK', 1114),
        (7, 'COOPERATIVE', 179),
        (7, 'FINANCE', 194),
        (7, 'MICRO_FINANCE', 102);

        -- Ward 8 data
        INSERT INTO acme_ward_wise_financial_accounts 
        (ward_number, financial_account_type, households) VALUES
        (8, 'NONE', 842),
        (8, 'BANK', 262),
        (8, 'COOPERATIVE', 97),
        (8, 'FINANCE', 596),
        (8, 'MICRO_FINANCE', 256);

        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_ward_wise_financial_accounts_ward_number 
        ON acme_ward_wise_financial_accounts(ward_number);

        CREATE INDEX IF NOT EXISTS idx_ward_wise_financial_accounts_type 
        ON acme_ward_wise_financial_accounts(financial_account_type);
    END IF;
END
$$;

-- Add comments for documentation
COMMENT ON TABLE acme_ward_wise_financial_accounts IS 'Stores ward-wise data on financial accounts for Khajura Rural Municipality';
COMMENT ON COLUMN acme_ward_wise_financial_accounts.ward_number IS 'Ward number (1-8)';
COMMENT ON COLUMN acme_ward_wise_financial_accounts.financial_account_type IS 'Type of financial account';
COMMENT ON COLUMN acme_ward_wise_financial_accounts.households IS 'Number of households in this ward with this financial account type';
