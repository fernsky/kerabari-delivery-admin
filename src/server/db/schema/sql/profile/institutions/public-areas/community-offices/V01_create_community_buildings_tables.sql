-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define community_building_type enum
DO $$ 
BEGIN
  CREATE TYPE community_building_type AS ENUM (
    'COMMUNITY_CENTER', 'MULTIPURPOSE_HALL', 'MEETING_FACILITY', 
    'COMMUNITY_RESOURCE_CENTER', 'COMMUNITY_LEARNING_CENTER', 
    'COMMUNITY_SERVICE_CENTER', 'INFORMATION_CENTER', 'CRISIS_CENTER', 
    'COMMUNITY_KITCHEN', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define management_type enum
DO $$ 
BEGIN
  CREATE TYPE management_type AS ENUM (
    'COMMUNITY_MANAGED', 'LOCAL_GOVERNMENT_MANAGED', 'NGO_MANAGED',
    'PUBLIC_PRIVATE_PARTNERSHIP', 'COOPERATIVE_MANAGED', 'TRUST_MANAGED',
    'USER_COMMITTEE_MANAGED', 'JOINT_MANAGEMENT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define building_construction_material enum
DO $$ 
BEGIN
  CREATE TYPE building_construction_material AS ENUM (
    'CONCRETE', 'BRICK_AND_CEMENT', 'STONE_AND_CEMENT', 'WOOD_AND_CEMENT',
    'MUD_AND_STONE', 'MUD_AND_WOOD', 'BAMBOO', 'PREFABRICATED', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define building_condition enum if not already exists
DO $$ 
BEGIN
  CREATE TYPE building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR', 
    'UNDER_CONSTRUCTION', 'UNDER_RENOVATION', 'ABANDONED', 'DAMAGED', 'CONDEMNED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define usage_frequency enum if not already exists
DO $$ 
BEGIN
  CREATE TYPE usage_frequency AS ENUM (
    'DAILY', 'SEVERAL_TIMES_A_WEEK', 'WEEKLY', 'BIWEEKLY', 
    'MONTHLY', 'QUARTERLY', 'OCCASIONALLY', 'SEASONALLY', 'RARELY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define accessibility_level enum if not already exists
DO $$ 
BEGIN
  CREATE TYPE accessibility_level AS ENUM (
    'EXCELLENT', 'GOOD', 'MODERATE', 'POOR', 'VERY_POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the community_building table
CREATE TABLE IF NOT EXISTS acme_community_building (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  building_type community_building_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  management_type management_type NOT NULL,
  managing_body TEXT,
  registration_number VARCHAR(50),
  registered_with TEXT,
  registration_date DATE,
  last_renewal_date DATE,
  
  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  building_condition building_condition,
  construction_year INTEGER,
  construction_material building_construction_material,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  main_hall_capacity INTEGER,
  has_stage BOOLEAN DEFAULT false,
  has_audio_system BOOLEAN DEFAULT false,
  has_projector BOOLEAN DEFAULT false,
  chairs_count INTEGER,
  tables_count INTEGER,
  has_kitchen BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_office BOOLEAN DEFAULT false,
  has_children_area BOOLEAN DEFAULT false,
  
  -- Basic facilities
  has_electricity BOOLEAN DEFAULT true,
  electricity_source TEXT,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT true,
  water_source_type TEXT,
  has_internet_connectivity BOOLEAN DEFAULT false,
  internet_type TEXT,
  has_heating_system BOOLEAN DEFAULT false,
  has_cooling_system BOOLEAN DEFAULT false,
  
  -- Public facilities
  has_public_toilets BOOLEAN DEFAULT true,
  male_toilets_count INTEGER,
  female_toilets_count INTEGER,
  has_handicap_toilets BOOLEAN DEFAULT false,
  has_menstruation_facilities BOOLEAN DEFAULT false,
  has_drinking_water BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  has_disabled_access BOOLEAN DEFAULT false,
  has_first_aid_kit BOOLEAN DEFAULT false,
  
  -- Usage and operations
  main_purposes TEXT,
  usage_frequency usage_frequency,
  average_monthly_users INTEGER,
  major_events TEXT,
  regular_activities TEXT,
  services_offered TEXT,
  is_open_to_public BOOLEAN DEFAULT true,
  access_restrictions TEXT,
  opening_time TIME,
  closing_time TIME,
  weekly_off_days TEXT,
  
  -- Booking and fees
  can_be_booked BOOLEAN DEFAULT true,
  booking_procedure TEXT,
  rental_fee_structure TEXT,
  average_daily_rental_fee_npr DECIMAL(10, 2),
  discount_for_community_members BOOLEAN DEFAULT false,
  fee_waiver_conditions TEXT,
  
  -- Management and staff
  management_committee_size INTEGER,
  women_in_management_committee INTEGER,
  dalits_in_management_committee INTEGER,
  janajatis_in_management_committee INTEGER,
  youth_in_management_committee INTEGER,
  pwd_in_management_committee INTEGER,
  management_committee_formation_date DATE,
  management_committee_tenure_years INTEGER,
  has_caretaker BOOLEAN DEFAULT false,
  permanent_staff_count INTEGER,
  temporary_staff_count INTEGER,
  female_staff_count INTEGER,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  maintenance_fund_npr DECIMAL(14, 2),
  income_sources TEXT,
  major_expenses TEXT,
  has_regular_audit BOOLEAN DEFAULT false,
  last_audit_date DATE,
  receives_external_funding BOOLEAN DEFAULT false,
  external_funding_sources TEXT,
  has_bank_account BOOLEAN DEFAULT false,
  bank_account_details TEXT,
  
  -- Accessibility and inclusion
  accessibility_level accessibility_level,
  distance_from_main_road_km DECIMAL(6, 2),
  distance_from_city_or_bazar_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  facilities_for_women TEXT,
  facilities_for_children TEXT,
  facilities_for_elderly TEXT,
  facilities_for_disabled TEXT,
  gender_friendliness TEXT,
  
  -- Environmental aspects
  has_garden_area BOOLEAN DEFAULT false,
  garden_area_sq_m DECIMAL(10, 2),
  has_tree_plantation BOOLEAN DEFAULT false,
  tree_count INTEGER,
  has_waste_management BOOLEAN DEFAULT false,
  waste_management_type TEXT,
  has_rainwater_harvesting BOOLEAN DEFAULT false,
  has_solar_panels BOOLEAN DEFAULT false,
  solar_capacity_kw DECIMAL(8, 2),
  environmental_initiatives TEXT,
  
  -- Security and safety
  has_security_personnel BOOLEAN DEFAULT false,
  security_personnel_count INTEGER,
  has_boundary_wall BOOLEAN DEFAULT false,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_fire_safety_equipment BOOLEAN DEFAULT false,
  fire_safety_equipment_details TEXT,
  has_emergency_exits BOOLEAN DEFAULT false,
  emergency_exit_count INTEGER,
  has_disaster_management_plan BOOLEAN DEFAULT false,
  disaster_management_details TEXT,
  
  -- Services and activities
  offers_training_programs BOOLEAN DEFAULT false,
  training_program_types TEXT,
  offers_community_meetings BOOLEAN DEFAULT true,
  offers_cultural_programs BOOLEAN DEFAULT false,
  offers_youth_activities BOOLEAN DEFAULT false,
  offers_women_activities BOOLEAN DEFAULT false,
  offers_elderly_activities BOOLEAN DEFAULT false,
  offers_children_activities BOOLEAN DEFAULT false,
  offers_library_services BOOLEAN DEFAULT false,
  book_count INTEGER,
  has_computer_facility BOOLEAN DEFAULT false,
  computer_count INTEGER,
  offers_public_internet BOOLEAN DEFAULT false,
  additional_service_details TEXT,
  
  -- Community involvement
  community_participation_level TEXT,
  annual_event_count INTEGER,
  major_annual_events TEXT,
  community_contribution_type TEXT,
  community_management_description TEXT,
  volunteer_involvement TEXT,
  
  -- Governance and transparency
  has_operational_manual BOOLEAN DEFAULT false,
  has_public_notice_board BOOLEAN DEFAULT false,
  public_meetings_frequency TEXT,
  decision_making_process TEXT,
  transparency_measures TEXT,
  has_complaint_box BOOLEAN DEFAULT false,
  grievance_handling_mechanism TEXT,
  
  -- Usage statistics
  male_user_percentage INTEGER,
  female_user_percentage INTEGER,
  child_user_percentage INTEGER,
  youth_user_percentage INTEGER,
  adult_user_percentage INTEGER,
  elderly_user_percentage INTEGER,
  marginalized_group_percentage INTEGER,
  
  -- History and significance
  historical_significance TEXT,
  cultural_significance TEXT,
  founding_organizations TEXT,
  founding_members TEXT,
  major_achievements TEXT,
  community_impact TEXT,
  
  -- Plans and needs
  future_development_plans TEXT,
  maintenance_needs TEXT,
  infrastructure_needs TEXT,
  capacity_building_needs TEXT,
  expand_in_future BOOLEAN DEFAULT false,
  expansion_plans TEXT,
  
  -- Contact information
  contact_person_name TEXT,
  contact_person_title TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  alternate_contact_name TEXT,
  alternate_contact_phone TEXT,
  
  -- Social media and online presence
  facebook_page TEXT,
  website_url TEXT,
  other_social_media TEXT,
  
  -- Challenges and issues
  infrastructure_challenges TEXT,
  management_challenges TEXT,
  financial_challenges TEXT,
  community_related_challenges TEXT,
  conflict_issues TEXT,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_community_groups JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_ngos JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  compound_area GEOMETRY(Polygon, 4326),
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_community_building_location_point ON acme_community_building USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_community_building_footprint ON acme_community_building USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_community_building_compound_area ON acme_community_building USING GIST (compound_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_community_building_name ON acme_community_building(name);
CREATE INDEX IF NOT EXISTS idx_community_building_slug ON acme_community_building(slug);
CREATE INDEX IF NOT EXISTS idx_community_building_type ON acme_community_building(building_type);
CREATE INDEX IF NOT EXISTS idx_community_building_ward_number ON acme_community_building(ward_number);
CREATE INDEX IF NOT EXISTS idx_community_building_management_type ON acme_community_building(management_type);
