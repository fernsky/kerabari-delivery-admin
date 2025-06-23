-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define ethnic_group_building_type enum
DO $$ 
BEGIN
  CREATE TYPE ethnic_group_building_type AS ENUM (
    'ETHNIC_COMMUNITY_CENTER', 'CULTURAL_CENTER', 'HERITAGE_PRESERVATION_CENTER',
    'TRADITIONAL_ART_CENTER', 'TRADITIONAL_KNOWLEDGE_CENTER', 'LANGUAGE_LEARNING_CENTER',
    'CRAFT_PRODUCTION_CENTER', 'INDIGENOUS_KNOWLEDGE_CENTER', 'MULTIPURPOSE_ETHNIC_CENTER',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define ethnic_group_focus_area enum
DO $$ 
BEGIN
  CREATE TYPE ethnic_group_focus_area AS ENUM (
    'CULTURAL_HERITAGE_PRESERVATION', 'LANGUAGE_PRESERVATION', 'TRADITIONAL_ARTS_AND_CRAFTS',
    'COMMUNITY_DEVELOPMENT', 'INDIGENOUS_KNOWLEDGE', 'RIGHTS_ADVOCACY',
    'TRADITIONAL_MUSIC_AND_DANCE', 'TRADITIONAL_HEALING_PRACTICES',
    'INTERGENERATIONAL_KNOWLEDGE_TRANSFER', 'MULTIPLE_FOCUS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the ethnic_group_building table
CREATE TABLE IF NOT EXISTS acme_ethnic_group_building (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  building_type ethnic_group_building_type NOT NULL,
  focus_area ethnic_group_focus_area NOT NULL,
  ethnic_group TEXT NOT NULL,
  
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
  male_member_count INTEGER,
  female_member_count INTEGER,
  other_gender_member_count INTEGER,
  youth_member_count INTEGER,
  adult_member_count INTEGER,
  elderly_member_count INTEGER,
  pwd_member_count INTEGER,
  
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
  has_performance_space BOOLEAN DEFAULT false,
  performance_space_capacity INTEGER,
  has_cultural_display_area BOOLEAN DEFAULT false,
  has_museum_section BOOLEAN DEFAULT false,
  has_library_space BOOLEAN DEFAULT false,
  has_training_space BOOLEAN DEFAULT false,
  has_office_space BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_kitchen BOOLEAN DEFAULT false,
  has_traditional_architectural_elements BOOLEAN DEFAULT false,
  traditional_elements_details TEXT,
  
  -- Cultural artifacts and collections
  has_cultural_artifacts BOOLEAN DEFAULT false,
  artifact_collection_size INTEGER,
  has_documented_history BOOLEAN DEFAULT false,
  has_audio_visual_archives BOOLEAN DEFAULT false,
  has_traditional_costume_collection BOOLEAN DEFAULT false,
  costume_collection_details TEXT,
  has_traditional_instruments BOOLEAN DEFAULT false,
  instrument_collection_details TEXT,
  has_manuscripts BOOLEAN DEFAULT false,
  manuscript_collection_details TEXT,
  collection_preservation_status TEXT,
  
  -- Basic facilities
  has_electricity BOOLEAN DEFAULT true,
  has_power_backup BOOLEAN DEFAULT false,
  has_water_supply BOOLEAN DEFAULT true,
  has_toilets BOOLEAN DEFAULT true,
  has_internet_connectivity BOOLEAN DEFAULT false,
  
  -- Equipment and resources
  has_computers BOOLEAN DEFAULT false,
  computer_count INTEGER,
  has_audio_recording_equipment BOOLEAN DEFAULT false,
  has_video_recording_equipment BOOLEAN DEFAULT false,
  has_projector BOOLEAN DEFAULT false,
  has_sound_system BOOLEAN DEFAULT false,
  has_traditional_craft_tools BOOLEAN DEFAULT false,
  traditional_tools_details TEXT,
  has_production_equipment BOOLEAN DEFAULT false,
  production_equipment_details TEXT,
  
  -- Activities and operations
  meeting_frequency TEXT,
  regular_activities TEXT,
  cultural_events_frequency TEXT,
  offers_cultural_training BOOLEAN DEFAULT false,
  cultural_training_types TEXT,
  offers_language_lessons BOOLEAN DEFAULT false,
  language_lesson_details TEXT,
  offers_craft_training BOOLEAN DEFAULT false,
  craft_training_details TEXT,
  has_oral_history_program BOOLEAN DEFAULT false,
  oral_history_program_details TEXT,
  has_cultural_exchanges BOOLEAN DEFAULT false,
  major_annual_events TEXT,
  usage_frequency usage_frequency,
  
  -- Product creation and marketing
  produces_traditional_products BOOLEAN DEFAULT false,
  traditional_product_types TEXT,
  has_sales_outlet BOOLEAN DEFAULT false,
  market_linkages TEXT,
  annual_production_value_npr DECIMAL(14, 2),
  
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
  receives_government_grants BOOLEAN DEFAULT false,
  government_grant_details TEXT,
  receives_international_support BOOLEAN DEFAULT false,
  international_support_details TEXT,
  
  -- Governance and leadership
  has_written_constitution BOOLEAN DEFAULT false,
  has_strategic_plan BOOLEAN DEFAULT false,
  executive_committee_size INTEGER,
  executive_committee_election_frequency_years INTEGER,
  last_executive_election_date DATE,
  female_in_executive_committee INTEGER,
  youth_in_executive_committee INTEGER,
  has_elders_council BOOLEAN DEFAULT false,
  elders_council_details TEXT,
  decision_making_process TEXT,
  has_subcommittees BOOLEAN DEFAULT false,
  subcommittee_details TEXT,
  
  -- Staff and human resources
  has_full_time_staff BOOLEAN DEFAULT false,
  full_time_staff_count INTEGER,
  has_part_time_staff BOOLEAN DEFAULT false,
  part_time_staff_count INTEGER,
  has_traditional_knowledge_holders BOOLEAN DEFAULT false,
  traditional_knowledge_holder_count INTEGER,
  has_language_teachers BOOLEAN DEFAULT false,
  language_teacher_count INTEGER,
  has_master_artisans BOOLEAN DEFAULT false,
  master_artisan_count INTEGER,
  has_cultural_performers BOOLEAN DEFAULT false,
  cultural_performer_count INTEGER,
  volunteer_count INTEGER,
  
  -- Partnerships and networks
  has_partnership_with_local_government BOOLEAN DEFAULT false,
  local_government_partnership_details TEXT,
  has_partnership_with_schools BOOLEAN DEFAULT false,
  school_partnership_details TEXT,
  has_partnership_with_universities BOOLEAN DEFAULT false,
  university_partnership_details TEXT,
  has_partnership_with_museums BOOLEAN DEFAULT false,
  museum_partnership_details TEXT,
  has_partnership_with_ngos BOOLEAN DEFAULT false,
  ngo_partnership_details TEXT,
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
  cultural_preservation_impact TEXT,
  language_revitalization_efforts TEXT,
  knowledge_documentation_achievements TEXT,
  policy_influence_achievements TEXT,
  awards_and_recognition TEXT,
  publications_produced TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  cultural_preservation_challenges TEXT,
  language_preservation_challenges TEXT,
  financial_challenges TEXT,
  social_challenges TEXT,
  maintenance_needs TEXT,
  training_needs TEXT,
  documentation_needs TEXT,
  funding_needs TEXT,
  
  -- Future plans
  strategic_priorities TEXT,
  expansion_plans TEXT,
  sustainability_plans TEXT,
  future_projects_planned TEXT,
  next_generation_engagement_plans TEXT,
  digital_preservation_plans TEXT,
  
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
  youtube_channel TEXT,
  other_social_media TEXT,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_community_groups JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_ethnic_groups JSONB DEFAULT '[]'::jsonb,
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
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_location_point ON acme_ethnic_group_building USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_footprint ON acme_ethnic_group_building USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_compound_area ON acme_ethnic_group_building USING GIST (compound_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_name ON acme_ethnic_group_building(name);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_slug ON acme_ethnic_group_building(slug);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_type ON acme_ethnic_group_building(building_type);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_focus_area ON acme_ethnic_group_building(focus_area);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_ethnic_group ON acme_ethnic_group_building(ethnic_group);
CREATE INDEX IF NOT EXISTS idx_ethnic_group_building_ward_number ON acme_ethnic_group_building(ward_number);
