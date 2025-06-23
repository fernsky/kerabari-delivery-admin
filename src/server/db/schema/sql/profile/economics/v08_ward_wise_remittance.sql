-- Check if acme_ward_wise_remittance table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_remittance'
    ) THEN
        CREATE TABLE acme_ward_wise_remittance (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            amount_group VARCHAR(100) NOT NULL,
            sending_population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_ward_wise_remittance;
END
$$;

-- Insert real data from the provided table
DO $$
BEGIN
    -- Ward 1 data
    INSERT INTO acme_ward_wise_remittance (id, ward_number, amount_group, sending_population)
    VALUES
        (gen_random_uuid(), 1, 'RS_0_TO_49999', 46),
        (gen_random_uuid(), 1, 'RS_50000_TO_99999', 35),
        (gen_random_uuid(), 1, 'RS_100000_TO_149999', 27),
        (gen_random_uuid(), 1, 'RS_150000_TO_199999', 5),
        (gen_random_uuid(), 1, 'RS_200000_TO_249999', 30),
        (gen_random_uuid(), 1, 'RS_250000_TO_299999', 3),
        (gen_random_uuid(), 1, 'RS_300000_TO_349999', 26),
        (gen_random_uuid(), 1, 'RS_350000_TO_399999', 3),
        (gen_random_uuid(), 1, 'RS_400000_TO_449999', 19),
        (gen_random_uuid(), 1, 'RS_450000_TO_499999', 0),
        (gen_random_uuid(), 1, 'RS_500000_PLUS', 70),
        
    -- Ward 2 data
        (gen_random_uuid(), 2, 'RS_0_TO_49999', 83),
        (gen_random_uuid(), 2, 'RS_50000_TO_99999', 82),
        (gen_random_uuid(), 2, 'RS_100000_TO_149999', 97),
        (gen_random_uuid(), 2, 'RS_150000_TO_199999', 22),
        (gen_random_uuid(), 2, 'RS_200000_TO_249999', 107),
        (gen_random_uuid(), 2, 'RS_250000_TO_299999', 58),
        (gen_random_uuid(), 2, 'RS_300000_TO_349999', 104),
        (gen_random_uuid(), 2, 'RS_350000_TO_399999', 13),
        (gen_random_uuid(), 2, 'RS_400000_TO_449999', 79),
        (gen_random_uuid(), 2, 'RS_450000_TO_499999', 18),
        (gen_random_uuid(), 2, 'RS_500000_PLUS', 379),
        
    -- Ward 3 data
        (gen_random_uuid(), 3, 'RS_0_TO_49999', 45),
        (gen_random_uuid(), 3, 'RS_50000_TO_99999', 25),
        (gen_random_uuid(), 3, 'RS_100000_TO_149999', 91),
        (gen_random_uuid(), 3, 'RS_150000_TO_199999', 32),
        (gen_random_uuid(), 3, 'RS_200000_TO_249999', 78),
        (gen_random_uuid(), 3, 'RS_250000_TO_299999', 12),
        (gen_random_uuid(), 3, 'RS_300000_TO_349999', 99),
        (gen_random_uuid(), 3, 'RS_350000_TO_399999', 21),
        (gen_random_uuid(), 3, 'RS_400000_TO_449999', 31),
        (gen_random_uuid(), 3, 'RS_450000_TO_499999', 27),
        (gen_random_uuid(), 3, 'RS_500000_PLUS', 218),
        
    -- Ward 4 data
        (gen_random_uuid(), 4, 'RS_0_TO_49999', 39),
        (gen_random_uuid(), 4, 'RS_50000_TO_99999', 24),
        (gen_random_uuid(), 4, 'RS_100000_TO_149999', 34),
        (gen_random_uuid(), 4, 'RS_150000_TO_199999', 42),
        (gen_random_uuid(), 4, 'RS_200000_TO_249999', 41),
        (gen_random_uuid(), 4, 'RS_250000_TO_299999', 29),
        (gen_random_uuid(), 4, 'RS_300000_TO_349999', 37),
        (gen_random_uuid(), 4, 'RS_350000_TO_399999', 39),
        (gen_random_uuid(), 4, 'RS_400000_TO_449999', 27),
        (gen_random_uuid(), 4, 'RS_450000_TO_499999', 45),
        (gen_random_uuid(), 4, 'RS_500000_PLUS', 139),
        
    -- Ward 5 data
        (gen_random_uuid(), 5, 'RS_0_TO_49999', 6),
        (gen_random_uuid(), 5, 'RS_50000_TO_99999', 4),
        (gen_random_uuid(), 5, 'RS_100000_TO_149999', 1),
        (gen_random_uuid(), 5, 'RS_150000_TO_199999', 0),
        (gen_random_uuid(), 5, 'RS_200000_TO_249999', 9),
        (gen_random_uuid(), 5, 'RS_250000_TO_299999', 1),
        (gen_random_uuid(), 5, 'RS_300000_TO_349999', 6),
        (gen_random_uuid(), 5, 'RS_350000_TO_399999', 10),
        (gen_random_uuid(), 5, 'RS_400000_TO_449999', 5),
        (gen_random_uuid(), 5, 'RS_450000_TO_499999', 1),
        (gen_random_uuid(), 5, 'RS_500000_PLUS', 9),
        
    -- Ward 6 data
        (gen_random_uuid(), 6, 'RS_0_TO_49999', 126),
        (gen_random_uuid(), 6, 'RS_50000_TO_99999', 115),
        (gen_random_uuid(), 6, 'RS_100000_TO_149999', 92),
        (gen_random_uuid(), 6, 'RS_150000_TO_199999', 44),
        (gen_random_uuid(), 6, 'RS_200000_TO_249999', 50),
        (gen_random_uuid(), 6, 'RS_250000_TO_299999', 22),
        (gen_random_uuid(), 6, 'RS_300000_TO_349999', 50),
        (gen_random_uuid(), 6, 'RS_350000_TO_399999', 44),
        (gen_random_uuid(), 6, 'RS_400000_TO_449999', 65),
        (gen_random_uuid(), 6, 'RS_450000_TO_499999', 14),
        (gen_random_uuid(), 6, 'RS_500000_PLUS', 65),
        
    -- Ward 7 data
        (gen_random_uuid(), 7, 'RS_0_TO_49999', 34),
        (gen_random_uuid(), 7, 'RS_50000_TO_99999', 49),
        (gen_random_uuid(), 7, 'RS_100000_TO_149999', 35),
        (gen_random_uuid(), 7, 'RS_150000_TO_199999', 33),
        (gen_random_uuid(), 7, 'RS_200000_TO_249999', 68),
        (gen_random_uuid(), 7, 'RS_250000_TO_299999', 7),
        (gen_random_uuid(), 7, 'RS_300000_TO_349999', 13),
        (gen_random_uuid(), 7, 'RS_350000_TO_399999', 19),
        (gen_random_uuid(), 7, 'RS_400000_TO_449999', 10),
        (gen_random_uuid(), 7, 'RS_450000_TO_499999', 4),
        (gen_random_uuid(), 7, 'RS_500000_PLUS', 29),
        
    -- Ward 8 data
        (gen_random_uuid(), 8, 'RS_0_TO_49999', 59),
        (gen_random_uuid(), 8, 'RS_50000_TO_99999', 23),
        (gen_random_uuid(), 8, 'RS_100000_TO_149999', 30),
        (gen_random_uuid(), 8, 'RS_150000_TO_199999', 10),
        (gen_random_uuid(), 8, 'RS_200000_TO_249999', 14),
        (gen_random_uuid(), 8, 'RS_250000_TO_299999', 11),
        (gen_random_uuid(), 8, 'RS_300000_TO_349999', 21),
        (gen_random_uuid(), 8, 'RS_350000_TO_399999', 30),
        (gen_random_uuid(), 8, 'RS_400000_TO_449999', 13),
        (gen_random_uuid(), 8, 'RS_450000_TO_499999', 4),
        (gen_random_uuid(), 8, 'RS_500000_PLUS', 48);
END
$$;
