-- Check if acme_ward_wise_old_age_population_and_single_women table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_old_age_population_and_single_women'
    ) THEN
        CREATE TABLE acme_ward_wise_old_age_population_and_single_women (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            male_old_age_population INTEGER NOT NULL,
            female_old_age_population INTEGER NOT NULL,
            single_women_population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_old_age_population_and_single_women) THEN
--         INSERT INTO acme_ward_wise_old_age_population_and_single_women (
--             id, ward_number, male_old_age_population, female_old_age_population, single_women_population
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 75, 82, 45),
        
--         -- Ward 2
--         (gen_random_uuid(), 2, 68, 74, 38),
        
--         -- Ward 3
--         (gen_random_uuid(), 3, 85, 92, 52),
        
--         -- Ward 4
--         (gen_random_uuid(), 4, 72, 80, 48),
        
--         -- Ward 5
--         (gen_random_uuid(), 5, 78, 85, 42);
--     END IF;
-- END
-- $$;