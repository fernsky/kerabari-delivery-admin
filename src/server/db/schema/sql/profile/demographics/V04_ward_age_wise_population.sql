-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Create age_group enum type if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_group') THEN
        CREATE TYPE age_group AS ENUM (
            'AGE_0_4',
            'AGE_5_9',
            'AGE_10_14',
            'AGE_15_19',
            'AGE_20_24',
            'AGE_25_29',
            'AGE_30_34',
            'AGE_35_39',
            'AGE_40_44',
            'AGE_45_49',
            'AGE_50_54',
            'AGE_55_59',
            'AGE_60_64',
            'AGE_65_69',
            'AGE_70_74',
            'AGE_75_AND_ABOVE'
        );
    END IF;
END
$$;

-- Use gender enum type from V03_ward_wise_househead_gender.sql

-- Create ward_age_wise_population table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_wise_population') THEN
        CREATE TABLE acme_ward_age_wise_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group age_group NOT NULL,
            gender gender NOT NULL,
            population INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes for faster lookups
        CREATE INDEX idx_ward_age_gender ON acme_ward_age_wise_population(ward_number, age_group, gender);
    END IF;
END
$$;

-- Insert ward-wise age population data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_wise_population WHERE ward_number = 1 LIMIT 1) THEN
        -- Ward 1 data
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            -- Ward 1 Male data
            (gen_random_uuid(), 1, 'AGE_0_4', 'MALE', 128),
            (gen_random_uuid(), 1, 'AGE_5_9', 'MALE', 187),
            (gen_random_uuid(), 1, 'AGE_10_14', 'MALE', 183),
            (gen_random_uuid(), 1, 'AGE_15_19', 'MALE', 161),
            (gen_random_uuid(), 1, 'AGE_20_24', 'MALE', 161),
            (gen_random_uuid(), 1, 'AGE_25_29', 'MALE', 159),
            (gen_random_uuid(), 1, 'AGE_30_34', 'MALE', 162),
            (gen_random_uuid(), 1, 'AGE_35_39', 'MALE', 164),
            (gen_random_uuid(), 1, 'AGE_40_44', 'MALE', 164),
            (gen_random_uuid(), 1, 'AGE_45_49', 'MALE', 99),
            (gen_random_uuid(), 1, 'AGE_50_54', 'MALE', 113),
            (gen_random_uuid(), 1, 'AGE_55_59', 'MALE', 92),
            (gen_random_uuid(), 1, 'AGE_60_64', 'MALE', 71),
            (gen_random_uuid(), 1, 'AGE_65_69', 'MALE', 53),
            (gen_random_uuid(), 1, 'AGE_70_74', 'MALE', 44),
            (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'MALE', 47),

            -- Ward 1 Female data
            (gen_random_uuid(), 1, 'AGE_0_4', 'FEMALE', 124),
            (gen_random_uuid(), 1, 'AGE_5_9', 'FEMALE', 146),
            (gen_random_uuid(), 1, 'AGE_10_14', 'FEMALE', 149),
            (gen_random_uuid(), 1, 'AGE_15_19', 'FEMALE', 167),
            (gen_random_uuid(), 1, 'AGE_20_24', 'FEMALE', 217),
            (gen_random_uuid(), 1, 'AGE_25_29', 'FEMALE', 226),
            (gen_random_uuid(), 1, 'AGE_30_34', 'FEMALE', 194),
            (gen_random_uuid(), 1, 'AGE_35_39', 'FEMALE', 171),
            (gen_random_uuid(), 1, 'AGE_40_44', 'FEMALE', 148),
            (gen_random_uuid(), 1, 'AGE_45_49', 'FEMALE', 124),
            (gen_random_uuid(), 1, 'AGE_50_54', 'FEMALE', 110),
            (gen_random_uuid(), 1, 'AGE_55_59', 'FEMALE', 97),
            (gen_random_uuid(), 1, 'AGE_60_64', 'FEMALE', 76),
            (gen_random_uuid(), 1, 'AGE_65_69', 'FEMALE', 64),
            (gen_random_uuid(), 1, 'AGE_70_74', 'FEMALE', 52),
            (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'FEMALE', 59),

            -- Ward 2 Male data
            (gen_random_uuid(), 2, 'AGE_0_4', 'MALE', 355),
            (gen_random_uuid(), 2, 'AGE_5_9', 'MALE', 470),
            (gen_random_uuid(), 2, 'AGE_10_14', 'MALE', 475),
            (gen_random_uuid(), 2, 'AGE_15_19', 'MALE', 441),
            (gen_random_uuid(), 2, 'AGE_20_24', 'MALE', 455),
            (gen_random_uuid(), 2, 'AGE_25_29', 'MALE', 486),
            (gen_random_uuid(), 2, 'AGE_30_34', 'MALE', 463),
            (gen_random_uuid(), 2, 'AGE_35_39', 'MALE', 473),
            (gen_random_uuid(), 2, 'AGE_40_44', 'MALE', 421),
            (gen_random_uuid(), 2, 'AGE_45_49', 'MALE', 331),
            (gen_random_uuid(), 2, 'AGE_50_54', 'MALE', 256),
            (gen_random_uuid(), 2, 'AGE_55_59', 'MALE', 215),
            (gen_random_uuid(), 2, 'AGE_60_64', 'MALE', 188),
            (gen_random_uuid(), 2, 'AGE_65_69', 'MALE', 133),
            (gen_random_uuid(), 2, 'AGE_70_74', 'MALE', 101),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'MALE', 140),

            -- Ward 2 Female data
            (gen_random_uuid(), 2, 'AGE_0_4', 'FEMALE', 248),
            (gen_random_uuid(), 2, 'AGE_5_9', 'FEMALE', 397),
            (gen_random_uuid(), 2, 'AGE_10_14', 'FEMALE', 404),
            (gen_random_uuid(), 2, 'AGE_15_19', 'FEMALE', 470),
            (gen_random_uuid(), 2, 'AGE_20_24', 'FEMALE', 520),
            (gen_random_uuid(), 2, 'AGE_25_29', 'FEMALE', 519),
            (gen_random_uuid(), 2, 'AGE_30_34', 'FEMALE', 493),
            (gen_random_uuid(), 2, 'AGE_35_39', 'FEMALE', 428),
            (gen_random_uuid(), 2, 'AGE_40_44', 'FEMALE', 384),
            (gen_random_uuid(), 2, 'AGE_45_49', 'FEMALE', 314),
            (gen_random_uuid(), 2, 'AGE_50_54', 'FEMALE', 216),
            (gen_random_uuid(), 2, 'AGE_55_59', 'FEMALE', 228),
            (gen_random_uuid(), 2, 'AGE_60_64', 'FEMALE', 178),
            (gen_random_uuid(), 2, 'AGE_65_69', 'FEMALE', 120),
            (gen_random_uuid(), 2, 'AGE_70_74', 'FEMALE', 122),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'FEMALE', 98),
            
            -- Ward 2 Other data
            (gen_random_uuid(), 2, 'AGE_0_4', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_5_9', 'OTHER', 1),
            (gen_random_uuid(), 2, 'AGE_10_14', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_15_19', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_20_24', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_25_29', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_30_34', 'OTHER', 1),
            (gen_random_uuid(), 2, 'AGE_35_39', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_40_44', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_45_49', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_50_54', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_55_59', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_60_64', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_65_69', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_70_74', 'OTHER', 0),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'OTHER', 0),
            
            -- Ward 3 Male data
            (gen_random_uuid(), 3, 'AGE_0_4', 'MALE', 220),
            (gen_random_uuid(), 3, 'AGE_5_9', 'MALE', 378),
            (gen_random_uuid(), 3, 'AGE_10_14', 'MALE', 375),
            (gen_random_uuid(), 3, 'AGE_15_19', 'MALE', 341),
            (gen_random_uuid(), 3, 'AGE_20_24', 'MALE', 345),
            (gen_random_uuid(), 3, 'AGE_25_29', 'MALE', 414),
            (gen_random_uuid(), 3, 'AGE_30_34', 'MALE', 410),
            (gen_random_uuid(), 3, 'AGE_35_39', 'MALE', 352),
            (gen_random_uuid(), 3, 'AGE_40_44', 'MALE', 346),
            (gen_random_uuid(), 3, 'AGE_45_49', 'MALE', 277),
            (gen_random_uuid(), 3, 'AGE_50_54', 'MALE', 199),
            (gen_random_uuid(), 3, 'AGE_55_59', 'MALE', 179),
            (gen_random_uuid(), 3, 'AGE_60_64', 'MALE', 127),
            (gen_random_uuid(), 3, 'AGE_65_69', 'MALE', 94),
            (gen_random_uuid(), 3, 'AGE_70_74', 'MALE', 104),
            (gen_random_uuid(), 3, 'AGE_75_AND_ABOVE', 'MALE', 116),
            
            -- Ward 3 Female data
            (gen_random_uuid(), 3, 'AGE_0_4', 'FEMALE', 208),
            (gen_random_uuid(), 3, 'AGE_5_9', 'FEMALE', 312),
            (gen_random_uuid(), 3, 'AGE_10_14', 'FEMALE', 305),
            (gen_random_uuid(), 3, 'AGE_15_19', 'FEMALE', 346),
            (gen_random_uuid(), 3, 'AGE_20_24', 'FEMALE', 426),
            (gen_random_uuid(), 3, 'AGE_25_29', 'FEMALE', 463),
            (gen_random_uuid(), 3, 'AGE_30_34', 'FEMALE', 418),
            (gen_random_uuid(), 3, 'AGE_35_39', 'FEMALE', 324),
            (gen_random_uuid(), 3, 'AGE_40_44', 'FEMALE', 311),
            (gen_random_uuid(), 3, 'AGE_45_49', 'FEMALE', 235),
            (gen_random_uuid(), 3, 'AGE_50_54', 'FEMALE', 212),
            (gen_random_uuid(), 3, 'AGE_55_59', 'FEMALE', 178),
            (gen_random_uuid(), 3, 'AGE_60_64', 'FEMALE', 151),
            (gen_random_uuid(), 3, 'AGE_65_69', 'FEMALE', 112),
            (gen_random_uuid(), 3, 'AGE_70_74', 'FEMALE', 112),
            (gen_random_uuid(), 3, 'AGE_75_AND_ABOVE', 'FEMALE', 91);
            
        -- Continue with more wards
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            -- Ward 4 Male data
            (gen_random_uuid(), 4, 'AGE_0_4', 'MALE', 212),
            (gen_random_uuid(), 4, 'AGE_5_9', 'MALE', 292),
            (gen_random_uuid(), 4, 'AGE_10_14', 'MALE', 267),
            (gen_random_uuid(), 4, 'AGE_15_19', 'MALE', 289),
            (gen_random_uuid(), 4, 'AGE_20_24', 'MALE', 303),
            (gen_random_uuid(), 4, 'AGE_25_29', 'MALE', 331),
            (gen_random_uuid(), 4, 'AGE_30_34', 'MALE', 286),
            (gen_random_uuid(), 4, 'AGE_35_39', 'MALE', 406),
            (gen_random_uuid(), 4, 'AGE_40_44', 'MALE', 298),
            (gen_random_uuid(), 4, 'AGE_45_49', 'MALE', 243),
            (gen_random_uuid(), 4, 'AGE_50_54', 'MALE', 214),
            (gen_random_uuid(), 4, 'AGE_55_59', 'MALE', 139),
            (gen_random_uuid(), 4, 'AGE_60_64', 'MALE', 99),
            (gen_random_uuid(), 4, 'AGE_65_69', 'MALE', 72),
            (gen_random_uuid(), 4, 'AGE_70_74', 'MALE', 45),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'MALE', 67),
            
            -- Ward 4 Female data
            (gen_random_uuid(), 4, 'AGE_0_4', 'FEMALE', 161),
            (gen_random_uuid(), 4, 'AGE_5_9', 'FEMALE', 249),
            (gen_random_uuid(), 4, 'AGE_10_14', 'FEMALE', 290),
            (gen_random_uuid(), 4, 'AGE_15_19', 'FEMALE', 264),
            (gen_random_uuid(), 4, 'AGE_20_24', 'FEMALE', 351),
            (gen_random_uuid(), 4, 'AGE_25_29', 'FEMALE', 402),
            (gen_random_uuid(), 4, 'AGE_30_34', 'FEMALE', 306),
            (gen_random_uuid(), 4, 'AGE_35_39', 'FEMALE', 421),
            (gen_random_uuid(), 4, 'AGE_40_44', 'FEMALE', 250),
            (gen_random_uuid(), 4, 'AGE_45_49', 'FEMALE', 226),
            (gen_random_uuid(), 4, 'AGE_50_54', 'FEMALE', 183),
            (gen_random_uuid(), 4, 'AGE_55_59', 'FEMALE', 134),
            (gen_random_uuid(), 4, 'AGE_60_64', 'FEMALE', 101),
            (gen_random_uuid(), 4, 'AGE_65_69', 'FEMALE', 82),
            (gen_random_uuid(), 4, 'AGE_70_74', 'FEMALE', 74),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'FEMALE', 89),
            
            -- Ward 4 Other data
            (gen_random_uuid(), 4, 'AGE_0_4', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_5_9', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_10_14', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_15_19', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_20_24', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_25_29', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_30_34', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_35_39', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_40_44', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_45_49', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_50_54', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_55_59', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_60_64', 'OTHER', 1),
            (gen_random_uuid(), 4, 'AGE_65_69', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_70_74', 'OTHER', 0),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'OTHER', 0),
            
            -- Ward 5 Male data
            (gen_random_uuid(), 5, 'AGE_0_4', 'MALE', 388),
            (gen_random_uuid(), 5, 'AGE_5_9', 'MALE', 483),
            (gen_random_uuid(), 5, 'AGE_10_14', 'MALE', 420),
            (gen_random_uuid(), 5, 'AGE_15_19', 'MALE', 361),
            (gen_random_uuid(), 5, 'AGE_20_24', 'MALE', 373),
            (gen_random_uuid(), 5, 'AGE_25_29', 'MALE', 359),
            (gen_random_uuid(), 5, 'AGE_30_34', 'MALE', 302),
            (gen_random_uuid(), 5, 'AGE_35_39', 'MALE', 308),
            (gen_random_uuid(), 5, 'AGE_40_44', 'MALE', 251),
            (gen_random_uuid(), 5, 'AGE_45_49', 'MALE', 198),
            (gen_random_uuid(), 5, 'AGE_50_54', 'MALE', 149),
            (gen_random_uuid(), 5, 'AGE_55_59', 'MALE', 104),
            (gen_random_uuid(), 5, 'AGE_60_64', 'MALE', 81),
            (gen_random_uuid(), 5, 'AGE_65_69', 'MALE', 59),
            (gen_random_uuid(), 5, 'AGE_70_74', 'MALE', 59),
            (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'MALE', 48),
            
            -- Ward 5 Female data
            (gen_random_uuid(), 5, 'AGE_0_4', 'FEMALE', 334),
            (gen_random_uuid(), 5, 'AGE_5_9', 'FEMALE', 414),
            (gen_random_uuid(), 5, 'AGE_10_14', 'FEMALE', 356),
            (gen_random_uuid(), 5, 'AGE_15_19', 'FEMALE', 344),
            (gen_random_uuid(), 5, 'AGE_20_24', 'FEMALE', 352),
            (gen_random_uuid(), 5, 'AGE_25_29', 'FEMALE', 381),
            (gen_random_uuid(), 5, 'AGE_30_34', 'FEMALE', 289),
            (gen_random_uuid(), 5, 'AGE_35_39', 'FEMALE', 298),
            (gen_random_uuid(), 5, 'AGE_40_44', 'FEMALE', 206),
            (gen_random_uuid(), 5, 'AGE_45_49', 'FEMALE', 160),
            (gen_random_uuid(), 5, 'AGE_50_54', 'FEMALE', 129),
            (gen_random_uuid(), 5, 'AGE_55_59', 'FEMALE', 82),
            (gen_random_uuid(), 5, 'AGE_60_64', 'FEMALE', 67),
            (gen_random_uuid(), 5, 'AGE_65_69', 'FEMALE', 43),
            (gen_random_uuid(), 5, 'AGE_70_74', 'FEMALE', 68),
            (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'FEMALE', 56);
            
        -- Insert remaining ward data
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            -- Ward 6 Male data
            (gen_random_uuid(), 6, 'AGE_0_4', 'MALE', 383),
            (gen_random_uuid(), 6, 'AGE_5_9', 'MALE', 507),
            (gen_random_uuid(), 6, 'AGE_10_14', 'MALE', 505),
            (gen_random_uuid(), 6, 'AGE_15_19', 'MALE', 437),
            (gen_random_uuid(), 6, 'AGE_20_24', 'MALE', 429),
            (gen_random_uuid(), 6, 'AGE_25_29', 'MALE', 441),
            (gen_random_uuid(), 6, 'AGE_30_34', 'MALE', 337),
            (gen_random_uuid(), 6, 'AGE_35_39', 'MALE', 300),
            (gen_random_uuid(), 6, 'AGE_40_44', 'MALE', 231),
            (gen_random_uuid(), 6, 'AGE_45_49', 'MALE', 185),
            (gen_random_uuid(), 6, 'AGE_50_54', 'MALE', 142),
            (gen_random_uuid(), 6, 'AGE_55_59', 'MALE', 143),
            (gen_random_uuid(), 6, 'AGE_60_64', 'MALE', 96),
            (gen_random_uuid(), 6, 'AGE_65_69', 'MALE', 75),
            (gen_random_uuid(), 6, 'AGE_70_74', 'MALE', 49),
            (gen_random_uuid(), 6, 'AGE_75_AND_ABOVE', 'MALE', 79),
            
            -- Ward 6 Female data
            (gen_random_uuid(), 6, 'AGE_0_4', 'FEMALE', 324),
            (gen_random_uuid(), 6, 'AGE_5_9', 'FEMALE', 446),
            (gen_random_uuid(), 6, 'AGE_10_14', 'FEMALE', 439),
            (gen_random_uuid(), 6, 'AGE_15_19', 'FEMALE', 402),
            (gen_random_uuid(), 6, 'AGE_20_24', 'FEMALE', 393),
            (gen_random_uuid(), 6, 'AGE_25_29', 'FEMALE', 422),
            (gen_random_uuid(), 6, 'AGE_30_34', 'FEMALE', 335),
            (gen_random_uuid(), 6, 'AGE_35_39', 'FEMALE', 254),
            (gen_random_uuid(), 6, 'AGE_40_44', 'FEMALE', 209),
            (gen_random_uuid(), 6, 'AGE_45_49', 'FEMALE', 167),
            (gen_random_uuid(), 6, 'AGE_50_54', 'FEMALE', 142),
            (gen_random_uuid(), 6, 'AGE_55_59', 'FEMALE', 135),
            (gen_random_uuid(), 6, 'AGE_60_64', 'FEMALE', 85),
            (gen_random_uuid(), 6, 'AGE_65_69', 'FEMALE', 70),
            (gen_random_uuid(), 6, 'AGE_70_74', 'FEMALE', 69),
            (gen_random_uuid(), 6, 'AGE_75_AND_ABOVE', 'FEMALE', 50),
            
            -- Ward 7 Male data
            (gen_random_uuid(), 7, 'AGE_0_4', 'MALE', 419),
            (gen_random_uuid(), 7, 'AGE_5_9', 'MALE', 604),
            (gen_random_uuid(), 7, 'AGE_10_14', 'MALE', 514),
            (gen_random_uuid(), 7, 'AGE_15_19', 'MALE', 521),
            (gen_random_uuid(), 7, 'AGE_20_24', 'MALE', 518),
            (gen_random_uuid(), 7, 'AGE_25_29', 'MALE', 532),
            (gen_random_uuid(), 7, 'AGE_30_34', 'MALE', 428),
            (gen_random_uuid(), 7, 'AGE_35_39', 'MALE', 424),
            (gen_random_uuid(), 7, 'AGE_40_44', 'MALE', 369),
            (gen_random_uuid(), 7, 'AGE_45_49', 'MALE', 248),
            (gen_random_uuid(), 7, 'AGE_50_54', 'MALE', 191),
            (gen_random_uuid(), 7, 'AGE_55_59', 'MALE', 160),
            (gen_random_uuid(), 7, 'AGE_60_64', 'MALE', 133),
            (gen_random_uuid(), 7, 'AGE_65_69', 'MALE', 94),
            (gen_random_uuid(), 7, 'AGE_70_74', 'MALE', 92),
            (gen_random_uuid(), 7, 'AGE_75_AND_ABOVE', 'MALE', 126),
            
            -- Ward 7 Female data
            (gen_random_uuid(), 7, 'AGE_0_4', 'FEMALE', 404),
            (gen_random_uuid(), 7, 'AGE_5_9', 'FEMALE', 496),
            (gen_random_uuid(), 7, 'AGE_10_14', 'FEMALE', 468),
            (gen_random_uuid(), 7, 'AGE_15_19', 'FEMALE', 468),
            (gen_random_uuid(), 7, 'AGE_20_24', 'FEMALE', 541),
            (gen_random_uuid(), 7, 'AGE_25_29', 'FEMALE', 556),
            (gen_random_uuid(), 7, 'AGE_30_34', 'FEMALE', 457),
            (gen_random_uuid(), 7, 'AGE_35_39', 'FEMALE', 427),
            (gen_random_uuid(), 7, 'AGE_40_44', 'FEMALE', 336),
            (gen_random_uuid(), 7, 'AGE_45_49', 'FEMALE', 217),
            (gen_random_uuid(), 7, 'AGE_50_54', 'FEMALE', 200),
            (gen_random_uuid(), 7, 'AGE_55_59', 'FEMALE', 165),
            (gen_random_uuid(), 7, 'AGE_60_64', 'FEMALE', 121),
            (gen_random_uuid(), 7, 'AGE_65_69', 'FEMALE', 119),
            (gen_random_uuid(), 7, 'AGE_70_74', 'FEMALE', 96),
            (gen_random_uuid(), 7, 'AGE_75_AND_ABOVE', 'FEMALE', 142),
            
            -- Ward 8 Male data
            (gen_random_uuid(), 8, 'AGE_0_4', 'MALE', 332),
            (gen_random_uuid(), 8, 'AGE_5_9', 'MALE', 335),
            (gen_random_uuid(), 8, 'AGE_10_14', 'MALE', 361),
            (gen_random_uuid(), 8, 'AGE_15_19', 'MALE', 386),
            (gen_random_uuid(), 8, 'AGE_20_24', 'MALE', 465),
            (gen_random_uuid(), 8, 'AGE_25_29', 'MALE', 443),
            (gen_random_uuid(), 8, 'AGE_30_34', 'MALE', 306),
            (gen_random_uuid(), 8, 'AGE_35_39', 'MALE', 358),
            (gen_random_uuid(), 8, 'AGE_40_44', 'MALE', 258),
            (gen_random_uuid(), 8, 'AGE_45_49', 'MALE', 220),
            (gen_random_uuid(), 8, 'AGE_50_54', 'MALE', 140),
            (gen_random_uuid(), 8, 'AGE_55_59', 'MALE', 121),
            (gen_random_uuid(), 8, 'AGE_60_64', 'MALE', 72),
            (gen_random_uuid(), 8, 'AGE_65_69', 'MALE', 80),
            (gen_random_uuid(), 8, 'AGE_70_74', 'MALE', 93),
            (gen_random_uuid(), 8, 'AGE_75_AND_ABOVE', 'MALE', 71),
            
            -- Ward 8 Female data
            (gen_random_uuid(), 8, 'AGE_0_4', 'FEMALE', 374),
            (gen_random_uuid(), 8, 'AGE_5_9', 'FEMALE', 318),
            (gen_random_uuid(), 8, 'AGE_10_14', 'FEMALE', 307),
            (gen_random_uuid(), 8, 'AGE_15_19', 'FEMALE', 355),
            (gen_random_uuid(), 8, 'AGE_20_24', 'FEMALE', 533),
            (gen_random_uuid(), 8, 'AGE_25_29', 'FEMALE', 446),
            (gen_random_uuid(), 8, 'AGE_30_34', 'FEMALE', 373),
            (gen_random_uuid(), 8, 'AGE_35_39', 'FEMALE', 340),
            (gen_random_uuid(), 8, 'AGE_40_44', 'FEMALE', 276),
            (gen_random_uuid(), 8, 'AGE_45_49', 'FEMALE', 199),
            (gen_random_uuid(), 8, 'AGE_50_54', 'FEMALE', 161),
            (gen_random_uuid(), 8, 'AGE_55_59', 'FEMALE', 144),
            (gen_random_uuid(), 8, 'AGE_60_64', 'FEMALE', 94),
            (gen_random_uuid(), 8, 'AGE_65_69', 'FEMALE', 81),
            (gen_random_uuid(), 8, 'AGE_70_74', 'FEMALE', 84),
            (gen_random_uuid(), 8, 'AGE_75_AND_ABOVE', 'FEMALE', 109);
        
        RAISE NOTICE 'Ward age-wise population data inserted successfully';
    ELSE
        RAISE NOTICE 'Ward age-wise population data already exists, skipping insertion';
    END IF;
END
$$;
