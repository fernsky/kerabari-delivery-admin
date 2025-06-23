-- Check if acme_ward_wise_remittance_expenses table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_remittance_expenses'
    ) THEN
        CREATE TABLE acme_ward_wise_remittance_expenses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            remittance_expense TEXT NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_remittance_expenses) THEN
        INSERT INTO acme_ward_wise_remittance_expenses (
            ward_number, remittance_expense, households
        )
        VALUES
        -- Ward 1
        (1, 'EDUCATION', 45),
        (1, 'HEALTH', 38),
        (1, 'HOUSEHOLD_USE', 85),
        (1, 'FESTIVALS', 25),
        (1, 'LOAN_PAYMENT', 35),
        (1, 'LOANED_OTHERS', 12),
        (1, 'SAVING', 42),
        (1, 'HOUSE_CONSTRUCTION', 28),
        (1, 'LAND_OWNERSHIP', 15),
        (1, 'JEWELRY_PURCHASE', 22),
        (1, 'GOODS_PURCHASE', 31),
        (1, 'BUSINESS_INVESTMENT', 19),
        (1, 'OTHER', 8),
        (1, 'UNKNOWN', 5),
        
        -- Ward 2
        (2, 'EDUCATION', 52),
        (2, 'HEALTH', 43),
        (2, 'HOUSEHOLD_USE', 92),
        (2, 'FESTIVALS', 31),
        (2, 'LOAN_PAYMENT', 41),
        (2, 'LOANED_OTHERS', 15),
        (2, 'SAVING', 46),
        (2, 'HOUSE_CONSTRUCTION', 33),
        (2, 'LAND_OWNERSHIP', 18),
        (2, 'JEWELRY_PURCHASE', 27),
        (2, 'GOODS_PURCHASE', 35),
        (2, 'BUSINESS_INVESTMENT', 24),
        (2, 'OTHER', 11),
        (2, 'UNKNOWN', 7),
        
        -- Ward 3
        (3, 'EDUCATION', 39),
        (3, 'HEALTH', 32),
        (3, 'HOUSEHOLD_USE', 78),
        (3, 'FESTIVALS', 22),
        (3, 'LOAN_PAYMENT', 29),
        (3, 'LOANED_OTHERS', 10),
        (3, 'SAVING', 35),
        (3, 'HOUSE_CONSTRUCTION', 25),
        (3, 'LAND_OWNERSHIP', 12),
        (3, 'JEWELRY_PURCHASE', 18),
        (3, 'GOODS_PURCHASE', 26),
        (3, 'BUSINESS_INVESTMENT', 15),
        (3, 'OTHER', 6),
        (3, 'UNKNOWN', 4),
        
        -- Ward 4
        (4, 'EDUCATION', 47),
        (4, 'HEALTH', 40),
        (4, 'HOUSEHOLD_USE', 88),
        (4, 'FESTIVALS', 28),
        (4, 'LOAN_PAYMENT', 37),
        (4, 'LOANED_OTHERS', 13),
        (4, 'SAVING', 44),
        (4, 'HOUSE_CONSTRUCTION', 30),
        (4, 'LAND_OWNERSHIP', 16),
        (4, 'JEWELRY_PURCHASE', 24),
        (4, 'GOODS_PURCHASE', 33),
        (4, 'BUSINESS_INVESTMENT', 21),
        (4, 'OTHER', 9),
        (4, 'UNKNOWN', 6),
        
        -- Ward 5
        (5, 'EDUCATION', 42),
        (5, 'HEALTH', 35),
        (5, 'HOUSEHOLD_USE', 80),
        (5, 'FESTIVALS', 24),
        (5, 'LOAN_PAYMENT', 32),
        (5, 'LOANED_OTHERS', 11),
        (5, 'SAVING', 38),
        (5, 'HOUSE_CONSTRUCTION', 27),
        (5, 'LAND_OWNERSHIP', 14),
        (5, 'JEWELRY_PURCHASE', 20),
        (5, 'GOODS_PURCHASE', 29),
        (5, 'BUSINESS_INVESTMENT', 17),
        (5, 'OTHER', 7),
        (5, 'UNKNOWN', 5);
    END IF;
END
$$;