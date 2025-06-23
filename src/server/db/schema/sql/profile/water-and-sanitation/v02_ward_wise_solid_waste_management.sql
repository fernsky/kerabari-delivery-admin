DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_solid_waste_management) THEN
        INSERT INTO acme_ward_wise_solid_waste_management (
            id, ward_number, solid_waste_management, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'BURNING', 573),
        (gen_random_uuid(), 1, 'DIGGING', 31),
        (gen_random_uuid(), 1, 'COMPOST_MANURE', 300),
        (gen_random_uuid(), 1, 'WASTE_COLLECTING_PLACE', 2),
        (gen_random_uuid(), 1, 'RIVER', 3),
        (gen_random_uuid(), 1, 'HOME_COLLECTION', 1),

        -- Ward 2
        (gen_random_uuid(), 2, 'BURNING', 1417),
        (gen_random_uuid(), 2, 'DIGGING', 547),
        (gen_random_uuid(), 2, 'COMPOST_MANURE', 145),
        (gen_random_uuid(), 2, 'WASTE_COLLECTING_PLACE', 236),
        (gen_random_uuid(), 2, 'RIVER', 245),
        (gen_random_uuid(), 2, 'HOME_COLLECTION', 21),

        -- Ward 3
        (gen_random_uuid(), 3, 'BURNING', 1129),
        (gen_random_uuid(), 3, 'DIGGING', 670),
        (gen_random_uuid(), 3, 'COMPOST_MANURE', 35),
        (gen_random_uuid(), 3, 'WASTE_COLLECTING_PLACE', 169),
        (gen_random_uuid(), 3, 'RIVER', 6),
        (gen_random_uuid(), 3, 'HOME_COLLECTION', 51),
        (gen_random_uuid(), 3, 'ROAD_OR_PUBLIC_PLACE', 1),

        -- Ward 4
        (gen_random_uuid(), 4, 'BURNING', 1127),
        (gen_random_uuid(), 4, 'DIGGING', 263),
        (gen_random_uuid(), 4, 'COMPOST_MANURE', 39),
        (gen_random_uuid(), 4, 'WASTE_COLLECTING_PLACE', 119),
        (gen_random_uuid(), 4, 'RIVER', 279),
        (gen_random_uuid(), 4, 'HOME_COLLECTION', 5),

        -- Ward 5
        (gen_random_uuid(), 5, 'BURNING', 527),
        (gen_random_uuid(), 5, 'DIGGING', 591),
        (gen_random_uuid(), 5, 'COMPOST_MANURE', 342),
        (gen_random_uuid(), 5, 'WASTE_COLLECTING_PLACE', 376),
        (gen_random_uuid(), 5, 'HOME_COLLECTION', 2),
        (gen_random_uuid(), 5, 'ROAD_OR_PUBLIC_PLACE', 9),
        (gen_random_uuid(), 5, 'OTHER', 1),

        -- Ward 6
        (gen_random_uuid(), 6, 'BURNING', 1262),
        (gen_random_uuid(), 6, 'DIGGING', 237),
        (gen_random_uuid(), 6, 'COMPOST_MANURE', 429),
        (gen_random_uuid(), 6, 'WASTE_COLLECTING_PLACE', 10),
        (gen_random_uuid(), 6, 'RIVER', 32),
        (gen_random_uuid(), 6, 'HOME_COLLECTION', 1),

        -- Ward 7
        (gen_random_uuid(), 7, 'BURNING', 493),
        (gen_random_uuid(), 7, 'DIGGING', 1472),
        (gen_random_uuid(), 7, 'COMPOST_MANURE', 324),
        (gen_random_uuid(), 7, 'WASTE_COLLECTING_PLACE', 101),
        (gen_random_uuid(), 7, 'RIVER', 1),
        (gen_random_uuid(), 7, 'HOME_COLLECTION', 12),
        (gen_random_uuid(), 7, 'ROAD_OR_PUBLIC_PLACE', 4),

        -- Ward 8
        (gen_random_uuid(), 8, 'BURNING', 852),
        (gen_random_uuid(), 8, 'DIGGING', 574),
        (gen_random_uuid(), 8, 'COMPOST_MANURE', 255),
        (gen_random_uuid(), 8, 'WASTE_COLLECTING_PLACE', 156),
        (gen_random_uuid(), 8, 'RIVER', 15),
        (gen_random_uuid(), 8, 'HOME_COLLECTION', 20),
        (gen_random_uuid(), 8, 'ROAD_OR_PUBLIC_PLACE', 12),
        (gen_random_uuid(), 8, 'OTHER', 6);
    END IF;
END
$$;
