-- Check if acme_municipality_wide_agriculture_related_farmers_group table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_agriculture_related_farmers_group'
    ) THEN
        CREATE TABLE acme_municipality_wide_agriculture_related_farmers_group (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            ward_number INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_agriculture_related_farmers_group;
END
$$;

-- Insert data from the provided dataset with extracted ward numbers
DO $$
BEGIN
    INSERT INTO acme_municipality_wide_agriculture_related_farmers_group (id, name, ward_number)
    VALUES 
    (gen_random_uuid(), 'नयाँ गुराँसपुर कृषि समुह', 2),
    (gen_random_uuid(), 'सिर्जनाशिल कृषक समुह', 3),
    (gen_random_uuid(), 'हरियाली कृषक समुह', 1),
    (gen_random_uuid(), 'सिर्जनशिल कृषक समुह', 1),
    (gen_random_uuid(), 'सितापुर कृषक समाज समुह', 2),
    (gen_random_uuid(), 'उज्यालो दलित कृषक महिला समुह', 5),
    (gen_random_uuid(), 'आरती दलित कृषक महिला समुह', 5),
    (gen_random_uuid(), 'श्री प्रगतिशिल कृषक समुह', 4),
    (gen_random_uuid(), 'लालीगुराँस कृषक समुह', 1),
    (gen_random_uuid(), 'योग्यता महिला किसान समुह', 6),
    (gen_random_uuid(), 'श्री सिजनाशिल दलित महिला कृषक समुह', 6),
    (gen_random_uuid(), 'सगरमाथा दलित महिला कृषक समुह', 5),
    (gen_random_uuid(), 'धौलागिरी कृषक समुह', 3),
    (gen_random_uuid(), 'लक्ष्मी दलित महिला समुह', 6),
    (gen_random_uuid(), 'गौरी दिदी बहिनी दलित महिला समुह', 6),
    (gen_random_uuid(), 'सितापुर नमुना बैदेशीक कृषक समुह', 2),
    (gen_random_uuid(), 'लगनशिल दलित कृषक समुह', 6),
    (gen_random_uuid(), 'नुरानी कृषक समुह', 5),
    (gen_random_uuid(), 'सुनैलो दलित महिल कृषक समुह', 7),
    (gen_random_uuid(), 'दलित महिला कृषक समुह', 7),
    (gen_random_uuid(), 'हरियाली कृषक समुह', 5),
    (gen_random_uuid(), 'फुलवारि कृषक समुह', 5),
    (gen_random_uuid(), 'श्री दुर्गामाता महिला कृषक समुह', 7),
    (gen_random_uuid(), 'श्री जमना कृषक समुह', 7),
    (gen_random_uuid(), 'श्री लक्ष्मी कृषक समुह', 7),
    (gen_random_uuid(), 'श्री योजना कृषक बचत समुह', 7),
    (gen_random_uuid(), 'राम रहिम कृषक समुह', 7),
    (gen_random_uuid(), 'शिर्जनाशिल महिला कृषक समुह', 2),
    (gen_random_uuid(), 'लाफा कृषक समुह', 3),
    (gen_random_uuid(), 'स्थानीय अमर बचत कृषक समुह', 2),
    (gen_random_uuid(), 'हरेराम एकता कृषक समुह', 7),
    (gen_random_uuid(), 'कालीका कृषक समुह', 8),
    (gen_random_uuid(), 'लालीगुराँस कृषक समुह', 2),
    (gen_random_uuid(), 'प्रगातीशिल महिला कृषक समुह', 2),
    (gen_random_uuid(), 'दुर्गा महिला कृषक समुह', 7),
    (gen_random_uuid(), 'शान्ति क कृषक समुह', 7),
    (gen_random_uuid(), 'हरे कृष्ण कृषक समुह', 7),
    (gen_random_uuid(), 'एफ गाउँ दोहोरो लाइन कृषक समुह', 4),
    (gen_random_uuid(), 'हरियाली घरायसी खाद्यान्न उत्पादन कृषक समुह', 8),
    (gen_random_uuid(), 'हरियाली कृषि समुह', 2),
    (gen_random_uuid(), 'गाउँ फर्क समुह', 2),
    (gen_random_uuid(), 'बुदुपुर कृषि समुह', 4),
    (gen_random_uuid(), 'हरियाली महिला कृषक समुह', 2),
    (gen_random_uuid(), 'सितापुर दलित कृषक समुह', 2),
    (gen_random_uuid(), 'साझा प्रगातीशिल कृषक समुह', 2),
    (gen_random_uuid(), 'अर्गानिक कृषक समुह', 5),
    (gen_random_uuid(), 'संघर्षशिल कृषक समुह', 3);
END
$$;
