-- Check if ward_time_series_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_time_series_population'
    ) THEN
        CREATE TABLE acme_ward_time_series_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            ward_name TEXT,
            year INTEGER NOT NULL,
            total_population INTEGER,
            male_population INTEGER,
            female_population INTEGER,
            other_population INTEGER,
            total_households INTEGER,
            average_household_size DECIMAL,
            population_0_to_14 INTEGER,
            population_15_to_59 INTEGER,
            population_60_and_above INTEGER,
            literacy_rate DECIMAL,
            male_literacy_rate DECIMAL,
            female_literacy_rate DECIMAL,
            growth_rate DECIMAL,
            area_sq_km DECIMAL,
            population_density DECIMAL,
            sex_ratio DECIMAL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_time_series_population) THEN
        INSERT INTO acme_ward_time_series_population (
            id, ward_number, ward_name, year, total_population, total_households, average_household_size,
            growth_rate, area_sq_km, population_density, sex_ratio
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'राधापुर (१–९)', 2068, 3555, NULL, 5.0, NULL, 8.37, NULL, 93.60),
        (gen_random_uuid(), 1, 'राधापुर (१–९)', 2078, 3770, NULL, 5.0, 1.57, 8.37, NULL, 93.60),
        (gen_random_uuid(), 1, 'राधापुर (१–९)', 2081, 4112, 910, 5.0, 1.57, 8.37, 491.28, 93.60),

        -- Ward 2
        (gen_random_uuid(), 2, 'सीतापुर (१–९)', 2068, 8626, NULL, 4.0, NULL, 18.37, NULL, 105.14),
        (gen_random_uuid(), 2, 'सीतापुर (१–९)', 2078, 10124, NULL, 4.0, 2.22, 18.37, NULL, 105.14),
        (gen_random_uuid(), 2, 'सीतापुर (१–९)', 2081, 10544, 2611, 4.0, 2.22, 18.37, 573.98, 105.14),

        -- Ward 3
        (gen_random_uuid(), 3, 'बागेश्वरी (१–३, ५)', 2068, 6914, NULL, 4.0, NULL, 12.65, NULL, 101.74),
        (gen_random_uuid(), 3, 'बागेश्वरी (१–३, ५)', 2078, 8133, NULL, 4.0, 2.27, 12.65, NULL, 101.74),
        (gen_random_uuid(), 3, 'बागेश्वरी (१–३, ५)', 2081, 8481, 2061, 4.0, 2.27, 12.65, 670.43, 101.74),

        -- Ward 4
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६–९)', 2068, 5757, NULL, 4.0, NULL, 12.74, NULL, 99.44),
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६–९)', 2078, 7064, NULL, 4.0, 2.41, 12.74, NULL, 99.44),
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६–९)', 2081, 7147, 1832, 4.0, 2.41, 12.74, 560.99, 99.44),

        -- Ward 5
        (gen_random_uuid(), 5, 'उढरापुर (१, ३–५, ८, ९)', 2068, 6026, NULL, 4.0, NULL, 8.57, NULL, 110.17),
        (gen_random_uuid(), 5, 'उढरापुर (१, ३–५, ८, ९)', 2078, 7298, NULL, 4.0, 2.48, 8.57, NULL, 110.17),
        (gen_random_uuid(), 5, 'उढरापुर (१, ३–५, ८, ९)', 2081, 7522, 1848, 4.0, 2.48, 8.57, 877.71, 110.17),

        -- Ward 6
        (gen_random_uuid(), 6, 'उढरापुर (२, ६, ७)', 2068, 5485, NULL, 4.0, NULL, 10.68, NULL, 110.07),
        (gen_random_uuid(), 6, 'उढरापुर (२, ६, ७)', 2078, 7901, NULL, 4.0, 5.10, 10.68, NULL, 110.07),
        (gen_random_uuid(), 6, 'उढरापुर (२, ६, ७)', 2081, 8281, 1971, 4.0, 5.10, 10.68, 775.37, 110.07),

        -- Ward 7
        (gen_random_uuid(), 7, 'सोनपुर (१–९)', 2068, 8156, NULL, 4.0, NULL, 14.2, NULL, 103.07),
        (gen_random_uuid(), 7, 'सोनपुर (१–९)', 2078, 10436, NULL, 4.0, 2.98, 14.2, NULL, 103.07),
        (gen_random_uuid(), 7, 'सोनपुर (१–९)', 2081, 10586, 2407, 4.0, 2.98, 14.2, 745.49, 103.07),

        -- Ward 8
        (gen_random_uuid(), 8, 'रनियापुर (१–९)', 2068, 6442, NULL, 4.0, NULL, 16.33, NULL, 96.35),
        (gen_random_uuid(), 8, 'रनियापुर (१–९)', 2078, 8063, NULL, 4.0, 2.78, 16.33, NULL, 96.35),
        (gen_random_uuid(), 8, 'रनियापुर (१–९)', 2081, 8235, 1890, 4.0, 2.78, 16.33, 504.29, 96.35);
    END IF;
END
$$;
