-- Check if acme_municipality_wide_commercial_agricultural_animal_husbandry_farmers_group table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_commercial_agricultural_animal_husbandry_farmers_group'
    ) THEN
        CREATE TABLE acme_municipality_wide_commercial_agricultural_animal_husbandry_farmers_group (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            ward_number INTEGER NOT NULL,
            type VARCHAR(50) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_commercial_agricultural_animal_husbandry_farmers_group;
END
$$;

-- Insert data from the provided dataset with extracted ward numbers
DO $$
BEGIN
    -- Sample entries from the dataset with mapped business types and extracted ward numbers
    INSERT INTO acme_municipality_wide_commercial_agricultural_animal_husbandry_farmers_group (id, name, ward_number, type)
    VALUES 
    (gen_random_uuid(), 'खड्का कृषि फर्म', 4, 'VEGETABLE_FARMING'),
    (gen_random_uuid(), 'तिला बाख्रा पालन फर्म', 1, 'GOAT_FARMING'),
    (gen_random_uuid(), 'सृजना कृषि तथा तरकारी फर्म', 2, 'MIXED_FARMING'),
    (gen_random_uuid(), 'संगम मत्स्य फर्म', 1, 'FISH_FARMING'),
    (gen_random_uuid(), 'ईशा बाख्रा पालन फर्म', 2, 'GOAT_FARMING'),
    (gen_random_uuid(), 'कुबेर कृषि फर्म', 2, 'ANIMAL_HUSBANDRY'),
    (gen_random_uuid(), 'शान्ति कृषि पशुपंछी फर्म', 2, 'LIVESTOCK_POULTRY'),
    (gen_random_uuid(), 'सापकोटा मौरी फर्म', 3, 'BEEKEEPING'),
    (gen_random_uuid(), 'योगी बाख्रापालन फर्म', 2, 'GOAT_FARMING'),
    (gen_random_uuid(), 'ग्रेस पशुपंछी फर्म', 2, 'LIVESTOCK_POULTRY'),
    (gen_random_uuid(), 'क्षितिज पशुपालन फर्म', 4, 'ANIMAL_HUSBANDRY'),
    (gen_random_uuid(), 'भुपाल कृषि तथा पशुपन्छी फार्म', 2, 'LIVESTOCK_POULTRY'),
    (gen_random_uuid(), 'मदन पोल्ट्री फार्म', 2, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'रोहन पोल्ट्री फार्म', 1, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'सुरज पोल्ट्री फार्म', 1, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'जय भैंसी पालन फार्म', 2, 'CATTLE_FARMING'),
    (gen_random_uuid(), 'भेरी बाख्रा पालन फार्म', 1, 'GOAT_FARMING'),
    (gen_random_uuid(), 'तारा मौरी पालन फार्म', 3, 'BEEKEEPING'),
    (gen_random_uuid(), 'हाम्रो आधुनिक कृषि फार्म', 5, 'FRUIT_FARMING'),
    (gen_random_uuid(), 'विजय कुखुरा फार्म', 3, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'आचार्य तरकारी फार्म', 3, 'VEGETABLE_FARMING'),
    (gen_random_uuid(), 'कुशल गाईपालन फार्म', 2, 'DAIRY_FARMING'),
    (gen_random_uuid(), 'डोर्नन् पोल्ट्री फार्म', 2, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'सरस्वती बाख्रा फार्म', 3, 'GOAT_FARMING'),
    (gen_random_uuid(), 'साना पोल्ट्री फार्म तथा माछापालन फार्म', 3, 'MIXED_FARMING'),
    (gen_random_uuid(), 'प्रगतिशील बाख्रापालन फार्म', 3, 'GOAT_FARMING'),
    (gen_random_uuid(), 'अमन कुखुरा फार्म', 5, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'बुद्धशान्ति बाख्रा फार्म', 4, 'MIXED_FARMING'),
    (gen_random_uuid(), 'प्रगति ह्याचरी एण्ड पोल्ट्री फार्म', 3, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'ग्रीन फार्म', 3, 'FRUIT_FARMING'),
    (gen_random_uuid(), 'बागेश्वरी बाख्रा फार्म', 3, 'GOAT_FARMING'),
    (gen_random_uuid(), 'प्राप्ति पोल्ट्री फार्म', 7, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'सैनिक कृषि फार्म', 1, 'VEGETABLE_FARMING'),
    (gen_random_uuid(), 'कृष्ण भैंसी फार्म', 1, 'CATTLE_FARMING'),
    (gen_random_uuid(), 'बुद्धशान्ति बहुउद्देश्य कृषि एग्रो फार्म', 4, 'MIXED_FARMING'),
    (gen_random_uuid(), 'मल्ल पोल्ट्री फार्म', 2, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'अब्दुल कृषि फार्म', 8, 'VEGETABLE_FARMING'),
    (gen_random_uuid(), 'शुभम् पोल्ट्री फार्म', 4, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'बागेश्वरी कृषि तथा टुरिजम फार्म', 3, 'MIXED_FARMING'),
    (gen_random_uuid(), 'रोशनी पोल्ट्री फार्म', 5, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'रयानमेली गाई पालन फार्म', 2, 'DAIRY_FARMING'),
    (gen_random_uuid(), 'जय किसान भैसीपालन फर्म', 5, 'CATTLE_FARMING'),
    (gen_random_uuid(), 'संजय गाईपालन फर्म', 2, 'ANIMAL_HUSBANDRY'),
    (gen_random_uuid(), 'लाईफ नर्सरी फार्म', 1, 'NURSERY'),
    (gen_random_uuid(), 'डि. एस. बाख्रा पालन फार्म', 6, 'GOAT_FARMING'),
    (gen_random_uuid(), 'ईश्वरी बाख्रा पालन फार्म', 2, 'GOAT_FARMING'),
    (gen_random_uuid(), 'श्री गीत भैंसी फार्म', 8, 'CATTLE_FARMING'),
    (gen_random_uuid(), 'श्री रमनशिल कृषि फार्म', 6, 'ANIMAL_HUSBANDRY'),
    (gen_random_uuid(), 'श्री पौडेल गाई फार्म', 8, 'CATTLE_FARMING'),
    (gen_random_uuid(), 'लक्ष्मी बाख्रा फार्म', 3, 'GOAT_FARMING'),
    (gen_random_uuid(), 'खत्री भैंसी फार्म', 2, 'CATTLE_FARMING'),
    (gen_random_uuid(), 'सुबित्रा कुखुरा फार्म', 2, 'POULTRY_FARMING'),
    (gen_random_uuid(), 'लक्ष्मी च्याउ फार्म', 6, 'MUSHROOM_FARMING'),
    (gen_random_uuid(), 'देउकी बंगुर फार्म', 1, 'PIG_FARMING'),
    (gen_random_uuid(), 'अन्नपूर्ण जैविक कृषि फार्म', 3, 'ORGANIC_FARMING');
END
$$;
