-- Ensure table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_outer_wall'
    ) THEN
        CREATE TABLE acme_ward_wise_household_outer_wall (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            wall_type outer_wall_type NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_outer_wall) THEN
        INSERT INTO acme_ward_wise_household_outer_wall (
            id, ward_number, wall_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'CEMENT_JOINED', 675),
        (gen_random_uuid(), 1, 'MUD_JOINED', 231),
        (gen_random_uuid(), 1, 'UNBAKED_BRICK', 0),
        (gen_random_uuid(), 1, 'WOOD', 0),
        (gen_random_uuid(), 1, 'BAMBOO', 2),
        (gen_random_uuid(), 1, 'TIN', 0),
        (gen_random_uuid(), 1, 'PREFAB', 0),
        (gen_random_uuid(), 1, 'OTHER', 2),

        -- Ward 2
        (gen_random_uuid(), 2, 'CEMENT_JOINED', 1873),
        (gen_random_uuid(), 2, 'MUD_JOINED', 615),
        (gen_random_uuid(), 2, 'UNBAKED_BRICK', 33),
        (gen_random_uuid(), 2, 'WOOD', 32),
        (gen_random_uuid(), 2, 'BAMBOO', 6),
        (gen_random_uuid(), 2, 'TIN', 7),
        (gen_random_uuid(), 2, 'PREFAB', 0),
        (gen_random_uuid(), 2, 'OTHER', 45),

        -- Ward 3
        (gen_random_uuid(), 3, 'CEMENT_JOINED', 1720),
        (gen_random_uuid(), 3, 'MUD_JOINED', 274),
        (gen_random_uuid(), 3, 'UNBAKED_BRICK', 0),
        (gen_random_uuid(), 3, 'WOOD', 7),
        (gen_random_uuid(), 3, 'BAMBOO', 2),
        (gen_random_uuid(), 3, 'TIN', 21),
        (gen_random_uuid(), 3, 'PREFAB', 0),
        (gen_random_uuid(), 3, 'OTHER', 37),

        -- Ward 4
        (gen_random_uuid(), 4, 'CEMENT_JOINED', 1526),
        (gen_random_uuid(), 4, 'MUD_JOINED', 276),
        (gen_random_uuid(), 4, 'UNBAKED_BRICK', 1),
        (gen_random_uuid(), 4, 'WOOD', 1),
        (gen_random_uuid(), 4, 'BAMBOO', 3),
        (gen_random_uuid(), 4, 'TIN', 4),
        (gen_random_uuid(), 4, 'PREFAB', 1),
        (gen_random_uuid(), 4, 'OTHER', 20),

        -- Ward 5
        (gen_random_uuid(), 5, 'CEMENT_JOINED', 1091),
        (gen_random_uuid(), 5, 'MUD_JOINED', 739),
        (gen_random_uuid(), 5, 'UNBAKED_BRICK', 2),
        (gen_random_uuid(), 5, 'WOOD', 4),
        (gen_random_uuid(), 5, 'BAMBOO', 10),
        (gen_random_uuid(), 5, 'TIN', 0),
        (gen_random_uuid(), 5, 'PREFAB', 0),
        (gen_random_uuid(), 5, 'OTHER', 2),

        -- Ward 6
        (gen_random_uuid(), 6, 'CEMENT_JOINED', 1106),
        (gen_random_uuid(), 6, 'MUD_JOINED', 607),
        (gen_random_uuid(), 6, 'UNBAKED_BRICK', 1),
        (gen_random_uuid(), 6, 'WOOD', 1),
        (gen_random_uuid(), 6, 'BAMBOO', 3),
        (gen_random_uuid(), 6, 'TIN', 1),
        (gen_random_uuid(), 6, 'PREFAB', 0),
        (gen_random_uuid(), 6, 'OTHER', 252),

        -- Ward 7
        (gen_random_uuid(), 7, 'CEMENT_JOINED', 1615),
        (gen_random_uuid(), 7, 'MUD_JOINED', 680),
        (gen_random_uuid(), 7, 'UNBAKED_BRICK', 19),
        (gen_random_uuid(), 7, 'WOOD', 37),
        (gen_random_uuid(), 7, 'BAMBOO', 11),
        (gen_random_uuid(), 7, 'TIN', 2),
        (gen_random_uuid(), 7, 'PREFAB', 0),
        (gen_random_uuid(), 7, 'OTHER', 43),

        -- Ward 8
        (gen_random_uuid(), 8, 'CEMENT_JOINED', 1329),
        (gen_random_uuid(), 8, 'MUD_JOINED', 471),
        (gen_random_uuid(), 8, 'UNBAKED_BRICK', 45),
        (gen_random_uuid(), 8, 'WOOD', 13),
        (gen_random_uuid(), 8, 'BAMBOO', 2),
        (gen_random_uuid(), 8, 'TIN', 3),
        (gen_random_uuid(), 8, 'PREFAB', 0),
        (gen_random_uuid(), 8, 'OTHER', 27);
    END IF;
END
$$;
