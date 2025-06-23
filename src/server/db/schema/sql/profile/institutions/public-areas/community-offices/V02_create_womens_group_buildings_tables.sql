-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define womens_group_building_type enum
DO $$ 
BEGIN
  CREATE TYPE womens_group_building_type AS ENUM (
    'MOTHERS_GROUP_BUILDING', 'WOMENS_COOPERATIVE', 'WOMENS_CENTER',
    'WOMENS_SHELTER', 'WOMEN_EMPOWERMENT_CENTER', 'SKILL_DEVELOPMENT_CENTER',
    'WOMENS_SAVING_GROUP', 'WOMEN_ENTERPRISE_CENTER', 'WOMEN_HEALTH_CENTER',
    'MULTIPURPOSE_CENTER', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define women_group_focus_area enum
DO $$ 
BEGIN
  CREATE TYPE women_group_focus_area AS ENUM (
    'ECONOMIC_EMPOWERMENT', 'HEALTH_AND_SANITATION', 'EDUCATION',
    'RIGHTS_ADVOCACY', 'GENDER_BASED_VIOLENCE', 'SAVINGS_AND_CREDIT',
    'SKILL_DEVELOPMENT', 'ENVIRONMENTAL_CONSERVATION', 'HANDICRAFTS_PRODUCTION',
    'LEADERSHIP_DEVELOPMENT', 'REPRODUCTIVE_HEALTH', 'COMMUNITY_DEVELOPMENT',
    'MULTIPLE_FOCUS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the womens_group_building table
CREATE TABLE IF NOT EXISTS acme_womens_group_building (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  building_type womens_group_building_type NOT NULL,
  group_focus_area women_group_focus_area NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  group_established_year INTEGER,
  management_type management_type NOT NULL,
  registration_number VARCHAR(50),
  registered_with TEXT,
  registration_date DATE,
  last_renewal_date DATE,
  is_affiliated_with_federation BOOLEAN DEFAULT false,
  federation_affiliation_details TEXT,
  
  -- Group composition
  total_member_count INTEGER,
  active_member_count INTEGER,
  dalit_member_count INTEGER,
  janajati_member_count INTEGER,
  brahmin_chhetri_member_count INTEGER,
  madhesi_member_count INTEGER,
  muslim_member_count INTEGER,
  other_ethnicity_member_count INTEGER,
  pwd_member_count INTEGER,
  single_women_member_count INTEGER,
  youth_member_count INTEGER,
  senior_member_count INTEGER,
  
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
  has_office_space BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_kitchen BOOLEAN DEFAULT false,
  has_childcare_space BOOLEAN DEFAULT false,
  
  -- Basic facilities
  has_electricity BOOLEAN DEFAULT true,
  has_power_backup BOOLEAN DEFAULT false,
  has_water_supply BOOLEAN DEFAULT true,
  has_toilets BOOLEAN DEFAULT true,
  has_menstrual_hygiene_management BOOLEAN DEFAULT false,
  has_internet_connectivity BOOLEAN DEFAULT false,
  
  -- Equipment and resources
  has_computers BOOLEAN DEFAULT false,
  computer_count INTEGER,
  has_training_equipment BOOLEAN DEFAULT false,
  training_equipment_details TEXT,
  has_production_equipment BOOLEAN DEFAULT false,
  production_equipment_details TEXT,
  has_office_furniture BOOLEAN DEFAULT false,
  has_audio_visual_equipment BOOLEAN DEFAULT false,
  
  -- Activities and operations
  meeting_frequency TEXT,
  regular_activities TEXT,
  skill_training_offered TEXT,
  awareness_programs_organized TEXT,
  income_generation_activities TEXT,
  health_activities TEXT,
  education_activities TEXT,
  advocacy_activities TEXT,
  major_annual_events TEXT,
  usage_frequency usage_frequency,
  
  -- Economic activities
  has_saving_credit_program BOOLEAN DEFAULT false,
  total_savings_npr DECIMAL(18, 2),
  loan_portfolio_size_npr DECIMAL(18, 2),
  interest_rate_percent DECIMAL(5, 2),
  default_rate_percent DECIMAL(5, 2),
  has_enterprise_activities BOOLEAN DEFAULT false,
  enterprise_activities_details TEXT,
  annual_turnover_npr DECIMAL(18, 2),
  major_products_produced TEXT,
  market_linkages TEXT,
  
  -- Financial aspects
  has_bank_account BOOLEAN DEFAULT false,
  bank_account_details TEXT,
  annual_budget_npr DECIMAL(18, 2),
  maintenance_fund_npr DECIMAL(14, 2),
  funding_sources TEXT,
  has_annual_audit BOOLEAN DEFAULT false,
  last_audit_date DATE,
  receives_external_funding BOOLEAN DEFAULT false,
  external_funding_sources TEXT,
  has_insurance BOOLEAN DEFAULT false,
  insurance_details TEXT,
  
  -- Governance and leadership
  has_written_constitution BOOLEAN DEFAULT false,
  has_strategic_plan BOOLEAN DEFAULT false,
  executive_committee_size INTEGER,
  executive_committee_selection_process TEXT,
  last_executive_election_date DATE,
  decision_making_process TEXT,
  leadership_rotation_policy TEXT,
  has_subcommittees BOOLEAN DEFAULT false,
  subcommittee_details TEXT,
  has_operational_manual BOOLEAN DEFAULT false,
  record_keeping_system TEXT,
  
  -- Staff and human resources
  has_full_time_staff BOOLEAN DEFAULT false,
  full_time_staff_count INTEGER,
  has_part_time_staff BOOLEAN DEFAULT false,
  part_time_staff_count INTEGER,
  has_trained_facilitators BOOLEAN DEFAULT false,
  facilitator_count INTEGER,
  staff_training_details TEXT,
  volunteer_count INTEGER,
  
  -- Partnerships and networks
  has_partnership_with_local_government BOOLEAN DEFAULT false,
  local_government_partnership_details TEXT,
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
  inclusion_challenges TEXT,
  
  -- Impact and achievements
  major_achievements TEXT,
  community_impact TEXT,
  success_stories TEXT,
  improvements_in_womens_lives TEXT,
  advocacy_successes TEXT,
  awards_and_recognition TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  capacity_challenges TEXT,
  financial_challenges TEXT,
  social_challenges TEXT,
  maintenance_needs TEXT,
  training_needs TEXT,
  equipment_needs TEXT,
  funding_needs TEXT,
  
  -- Future plans
  strategic_priorities TEXT,
  expansion_plans TEXT,
  sustainability_plans TEXT,
  future_projects_planned TEXT,
  
  -- Security and safety
  has_safety_protocol BOOLEAN DEFAULT false,
  safety_protocol_details TEXT,
  has_gbv_response_mechanism BOOLEAN DEFAULT false,
  gbv_response_details TEXT,
  security_challenges TEXT,
  has_boundary_wall BOOLEAN DEFAULT false,
  
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
  linked_community_groups JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
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
CREATE INDEX IF NOT EXISTS idx_womens_group_building_location_point ON acme_womens_group_building USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_womens_group_building_footprint ON acme_womens_group_building USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_womens_group_building_compound_area ON acme_womens_group_building USING GIST (compound_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_womens_group_building_name ON acme_womens_group_building(name);
CREATE INDEX IF NOT EXISTS idx_womens_group_building_slug ON acme_womens_group_building(slug);
CREATE INDEX IF NOT EXISTS idx_womens_group_building_type ON acme_womens_group_building(building_type);
CREATE INDEX IF NOT EXISTS idx_womens_group_focus_area ON acme_womens_group_building(group_focus_area);
CREATE INDEX IF NOT EXISTS idx_womens_group_building_ward_number ON acme_womens_group_building(ward_number);
