-- Check if acme_municipality_wide_vegetables table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_vegetables'
    ) THEN
        CREATE TABLE acme_municipality_wide_vegetables (
            id VARCHAR(36) PRIMARY KEY,
            vegetable_type VARCHAR(100) NOT NULL,
            production_in_tonnes DECIMAL(10, 2) NOT NULL,
            sales_in_tonnes DECIMAL(10, 2) NOT NULL,
            revenue_in_rs DECIMAL(14, 2) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_vegetables;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    -- Potato (आलु)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'POTATO', 147.09, 24.75, 2153250);

    -- Tomato (गोलभेडा/टमाटर)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'TOMATO', 113.72, 29.94, 2604780);
    
    -- Cucumber (काक्रो)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CUCUMBER', 105.92, 15.12, 1315440);
    
    -- Pumpkin (फर्सी)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'PUMPKIN', 62.19, 6.15, 535050);
    
    -- Cauliflower (काउली)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CAULIFLOWER', 28.16, 15.06, 1310220);
    
    -- Calabash (लौका)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CALABASH', 27.35, 5.8, 504600);
    
    -- Cabbage (बन्दा)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CABBAGE', 20.58, 9.78, 850860);
    
    -- Brinjal (भण्टा/भ्यान्टा)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'BRINJAL', 16.31, 3.03, 263610);
    
    -- Bitter Gourd (करेला)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'BITTER_GOURD', 10.27, 2.06, 179220);
    
    -- Onion (प्याज)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'ONION', 9.78, 2.47, 214890);
    
    -- Radish (मुला)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'RADISH', 9.02, 4.88, 424560);
    
    -- Capsicum (भेडे खुर्सानी)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CAPSICUM', 6.34, 6.71, 583770);
    
    -- Okra (भिण्डी/रामतोरिया)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'OKRA', 3.54, 3.62, 314940);
    
    -- Yam (तरुल)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'YAM', 1.4, 2.52, 219240);
    
    -- Luffa (घिरौला)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'LUFFA', 0.76, 0.54, 46980);
    
    -- Carrot (गाँजर)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'CARROT', 0.73, 0.44, 38280);
    
    -- Red Kidney Bean (राज्मा सिमी)
    INSERT INTO acme_municipality_wide_vegetables (id, vegetable_type, production_in_tonnes, sales_in_tonnes, revenue_in_rs)
    VALUES (gen_random_uuid(), 'RED_KIDNEY_BEAN', 0.25, 0.22, 19140);
END
$$;