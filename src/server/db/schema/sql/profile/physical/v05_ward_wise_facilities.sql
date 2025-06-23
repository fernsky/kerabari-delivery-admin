-- Check if acme_ward_wise_facilities table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_facilities'
    ) THEN
        CREATE TABLE acme_ward_wise_facilities (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            facility facility_type NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_facilities) THEN
        INSERT INTO acme_ward_wise_facilities (id, ward_number, facility, households) VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'MOBILE_PHONE', 844),
        (gen_random_uuid(), 1, 'ELECTRICAL_FAN', 500),
        (gen_random_uuid(), 1, 'BICYCLE', 811),
        (gen_random_uuid(), 1, 'TELEVISION', 344),
        (gen_random_uuid(), 1, 'INTERNET', 418),
        (gen_random_uuid(), 1, 'REFRIGERATOR', 430),
        (gen_random_uuid(), 1, 'MOTORCYCLE', 373),
        (gen_random_uuid(), 1, 'RADIO', 41),
        (gen_random_uuid(), 1, 'COMPUTER', 29),
        (gen_random_uuid(), 1, 'NONE', 8),
        (gen_random_uuid(), 1, 'WASHING_MACHINE', 10),
        (gen_random_uuid(), 1, 'CAR_JEEP', 11),
        (gen_random_uuid(), 1, 'AIR_CONDITIONER', 6),
        (gen_random_uuid(), 1, 'MICROWAVE_OVEN', 1),

        -- Ward 2
        (gen_random_uuid(), 2, 'MOBILE_PHONE', 2369),
        (gen_random_uuid(), 2, 'ELECTRICAL_FAN', 2036),
        (gen_random_uuid(), 2, 'BICYCLE', 1860),
        (gen_random_uuid(), 2, 'TELEVISION', 1292),
        (gen_random_uuid(), 2, 'INTERNET', 928),
        (gen_random_uuid(), 2, 'REFRIGERATOR', 1108),
        (gen_random_uuid(), 2, 'MOTORCYCLE', 751),
        (gen_random_uuid(), 2, 'RADIO', 123),
        (gen_random_uuid(), 2, 'COMPUTER', 135),
        (gen_random_uuid(), 2, 'NONE', 23),
        (gen_random_uuid(), 2, 'WASHING_MACHINE', 19),
        (gen_random_uuid(), 2, 'CAR_JEEP', 13),
        (gen_random_uuid(), 2, 'AIR_CONDITIONER', 10),
        (gen_random_uuid(), 2, 'MICROWAVE_OVEN', 3),
        (gen_random_uuid(), 2, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 2),

        -- Ward 3
        (gen_random_uuid(), 3, 'MOBILE_PHONE', 1899),
        (gen_random_uuid(), 3, 'ELECTRICAL_FAN', 1767),
        (gen_random_uuid(), 3, 'BICYCLE', 1209),
        (gen_random_uuid(), 3, 'TELEVISION', 1097),
        (gen_random_uuid(), 3, 'INTERNET', 1285),
        (gen_random_uuid(), 3, 'REFRIGERATOR', 1018),
        (gen_random_uuid(), 3, 'MOTORCYCLE', 737),
        (gen_random_uuid(), 3, 'RADIO', 66),
        (gen_random_uuid(), 3, 'COMPUTER', 229),
        (gen_random_uuid(), 3, 'NONE', 35),
        (gen_random_uuid(), 3, 'WASHING_MACHINE', 74),
        (gen_random_uuid(), 3, 'CAR_JEEP', 34),
        (gen_random_uuid(), 3, 'AIR_CONDITIONER', 31),
        (gen_random_uuid(), 3, 'MICROWAVE_OVEN', 4),
        (gen_random_uuid(), 3, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 3),

        -- Ward 4
        (gen_random_uuid(), 4, 'MOBILE_PHONE', 1203),
        (gen_random_uuid(), 4, 'ELECTRICAL_FAN', 781),
        (gen_random_uuid(), 4, 'BICYCLE', 762),
        (gen_random_uuid(), 4, 'TELEVISION', 1210),
        (gen_random_uuid(), 4, 'INTERNET', 629),
        (gen_random_uuid(), 4, 'REFRIGERATOR', 439),
        (gen_random_uuid(), 4, 'MOTORCYCLE', 357),
        (gen_random_uuid(), 4, 'RADIO', 767),
        (gen_random_uuid(), 4, 'COMPUTER', 167),
        (gen_random_uuid(), 4, 'NONE', 19),
        (gen_random_uuid(), 4, 'WASHING_MACHINE', 6),
        (gen_random_uuid(), 4, 'CAR_JEEP', 17),
        (gen_random_uuid(), 4, 'AIR_CONDITIONER', 7),
        (gen_random_uuid(), 4, 'MICROWAVE_OVEN', 3),

        -- Ward 5
        (gen_random_uuid(), 5, 'MOBILE_PHONE', 1422),
        (gen_random_uuid(), 5, 'ELECTRICAL_FAN', 593),
        (gen_random_uuid(), 5, 'BICYCLE', 1189),
        (gen_random_uuid(), 5, 'TELEVISION', 26),
        (gen_random_uuid(), 5, 'INTERNET', 81),
        (gen_random_uuid(), 5, 'REFRIGERATOR', 68),
        (gen_random_uuid(), 5, 'MOTORCYCLE', 251),
        (gen_random_uuid(), 5, 'RADIO', 19),
        (gen_random_uuid(), 5, 'COMPUTER', 2),
        (gen_random_uuid(), 5, 'NONE', 137),
        (gen_random_uuid(), 5, 'WASHING_MACHINE', 10),
        (gen_random_uuid(), 5, 'CAR_JEEP', 1),
        (gen_random_uuid(), 5, 'AIR_CONDITIONER', 1),
        (gen_random_uuid(), 5, 'MICROWAVE_OVEN', 2),
        (gen_random_uuid(), 5, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 2),

        -- Ward 6
        (gen_random_uuid(), 6, 'MOBILE_PHONE', 1651),
        (gen_random_uuid(), 6, 'ELECTRICAL_FAN', 1784),
        (gen_random_uuid(), 6, 'BICYCLE', 1270),
        (gen_random_uuid(), 6, 'TELEVISION', 528),
        (gen_random_uuid(), 6, 'INTERNET', 440),
        (gen_random_uuid(), 6, 'REFRIGERATOR', 230),
        (gen_random_uuid(), 6, 'MOTORCYCLE', 243),
        (gen_random_uuid(), 6, 'RADIO', 310),
        (gen_random_uuid(), 6, 'COMPUTER', 26),
        (gen_random_uuid(), 6, 'NONE', 16),
        (gen_random_uuid(), 6, 'WASHING_MACHINE', 9),
        (gen_random_uuid(), 6, 'CAR_JEEP', 7),
        (gen_random_uuid(), 6, 'MICROWAVE_OVEN', 3),

        -- Ward 7
        (gen_random_uuid(), 7, 'MOBILE_PHONE', 1936),
        (gen_random_uuid(), 7, 'ELECTRICAL_FAN', 1370),
        (gen_random_uuid(), 7, 'BICYCLE', 1399),
        (gen_random_uuid(), 7, 'TELEVISION', 113),
        (gen_random_uuid(), 7, 'INTERNET', 459),
        (gen_random_uuid(), 7, 'REFRIGERATOR', 149),
        (gen_random_uuid(), 7, 'MOTORCYCLE', 292),
        (gen_random_uuid(), 7, 'RADIO', 217),
        (gen_random_uuid(), 7, 'COMPUTER', 44),
        (gen_random_uuid(), 7, 'NONE', 83),
        (gen_random_uuid(), 7, 'WASHING_MACHINE', 10),
        (gen_random_uuid(), 7, 'CAR_JEEP', 21),
        (gen_random_uuid(), 7, 'AIR_CONDITIONER', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'MOBILE_PHONE', 1038),
        (gen_random_uuid(), 8, 'ELECTRICAL_FAN', 876),
        (gen_random_uuid(), 8, 'BICYCLE', 811),
        (gen_random_uuid(), 8, 'TELEVISION', 254),
        (gen_random_uuid(), 8, 'INTERNET', 131),
        (gen_random_uuid(), 8, 'REFRIGERATOR', 96),
        (gen_random_uuid(), 8, 'MOTORCYCLE', 194),
        (gen_random_uuid(), 8, 'RADIO', 469),
        (gen_random_uuid(), 8, 'COMPUTER', 130),
        (gen_random_uuid(), 8, 'NONE', 71),
        (gen_random_uuid(), 8, 'WASHING_MACHINE', 17),
        (gen_random_uuid(), 8, 'CAR_JEEP', 30),
        (gen_random_uuid(), 8, 'AIR_CONDITIONER', 3),
        (gen_random_uuid(), 8, 'MICROWAVE_OVEN', 5),
        (gen_random_uuid(), 8, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 8);
    END IF;
END
$$;
