-- Check if acme_cooperatives table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_cooperatives'
    ) THEN
        CREATE TABLE acme_cooperatives (
            id VARCHAR(36) PRIMARY KEY,
            cooperative_name VARCHAR(255) NOT NULL,
            ward_number INTEGER NOT NULL,
            cooperative_type VARCHAR(50) NOT NULL,
            phone_number VARCHAR(20),
            remarks TEXT,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_cooperatives;
END
$$;

-- Insert data from the provided dataset with extracted ward numbers
DO $$
BEGIN
    -- Sample entries from the dataset with mapped cooperative types and extracted ward numbers
    INSERT INTO acme_cooperatives (id, cooperative_name, ward_number, cooperative_type, phone_number, remarks)
    VALUES 
    (gen_random_uuid(), 'राधापुर बचत तथा ऋण स.सं लि.', 1, 'SAVINGS_CREDIT', '', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'शिवशक्ति बहुउद्देश्यीय कृषि स. सं लि.', 1, 'MULTI_PURPOSE', '9848178510', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'जागरुक महिला बहुउद्देश्यीय स. सं लि.', 2, 'MULTI_PURPOSE', '9824531553', ''),
    (gen_random_uuid(), 'धनबर्षा सहकारी संस्था लि.', 2, 'OTHER', '9858024809', ''),
    (gen_random_uuid(), 'ध्रुबतारा संयुक्त युवा जागरण स. सं.लि.', 2, 'OTHER', '9844827152', ''),
    (gen_random_uuid(), 'आदर्श कृषक सहकारी सं लि.', 2, 'AGRICULTURE', '9848025037', ''),
    (gen_random_uuid(), 'रिमझिम सहकारी संस्था लि.', 2, 'OTHER', '9848086733', ''),
    (gen_random_uuid(), 'पुष्प महिला सहकारी स.लि.', 2, 'WOMENS', '9848222488', ''),
    (gen_random_uuid(), 'सुर्योदय सामुदायिक स. सं लि', 2, 'COMMUNITY', '9848146424', ''),
    (gen_random_uuid(), 'भद्रकाली महिला बचत सहकारी स. लि.', 2, 'WOMENS', '', ''),
    (gen_random_uuid(), 'परिवार कल्याण सहकारी सं लि', 2, 'OTHER', '9848083497', ''),
    (gen_random_uuid(), 'हम्रो साझा कृषि सहकारी सं लि', 2, 'AGRICULTURE', '9815594594', ''),
    (gen_random_uuid(), 'नव दुर्गा कृषि सहकारी सं लि.', 2, 'AGRICULTURE', '9844828433', ''),
    (gen_random_uuid(), 'सुरक्षित बचत तथा सहकारी स. लि.', 2, 'SAVINGS_CREDIT', '9804515228', ''),
    (gen_random_uuid(), 'अमर कृषि सहकारी सं लि', 2, 'AGRICULTURE', '9858028138', ''),
    (gen_random_uuid(), 'एकता महिला बचत सहकारी स.लि.', 3, 'WOMENS', '9848033270', ''),
    (gen_random_uuid(), 'बागेश्वरी बहुउद्देश्यीय कृ.स.स.लि', 3, 'MULTI_PURPOSE', '9848080085', ''),
    (gen_random_uuid(), 'पुष्पाञ्जली म. वि स. सं', 3, 'OTHER', '9844839680', ''),
    (gen_random_uuid(), 'भूमि बचत तथा स. सं लि.', 3, 'SAVINGS_CREDIT', '9844839680', ''),
    (gen_random_uuid(), 'दिप शशक्तिकरण कृषि स. सं लि.', 3, 'AGRICULTURE', '9848091447', ''),
    (gen_random_uuid(), 'पंचज्योती कृषि सहकारी सं लि.', 3, 'AGRICULTURE', '9848016418', ''),
    (gen_random_uuid(), 'गढवा बहुउद्देश्यीय स. सं लि', 3, 'MULTI_PURPOSE', '9848102221', ''),
    (gen_random_uuid(), 'जनता दुग्घ सहकारी सं लि.', 3, 'DAIRY', '9858024167', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'सहकारी संस्था लि. गढवा', 3, 'OTHER', '9848052947', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'साझा फुलबारी सहकारी सं लि.', 4, 'OTHER', '9816591736', ''),
    (gen_random_uuid(), 'दक्षशिला साना किसान कृषि स. सं लि.', 4, 'FARMERS', '9848086267', ''),
    (gen_random_uuid(), 'गढवा सैनिकी सहकारी सं लि.', 4, 'OTHER', '9858035240', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'माई भगवती कृषि सहकारी सं लि.', 5, 'AGRICULTURE', '9848112240', ''),
    (gen_random_uuid(), 'प्रकृति बचत तथा ऋण सहकारी सं लि.', 6, 'SAVINGS_CREDIT', '9858060992', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'शैयद कृषि सहकारी सं लि.', 6, 'AGRICULTURE', '9848189156', ''),
    (gen_random_uuid(), 'श्रृजनशिल महिला विकास बचत तथा श्रण सहकारी सं लि.', 7, 'WOMENS', '9864868104', ''),
    (gen_random_uuid(), 'पुर्नबास कृषक तरकारी उपभोक्ता सहकारी सं लि.', 7, 'VEGETABLE', '9868113252', ''),
    (gen_random_uuid(), 'नयाँ समावेशी सहकारी सं लि.', 8, 'OTHER', '9868044002', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'कालिका बहुउद्देश्यीय सहकारी स. लि.', 3, 'MULTI_PURPOSE', '9849491699', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'शुभकामना सहकारी सं लि.', 3, 'OTHER', '9858020244', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'बागेश्वरी कृषि सहकारी सं लि.', 3, 'AGRICULTURE', '9848080085', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'स्वाबलम्बन बचत तथा ऋण स. सं लि.', 3, 'SAVINGS_CREDIT', '9868086113', 'प्रदेश स्तरीय'),
    (gen_random_uuid(), 'सिमरहन कृषि सहकारी स. लि.', 5, 'AGRICULTURE', '9815539998', ''),
    (gen_random_uuid(), 'परोपकार कृषि सहकारी सं लि.', 4, 'AGRICULTURE', '9848030332', '');
END
$$;
