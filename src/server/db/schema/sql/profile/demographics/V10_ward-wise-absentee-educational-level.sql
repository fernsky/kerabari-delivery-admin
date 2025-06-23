-- Check if acme_ward_wise_absentee_educational_level table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_absentee_educational_level'
    ) THEN
        CREATE TABLE acme_ward_wise_absentee_educational_level (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            educational_level VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_absentee_educational_level) THEN
        INSERT INTO acme_ward_wise_absentee_educational_level (
            id, ward_number, educational_level, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'CHILD_DEVELOPMENT_CENTER', 42),
        (gen_random_uuid(), 1, 'NURSERY', 55),
        (gen_random_uuid(), 1, 'CLASS_1', 61),
        (gen_random_uuid(), 1, 'CLASS_2', 58),
        (gen_random_uuid(), 1, 'CLASS_3', 63),
        (gen_random_uuid(), 1, 'CLASS_4', 59),
        (gen_random_uuid(), 1, 'CLASS_5', 68),
        (gen_random_uuid(), 1, 'CLASS_6', 71),
        (gen_random_uuid(), 1, 'CLASS_7', 64),
        (gen_random_uuid(), 1, 'CLASS_8', 79),
        (gen_random_uuid(), 1, 'CLASS_9', 86),
        (gen_random_uuid(), 1, 'CLASS_10', 92),
        (gen_random_uuid(), 1, 'SLC_LEVEL', 105),
        (gen_random_uuid(), 1, 'CLASS_12_LEVEL', 120),
        (gen_random_uuid(), 1, 'BACHELOR_LEVEL', 85),
        (gen_random_uuid(), 1, 'MASTERS_LEVEL', 42),
        (gen_random_uuid(), 1, 'PHD_LEVEL', 8),
        (gen_random_uuid(), 1, 'INFORMAL_EDUCATION', 35),
        (gen_random_uuid(), 1, 'OTHER', 12),
        (gen_random_uuid(), 1, 'EDUCATED', 28),
        (gen_random_uuid(), 1, 'UNKNOWN', 15),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'CHILD_DEVELOPMENT_CENTER', 38),
        (gen_random_uuid(), 2, 'NURSERY', 47),
        (gen_random_uuid(), 2, 'CLASS_1', 53),
        (gen_random_uuid(), 2, 'CLASS_2', 51),
        (gen_random_uuid(), 2, 'CLASS_3', 56),
        (gen_random_uuid(), 2, 'CLASS_4', 54),
        (gen_random_uuid(), 2, 'CLASS_5', 63),
        (gen_random_uuid(), 2, 'CLASS_6', 68),
        (gen_random_uuid(), 2, 'CLASS_7', 60),
        (gen_random_uuid(), 2, 'CLASS_8', 75),
        (gen_random_uuid(), 2, 'CLASS_9', 82),
        (gen_random_uuid(), 2, 'CLASS_10', 87),
        (gen_random_uuid(), 2, 'SLC_LEVEL', 98),
        (gen_random_uuid(), 2, 'CLASS_12_LEVEL', 115),
        (gen_random_uuid(), 2, 'BACHELOR_LEVEL', 78),
        (gen_random_uuid(), 2, 'MASTERS_LEVEL', 39),
        (gen_random_uuid(), 2, 'PHD_LEVEL', 7),
        (gen_random_uuid(), 2, 'INFORMAL_EDUCATION', 30),
        (gen_random_uuid(), 2, 'OTHER', 15),
        (gen_random_uuid(), 2, 'EDUCATED', 25),
        (gen_random_uuid(), 2, 'UNKNOWN', 18),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'CHILD_DEVELOPMENT_CENTER', 32),
        (gen_random_uuid(), 3, 'NURSERY', 43),
        (gen_random_uuid(), 3, 'CLASS_1', 48),
        (gen_random_uuid(), 3, 'CLASS_2', 45),
        (gen_random_uuid(), 3, 'CLASS_3', 50),
        (gen_random_uuid(), 3, 'CLASS_4', 47),
        (gen_random_uuid(), 3, 'CLASS_5', 55),
        (gen_random_uuid(), 3, 'CLASS_6', 60),
        (gen_random_uuid(), 3, 'CLASS_7', 53),
        (gen_random_uuid(), 3, 'CLASS_8', 68),
        (gen_random_uuid(), 3, 'CLASS_9', 76),
        (gen_random_uuid(), 3, 'CLASS_10', 80),
        (gen_random_uuid(), 3, 'SLC_LEVEL', 90),
        (gen_random_uuid(), 3, 'CLASS_12_LEVEL', 98),
        (gen_random_uuid(), 3, 'BACHELOR_LEVEL', 62),
        (gen_random_uuid(), 3, 'MASTERS_LEVEL', 31),
        (gen_random_uuid(), 3, 'PHD_LEVEL', 5),
        (gen_random_uuid(), 3, 'INFORMAL_EDUCATION', 28),
        (gen_random_uuid(), 3, 'OTHER', 14),
        (gen_random_uuid(), 3, 'EDUCATED', 21),
        (gen_random_uuid(), 3, 'UNKNOWN', 16),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'CHILD_DEVELOPMENT_CENTER', 35),
        (gen_random_uuid(), 4, 'NURSERY', 46),
        (gen_random_uuid(), 4, 'CLASS_1', 52),
        (gen_random_uuid(), 4, 'CLASS_2', 48),
        (gen_random_uuid(), 4, 'CLASS_3', 53),
        (gen_random_uuid(), 4, 'CLASS_4', 49),
        (gen_random_uuid(), 4, 'CLASS_5', 57),
        (gen_random_uuid(), 4, 'CLASS_6', 62),
        (gen_random_uuid(), 4, 'CLASS_7', 58),
        (gen_random_uuid(), 4, 'CLASS_8', 70),
        (gen_random_uuid(), 4, 'CLASS_9', 78),
        (gen_random_uuid(), 4, 'CLASS_10', 84),
        (gen_random_uuid(), 4, 'SLC_LEVEL', 95),
        (gen_random_uuid(), 4, 'CLASS_12_LEVEL', 102),
        (gen_random_uuid(), 4, 'BACHELOR_LEVEL', 68),
        (gen_random_uuid(), 4, 'MASTERS_LEVEL', 34),
        (gen_random_uuid(), 4, 'PHD_LEVEL', 6),
        (gen_random_uuid(), 4, 'INFORMAL_EDUCATION', 26),
        (gen_random_uuid(), 4, 'OTHER', 13),
        (gen_random_uuid(), 4, 'EDUCATED', 22),
        (gen_random_uuid(), 4, 'UNKNOWN', 17),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'CHILD_DEVELOPMENT_CENTER', 30),
        (gen_random_uuid(), 5, 'NURSERY', 40),
        (gen_random_uuid(), 5, 'CLASS_1', 44),
        (gen_random_uuid(), 5, 'CLASS_2', 42),
        (gen_random_uuid(), 5, 'CLASS_3', 47),
        (gen_random_uuid(), 5, 'CLASS_4', 45),
        (gen_random_uuid(), 5, 'CLASS_5', 52),
        (gen_random_uuid(), 5, 'CLASS_6', 56),
        (gen_random_uuid(), 5, 'CLASS_7', 50),
        (gen_random_uuid(), 5, 'CLASS_8', 65),
        (gen_random_uuid(), 5, 'CLASS_9', 72),
        (gen_random_uuid(), 5, 'CLASS_10', 78),
        (gen_random_uuid(), 5, 'SLC_LEVEL', 88),
        (gen_random_uuid(), 5, 'CLASS_12_LEVEL', 94),
        (gen_random_uuid(), 5, 'BACHELOR_LEVEL', 58),
        (gen_random_uuid(), 5, 'MASTERS_LEVEL', 28),
        (gen_random_uuid(), 5, 'PHD_LEVEL', 4),
        (gen_random_uuid(), 5, 'INFORMAL_EDUCATION', 24),
        (gen_random_uuid(), 5, 'OTHER', 11),
        (gen_random_uuid(), 5, 'EDUCATED', 19),
        (gen_random_uuid(), 5, 'UNKNOWN', 15);
    END IF;
END
$$;