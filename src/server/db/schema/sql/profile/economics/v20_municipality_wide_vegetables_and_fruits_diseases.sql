-- Check if acme_municipality_wide_vegetables_and_fruits_diseases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_vegetables_and_fruits_diseases'
    ) THEN
        CREATE TABLE acme_municipality_wide_vegetables_and_fruits_diseases (
            id VARCHAR(36) PRIMARY KEY,
            crop VARCHAR(50) NOT NULL,
            major_pests TEXT NOT NULL,
            major_diseases TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_vegetables_and_fruits_diseases;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    -- Tomato (गोलभेडा)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'TOMATO', 'टूटायप्सूलूटा, सेतो झिंगा, लाही, फलको गवारो, पतेरो आदि ।', 'उडूवा— अगाटे, पछौटे आईलाउने, ममाजाईक आदि ।');

    -- Cauliflower & Cabbage (काउली, बन्दा)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CAULIFLOWER', 'डाईमण्ड ब्याक मोथ, टोवाको क्याटरपिलर, लाही, उफ्रने फडके आदि ।', 'सफ्ट रट, ब्लाक रट, अल्टरवेरिया, क्लव रुट डेम्पीङ अफ आदि ।');
    
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CABBAGE', 'डाईमण्ड ब्याक मोथ, टोवाको क्याटरपिलर, लाही, उफ्रने फडके आदि ।', 'सफ्ट रट, ब्लाक रट, अल्टरवेरिया, क्लव रुट डेम्पीङ अफ आदि ।');
    
    -- Potato (आलु)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'POTATO', 'पि.टी. एम., लाही, पात खाने लाभ्रे आदि ।', 'डढूवा, मोजाइफ खैरो पिप, चक्के आदि ।');
    
    -- Mustard (रायो)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'MUSTARD', 'डाईमण्ड ब्याक मोथ, टोवाको क्याटरपिलर, लाही, उफ्रने फडके आदि ।', 'सफ्ट रट, ब्लाक रट, अल्टरवेरिया, क्लव रुट डेम्पीङ अफ आदि ।');
END
$$;
