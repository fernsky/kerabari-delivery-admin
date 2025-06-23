-- Check if ward_wise_demographic_summary table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_demographic_summary'
    ) THEN
        CREATE TABLE acme_ward_wise_demographic_summary (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            ward_name TEXT,
            total_population INTEGER,
            population_male INTEGER,
            population_female INTEGER,
            population_other INTEGER,
            total_households INTEGER,
            average_household_size DECIMAL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_demographic_summary) THEN
        INSERT INTO acme_ward_wise_demographic_summary (
            id, ward_number, ward_name, total_population, population_male, population_female, 
            population_other, total_households, average_household_size, sex_ratio
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'राजापुर (१-१)', 4112, ROUND(4112/(1+93.60/100)), ROUND(4112-(4112/(1+93.60/100))), 0, 910, 5, 93.60),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'सीतापुर (१-२)', 10544, ROUND(10544/(1+100/105.14)), ROUND(10544-(10544/(1+100/105.14))), 0, 2611, 4, 105.14),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'बागेश्वरी (१-३, ५)', 8481, ROUND(8481/(1+100/101.74)), ROUND(8481-(8481/(1+100/101.74))), 0, 2061, 4, 101.74),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६-७)', 7147, ROUND(7147/(1+100/99.44)), ROUND(7147-(7147/(1+100/99.44))), 0, 1832, 4, 99.44),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'उधपुर (१, ३-५, ७, ९)', 7522, ROUND(7522/(1+100/110.17)), ROUND(7522-(7522/(1+100/110.17))), 0, 1848, 4, 110.17),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'उधपुर (२, ६, ८)', 8281, ROUND(8281/(1+100/110.07)), ROUND(8281-(8281/(1+100/110.07))), 0, 1971, 4, 110.07),
        
        -- Ward 7
        (gen_random_uuid(), 7, 'सोनपुर (१-१)', 10586, ROUND(10586/(1+100/103.07)), ROUND(10586-(10586/(1+100/103.07))), 0, 2407, 4, 103.07),
        
        -- Ward 8
        (gen_random_uuid(), 8, 'रनियापुर (१-१)', 8235, ROUND(8235/(1+100/96.35)), ROUND(8235-(8235/(1+100/96.35))), 0, 1890, 4, 96.35);
    END IF;
END
$$;
