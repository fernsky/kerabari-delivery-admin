-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Create gender enum type if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
        CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
    END IF;
END
$$;

-- Create acme_ward_wise_househead_gender table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_househead_gender') THEN
        CREATE TABLE acme_ward_wise_househead_gender (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            ward_name VARCHAR(100),
            gender gender NOT NULL,
            population INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create index for faster lookups by ward number and gender
        CREATE INDEX idx_ward_househead_gender ON acme_ward_wise_househead_gender(ward_number, gender);
    END IF;
END
$$;


-- Seed data for 2080 household heads by gender
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM acme_ward_wise_househead_gender WHERE created_at::DATE = CURRENT_DATE AND ward_number = 1
    ) THEN
        INSERT INTO acme_ward_wise_househead_gender (id, ward_number, ward_name, gender, population)
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, NULL, 'MALE', 535),
        (gen_random_uuid(), 1, NULL, 'FEMALE', 375),
        (gen_random_uuid(), 1, NULL, 'OTHER', 0),

        -- Ward 2
        (gen_random_uuid(), 2, NULL, 'MALE', 2116),
        (gen_random_uuid(), 2, NULL, 'FEMALE', 495),
        (gen_random_uuid(), 2, NULL, 'OTHER', 0),

        -- Ward 3
        (gen_random_uuid(), 3, NULL, 'MALE', 1574),
        (gen_random_uuid(), 3, NULL, 'FEMALE', 487),
        (gen_random_uuid(), 3, NULL, 'OTHER', 0),

        -- Ward 4
        (gen_random_uuid(), 4, NULL, 'MALE', 1180),
        (gen_random_uuid(), 4, NULL, 'FEMALE', 651),
        (gen_random_uuid(), 4, NULL, 'OTHER', 1),

        -- Ward 5
        (gen_random_uuid(), 5, NULL, 'MALE', 1488),
        (gen_random_uuid(), 5, NULL, 'FEMALE', 360),
        (gen_random_uuid(), 5, NULL, 'OTHER', 0),

        -- Ward 6
        (gen_random_uuid(), 6, NULL, 'MALE', 1642),
        (gen_random_uuid(), 6, NULL, 'FEMALE', 329),
        (gen_random_uuid(), 6, NULL, 'OTHER', 0),

        -- Ward 7
        (gen_random_uuid(), 7, NULL, 'MALE', 1945),
        (gen_random_uuid(), 7, NULL, 'FEMALE', 462),
        (gen_random_uuid(), 7, NULL, 'OTHER', 0),

        -- Ward 8
        (gen_random_uuid(), 8, NULL, 'MALE', 1275),
        (gen_random_uuid(), 8, NULL, 'FEMALE', 615),
        (gen_random_uuid(), 8, NULL, 'OTHER', 0);
    END IF;
END
$$;
