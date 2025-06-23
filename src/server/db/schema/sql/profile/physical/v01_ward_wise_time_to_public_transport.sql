-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_public_transport) THEN
        INSERT INTO acme_ward_wise_time_to_public_transport (
            id, ward_number, time_to_public_transport, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'UNDER_15_MIN', 612),
        (gen_random_uuid(), 1, 'UNDER_30_MIN', 283),
        (gen_random_uuid(), 1, 'UNDER_1_HOUR', 7),
        (gen_random_uuid(), 1, '1_HOUR_OR_MORE', 8),

        -- Ward 2
        (gen_random_uuid(), 2, 'UNDER_15_MIN', 2139),
        (gen_random_uuid(), 2, 'UNDER_30_MIN', 335),
        (gen_random_uuid(), 2, 'UNDER_1_HOUR', 137),
        (gen_random_uuid(), 2, '1_HOUR_OR_MORE', 0),

        -- Ward 3
        (gen_random_uuid(), 3, 'UNDER_15_MIN', 1514),
        (gen_random_uuid(), 3, 'UNDER_30_MIN', 501),
        (gen_random_uuid(), 3, 'UNDER_1_HOUR', 43),
        (gen_random_uuid(), 3, '1_HOUR_OR_MORE', 3),

        -- Ward 4
        (gen_random_uuid(), 4, 'UNDER_15_MIN', 1305),
        (gen_random_uuid(), 4, 'UNDER_30_MIN', 490),
        (gen_random_uuid(), 4, 'UNDER_1_HOUR', 37),
        (gen_random_uuid(), 4, '1_HOUR_OR_MORE', 0),

        -- Ward 5
        (gen_random_uuid(), 5, 'UNDER_15_MIN', 1471),
        (gen_random_uuid(), 5, 'UNDER_30_MIN', 177),
        (gen_random_uuid(), 5, 'UNDER_1_HOUR', 159),
        (gen_random_uuid(), 5, '1_HOUR_OR_MORE', 41),

        -- Ward 6
        (gen_random_uuid(), 6, 'UNDER_15_MIN', 191),
        (gen_random_uuid(), 6, 'UNDER_30_MIN', 1349),
        (gen_random_uuid(), 6, 'UNDER_1_HOUR', 255),
        (gen_random_uuid(), 6, '1_HOUR_OR_MORE', 176),

        -- Ward 7
        (gen_random_uuid(), 7, 'UNDER_15_MIN', 1545),
        (gen_random_uuid(), 7, 'UNDER_30_MIN', 840),
        (gen_random_uuid(), 7, 'UNDER_1_HOUR', 21),
        (gen_random_uuid(), 7, '1_HOUR_OR_MORE', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'UNDER_15_MIN', 1198),
        (gen_random_uuid(), 8, 'UNDER_30_MIN', 634),
        (gen_random_uuid(), 8, 'UNDER_1_HOUR', 48),
        (gen_random_uuid(), 8, '1_HOUR_OR_MORE', 10);
    END IF;
END
$$;
