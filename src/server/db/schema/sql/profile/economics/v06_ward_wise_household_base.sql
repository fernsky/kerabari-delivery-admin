-- Check if acme_ward_wise_household_base table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_base'
    ) THEN
        CREATE TABLE acme_ward_wise_household_base (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            base_type VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty using the accurate real data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_base) THEN
        INSERT INTO acme_ward_wise_household_base (
            id, ward_number, base_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'CONCRETE_PILLAR', 406),
        (gen_random_uuid(), 1, 'CEMENT_JOINED', 262),
        (gen_random_uuid(), 1, 'MUD_JOINED', 238),
        (gen_random_uuid(), 1, 'WOOD_POLE', 2),
        (gen_random_uuid(), 1, 'OTHER', 2),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'CONCRETE_PILLAR', 384),
        (gen_random_uuid(), 2, 'CEMENT_JOINED', 1447),
        (gen_random_uuid(), 2, 'MUD_JOINED', 673),
        (gen_random_uuid(), 2, 'WOOD_POLE', 57),
        (gen_random_uuid(), 2, 'OTHER', 50),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'CONCRETE_PILLAR', 1123),
        (gen_random_uuid(), 3, 'CEMENT_JOINED', 607),
        (gen_random_uuid(), 3, 'MUD_JOINED', 280),
        (gen_random_uuid(), 3, 'WOOD_POLE', 32),
        (gen_random_uuid(), 3, 'OTHER', 19),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'CONCRETE_PILLAR', 377),
        (gen_random_uuid(), 4, 'CEMENT_JOINED', 1142),
        (gen_random_uuid(), 4, 'MUD_JOINED', 283),
        (gen_random_uuid(), 4, 'WOOD_POLE', 8),
        (gen_random_uuid(), 4, 'OTHER', 22),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'CONCRETE_PILLAR', 93),
        (gen_random_uuid(), 5, 'CEMENT_JOINED', 982),
        (gen_random_uuid(), 5, 'MUD_JOINED', 759),
        (gen_random_uuid(), 5, 'WOOD_POLE', 8),
        (gen_random_uuid(), 5, 'OTHER', 6),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'CONCRETE_PILLAR', 177),
        (gen_random_uuid(), 6, 'CEMENT_JOINED', 932),
        (gen_random_uuid(), 6, 'MUD_JOINED', 600),
        (gen_random_uuid(), 6, 'WOOD_POLE', 9),
        (gen_random_uuid(), 6, 'OTHER', 253),
        
        -- Ward 7
        (gen_random_uuid(), 7, 'CONCRETE_PILLAR', 83),
        (gen_random_uuid(), 7, 'CEMENT_JOINED', 1533),
        (gen_random_uuid(), 7, 'MUD_JOINED', 704),
        (gen_random_uuid(), 7, 'WOOD_POLE', 45),
        (gen_random_uuid(), 7, 'OTHER', 42),
        
        -- Ward 8
        (gen_random_uuid(), 8, 'CONCRETE_PILLAR', 249),
        (gen_random_uuid(), 8, 'CEMENT_JOINED', 1051),
        (gen_random_uuid(), 8, 'MUD_JOINED', 512),
        (gen_random_uuid(), 8, 'WOOD_POLE', 2),
        (gen_random_uuid(), 8, 'OTHER', 76);
    END IF;
END
$$;