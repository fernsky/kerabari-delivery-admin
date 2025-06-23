-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Buffer zone type enum
DO $$ 
BEGIN
  CREATE TYPE buffer_zone_type AS ENUM (
    'NATIONAL_PARK_BUFFER_ZONE', 'WILDLIFE_RESERVE_BUFFER_ZONE', 
    'CONSERVATION_AREA_BUFFER_ZONE', 'PROTECTED_FOREST_BUFFER_ZONE', 
    'MIXED_USE_BUFFER_ZONE', 'TRANSITION_ZONE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Buffer zone management enum
DO $$ 
BEGIN
  CREATE TYPE buffer_zone_management AS ENUM (
    'BUFFER_ZONE_MANAGEMENT_COMMITTEE', 'COMMUNITY_FOREST_USER_GROUP', 
    'PARK_ADMINISTRATION', 'LOCAL_GOVERNMENT', 'JOINT_MANAGEMENT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Land use type enum
DO $$ 
BEGIN
  CREATE TYPE land_use_type AS ENUM (
    'SETTLEMENT', 'AGRICULTURE', 'FOREST', 'GRAZING_LAND', 
    'WETLAND', 'BARREN_LAND', 'MIXED_USE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the buffer_zone table
CREATE TABLE IF NOT EXISTS acme_buffer_zone (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  buffer_zone_type buffer_zone_type NOT NULL,
  
  -- Location and boundary details
  province TEXT,
  district TEXT,
  municipality TEXT,
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  adjacent_protected_area_id VARCHAR(36),
  adjacent_protected_area_name TEXT,
  total_area_hectares DECIMAL(12, 2) NOT NULL,
  boundary_description TEXT,
  is_gps_marked BOOLEAN DEFAULT FALSE,
  has_demarcation_markers BOOLEAN DEFAULT FALSE,
  establishment_year INTEGER,
  legal_status TEXT,
  gazette_notification_date DATE,
  gazette_reference TEXT,
  management_type buffer_zone_management,
  management_body_name TEXT,
  management_office_location TEXT,
  annual_budget_npr DECIMAL(14, 2),
  has_management_committee BOOLEAN DEFAULT TRUE,
  committee_formation_date DATE,
  committee_members_count INTEGER,
  committee_female_count INTEGER,
  committee_marginalized_count INTEGER,
  committee_meeting_frequency TEXT,
  villages_count INTEGER,
  household_count INTEGER,
  population_total INTEGER,
  population_female INTEGER,
  population_male INTEGER,
  dependency_on_forest_resources_percent DECIMAL(5, 2),
  forest_area_hectares DECIMAL(12, 2),
  agriculture_area_hectares DECIMAL(12, 2),
  settlement_area_hectares DECIMAL(12, 2),
  other_land_use_area_hectares DECIMAL(12, 2),
  land_use_composition JSONB DEFAULT '{}'::jsonb,
  dominant_land_use_type land_use_type,
  forest_density forest_density,
  major_vegetation_types TEXT,
  community_forest_groups_count INTEGER,
  community_forest_area_hectares DECIMAL(12, 2),
  cfug_member_households INTEGER,
  biodiversity_level biodiversity_level,
  ecosystem_type ecosystem_type,
  topography_type topography_type,
  elevation_range_low DECIMAL(8, 2),
  elevation_range_high DECIMAL(8, 2),
  key_flora_species TEXT,
  key_fauna_species TEXT,
  wildlife_corridor_present BOOLEAN DEFAULT FALSE,
  corridor_details TEXT,
  allowed_resource_collection_types TEXT,
  restricted_activities TEXT,
  has_permit_system BOOLEAN DEFAULT TRUE,
  permit_issuing_authority TEXT,
  resource_harvest_schedule TEXT,
  sustainable_harvest_guidelines TEXT,
  human_wildlife_conflict_level TEXT,
  conflict_incidents_annually INTEGER,
  major_conflict_species TEXT,
  mitigation_measures TEXT,
  compensation_scheme_exists BOOLEAN DEFAULT FALSE,
  compensation_details TEXT,
  annual_compensation_amount_npr DECIMAL(12, 2),
  conservation_activities TEXT,
  afforestation_programmes TEXT,
  habitat_restoration_activities TEXT,
  alternate_livelihood_programs TEXT,
  skill_development_trainings TEXT,
  micro_finance_initiatives TEXT,
  energy_alternatives_provided TEXT,
  revenue_source_types TEXT,
  annual_revenue_npr DECIMAL(14, 2),
  tourism_contribution_percent DECIMAL(5, 2),
  forest_product_contribution_percent DECIMAL(5, 2),
  other_income_sources_percent DECIMAL(5, 2),
  annual_tourist_count INTEGER,
  homestay_facilities INTEGER,
  nature_tourism_activities TEXT,
  ecotourism_initiatives TEXT,
  school_count INTEGER,
  health_facility_count INTEGER,
  road_access_kilometers DECIMAL(8, 2),
  irrigation_schemes_count INTEGER,
  drinking_water_schemes_count INTEGER,
  has_monitoring_system BOOLEAN DEFAULT FALSE,
  monitoring_parameters TEXT,
  monitoring_frequency TEXT,
  has_baseline BOOLEAN DEFAULT FALSE,
  baseline_year INTEGER,
  monitoring_responsibility TEXT,
  has_management_plan BOOLEAN DEFAULT TRUE,
  management_plan_period TEXT,
  last_management_plan_review_date DATE,
  operational_plans_exist BOOLEAN DEFAULT FALSE,
  bye_laws_exist BOOLEAN DEFAULT FALSE,
  bye_law_details TEXT,
  major_challenges TEXT,
  resource_needs TEXT,
  capacity_development_needs TEXT,
  major_achievements TEXT,
  success_stories TEXT,
  innovative_practices TEXT,
  future_development_plans TEXT,
  future_conservation_plans TEXT,
  office_name TEXT,
  office_address TEXT,
  chairperson_name TEXT,
  secretary_name TEXT,
  phone_number TEXT,
  email_address TEXT,
  linked_protected_areas JSONB DEFAULT '[]'::jsonb,
  linked_community_forests JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_infrastructure JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  boundary_polygon GEOMETRY(MultiPolygon, 4326),
  settlement_locations GEOMETRY(MultiPoint, 4326),
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_buffer_zone_boundary ON acme_buffer_zone USING GIST (boundary_polygon);
CREATE INDEX IF NOT EXISTS idx_buffer_zone_settlements ON acme_buffer_zone USING GIST (settlement_locations);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_buffer_zone_name ON acme_buffer_zone(name);
CREATE INDEX IF NOT EXISTS idx_buffer_zone_slug ON acme_buffer_zone(slug);
CREATE INDEX IF NOT EXISTS idx_buffer_zone_type ON acme_buffer_zone(buffer_zone_type);
CREATE INDEX IF NOT EXISTS idx_buffer_zone_management ON acme_buffer_zone(management_type);
