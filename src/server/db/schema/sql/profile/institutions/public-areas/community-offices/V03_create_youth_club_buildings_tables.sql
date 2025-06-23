-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define youth_club_building_type enum
DO $$ 
BEGIN
  CREATE TYPE youth_club_building_type AS ENUM (
    'YOUTH_CLUB', 'SPORTS_CLUB', 'MULTIPURPOSE_YOUTH_CENTER', 
    'YOUTH_INFORMATION_CENTER', 'YOUTH_TRAINING_CENTER', 
    'YOUTH_ACTIVITY_CENTER', 'YOUTH_INNOVATION_HUB', 
    'YOUTH_RESOURCE_CENTER', 'YOUTH_COUNCIL_BUILDING', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define youth_club_focus_area enum
DO $$ 
BEGIN
  CREATE TYPE youth_club_focus_area AS ENUM (
    'SPORTS', 'EDUCATION', 'SKILL_DEVELOPMENT', 'LEADERSHIP_DEVELOPMENT',
    'COMMUNITY_SERVICE', 'ENTREPRENEURSHIP', 'ARTS_AND_CULTURE',
    'ENVIRONMENT', 'TECHNOLOGY', 'CIVIC_ENGAGEMENT', 'HEALTH_AWARENESS',
    'DISASTER_MANAGEMENT', 'MULTIPLE_FOCUS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the youth_club_building table
CREATE TABLE IF NOT EXISTS acme_youth_club_building (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  building_type youth_club_building_type NOT NULL,
  club_focus_area youth_club_focus_area NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  club_established_year INTEGER,
  management_type management_type NOT NULL,
  registration_number VARCHAR(50),
  registered_with TEXT,
  registration_date DATE,
  last_renewal_date DATE,
  is_affiliated_with_national_youth_council BOOLEAN DEFAULT false,
  affiliation_details TEXT,
  
  -- Membership details
  total_member_count INTEGER,
  active_member_count INTEGER,
  male_member_count INTEGER,
  female_member_count INTEGER,
  other_gender_member_count INTEGER,
  dalit_member_count INTEGER,
  janajati_member_count INTEGER,
  brahmin_chhetri_member_count INTEGER,
  madhesi_member_count INTEGER,
  muslim_member_count INTEGER,
  other_ethnicity_member_count INTEGER,
  pwd_member_count INTEGER,
  age_group_15_18_count INTEGER,
  age_group_19_24_count INTEGER,
  age_group_25_30_count INTEGER,
  age_group_31_plus_count INTEGER,
  membership_fee_npr DECIMAL(10, 2),
  membership_renewal_frequency TEXT,
  
  -- Physical infrastructure
  has_dedicated_building BOOLEAN DEFAULT true,
  building_ownership TEXT,
  total_area_sq_m DECIMAL(10, 2),
  building_condition building_condition,
  construction_year INTEGER,
  construction_material building_construction_material,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  meeting_hall_capacity INTEGER,
  has_training_hall BOOLEAN DEFAULT false,
  training_hall_capacity INTEGER,
  has_library_space BOOLEAN DEFAULT false,
  has_office_space BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_indoor_sports_area BOOLEAN DEFAULT false,
  indoor_sports_area_details TEXT,
  has_outdoor_sports_area BOOLEAN DEFAULT false,
  outdoor_sports_area_details TEXT,
  has_recreation_area BOOLEAN DEFAULT false,
  recreation_area_details TEXT,
  
  -- Sports facilities
  has_football_ground BOOLEAN DEFAULT false,
  has_volleyball_court BOOLEAN DEFAULT false,
  has_basketball_court BOOLEAN DEFAULT false,
  has_cricket_ground BOOLEAN DEFAULT false,
  has_table_tennis BOOLEAN DEFAULT false,
  has_carrom_board BOOLEAN DEFAULT false,
  has_chess_boards BOOLEAN DEFAULT false,
  has_gym BOOLEAN DEFAULT false,
  gym_equipment_details TEXT,
  other_sports_facilities TEXT,
  sporting_equipment_inventory TEXT,
  
  -- Basic facilities
  has_electricity BOOLEAN DEFAULT true,
  has_power_backup BOOLEAN DEFAULT false,
  has_water_supply BOOLEAN DEFAULT true,
  has_toilets BOOLEAN DEFAULT true,
  has_separate_toilets_for_genders BOOLEAN DEFAULT false,
  has_changing_rooms BOOLEAN DEFAULT false,
  has_showers BOOLEAN DEFAULT false,
  has_internet_connectivity BOOLEAN DEFAULT false,
  has_cafeteria BOOLEAN DEFAULT false,
  
  -- Equipment and resources
  has_computers BOOLEAN DEFAULT false,
  computer_count INTEGER,
  has_audio_visual_equipment BOOLEAN DEFAULT false,
  has_library_books BOOLEAN DEFAULT false,
  book_count INTEGER,
  has_training_materials BOOLEAN DEFAULT false,
  training_materials_details TEXT,
  
  -- Activities and operations
  meeting_frequency TEXT,
  regular_activities TEXT,
  sports_activities TEXT,
  skill_training_offered TEXT,
  awareness_programs_organized TEXT,
  community_service_activities TEXT,
  tournaments_organized TEXT,
  cultural_activities TEXT,
  major_annual_events TEXT,
  usage_frequency usage_frequency,
  
  -- Financial aspects
  has_bank_account BOOLEAN DEFAULT false,
  bank_account_details TEXT,
  annual_budget_npr DECIMAL(18, 2),
  maintenance_fund_npr DECIMAL(14, 2),
  funding_sources TEXT,
  membership_fees_income_npr DECIMAL(14, 2),
  event_income_npr DECIMAL(14, 2),
  donations_npr DECIMAL(14, 2),
  local_government_funding_npr DECIMAL(14, 2),
  has_annual_audit BOOLEAN DEFAULT false,
  last_audit_date DATE,
  receives_external_funding BOOLEAN DEFAULT false,
  external_funding_sources TEXT,
  income_sustainability_plans TEXT,
  
  -- Governance and leadership
  has_written_constitution BOOLEAN DEFAULT false,
  has_strategic_plan BOOLEAN DEFAULT false,
  executive_committee_size INTEGER,
  female_in_executive_committee INTEGER,
  marginalised_groups_in_executive_committee INTEGER,
  executive_committee_selection_process TEXT,
  last_executive_election_date DATE,
  executive_committee_term INTEGER,
  decision_making_process TEXT,
  has_subcommittees BOOLEAN DEFAULT false,
  subcommittee_details TEXT,
  has_youth_participation_policy BOOLEAN DEFAULT false,
  record_keeping_system TEXT,
  
  -- Staff and human resources
  has_full_time_staff BOOLEAN DEFAULT false,
  full_time_staff_count INTEGER,
  has_part_time_staff BOOLEAN DEFAULT false,
  part_time_staff_count INTEGER,
  has_trainers BOOLEAN DEFAULT false,
  trainer_count INTEGER,
  trainer_specialties TEXT,
  has_youth_leadership_program BOOLEAN DEFAULT false,
  youth_leadership_details TEXT,
  volunteer_management_system TEXT,
  volunteer_count INTEGER,
  
  -- Partnerships and networks
  has_partnership_with_local_government BOOLEAN DEFAULT false,
  local_government_partnership_details TEXT,
  has_school_partnerships BOOLEAN DEFAULT false,
  school_partnership_details TEXT,
  has_sports_association_affiliations BOOLEAN DEFAULT false,
  sports_association_details TEXT,
  has_ngo_partnerships BOOLEAN DEFAULT false,
  ngo_partnership_details TEXT,
  has_private_sector_partnerships BOOLEAN DEFAULT false,
  private_sector_partnership_details TEXT,
  network_memberships TEXT,
  
  -- Accessibility and inclusion
  accessibility_level accessibility_level,
  distance_from_main_road_km DECIMAL(6, 2),
  distance_from_city_or_bazar_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  inclusion_policies TEXT,
  gender_equality_measures TEXT,
  facilities_for_disabled TEXT,
  inclusion_challenges TEXT,
  
  -- Impact and achievements
  major_achievements TEXT,
  community_impact TEXT,
  success_stories TEXT,
  sports_achievements TEXT,
  skill_development_outcomes TEXT,
  youth_employment_contribution TEXT,
  awards_and_recognition TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  capacity_challenges TEXT,
  financial_challenges TEXT,
  participation_challenges TEXT,
  maintenance_needs TEXT,
  training_needs TEXT,
  equipment_needs TEXT,
  funding_needs TEXT,
  
  -- Future plans
  strategic_priorities TEXT,
  expansion_plans TEXT,
  sustainability_plans TEXT,
  future_projects_planned TEXT,
  youth_engagement_strategies TEXT,
  
  -- Security and safety
  has_safety_protocol BOOLEAN DEFAULT false,
  safety_protocol_details TEXT,
  has_first_aid_facilities BOOLEAN DEFAULT false,
  first_aid_details TEXT,
  has_sports_injury_management BOOLEAN DEFAULT false,
  injury_management_details TEXT,
  has_boundary_wall BOOLEAN DEFAULT false,
  security_arrangements TEXT,
  
  -- Contact information
  chairperson_name TEXT,
  secretary_name TEXT,
  treasurer_name TEXT,
  contact_phone TEXT,
  alternate_contact_phone TEXT,
  contact_email TEXT,
  
  -- Digital presence
  has_social_media_presence BOOLEAN DEFAULT false,
  facebook_page TEXT,
  website_url TEXT,
  other_social_media TEXT,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_sports_associations JSONB DEFAULT '[]'::jsonb,
  linked_youth_clubs JSONB DEFAULT '[]'::jsonb,
  linked_ngos JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  compound_area GEOMETRY(Polygon, 4326),
  sports_fields_area GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_youth_club_building_location_point ON acme_youth_club_building USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_youth_club_building_footprint ON acme_youth_club_building USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_youth_club_building_compound_area ON acme_youth_club_building USING GIST (compound_area);
CREATE INDEX IF NOT EXISTS idx_youth_club_building_sports_fields_area ON acme_youth_club_building USING GIST (sports_fields_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_youth_club_building_name ON acme_youth_club_building(name);
CREATE INDEX IF NOT EXISTS idx_youth_club_building_slug ON acme_youth_club_building(slug);
CREATE INDEX IF NOT EXISTS idx_youth_club_building_type ON acme_youth_club_building(building_type);
CREATE INDEX IF NOT EXISTS idx_youth_club_focus_area ON acme_youth_club_building(club_focus_area);
CREATE INDEX IF NOT EXISTS idx_youth_club_building_ward_number ON acme_youth_club_building(ward_number);
