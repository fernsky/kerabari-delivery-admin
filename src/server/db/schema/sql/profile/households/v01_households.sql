CREATE TABLE IF NOT EXISTS
    acme_khajura_household (
        id TEXT PRIMARY KEY NOT NULL,
        profile_id TEXT DEFAULT 'khajura',
        province TEXT,
        district TEXT,
        local_level TEXT,
        ward_no INTEGER,
        house_symbol_no TEXT,
        family_symbol_no TEXT,
        date_of_interview TIMESTAMP,
        household_location DOUBLE PRECISION[],
        locality TEXT,
        development_organization TEXT,
        family_head_name TEXT,
        family_head_phone_no TEXT,
        total_members INTEGER,
        -- DELETE
        -- male_members INTEGER ,
        -- female_members INTEGER ,
        -- third_gender_members INTEGER ,
        are_members_elsewhere TEXT,
        total_elsewhere_members INTEGER,
        house_ownership TEXT,
        -- ADD
        house_ownership_other TEXT,
        -- DELETE
        -- rent_amount INTEGER,
        land_ownership TEXT,
        -- ADD 
        land_ownership_other TEXT,
        house_base TEXT,
        -- ADD
        house_base_other TEXT,
        house_outer_wall TEXT,
        -- ADD
        house_outer_wall_other TEXT,
        house_roof TEXT,
        -- ADD
        house_roof_other TEXT,
        house_floor TEXT,
        -- ADD
        house_floor_other TEXT,
        -- ADD
        house_floors INTEGER,
        -- ADD
        room_count INTEGER,
        -- DELETE
        -- house_built_date TIMESTAMP,
        -- DELETE
        -- house_storey INTEGER ,
        -- DELETE
        -- house_has_underground TEXT ,
        is_house_passed TEXT,
        -- ADD
        is_map_archived TEXT,
        -- ADD
        is_earthquake_resistant TEXT,
        -- ADD
        disaster_risk_status TEXT,
        -- DELETE
        -- house_passed_stories INTEGER,
        natural_disasters TEXT[],
        -- ADD
        is_safe TEXT,
        -- DELETE
        -- natural_disasters_other TEXT[],
        -- DTYPE_CHANGE TEXT[] -> TEXT
        water_source TEXT,
        -- DELETE
        -- water_source_other TEXT[],
        -- DTYPE_CHANGE TEXT[] -> TEXT
        water_purification_methods TEXT[],
        toilet_type TEXT,
        -- DELETE
        -- categorizes_waste TEXT ,
        -- DELETE
        -- decomposes_waste TEXT ,
        -- DELETE
        -- has_vehicular_waste_collection TEXT ,
        solid_waste_management TEXT,
        -- DELETE
        -- solid_waste_management_other TEXT[],
        primary_cooking_fuel TEXT,
        -- DELETE
        -- secondary_cooking_fuels TEXT[],
        primary_energy_source TEXT,
        -- DELETE
        -- primary_energy_source_other TEXT,
        -- DELETE
        -- secondary_energy_sources TEXT[],
        -- DELETE
        -- secondary_energy_sources_other TEXT[],
        road_status TEXT,
        -- DELETE
        -- road_status_other TEXT,
        time_to_public_bus TEXT,
        -- DELETE
        -- public_bus_interval TEXT ,
        time_to_market TEXT,
        distance_to_active_road TEXT,
        facilities TEXT[],
        has_properties_elsewhere TEXT,
        has_female_named_properties TEXT,
        -- DELETE
        -- months_sustained_from_income TEXT ,
        organizations_loaned_from TEXT[],
        loan_uses TEXT[],
        time_to_bank TEXT,
        -- DELETE
        -- time_to_cooperative TEXT ,
        financial_accounts TEXT[],
        have_health_insurance TEXT,
        -- DELETE
        -- have_life_insurance TEXT,
        -- DELETE
        -- life_insured_family_members INTEGER,
        consulting_health_organization TEXT,
        -- DELETE
        -- consulting_health_organization_other TEXT,
        time_to_health_organization TEXT,
        -- DELETE
        -- max_expense TEXT ,
        -- DELETE
        -- max_expense_excess INTEGER,
        -- DELETE
        -- max_income TEXT ,
        -- DELETE
        -- max_income_excess INTEGER,
        income_sources TEXT[],
        -- DELETE
        -- other_income_sources TEXT[],
        -- DELETE
        -- have_dog TEXT ,
        -- DELETE
        -- dog_number INTEGER,
        -- DELETE
        -- is_dog_registered TEXT,
        -- DELETE
        -- is_dog_vaccinated TEXT,
        municipal_suggestions TEXT[],
        -- DELETE
        -- municipal_suggestions_other TEXT[],
        have_agricultural_land TEXT,
        agricultural_lands TEXT[],
        are_involved_in_agriculture TEXT,
        food_crops TEXT[],
        pulses TEXT[],
        oil_seeds TEXT[],
        vegetables TEXT[],
        fruits TEXT[],
        spices TEXT[],
        cash_crops TEXT[],
        -- DELETE
        -- have_cultivated_grass TEXT,
        are_involved_in_husbandry TEXT,
        animals TEXT[],
        animal_products TEXT[],
        have_aquaculture TEXT,
        pond_number INTEGER,
        pond_area REAL,
        fish_production REAL,
        -- DELETE
        -- fish_sales REAL,
        -- DELETE
        -- fish_revenue REAL,
        have_apiary TEXT,
        hive_number INTEGER,
        honey_production REAL,
        -- ADD
        honey_sales REAL,
        -- ADD
        honey_revenue REAL,
        -- Barren Lands
        -- DELETE
        -- is_land_barren TEXT,
        -- DELETE
        -- barren_land_area REAL,
        -- DELETE
        -- barren_land_food_crop_possibilities TEXT[],
        -- DELETE
        -- barren_land_food_crop_possibilities_other TEXT[],
        -- DELETE
        -- wants_to_rent_barren_land TEXT,
        has_agricultural_insurance TEXT,
        -- DELETE
        -- months_sustained_from_agriculture INTEGER,
        months_involved_in_agriculture TEXT,
        -- DELETE
        -- agriculture_investment INTEGER,
        agricultural_machines TEXT[],
        -- DELETE
        -- sales_and_distribution TEXT,
        -- DELETE
        -- is_farmer_registered TEXT,
        have_remittance TEXT,
        remittance_expenses TEXT[],
        -- DELETE
        -- house_image TEXT,
        device_id TEXT,
        geom geometry (Point, 4326),
        name TEXT,
        -- DELETE
        -- food_expense INTEGER,
        -- education_expense INTEGER,
        -- health_expense INTEGER,
        -- social_expense INTEGER,
        -- entertainment_expense INTEGER,
        -- household_expense INTEGER,
        -- DELETE
        -- service_income INTEGER,
        -- agriculture_income INTEGER,
        -- business_income INTEGER,
        -- industry_income INTEGER,
        -- remittance_income INTEGER,
        -- labour_income INTEGER,
        -- other_income INTEGER,
        -- ADD NEW
        -- Migration Details
        birth_place TEXT,
        birth_province TEXT,
        birth_district TEXT,
        birth_country TEXT,
        prior_location TEXT,
        prior_province TEXT,
        prior_district TEXT,
        prior_country TEXT,
        -- DELETE
        -- prior_urbanity_status TEXT,
        -- prior_residence_time INTEGER,
        residence_reason TEXT,
        -- ADD NEW
        has_business TEXT
    );