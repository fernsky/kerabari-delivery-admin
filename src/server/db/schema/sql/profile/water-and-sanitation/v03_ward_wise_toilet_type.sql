-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_toilet_type) THEN
        INSERT INTO acme_ward_wise_toilet_type (
            id, ward_number, toilet_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'NORMAL', 674),
        (gen_random_uuid(), 1, 'FLUSH_WITH_SEPTIC_TANK', 96),
        (gen_random_uuid(), 1, 'PUBLIC_EILANI', 135),
        (gen_random_uuid(), 1, 'NO_TOILET', 2),
        (gen_random_uuid(), 1, 'OTHER', 3),

        -- Ward 2
        (gen_random_uuid(), 2, 'NORMAL', 1001),
        (gen_random_uuid(), 2, 'FLUSH_WITH_SEPTIC_TANK', 1376),
        (gen_random_uuid(), 2, 'PUBLIC_EILANI', 190),
        (gen_random_uuid(), 2, 'NO_TOILET', 36),
        (gen_random_uuid(), 2, 'OTHER', 8),

        -- Ward 3
        (gen_random_uuid(), 3, 'NORMAL', 859),
        (gen_random_uuid(), 3, 'FLUSH_WITH_SEPTIC_TANK', 1149),
        (gen_random_uuid(), 3, 'PUBLIC_EILANI', 33),
        (gen_random_uuid(), 3, 'NO_TOILET', 11),
        (gen_random_uuid(), 3, 'OTHER', 9),

        -- Ward 4
        (gen_random_uuid(), 4, 'NORMAL', 821),
        (gen_random_uuid(), 4, 'FLUSH_WITH_SEPTIC_TANK', 847),
        (gen_random_uuid(), 4, 'PUBLIC_EILANI', 133),
        (gen_random_uuid(), 4, 'NO_TOILET', 8),
        (gen_random_uuid(), 4, 'OTHER', 23),

        -- Ward 5
        (gen_random_uuid(), 5, 'NORMAL', 1757),
        (gen_random_uuid(), 5, 'FLUSH_WITH_SEPTIC_TANK', 34),
        (gen_random_uuid(), 5, 'PUBLIC_EILANI', 1),
        (gen_random_uuid(), 5, 'NO_TOILET', 47),
        (gen_random_uuid(), 5, 'OTHER', 9),

        -- Ward 6
        (gen_random_uuid(), 6, 'NORMAL', 1913),
        (gen_random_uuid(), 6, 'FLUSH_WITH_SEPTIC_TANK', 24),
        (gen_random_uuid(), 6, 'PUBLIC_EILANI', 1),
        (gen_random_uuid(), 6, 'NO_TOILET', 12),
        (gen_random_uuid(), 6, 'OTHER', 21),

        -- Ward 7
        (gen_random_uuid(), 7, 'NORMAL', 1917),
        (gen_random_uuid(), 7, 'FLUSH_WITH_SEPTIC_TANK', 92),
        (gen_random_uuid(), 7, 'PUBLIC_EILANI', 74),
        (gen_random_uuid(), 7, 'NO_TOILET', 298),
        (gen_random_uuid(), 7, 'OTHER', 26),

        -- Ward 8
        (gen_random_uuid(), 8, 'NORMAL', 1595),
        (gen_random_uuid(), 8, 'FLUSH_WITH_SEPTIC_TANK', 18),
        (gen_random_uuid(), 8, 'PUBLIC_EILANI', 120),
        (gen_random_uuid(), 8, 'NO_TOILET', 73),
        (gen_random_uuid(), 8, 'OTHER', 84);
    END IF;
END
$$;
