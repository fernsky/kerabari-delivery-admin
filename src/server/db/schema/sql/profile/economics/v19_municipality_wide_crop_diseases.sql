-- Check if acme_municipality_wide_crop_diseases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_crop_diseases'
    ) THEN
        CREATE TABLE acme_municipality_wide_crop_diseases (
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
    DELETE FROM acme_municipality_wide_crop_diseases;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    -- Rice (धान)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'RICE', 'ब्लाष्ट, खैरोथोप्ले, फेदकुहिने आदि ।', 'पतेरो, गवारो, फड्के, पातबेरुवा');

    -- Wheat (गहुँ)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'WHEAT', 'सिन्दुरे, कालोपोके', 'लाही, खुर्मे, फट्याँग्रा, फेदकटुवा');
    
    -- Corn (मकै)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CORN', 'कालोपोके, पातको धर्सेरोग, डाँठ र फल कुहिने, ध्वाँसे आदि ।', 'लाही, फट्याग्रा, खुम्रै, फेदकटुवा, गवारो आदि।');
    
    -- Vegetables (तरकारी)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'VEGETABLES', 'भण्टाको गवारो, लाही, वन्दाको पुतली, टमाटरको फलको गवारो, फल कुहाउने औसा, सुलसुले, रातो खपटे, डल्ले खपटे, थ्रिप्स, खुम्रे', 'ओइलाउने रोग, अल्टरनोरिया, क्लवरट, ड्याम्पिङ्ग अफ, डाइ ब्याक, जरा कुहिने, पाउडरी मिल्ड्यू');
    
    -- Fruits (फलफूल)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'FRUITS', 'आपको मधुवा, गवारो, फल कुहाउने औसा सुलसुले, अनारको पुतली, होपर', 'एनथ्राक्नोजा, ससेतो ढुसी, डाईव्याक, आँपको गुच्चा हुने, डाउनी मिल्ड्यू');
END
$$;