-- Insert actual water purification data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_water_purification) THEN
        INSERT INTO acme_ward_wise_water_purification (
            id, ward_number, water_purification, households
        ) VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'BOILING', 7),
        (gen_random_uuid(), 1, 'FILTERING', 80),
        (gen_random_uuid(), 1, 'CHEMICAL_PIYUSH', 14),
        (gen_random_uuid(), 1, 'NO_ANY_FILTERING', 830),
        (gen_random_uuid(), 1, 'OTHER', 3),

        -- Ward 2
        (gen_random_uuid(), 2, 'BOILING', 436),
        (gen_random_uuid(), 2, 'FILTERING', 164),
        (gen_random_uuid(), 2, 'CHEMICAL_PIYUSH', 32),
        (gen_random_uuid(), 2, 'NO_ANY_FILTERING', 2152),
        (gen_random_uuid(), 2, 'OTHER', 3),

        -- Ward 3
        (gen_random_uuid(), 3, 'BOILING', 27),
        (gen_random_uuid(), 3, 'FILTERING', 435),
        (gen_random_uuid(), 3, 'CHEMICAL_PIYUSH', 6),
        (gen_random_uuid(), 3, 'NO_ANY_FILTERING', 1633),
        (gen_random_uuid(), 3, 'OTHER', 1),

        -- Ward 4
        (gen_random_uuid(), 4, 'BOILING', 786),
        (gen_random_uuid(), 4, 'FILTERING', 535),
        (gen_random_uuid(), 4, 'CHEMICAL_PIYUSH', 54),
        (gen_random_uuid(), 4, 'NO_ANY_FILTERING', 1001),
        (gen_random_uuid(), 4, 'OTHER', 42),

        -- Ward 5
        (gen_random_uuid(), 5, 'BOILING', 3),
        (gen_random_uuid(), 5, 'FILTERING', 9),
        (gen_random_uuid(), 5, 'CHEMICAL_PIYUSH', 8),
        (gen_random_uuid(), 5, 'NO_ANY_FILTERING', 1834),
        (gen_random_uuid(), 5, 'OTHER', 2),

        -- Ward 6
        (gen_random_uuid(), 6, 'BOILING', 4),
        (gen_random_uuid(), 6, 'FILTERING', 172),
        (gen_random_uuid(), 6, 'CHEMICAL_PIYUSH', 102),
        (gen_random_uuid(), 6, 'NO_ANY_FILTERING', 1719),
        (gen_random_uuid(), 6, 'OTHER', 0),

        -- Ward 7
        (gen_random_uuid(), 7, 'BOILING', 289),
        (gen_random_uuid(), 7, 'FILTERING', 116),
        (gen_random_uuid(), 7, 'CHEMICAL_PIYUSH', 66),
        (gen_random_uuid(), 7, 'NO_ANY_FILTERING', 2121),
        (gen_random_uuid(), 7, 'OTHER', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'BOILING', 299),
        (gen_random_uuid(), 8, 'FILTERING', 182),
        (gen_random_uuid(), 8, 'CHEMICAL_PIYUSH', 196),
        (gen_random_uuid(), 8, 'NO_ANY_FILTERING', 1361),
        (gen_random_uuid(), 8, 'OTHER', 25);
    END IF;
END
$$;
