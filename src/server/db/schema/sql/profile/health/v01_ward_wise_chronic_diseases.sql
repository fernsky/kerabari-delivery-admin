-- Check if acme_ward_wise_chronic_diseases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_chronic_diseases'
    ) THEN
        CREATE TABLE acme_ward_wise_chronic_diseases (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            chronic_disease VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_chronic_diseases) THEN
--         INSERT INTO acme_ward_wise_chronic_diseases (
--             id, ward_number, chronic_disease, population
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'HEART_RELATED_DISEASE', 58),
--         (gen_random_uuid(), 1, 'RESPIRATION_RELATED', 42),
--         (gen_random_uuid(), 1, 'ASTHMA', 35),
--         (gen_random_uuid(), 1, 'DIABETES', 64),
--         (gen_random_uuid(), 1, 'BLOOD_PRESSURE_HIGH_LOW', 92),
--         (gen_random_uuid(), 1, 'ARTHRITIS_JOINT_PAIN', 73),
--         (gen_random_uuid(), 1, 'GASTRIC_ULCER_INTESTINE_DISEASE', 67),
--         (gen_random_uuid(), 1, 'OTHER', 48),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'HEART_RELATED_DISEASE', 62),
--         (gen_random_uuid(), 2, 'RESPIRATION_RELATED', 39),
--         (gen_random_uuid(), 2, 'ASTHMA', 31),
--         (gen_random_uuid(), 2, 'DIABETES', 70),
--         (gen_random_uuid(), 2, 'BLOOD_PRESSURE_HIGH_LOW', 85),
--         (gen_random_uuid(), 2, 'ARTHRITIS_JOINT_PAIN', 79),
--         (gen_random_uuid(), 2, 'GASTRIC_ULCER_INTESTINE_DISEASE', 71),
--         (gen_random_uuid(), 2, 'OTHER', 42),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'HEART_RELATED_DISEASE', 55),
--         (gen_random_uuid(), 3, 'RESPIRATION_RELATED', 49),
--         (gen_random_uuid(), 3, 'ASTHMA', 44),
--         (gen_random_uuid(), 3, 'DIABETES', 58),
--         (gen_random_uuid(), 3, 'BLOOD_PRESSURE_HIGH_LOW', 78),
--         (gen_random_uuid(), 3, 'ARTHRITIS_JOINT_PAIN', 85),
--         (gen_random_uuid(), 3, 'GASTRIC_ULCER_INTESTINE_DISEASE', 63),
--         (gen_random_uuid(), 3, 'OTHER', 51),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'HEART_RELATED_DISEASE', 60),
--         (gen_random_uuid(), 4, 'RESPIRATION_RELATED', 45),
--         (gen_random_uuid(), 4, 'ASTHMA', 38),
--         (gen_random_uuid(), 4, 'DIABETES', 67),
--         (gen_random_uuid(), 4, 'BLOOD_PRESSURE_HIGH_LOW', 89),
--         (gen_random_uuid(), 4, 'ARTHRITIS_JOINT_PAIN', 76),
--         (gen_random_uuid(), 4, 'GASTRIC_ULCER_INTESTINE_DISEASE', 69),
--         (gen_random_uuid(), 4, 'OTHER', 44),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'HEART_RELATED_DISEASE', 53),
--         (gen_random_uuid(), 5, 'RESPIRATION_RELATED', 47),
--         (gen_random_uuid(), 5, 'ASTHMA', 40),
--         (gen_random_uuid(), 5, 'DIABETES', 61),
--         (gen_random_uuid(), 5, 'BLOOD_PRESSURE_HIGH_LOW', 82),
--         (gen_random_uuid(), 5, 'ARTHRITIS_JOINT_PAIN', 81),
--         (gen_random_uuid(), 5, 'GASTRIC_ULCER_INTESTINE_DISEASE', 65),
--         (gen_random_uuid(), 5, 'OTHER', 47);
--     END IF;
-- END
-- $$;