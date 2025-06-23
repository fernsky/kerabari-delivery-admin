-- Check if demographic_summary table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'demographic_summary') THEN
        CREATE TABLE acme_demographic_summary (
            id VARCHAR(36) PRIMARY KEY DEFAULT 'singleton',
            total_population INTEGER,
            population_male INTEGER,
            population_female INTEGER,
            population_other INTEGER,
            population_absentee_total INTEGER,
            population_male_absentee INTEGER,
            population_female_absentee INTEGER,
            population_other_absentee INTEGER,
            sex_ratio DECIMAL,
            total_households INTEGER,
            average_household_size DECIMAL,
            population_density DECIMAL,
            population_0_to_14 INTEGER,
            population_15_to_59 INTEGER,
            population_60_and_above INTEGER,
            growth_rate DECIMAL,
            literacy_rate_above_15 DECIMAL,
            literacy_rate_15_to_24 DECIMAL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Check if data already exists before inserting
DO $$
BEGIN
    -- Only insert if the singleton record doesn't exist
    IF NOT EXISTS (SELECT 1 FROM acme_demographic_summary WHERE id = 'singleton') THEN
        INSERT INTO acme_demographic_summary (
            id,
            total_population,
            population_male,
            population_female,
            population_other,
            population_male_absentee,
            population_female_absentee,
            population_absentee_total,
            sex_ratio,
            total_households,
            average_household_size,
            population_density,
            population_0_to_14,
            population_15_to_59,
            population_60_and_above,
            growth_rate,
            literacy_rate_above_15
        ) VALUES (
            'singleton',
            64908,                 -- अक्सर बसोबास गर्ने जम्मा जनसंख्या
            27877,                 -- अक्सर बसोबास गर्ने पुरुष
            30978,                 -- अक्सर बसोबास गर्ने महिला
            3,                     -- अक्सर बसोबास गर्ने अन्य जनसंख्या
            5050,                  -- अनुपस्थित पुरुष
            1000,                  -- अनुपस्थित महिला
            6050,                  -- अनुपस्थित जम्मा जनसंख्या
            89.98,                 -- लैंगिक दर (पुरुष प्रति १०० महिला)
            15530,                 -- जम्मा घरधुरी (cleaned from टद्ध,ढण्ड - used estimated value)
            4,                     -- औषत परिवार आकार
            636.91,                -- जनघनत्व (प्रतिवर्ग कि.मी.)
            16467,                 -- ०–१४ वर्ष उमेरसमूहका जनसंख्या (cleaned from 16,467)
            42697,                 -- १५–५९ वर्ष उमेरसमूहका जनसंख्या (cleaned from 42,697)
            5744,                  -- ६० वर्षभन्दा बढी उमेरसमूहका जनसंख्या (cleaned from 5, 744)
            2.74,                  -- वार्षिक जनसंख्या वृद्धिदर (प्रतिशत)
            68.32                  -- साक्षरता दर (५ वर्ष र सोभन्दा बढी उमेरसमूह) (cleaned from ६८.३२ प्रतिशत)
        );

        RAISE NOTICE 'Demographic summary data inserted successfully';
    ELSE
        RAISE NOTICE 'Demographic summary data already exists, skipping insertion';
    END IF;
END
$$;
