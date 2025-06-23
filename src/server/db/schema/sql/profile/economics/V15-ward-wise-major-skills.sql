-- Check if acme_ward_wise_major_skills table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_major_skills'
    ) THEN
        CREATE TABLE acme_ward_wise_major_skills (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            skill TEXT NOT NULL,
            population INTEGER NOT NULL DEFAULT 0 CHECK (population >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_major_skills) THEN
        INSERT INTO acme_ward_wise_major_skills (
            ward_number, skill, population
        )
        VALUES
        -- Ward 1
        (1, 'SEWING_RELATED', 31),
        (1, 'TEACHING_RELATED', 23),
        (1, 'HOTEL_RESTAURANT_RELATED', 17),
        (1, 'DRIVING_RELATED', 10),
        (1, 'SELF_PROTECTION_RELATED', 57),
        (1, 'OTHER', 8),
        (1, 'COMPUTER_SCIENCE_RELATED', 2),
        (1, 'HUMAN_HEALTH_RELATED', 11),
        (1, 'AGRICULTURE_RELATED', 7),
        (1, 'ELECTRICITY_INSTALLMENT_RELATED', 7),
        (1, 'BEUATICIAN_RELATED', 5),
        (1, 'CARPENTERY_RELATED', 7),
        (1, 'FURNITURE_RELATED', 1),
        (1, 'MECHANICS_RELATED', 2),
        (1, 'ANIMAL_HEALTH_RELATED', 2),
        (1, 'RADIO_TELEVISION_ELECTRICAL_REPAIR', 3),
        (1, 'PLUMBING', 3),
        (1, 'LITERARY_CREATION_RELATED', 3),
        
        -- Ward 2
        (2, 'SEWING_RELATED', 35),
        (2, 'TEACHING_RELATED', 63),
        (2, 'HOTEL_RESTAURANT_RELATED', 48),
        (2, 'DRIVING_RELATED', 44),
        (2, 'SELF_PROTECTION_RELATED', 17),
        (2, 'OTHER', 20),
        (2, 'COMPUTER_SCIENCE_RELATED', 50),
        (2, 'HUMAN_HEALTH_RELATED', 26),
        (2, 'AGRICULTURE_RELATED', 21),
        (2, 'ELECTRICITY_INSTALLMENT_RELATED', 14),
        (2, 'BEUATICIAN_RELATED', 13),
        (2, 'CARPENTERY_RELATED', 17),
        (2, 'FURNITURE_RELATED', 2),
        (2, 'MECHANICS_RELATED', 3),
        (2, 'ENGINEERING_DESIGN_RELATED', 8),
        (2, 'ANIMAL_HEALTH_RELATED', 5),
        (2, 'RADIO_TELEVISION_ELECTRICAL_REPAIR', 4),
        (2, 'PLUMBING', 3),
        (2, 'PHOTOGRAPHY_RELATED', 1),
        (2, 'STONEWORK_WOODWORK', 1),
        
        -- Ward 3
        (3, 'SEWING_RELATED', 47),
        (3, 'TEACHING_RELATED', 85),
        (3, 'HOTEL_RESTAURANT_RELATED', 41),
        (3, 'DRIVING_RELATED', 37),
        (3, 'SELF_PROTECTION_RELATED', 50),
        (3, 'OTHER', 54),
        (3, 'COMPUTER_SCIENCE_RELATED', 9),
        (3, 'HUMAN_HEALTH_RELATED', 31),
        (3, 'AGRICULTURE_RELATED', 31),
        (3, 'ELECTRICITY_INSTALLMENT_RELATED', 16),
        (3, 'BEUATICIAN_RELATED', 22),
        (3, 'CARPENTERY_RELATED', 5),
        (3, 'FURNITURE_RELATED', 1),
        (3, 'MECHANICS_RELATED', 7),
        (3, 'ENGINEERING_DESIGN_RELATED', 7),
        (3, 'ANIMAL_HEALTH_RELATED', 1),
        (3, 'RADIO_TELEVISION_ELECTRICAL_REPAIR', 8),
        (3, 'PLUMBING', 3),
        (3, 'JWELLERY_MAKING_RELATED', 7),
        (3, 'HANDICRAFT_RELATED', 2),
        
        -- Ward 4
        (4, 'SEWING_RELATED', 17),
        (4, 'TEACHING_RELATED', 10),
        (4, 'HOTEL_RESTAURANT_RELATED', 30),
        (4, 'DRIVING_RELATED', 10),
        (4, 'SELF_PROTECTION_RELATED', 2),
        (4, 'OTHER', 11),
        (4, 'COMPUTER_SCIENCE_RELATED', 11),
        (4, 'HUMAN_HEALTH_RELATED', 11),
        (4, 'AGRICULTURE_RELATED', 7),
        (4, 'ELECTRICITY_INSTALLMENT_RELATED', 13),
        (4, 'BEUATICIAN_RELATED', 8),
        (4, 'CARPENTERY_RELATED', 3),
        (4, 'FURNITURE_RELATED', 2),
        (4, 'MECHANICS_RELATED', 1),
        (4, 'ANIMAL_HEALTH_RELATED', 2),
        (4, 'RADIO_TELEVISION_ELECTRICAL_REPAIR', 1),
        (4, 'PLUMBING', 2),
        (4, 'HANDICRAFT_RELATED', 3),
        (4, 'PHOTOGRAPHY_RELATED', 1),
        
        -- Ward 5
        (5, 'SEWING_RELATED', 1),
        (5, 'TEACHING_RELATED', 12),
        (5, 'DRIVING_RELATED', 4),
        (5, 'OTHER', 7),
        (5, 'COMPUTER_SCIENCE_RELATED', 1),
        (5, 'HUMAN_HEALTH_RELATED', 1),
        (5, 'AGRICULTURE_RELATED', 3),
        (5, 'ELECTRICITY_INSTALLMENT_RELATED', 3),
        (5, 'CARPENTERY_RELATED', 3),
        (5, 'ENGINEERING_DESIGN_RELATED', 1),
        (5, 'ANIMAL_HEALTH_RELATED', 2),
        (5, 'LITERARY_CREATION_RELATED', 1),
        (5, 'PHOTOGRAPHY_RELATED', 1),
        (5, 'STONEWORK_WOODWORK', 1),
        
        -- Ward 6
        (6, 'SEWING_RELATED', 103),
        (6, 'TEACHING_RELATED', 20),
        (6, 'HOTEL_RESTAURANT_RELATED', 7),
        (6, 'DRIVING_RELATED', 23),
        (6, 'SELF_PROTECTION_RELATED', 2),
        (6, 'OTHER', 7),
        (6, 'COMPUTER_SCIENCE_RELATED', 27),
        (6, 'HUMAN_HEALTH_RELATED', 11),
        (6, 'AGRICULTURE_RELATED', 6),
        (6, 'ELECTRICITY_INSTALLMENT_RELATED', 16),
        (6, 'BEUATICIAN_RELATED', 11),
        (6, 'CARPENTERY_RELATED', 14),
        (6, 'FURNITURE_RELATED', 11),
        (6, 'MECHANICS_RELATED', 10),
        (6, 'ENGINEERING_DESIGN_RELATED', 3),
        (6, 'ANIMAL_HEALTH_RELATED', 4),
        (6, 'RADIO_TELEVISION_ELECTRICAL_REPAIR', 2),
        (6, 'PLUMBING', 3),
        (6, 'LITERARY_CREATION_RELATED', 1),
        
        -- Ward 7
        (7, 'SEWING_RELATED', 15),
        (7, 'TEACHING_RELATED', 12),
        (7, 'HOTEL_RESTAURANT_RELATED', 1),
        (7, 'DRIVING_RELATED', 5),
        (7, 'SELF_PROTECTION_RELATED', 4),
        (7, 'OTHER', 4),
        (7, 'COMPUTER_SCIENCE_RELATED', 4),
        (7, 'HUMAN_HEALTH_RELATED', 9),
        (7, 'AGRICULTURE_RELATED', 5),
        (7, 'ELECTRICITY_INSTALLMENT_RELATED', 3),
        (7, 'BEUATICIAN_RELATED', 6),
        (7, 'CARPENTERY_RELATED', 2),
        (7, 'MECHANICS_RELATED', 1),
        (7, 'ANIMAL_HEALTH_RELATED', 1),
        (7, 'PLUMBING', 1),
        (7, 'LITERARY_CREATION_RELATED', 1),
        (7, 'PHOTOGRAPHY_RELATED', 4),
        
        -- Ward 8
        (8, 'SEWING_RELATED', 22),
        (8, 'TEACHING_RELATED', 39),
        (8, 'HOTEL_RESTAURANT_RELATED', 15),
        (8, 'DRIVING_RELATED', 11),
        (8, 'OTHER', 12),
        (8, 'COMPUTER_SCIENCE_RELATED', 15),
        (8, 'HUMAN_HEALTH_RELATED', 7),
        (8, 'AGRICULTURE_RELATED', 11),
        (8, 'ELECTRICITY_INSTALLMENT_RELATED', 8),
        (8, 'BEUATICIAN_RELATED', 5),
        (8, 'CARPENTERY_RELATED', 6),
        (8, 'FURNITURE_RELATED', 11),
        (8, 'ENGINEERING_DESIGN_RELATED', 2),
        (8, 'ANIMAL_HEALTH_RELATED', 2),
        (8, 'PLUMBING', 2),
        (8, 'HANDICRAFT_RELATED', 1);
    END IF;
END
$$;